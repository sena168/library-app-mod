import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userApi, loansApi } from '../lib/api';

export const useUserLoans = () => {
  return useQuery({
    queryKey: ['me', 'loans'],
    queryFn: () => userApi.getUserLoans(),
    select: (response) => response.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: string) => loansApi.returnBook(loanId),
    onMutate: async (loanId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['me', 'loans'] });

      // Snapshot previous value
      const previousLoans = queryClient.getQueryData(['me', 'loans']);

      // Optimistically update loan status
      queryClient.setQueryData(['me', 'loans'], (old: any) => {
        if (old) {
          return old.map((loan: any) =>
            loan.id === loanId
              ? {
                  ...loan,
                  status: 'RETURNED',
                  returnedAt: new Date().toISOString(),
                }
              : loan
          );
        }
        return old;
      });

      return { previousLoans, loanId };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['me', 'loans'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({
        queryKey: ['book', response.data.book?.id],
      });
      toast.success('Book returned successfully!');
    },
    onError: (error: any, _variables, context) => {
      // Rollback optimistic update
      if (context?.previousLoans) {
        queryClient.setQueryData(['me', 'loans'], context.previousLoans);
      }
      const message = error.response?.data?.message || 'Failed to return book';
      toast.error(message);
    },
  });
};

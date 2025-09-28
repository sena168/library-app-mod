import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userApi } from '../lib/api';
import type { UpdateProfileRequest } from '../lib/types';
import { useAppDispatch } from '../store';
import { updateUser } from '../store/slices/authSlice';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.getProfile(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserReviews = () => {
  return useQuery({
    queryKey: ['me', 'reviews'],
    queryFn: () => userApi.getUserReviews(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
    onSuccess: (response) => {
      dispatch(updateUser(response.data));
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};

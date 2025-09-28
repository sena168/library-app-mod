import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { setCredentials, logout, setLoading } from '../store/slices/authSlice';
import { authApi } from '../lib/api';
// import type { LoginRequest, RegisterRequest } from '../lib/types';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (response) => {
      const { token, user } = response.data as unknown as {
        token: string;
        user: any;
      };
      dispatch(setCredentials({ token, user }));
      queryClient.invalidateQueries();
      toast.success('Login successful!');
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (response) => {
      const { token, user } = response.data as unknown as {
        token: string;
        user: any;
      };
      dispatch(setCredentials({ token, user }));
      queryClient.invalidateQueries();
      toast.success('Registration successful!');
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    dispatch(logout());
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };
};

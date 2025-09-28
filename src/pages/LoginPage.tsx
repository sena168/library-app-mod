import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authApi } from '../lib/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError('');
    setPasswordError('');

    // Basic validation
    const emailEmpty = !email || email.trim() === '';
    const passwordEmpty = !password || password.trim() === '';

    // Collect all validation errors before returning
    let hasErrors = false;

    if (emailEmpty) {
      setEmailError('Email is required');
      hasErrors = true;
    }
    if (passwordEmpty) {
      setPasswordError('Password is required');
      hasErrors = true;
    }

    // If there are any validation errors, stop here
    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.login({ email, password });
      console.log('Login successful:', response);

      // Store token in localStorage
      localStorage.setItem('auth-token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Check if user is admin and redirect accordingly
      if (response.data.user.email === 'admin@library.local') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      // Set field-specific errors for demo (in real app, this would come from API)
      setEmailError('Invalid email address');
      setPasswordError('Incorrect password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-0'>
      {/* Frame 1618873991 - Main Container */}
      <div className='flex flex-col items-start gap-5 w-full max-w-[400px]'>
        {/* Frame 37 - Logo Section */}
        <div className='flex items-center gap-[11.79px] w-[121.79px] h-[33px]'>
          {/* Logo */}
          <div className='w-[33px] h-[33px] flex-shrink-0'>
            <img
              src='/logos/main-logo.svg'
              alt='Booky Logo'
              className='w-full h-full'
            />
          </div>

          {/* Booky Text */}
          <span
            className='w-[77px] h-[33px] font-bold text-[25.14px] leading-[33px] text-[#0A0D12] flex-shrink-0'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Booky
          </span>
        </div>

        {/* Frame 1618873989 - Title Section */}
        <div className='flex flex-col items-start gap-2 w-full'>
          {/* Login Title */}
          <h1
            className='w-full font-bold text-2xl sm:text-[28px] leading-[38px] tracking-[-0.02em] text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Login
          </h1>

          {/* Description */}
          <p
            className='w-full font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#414651]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Sign in to manage your library account.
          </p>
        </div>

        {/* Frame 1618873990 - Form Container */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center gap-4 w-full'
        >
          {/* Email InputField */}
          <div className='flex flex-col items-start gap-[2px] w-full bg-white'>
            {/* Label */}
            <label
              className='w-full h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Email
            </label>

            {/* Input Container */}
            <div
              className={`flex items-center px-4 py-2 gap-2 w-full h-[48px] border rounded-xl ${
                emailError ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
              }`}
            >
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                className='flex-1 h-[28px] text-sm leading-[28px] bg-transparent border-none outline-none placeholder-gray-400'
                style={{ fontFamily: 'Red Hat Display, sans-serif' }}
              />
            </div>

            {/* Error Text Helper */}
            {emailError && (
              <span
                className='w-full h-[28px] font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#EE1D52]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {emailError}
              </span>
            )}
          </div>

          {/* Password InputField */}
          <div className='flex flex-col items-start gap-[2px] w-full bg-white'>
            {/* Label */}
            <label
              className='w-full h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Password
            </label>

            {/* Input Container */}
            <div
              className={`flex items-center px-4 py-2 gap-2 w-full h-[48px] border rounded-xl ${
                passwordError ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
              }`}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='flex-1 h-[28px] text-sm leading-[28px] bg-transparent border-none outline-none placeholder-gray-400'
                style={{ fontFamily: 'Red Hat Display, sans-serif' }}
              />

              {/* Eye Icon */}
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='w-5 h-5 flex items-center justify-center'
              >
                {showPassword ? (
                  <EyeOff size={20} color='#0A0D12' strokeWidth={1.67} />
                ) : (
                  <Eye size={20} color='#0A0D12' strokeWidth={1.67} />
                )}
              </button>
            </div>

            {/* Error Text Helper */}
            {passwordError && (
              <span
                className='w-full h-[28px] font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#EE1D52]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {passwordError}
              </span>
            )}
          </div>

          {/* Login Button */}
          <Button
            type='submit'
            disabled={isLoading}
            variant='figma-primary'
            size='figma-mobile'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        {/* Register Container */}
        <div className='flex items-center justify-center gap-1 w-full h-[30px] mx-auto'>
          {/* Register Prompt */}
          <span
            className='font-semibold text-sm sm:text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Don't have an account?
          </span>

          {/* Register Link */}
          <Link
            to='/register'
            className='font-bold text-sm sm:text-base leading-[30px] tracking-[-0.02em] text-[#1C65DA] hover:underline'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

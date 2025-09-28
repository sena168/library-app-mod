import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authApi } from '../lib/api';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Reset all field errors
    const newFieldErrors = {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    };

    // Basic validation
    let hasErrors = false;

    if (!formData.name.trim()) {
      newFieldErrors.name = 'Name is required';
      hasErrors = true;
    }
    if (!formData.email.trim()) {
      newFieldErrors.email = 'Email is required';
      hasErrors = true;
    }
    if (!formData.phoneNumber.trim()) {
      newFieldErrors.phoneNumber = 'Phone number is required';
      hasErrors = true;
    }
    if (!formData.password.trim()) {
      newFieldErrors.password = 'Password is required';
      hasErrors = true;
    }
    if (!formData.confirmPassword.trim()) {
      newFieldErrors.confirmPassword = 'Confirm password is required';
      hasErrors = true;
    }
    if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    setFieldErrors(newFieldErrors);

    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful:', response);

      // The register endpoint doesn't return a token, just user data
      // For now, we'll redirect to login page
      alert(
        `Registration successful! Welcome ${response.data.name}. Please login now.`
      );
      navigate('/login');
    } catch (err) {
      // Set field-specific errors for demo (in real app, this would come from API)
      setFieldErrors({
        name: 'Name already exists',
        email: 'Email already exists',
        phoneNumber: 'Invalid phone number format',
        password: 'Password is too weak',
        confirmPassword: 'Passwords do not match',
      });
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-0 py-4'>
      {/* Frame 1618873991 - Main Container */}
      <div className='flex flex-col items-start gap-3 w-full max-w-[400px]'>
        {/* Frame 37 - Logo Section */}
        <div className='flex items-center gap-[11.79px] w-[121.79px] h-[28px]'>
          {/* Logo */}
          <div className='w-[28px] h-[28px] flex-shrink-0'>
            <img
              src='/logos/main-logo.svg'
              alt='Booky Logo'
              className='w-full h-full'
            />
          </div>

          {/* Booky Text */}
          <span
            className='w-[77px] h-[28px] font-bold text-[20px] leading-[28px] text-[#0A0D12] flex-shrink-0'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Booky
          </span>
        </div>

        {/* Frame 1618873989 - Title Section */}
        <div className='flex flex-col items-start gap-0.5 w-full'>
          {/* Register Title */}
          <h1
            className='w-full font-bold text-lg sm:text-xl lg:text-2xl leading-[24px] sm:leading-[28px] lg:leading-[32px] tracking-[-0.02em] text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Register
          </h1>

          {/* Description */}
          <p
            className='w-full font-semibold text-xs sm:text-sm leading-[18px] sm:leading-[20px] tracking-[-0.02em] text-[#414651]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Create your account to start borrowing books.
          </p>
        </div>

        {/* Frame 1618873990 - Form Container */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center gap-2 w-full'
        >
          {/* Name InputField */}
          <div className='flex flex-col items-start gap-0.5 w-full bg-white'>
            {/* Label */}
            <label
              className='w-full font-bold text-xs leading-[16px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Name
            </label>

            {/* Input Container */}
            <div
              className={`flex items-center px-3 py-1.5 gap-2 w-full h-[40px] border rounded-lg ${
                fieldErrors.name ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
              }`}
            >
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your name'
                className='flex-1 h-[20px] text-xs leading-[20px] bg-transparent border-none outline-none placeholder-gray-400'
                style={{ fontFamily: 'Red Hat Display, sans-serif' }}
              />
            </div>

            {/* Error Text Helper */}
            {fieldErrors.name && (
              <span
                className='w-full font-medium text-xs leading-[14px] tracking-[-0.03em] text-[#EE1D52]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {fieldErrors.name}
              </span>
            )}
          </div>

          {/* Email InputField */}
          <div className='flex flex-col items-start gap-0.5 w-full bg-white'>
            {/* Label */}
            <label
              className='w-full font-bold text-xs leading-[16px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Email
            </label>

            {/* Input Container */}
            <div
              className={`flex items-center px-3 py-1.5 gap-2 w-full h-[40px] border rounded-lg ${
                fieldErrors.email ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
              }`}
            >
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your email'
                className='flex-1 h-[20px] text-xs leading-[20px] bg-transparent border-none outline-none placeholder-gray-400'
                style={{ fontFamily: 'Red Hat Display, sans-serif' }}
              />
            </div>

            {/* Error Text Helper */}
            {fieldErrors.email && (
              <span
                className='w-full font-medium text-xs leading-[14px] tracking-[-0.03em] text-[#EE1D52]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Phone Number InputField */}
          <div className='flex flex-col items-start gap-0.5 w-full bg-white'>
            {/* Label */}
            <label
              className='w-full font-bold text-xs leading-[16px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Phone Number
            </label>

            {/* Input Container */}
            <div
              className={`flex items-center px-3 py-1.5 gap-2 w-full h-[40px] border rounded-lg ${
                fieldErrors.phoneNumber
                  ? 'border-[#EE1D52]'
                  : 'border-[#D5D7DA]'
              }`}
            >
              <input
                type='tel'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='Enter your phone number'
                className='flex-1 h-[20px] text-xs leading-[20px] bg-transparent border-none outline-none placeholder-gray-400'
                style={{ fontFamily: 'Red Hat Display, sans-serif' }}
              />
            </div>

            {/* Error Text Helper */}
            {fieldErrors.phoneNumber && (
              <span
                className='w-full font-medium text-xs leading-[14px] tracking-[-0.03em] text-[#EE1D52]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {fieldErrors.phoneNumber}
              </span>
            )}
          </div>

          {/* Password InputField */}
          <div className='flex flex-col items-start gap-0.5 w-full bg-white'>
            {/* Label */}
            <label
              className='w-full font-bold text-xs leading-[16px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Password
            </label>

            {/* Input Container */}
            <div
              className={`flex items-center px-3 py-1.5 gap-2 w-full h-[40px] border rounded-lg ${
                fieldErrors.password ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
              }`}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Create a password'
                className='flex-1 h-[20px] text-xs leading-[20px] bg-transparent border-none outline-none placeholder-gray-400'
                style={{ fontFamily: 'Red Hat Display, sans-serif' }}
              />

              {/* Eye Icon */}
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='w-4 h-4 flex items-center justify-center'
              >
                {showPassword ? (
                  <EyeOff size={16} color='#0A0D12' strokeWidth={1.67} />
                ) : (
                  <Eye size={16} color='#0A0D12' strokeWidth={1.67} />
                )}
              </button>
            </div>

            {/* Error Text Helper */}
            {fieldErrors.password && (
              <span
                className='w-full font-medium text-xs leading-[14px] tracking-[-0.03em] text-[#EE1D52]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Confirm Password InputField */}
          <div className='flex flex-col items-start gap-0.5 w-full bg-white'>
            {/* Label */}
            <label
              className='w-full font-bold text-xs leading-[16px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Confirm Password
            </label>

            {/* Input Container */}
            <div
              className={`flex items-center px-3 py-1.5 gap-2 w-full h-[40px] border rounded-lg ${
                fieldErrors.confirmPassword
                  ? 'border-[#EE1D52]'
                  : 'border-[#D5D7DA]'
              }`}
            >
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm your password'
                className='flex-1 h-[20px] text-xs leading-[20px] bg-transparent border-none outline-none placeholder-gray-400'
                style={{ fontFamily: 'Red Hat Display, sans-serif' }}
              />

              {/* Eye Icon */}
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='w-4 h-4 flex items-center justify-center'
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} color='#0A0D12' strokeWidth={1.67} />
                ) : (
                  <Eye size={16} color='#0A0D12' strokeWidth={1.67} />
                )}
              </button>
            </div>

            {/* Error Text Helper */}
            {fieldErrors.confirmPassword && (
              <span
                className='w-full font-medium text-xs leading-[14px] tracking-[-0.03em] text-[#EE1D52]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          {/* Register Button */}
          <Button
            type='submit'
            disabled={isLoading}
            variant='figma-primary'
            size='figma-compact'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        {/* Login Container */}
        <div className='flex items-center justify-center gap-1 w-full mx-auto'>
          {/* Login Prompt */}
          <span
            className='font-semibold text-xs leading-[18px] tracking-[-0.02em] text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Already have an account?
          </span>

          {/* Login Link */}
          <Link
            to='/login'
            className='font-bold text-xs leading-[18px] tracking-[-0.02em] text-[#1C65DA] hover:underline'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

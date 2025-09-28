import React, { useState, useRef } from 'react';
import { User, Camera } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
}

interface ProfileCardProps {
  profile: ProfileData;
  onSave: (updatedProfile: ProfileData) => Promise<void>;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSave,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    profilePicture: profile?.profilePicture || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditForm((prev) => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!editForm.name?.trim()) {
        alert('Name is required');
        return;
      }
      if (!editForm.email?.trim()) {
        alert('Email is required');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email.trim())) {
        alert('Please enter a valid email address');
        return;
      }

      console.log('Attempting to save profile:', editForm);
      await onSave(editForm);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage =
        error?.message || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      profilePicture: profile?.profilePicture || '',
    });
    setIsEditing(false);
  };

  return (
    <Card
      className={`w-full md:w-[557px] h-auto md:h-[298px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] border-0 rounded-2xl ${className}`}
    >
      <CardContent className='flex flex-col items-start p-4 md:p-5 gap-4 md:gap-6 w-full h-full'>
        {/* Profile Info - Frame 70 */}
        <div className='flex flex-col items-start p-0 gap-2 md:gap-3 w-full md:w-[517px] h-auto md:h-[190px]'>
          {/* Avatar */}
          <div className='relative w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden'>
            {editForm.profilePicture ? (
              <img
                src={editForm.profilePicture}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            ) : (
              <User className='w-8 h-8 text-gray-500' />
            )}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'
              >
                <Camera className='w-4 h-4 text-white' />
              </button>
            )}
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='hidden'
            />
          </div>

          {/* Name Row - Frame 53 */}
          <div className='flex flex-row justify-between items-center p-0 w-full md:w-[517px] h-7 md:h-[30px]'>
            <span
              className='font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Name
            </span>
            {isEditing ? (
              <input
                type='text'
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12] bg-gray-50 border border-gray-300 rounded px-3 py-1 flex-1 min-w-0 max-w-[200px] md:max-w-[280px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              />
            ) : (
              <span
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {profile?.name || 'John Doe'}
              </span>
            )}
          </div>

          {/* Email Row - Frame 54 */}
          <div className='flex flex-row justify-between items-center p-0 w-full md:w-[517px] h-7 md:h-[30px]'>
            <span
              className='font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Email
            </span>
            {isEditing ? (
              <input
                type='email'
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12] bg-gray-50 border border-gray-300 rounded px-3 py-1 flex-1 min-w-0 max-w-[200px] md:max-w-[280px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                placeholder='Enter your email'
              />
            ) : (
              <span
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {profile?.email || 'johndoe@email.com'}
              </span>
            )}
          </div>

          {/* Phone Row - Frame 55 */}
          <div className='flex flex-row justify-between items-center p-0 w-full md:w-[517px] h-7 md:h-[30px]'>
            <span
              className='font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Nomor Handphone
            </span>
            {isEditing ? (
              <input
                type='tel'
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12] bg-gray-50 border border-gray-300 rounded px-3 py-1 flex-1 min-w-0 max-w-[200px] md:max-w-[280px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                placeholder='Enter phone number'
              />
            ) : (
              <span
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {profile?.phone || '081234567890'}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing ? (
          <div className='flex flex-row gap-3 w-full md:w-[517px]'>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className='flex flex-row justify-center items-center p-2 gap-2 flex-1 h-11 bg-[#1C65DA] rounded-full hover:bg-[#1557C7] transition-colors disabled:opacity-50'
            >
              <span
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </span>
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className='flex flex-row justify-center items-center p-2 gap-2 flex-1 h-11 bg-gray-500 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50'
            >
              <span
                className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Cancel
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className='flex flex-row justify-center items-center p-2 gap-2 w-full md:w-[517px] h-11 bg-[#1C65DA] rounded-full hover:bg-[#1557C7] transition-colors'
          >
            <span
              className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Update Profile
            </span>
          </button>
        )}
      </CardContent>
    </Card>
  );
};

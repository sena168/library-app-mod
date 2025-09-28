import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ChevronDown,
  CloudUpload,
  ArrowUpToLine,
  Trash2,
} from 'lucide-react';
import { AdminHeader } from '../components/admin/AdminHeader';
import { adminApi } from '../lib/api/adminService';
import { useToast } from '../contexts/ToastContext';
import type { CreateBookRequest } from '../lib/types/adminTypes';

interface Category {
  id: number;
  name: string;
}

const AdminAddBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<
    Omit<CreateBookRequest, 'pages'> & {
      authorName: string;
      pages: string | number;
    }
  >({
    title: '',
    description: '',
    isbn: '', // Will be auto-generated or set to default
    publishedYear: new Date().getFullYear(), // Will be auto-generated or set to default
    pages: '',
    authorId: 0, // Will be set based on authorName
    authorName: '',
    categoryId: 0,
    totalCopies: 1, // Will be auto-generated or set to default
    availableCopies: 1, // Will be set to default
    coverImage: '',
  });

  // Dropdown states
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // File upload state
  const [filePreview, setFilePreview] = useState<string>('');

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error state
  const [errors, setErrors] = useState<{
    title?: string;
    authorName?: string;
    categoryId?: string;
    pages?: string;
    description?: string;
    coverImage?: string;
  }>({});

  useEffect(() => {
    // Check if user is admin and get admin data
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check for admin role or specific admin email
    const isAdmin =
      user &&
      (user.role === 'admin' ||
        user.role === 'ADMIN' ||
        user.email === 'admin@library.local');

    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    // Store admin user data
    setAdminUser({
      name: user.name || 'Admin',
      email: user.email,
    });

    // Fetch categories
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      // Fetch categories from API
      const categoriesResponse = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/categories'
      );

      if (!categoriesResponse.ok) {
        throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
      }

      const categoriesData = await categoriesResponse.json();

      // Use API data if available, otherwise fallback to predefined categories
      const apiCategories = categoriesData.data || categoriesData || [];

      if (apiCategories.length > 0) {
        setCategories(apiCategories);
      } else {
        // Fallback to predefined categories (same as CategoryPage)
        const predefinedCategories: Category[] = [
          { id: 1, name: 'Fiction' },
          { id: 2, name: 'Non-Fiction' },
          { id: 3, name: 'Self-Improvement' },
          { id: 4, name: 'Finance & Business' },
          { id: 5, name: 'Science & Technology' },
          { id: 6, name: 'Education & Reference' },
        ];
        setCategories(predefinedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to predefined categories on error
      const predefinedCategories: Category[] = [
        { id: 1, name: 'Fiction' },
        { id: 2, name: 'Non-Fiction' },
        { id: 3, name: 'Self-Improvement' },
        { id: 4, name: 'Finance & Business' },
        { id: 5, name: 'Science & Technology' },
        { id: 6, name: 'Education & Reference' },
      ];
      setCategories(predefinedCategories);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pages' ? (value === '' ? '' : parseInt(value) || '') : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setFormData((prev) => ({ ...prev, categoryId: category.id }));
    setShowCategoryDropdown(false);

    // Clear category error when user selects a category
    if (errors.categoryId) {
      setErrors((prev) => ({
        ...prev,
        categoryId: undefined,
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          coverImage: 'File size must be less than 5MB',
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          coverImage: 'Please select a valid image file',
        }));
        return;
      }

      // Compress and resize image
      const compressImage = (
        file: File,
        maxWidth: number = 400,
        quality: number = 0.6
      ) => {
        return new Promise<string>((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();

          img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          };

          img.src = URL.createObjectURL(file);
        });
      };

      // Compress the image
      compressImage(file).then((compressedDataUrl) => {
        setFilePreview(compressedDataUrl);
        setFormData((prev) => ({
          ...prev,
          coverImage: compressedDataUrl,
        }));

        // Clear cover image error when user uploads a file
        if (errors.coverImage) {
          setErrors((prev) => ({
            ...prev,
            coverImage: undefined,
          }));
        }
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }

    if (!selectedCategory) {
      newErrors.categoryId = 'Please select a category';
    }

    const pagesValue =
      typeof formData.pages === 'string'
        ? parseInt(formData.pages)
        : formData.pages;
    if (!formData.pages || formData.pages === '' || pagesValue <= 0) {
      newErrors.pages = 'Pages must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // First, create or find the author
      let authorId = 1; // Default fallback

      if (formData.authorName.trim()) {
        try {
          // Try to find existing author first
          const authorsResponse = await adminApi.getAuthors();
          console.log('Authors response:', authorsResponse); // Debug log

          // Ensure authors is an array
          const authors = Array.isArray(authorsResponse) ? authorsResponse : [];

          if (authors.length > 0) {
            const existingAuthor = authors.find(
              (author: { id: number; name: string }) =>
                author.name.toLowerCase() === formData.authorName.toLowerCase()
            );

            if (existingAuthor) {
              authorId = existingAuthor.id;
            } else {
              // Create new author
              const newAuthor = await adminApi.createAuthor({
                name: formData.authorName.trim(),
                bio: `Author of ${formData.title}`,
              });
              authorId = newAuthor.id;
            }
          } else {
            // No authors found, create new one
            const newAuthor = await adminApi.createAuthor({
              name: formData.authorName.trim(),
              bio: `Author of ${formData.title}`,
            });
            authorId = newAuthor.id;
          }
        } catch (error) {
          console.error('Error handling author:', error);
          // Fallback to default author ID
          authorId = 1;
        }
      }

      // Set default values for removed fields
      const bookData = {
        title: formData.title,
        description: formData.description,
        pages: (() => {
          const pagesValue =
            typeof formData.pages === 'string'
              ? parseInt(formData.pages)
              : formData.pages;
          return isNaN(pagesValue) || pagesValue <= 0 ? 1 : pagesValue;
        })(),
        isbn: `ISBN-${Date.now()}`, // Auto-generate ISBN
        publishedYear: new Date().getFullYear(), // Set to current year
        totalCopies: 1, // Default to 1 copy
        availableCopies: 1, // Set available copies same as total copies
        authorId: authorId, // Use the determined author ID
        categoryId: selectedCategory?.id || 1, // Use selected category or default
        coverImage: formData.coverImage || '', // Include cover image if present
      };

      await adminApi.createBook(bookData);

      // Invalidate all books-related queries to refresh the book list
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['books', 'recommended'] });
      queryClient.invalidateQueries({ queryKey: ['books', 'top-rated'] });

      showSuccess('Add success');
      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate('/admin?tab=books');
      }, 1500);
    } catch (error) {
      console.error('Error creating book:', error);

      // Check if it's a 413 Payload Too Large error
      if (error instanceof Error && error.message.includes('413')) {
        showError(
          'File too large',
          'The image file is too large. Please compress it or choose a smaller image.'
        );
      } else {
        showError(
          'Failed to create book',
          'Please try again or contact support if the problem persists.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/admin?tab=books');
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <AdminHeader adminName={adminUser?.name || 'Admin'} />

      {/* Main Content */}
      <div className='w-full max-w-[1200px] mx-auto px-4 py-8 md:px-[120px]'>
        {/* Header with Back Button */}
        <div className='flex flex-col items-center p-0 gap-4 w-full max-w-[361px] mx-auto md:max-w-none'>
          {/* Back Button and Title */}
          <div className='flex flex-row items-center p-0 gap-3 w-[361px] h-9 md:w-[529px]'>
            {/* Arrow */}
            <button
              onClick={handleBack}
              className='w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors md:w-8 md:h-8'
            >
              <ArrowLeft className='w-5 h-5 text-[#1E1E1E] md:w-5 md:h-5' />
            </button>

            {/* Add Book */}
            <span
              className='w-[112px] h-9 font-bold text-xl leading-9 text-[#0A0D12] md:text-2xl'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Add Book
            </span>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className='flex flex-col items-start p-0 gap-4 w-[361px] md:w-[529px]'
          >
            {/* Book Title */}
            <div
              className={`flex flex-col items-start p-0 gap-0.5 w-[361px] md:w-[529px] ${
                errors.title ? 'h-[108px]' : 'h-[78px]'
              }`}
            >
              <label
                className='w-[361px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] md:w-[529px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Title
              </label>
              <div
                className={`flex flex-row items-center px-4 py-2 gap-2 w-[361px] h-12 border rounded-xl md:w-[529px] ${
                  errors.title ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
                }`}
              >
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder='Enter book title'
                  className='flex-1 h-7 font-normal text-sm leading-7 text-[#0A0D12] bg-transparent border-none outline-none'
                  style={{ fontFamily: 'Red Hat Display, sans-serif' }}
                />
              </div>
              {errors.title && (
                <span
                  className='w-[361px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#EE1D52] md:w-[529px]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {errors.title}
                </span>
              )}
            </div>

            {/* Author Input */}
            <div
              className={`flex flex-col items-start p-0 gap-0.5 w-[361px] md:w-[529px] ${
                errors.authorName ? 'h-[108px]' : 'h-[78px]'
              }`}
            >
              <label
                className='w-[361px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] md:w-[529px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Author
              </label>
              <div
                className={`flex flex-row items-center px-4 py-2 gap-2 w-[361px] h-12 border rounded-xl md:w-[529px] ${
                  errors.authorName ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
                }`}
              >
                <input
                  type='text'
                  name='authorName'
                  value={formData.authorName || ''}
                  onChange={handleInputChange}
                  placeholder='Enter author name'
                  className='flex-1 h-7 font-normal text-sm leading-7 text-[#0A0D12] bg-transparent border-none outline-none'
                  style={{ fontFamily: 'Red Hat Display, sans-serif' }}
                />
              </div>
              {errors.authorName && (
                <span
                  className='w-[361px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#EE1D52] md:w-[529px]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {errors.authorName}
                </span>
              )}
            </div>

            {/* Category Dropdown */}
            <div
              className={`flex flex-col items-start p-0 gap-0.5 w-[361px] md:w-[529px] ${
                errors.categoryId ? 'h-[108px]' : 'h-[78px]'
              }`}
            >
              <label
                className='w-[361px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] md:w-[529px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Category
              </label>
              <div className='relative w-[361px] md:w-[529px]'>
                <button
                  type='button'
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`flex flex-row items-center justify-between px-4 py-2 gap-2 w-[361px] h-12 border rounded-xl bg-white md:w-[529px] ${
                    errors.categoryId ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
                  }`}
                >
                  <span
                    className='flex-1 h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-[#717680] text-left'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {selectedCategory
                      ? selectedCategory.name
                      : 'Select Category'}
                  </span>
                  <ChevronDown className='w-5 h-5 text-[#0A0D12]' />
                </button>

                {showCategoryDropdown && (
                  <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-[#D5D7DA] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto'>
                    {categoriesLoading ? (
                      <div className='px-4 py-2 text-center'>
                        <span
                          className='font-medium text-sm text-[#717680]'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          Loading categories...
                        </span>
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          type='button'
                          onClick={() => handleCategorySelect(category)}
                          className='w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl'
                        >
                          <span
                            className='font-medium text-sm text-[#0A0D12]'
                            style={{ fontFamily: 'Quicksand, sans-serif' }}
                          >
                            {category.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className='px-4 py-2 text-center'>
                        <span
                          className='font-medium text-sm text-[#717680]'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          No categories available
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.categoryId && (
                <span
                  className='w-[361px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#EE1D52] md:w-[529px]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {errors.categoryId}
                </span>
              )}
            </div>

            {/* Pages */}
            <div
              className={`flex flex-col items-start p-0 gap-0.5 w-[361px] md:w-[529px] ${
                errors.pages ? 'h-[108px]' : 'h-[78px]'
              }`}
            >
              <label
                className='w-[361px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] md:w-[529px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Pages
              </label>
              <div
                className={`flex flex-row items-center px-4 py-2 gap-2 w-[361px] h-12 border rounded-xl md:w-[529px] ${
                  errors.pages ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
                }`}
              >
                <input
                  type='number'
                  name='pages'
                  value={formData.pages}
                  onChange={handleInputChange}
                  placeholder='Enter number of pages'
                  className='flex-1 h-7 font-normal text-sm leading-7 text-[#0A0D12] bg-transparent border-none outline-none'
                  style={{ fontFamily: 'Red Hat Display, sans-serif' }}
                />
              </div>
              {errors.pages && (
                <span
                  className='w-[361px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#EE1D52] md:w-[529px]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {errors.pages}
                </span>
              )}
            </div>

            {/* Description */}
            <div
              className={`flex flex-col items-start p-0 gap-0.5 w-[361px] md:w-[529px] ${
                errors.description ? 'h-[161px]' : 'h-[131px]'
              }`}
            >
              <label
                className='w-[361px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] md:w-[529px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Description
              </label>
              <div
                className={`flex flex-row items-start px-4 py-2 gap-2 w-[361px] h-[101px] border rounded-xl md:w-[529px] ${
                  errors.description ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
                }`}
              >
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Enter book description'
                  className='flex-1 h-auto font-normal text-sm leading-7 text-[#0A0D12] bg-transparent border-none outline-none resize-none'
                  style={{ fontFamily: 'Red Hat Display, sans-serif' }}
                  rows={3}
                />
              </div>
              {errors.description && (
                <span
                  className='w-[361px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#EE1D52] md:w-[529px]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {errors.description}
                </span>
              )}
            </div>

            {/* Cover Image Upload */}
            <div
              className={`flex flex-col items-start p-0 gap-0.5 w-[361px] md:w-[529px] ${
                errors.coverImage
                  ? 'h-[292px]'
                  : filePreview
                  ? 'h-auto min-h-[174px]'
                  : 'h-[174px]'
              }`}
            >
              <label
                className='w-[361px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] md:w-[529px]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Cover Image
              </label>
              <div
                className={`flex flex-col items-center px-6 py-4 gap-1 w-[361px] md:w-[529px] ${
                  filePreview ? 'h-auto min-h-[144px]' : 'h-[144px]'
                } bg-white border border-dashed rounded-xl ${
                  errors.coverImage ? 'border-[#EE1D52]' : 'border-[#D5D7DA]'
                }`}
              >
                {!filePreview ? (
                  // Default upload state
                  <div className='flex flex-col items-center p-0 gap-3 w-[313px] h-[112px] md:w-[481px]'>
                    {/* Upload Icon */}
                    <div className='w-10 h-10 border border-[#D5D7DA] rounded-lg flex items-center justify-center'>
                      <CloudUpload className='w-5 h-5 text-[#0A0D12]' />
                    </div>

                    {/* Upload Content */}
                    <div className='flex flex-col items-center p-0 gap-1 w-[313px] h-[60px] md:w-[481px]'>
                      <div className='flex flex-row justify-center items-start p-0 gap-1 w-[313px] h-7 md:w-[481px]'>
                        <button
                          type='button'
                          onClick={() =>
                            document.getElementById('file-upload')?.click()
                          }
                          className='w-[97px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#1C65DA]'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          Click to upload
                        </button>
                        <span
                          className='w-[112px] h-7 font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          or drag and drop
                        </span>
                      </div>
                      <span
                        className='w-[313px] h-7 font-semibold text-sm leading-7 tracking-[-0.02em] text-center text-[#0A0D12] md:w-[481px]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        PNG or JPG (max. 5mb)
                      </span>
                    </div>
                  </div>
                ) : (
                  // Image preview state with filters
                  <div className='flex flex-col items-center p-0 gap-3 w-[313px] h-[230px] md:w-[481px]'>
                    {/* Image Preview */}
                    <img
                      src={filePreview}
                      alt='Preview'
                      className='w-[92px] h-[138px] object-cover rounded-lg'
                    />

                    {/* Action Buttons */}
                    <div className='flex flex-row items-center p-0 gap-2 w-[280px] h-10 md:gap-3 md:w-[288px]'>
                      {/* Change Image Button */}
                      <button
                        type='button'
                        onClick={() =>
                          document.getElementById('file-upload')?.click()
                        }
                        className='flex flex-row items-center px-2 py-0 gap-1 w-[135px] h-10 bg-[#FDFDFD] border border-[#D5D7DA] rounded-[10px] hover:bg-[#F5F5F5] transition-colors md:px-3 md:w-[142px]'
                      >
                        {/* Arrow Up To Line Icon */}
                        <ArrowUpToLine className='w-5 h-5 text-[#0A0D12]' />
                        {/* Phase Title */}
                        <span
                          className='h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#0A0D12]'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          Change Image
                        </span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type='button'
                        onClick={() => {
                          setFilePreview('');
                          setFormData((prev) => ({ ...prev, coverImage: '' }));
                          // Clear cover image error when deleting
                          if (errors.coverImage) {
                            setErrors((prev) => ({
                              ...prev,
                              coverImage: undefined,
                            }));
                          }
                        }}
                        className='flex flex-row items-center px-2 py-0 gap-1 w-[130px] h-10 bg-[#FDFDFD] border border-[#D5D7DA] rounded-[10px] hover:bg-[#F5F5F5] transition-colors md:px-3 md:w-[134px]'
                      >
                        {/* Trash2 Icon */}
                        <Trash2 className='w-5 h-5 text-[#D9206E]' />
                        {/* Phase Title */}
                        <span
                          className='h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#D9206E]'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          Delete Image
                        </span>
                      </button>
                    </div>

                    {/* Supporting Text */}
                    <span
                      className='w-[313px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-center text-[#0A0D12] md:w-[481px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      PNG or JPG (max. 5mb)
                    </span>
                  </div>
                )}

                <input
                  id='file-upload'
                  type='file'
                  accept='image/*'
                  onChange={handleFileUpload}
                  className='hidden'
                />
              </div>
              {errors.coverImage && (
                <span
                  className='w-[361px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#EE1D52] md:w-[529px]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {errors.coverImage}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex flex-row justify-center items-center p-2 gap-2 w-[361px] h-12 bg-[#1C65DA] rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 md:w-[529px]'
            >
              <span
                className='w-[37px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBookPage;

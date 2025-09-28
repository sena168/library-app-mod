import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  searchQuery: string;
  selectedCategoryId: string | null;
  selectedAuthorId: string | null;
  sortBy: 'title' | 'publishedYear' | 'averageRating' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  isLoading: boolean;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  searchQuery: '',
  selectedCategoryId: null,
  selectedAuthorId: null,
  sortBy: 'title',
  sortOrder: 'asc',
  currentPage: 1,
  isLoading: false,
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
      state.currentPage = 1;
    },
    setSelectedAuthor: (state, action: PayloadAction<string | null>) => {
      state.selectedAuthorId = action.payload;
      state.currentPage = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{
        sortBy: UiState['sortBy'];
        sortOrder: UiState['sortOrder'];
      }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategoryId = null;
      state.selectedAuthorId = null;
      state.currentPage = 1;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedAuthor,
  setSorting,
  setCurrentPage,
  setLoading,
  setSidebarOpen,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer;

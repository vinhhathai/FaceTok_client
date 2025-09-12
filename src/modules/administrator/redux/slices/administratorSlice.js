import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentView: 'dashboard',
  selectedUser: null,
  selectedPost: null,
  selectedReport: null,
  filters: {
    userStatus: 'all',
    postStatus: 'all',
    reportStatus: 'pending',
    dateRange: {
      start: null,
      end: null,
    },
  },
  statistics: {
    totalUsers: 0,
    totalPosts: 0,
    pendingReports: 0,
    activeUsers: 0,
    todayRegistrations: 0,
    todayPosts: 0,
  },
  loading: {
    users: false,
    posts: false,
    reports: false,
    statistics: false,
  },
  errors: {
    users: null,
    posts: null,
    reports: null,
    statistics: null,
  },
};

const administratorSlice = createSlice({
  name: 'administrator',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    
    setSelectedReport: (state, action) => {
      state.selectedReport = action.payload;
    },
    
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    setUserFilter: (state, action) => {
      state.filters.userStatus = action.payload;
    },
    
    setPostFilter: (state, action) => {
      state.filters.postStatus = action.payload;
    },
    
    setReportFilter: (state, action) => {
      state.filters.reportStatus = action.payload;
    },
    
    setDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    
    updateStatistics: (state, action) => {
      state.statistics = {
        ...state.statistics,
        ...action.payload,
      };
    },
    
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
    },
    
    setError: (state, action) => {
      const { type, error } = action.payload;
      state.errors[type] = error;
    },
    
    clearError: (state, action) => {
      const type = action.payload;
      state.errors[type] = null;
    },
    
    clearAllErrors: (state) => {
      state.errors = {
        users: null,
        posts: null,
        reports: null,
        statistics: null,
      };
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    resetAdministratorState: () => initialState,
  },
});

export const {
  setCurrentView,
  setSelectedUser,
  setSelectedPost,
  setSelectedReport,
  updateFilters,
  setUserFilter,
  setPostFilter,
  setReportFilter,
  setDateRange,
  updateStatistics,
  setLoading,
  setError,
  clearError,
  clearAllErrors,
  resetFilters,
  resetAdministratorState,
} = administratorSlice.actions;

export default administratorSlice.reducer;

// Selectors
export const selectCurrentView = (state) => state.administrator.currentView;
export const selectSelectedUser = (state) => state.administrator.selectedUser;
export const selectSelectedPost = (state) => state.administrator.selectedPost;
export const selectSelectedReport = (state) => state.administrator.selectedReport;
export const selectFilters = (state) => state.administrator.filters;
export const selectStatistics = (state) => state.administrator.statistics;
export const selectLoading = (state) => state.administrator.loading;
export const selectErrors = (state) => state.administrator.errors;
export const selectUserFilter = (state) => state.administrator.filters.userStatus;
export const selectPostFilter = (state) => state.administrator.filters.postStatus;
export const selectReportFilter = (state) => state.administrator.filters.reportStatus;
export const selectDateRange = (state) => state.administrator.filters.dateRange;
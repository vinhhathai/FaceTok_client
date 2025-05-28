import postDetailReducer from './slices/postDetailSlice';
import postsReducer from './slices/postSlice';

// Export actions
export { fetchTimelinePosts } from './slices/postSlice';
export { clearError, likePost } from './slices/postDetailSlice';

// Export reducers
export { default as postsReducer } from './slices/postSlice';

// Export post detail reducer as default
export default postDetailReducer; 
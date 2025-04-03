import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createPost, getTimelinePosts, getUserPosts } from '../../api/postApi';

// Thunk để tạo bài viết mới
export const createNewPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue, getState }) => {
    try {
      const response = await createPost(postData);
      // Lấy thông tin người dùng hiện tại từ Redux state
      const currentUser = getState().user;
      
      // Format lại dữ liệu phản hồi để phù hợp với state
      return {
        success: true,
        message: response.data.message,
        // Nếu server trả về post, sử dụng dữ liệu từ server
        // Nếu không, tạo object post từ dữ liệu request
        post: response.data.post || {
          _id: response.data._id || Date.now().toString(),
          content: postData.content,
          caption: postData.content, // Thêm cả caption để đảm bảo tương thích
          createdAt: new Date().toISOString(),
          media: postData.mediaFiles 
            ? [{ url: URL.createObjectURL(postData.mediaFiles[0]) }] 
            : [],
          likesCount: 0,
          commentsCount: 0,
          author: {
            _id: currentUser.id || 'temp-id',
            fullName: currentUser.fullName || 'Tôi',
            profilePicture: currentUser.profilePicture || ''
          }
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể tạo bài viết');
    }
  }
);

// Thunk để lấy bài viết timeline
export const fetchTimelinePosts = createAsyncThunk(
  'posts/fetchTimeline',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await getTimelinePosts(page, limit);
      
      // Format lại dữ liệu nếu cần
      if (response.data && Array.isArray(response.data)) {
        // Trường hợp API trả về mảng bài viết trực tiếp
        return {
          posts: response.data.map(post => ({
            ...post,
            // Map các trường caption thành content để thống nhất hiển thị
            content: post.caption || post.content || '',
            media: post.filePath 
              ? [{ url: post.filePath }]
              : []
          })),
          currentPage: page,
          totalPages: Math.ceil(response.data.length / limit) || 1
        };
      } else if (response.data && response.data.posts) {
        // Trường hợp API trả về object có trường posts
        return {
          ...response.data,
          posts: response.data.posts.map(post => ({
            ...post,
            content: post.caption || post.content || '',
            media: post.filePath 
              ? [{ url: post.filePath }]
              : []
          }))
        };
      } else {
        // Trường hợp khác
        return {
          posts: [],
          currentPage: 1,
          totalPages: 1
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể tải bài viết');
    }
  }
);

// Thunk để lấy bài viết của người dùng cụ thể
export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getUserPosts(userId, page, limit);
      
      // Format lại dữ liệu tương tự như timeline posts
      if (response.data && Array.isArray(response.data)) {
        return {
          posts: response.data.map(post => ({
            ...post,
            content: post.caption || post.content || '',
            media: post.filePath 
              ? [{ url: post.filePath }]
              : []
          })),
          currentPage: page,
          totalPages: Math.ceil(response.data.length / limit) || 1
        };
      } else if (response.data && response.data.posts) {
        return {
          ...response.data,
          posts: response.data.posts.map(post => ({
            ...post,
            content: post.caption || post.content || '',
            media: post.filePath
              ? [{ url: post.filePath }]
              : []
          }))
        };
      } else {
        return {
          posts: [],
          currentPage: 1,
          totalPages: 1
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể tải bài viết của người dùng');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    timelinePosts: [],
    userPosts: [],
    currentPage: 1,
    userPostsPage: 1,
    totalPages: 1,
    userPostsTotalPages: 1,
    isLoading: false,
    isLoadingUserPosts: false,
    error: null,
    userPostsError: null,
    createPostStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    createPostError: null,
  },
  reducers: {
    clearPostErrors: (state) => {
      state.error = null;
      state.userPostsError = null;
      state.createPostError = null;
    },
    resetCreatePostStatus: (state) => {
      state.createPostStatus = 'idle';
      state.createPostError = null;
    },
    clearUserPosts: (state) => {
      state.userPosts = [];
      state.userPostsPage = 1;
      state.userPostsTotalPages = 1;
      state.isLoadingUserPosts = false;
      state.userPostsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý createNewPost
      .addCase(createNewPost.pending, (state) => {
        state.createPostStatus = 'loading';
        state.createPostError = null;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.createPostStatus = 'succeeded';
        // Thêm bài viết mới vào đầu danh sách nếu có
        if (action.payload && action.payload.post) {
          state.timelinePosts.unshift(action.payload.post);
          
          // Nếu đang ở trang profile của người dùng hiện tại, cũng thêm vào danh sách userPosts
          const currentUser = action.payload.post.author;
          if (currentUser && currentUser._id && state.userPosts.length > 0) {
            // Kiểm tra nếu userPosts thuộc về người dùng hiện tại
            if (state.userPosts[0]?.author?._id === currentUser._id) {
              state.userPosts.unshift(action.payload.post);
            }
          }
        }
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.createPostStatus = 'failed';
        state.createPostError = action.payload;
      })
      
      // Xử lý fetchTimelinePosts
      .addCase(fetchTimelinePosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTimelinePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Cập nhật danh sách bài viết
        if (action.payload && action.payload.posts) {
          if (state.currentPage === 1) {
            state.timelinePosts = action.payload.posts;
          } else {
            // Nối thêm bài viết mới vào danh sách hiện tại
            state.timelinePosts = [...state.timelinePosts, ...action.payload.posts];
          }
          
          state.currentPage = action.payload.currentPage || 1;
          state.totalPages = action.payload.totalPages || 1;
        }
      })
      .addCase(fetchTimelinePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Xử lý fetchUserPosts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoadingUserPosts = true;
        state.userPostsError = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoadingUserPosts = false;
        
        // Cập nhật danh sách bài viết người dùng
        if (action.payload && action.payload.posts) {
          if (state.userPostsPage === 1) {
            state.userPosts = action.payload.posts;
          } else {
            // Nối thêm bài viết mới vào danh sách hiện tại
            state.userPosts = [...state.userPosts, ...action.payload.posts];
          }
          
          state.userPostsPage = action.payload.currentPage || 1;
          state.userPostsTotalPages = action.payload.totalPages || 1;
        }
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoadingUserPosts = false;
        state.userPostsError = action.payload;
      });
  },
});

export const { clearPostErrors, resetCreatePostStatus, clearUserPosts } = postSlice.actions;

export default postSlice.reducer; 
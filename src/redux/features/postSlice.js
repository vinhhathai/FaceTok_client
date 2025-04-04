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
      
      // Check if we got a valid response with posts
      if (!response.data) {
        return { posts: [], currentPage: page, totalPages: 1 };
      }
      
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
        // Check if posts array is valid
        if (!Array.isArray(response.data.posts)) {
          return { posts: [], currentPage: page, totalPages: 1 };
        }
        
        return {
          ...response.data,
          posts: response.data.posts.map(post => {
            return {
              ...post,
              content: post.caption || post.content || '',
              media: post.filePath
                ? [{ url: post.filePath }]
                : (post.media || [])
            };
          })
        };
      } else {
        return {
          posts: [],
          currentPage: 1,
          totalPages: 1
        };
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
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
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload.posts;
      state.userPostsPage = action.payload.page || 1;
      state.userPostsTotalPages = action.payload.totalPages || 1;
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
          const newPost = action.payload.post;
          
          console.log('New post from server:', newPost);
          
          // Ensure we have the proper format for the post
          const formattedPost = {
            ...newPost,
            _id: newPost._id,
            content: newPost.content || newPost.caption || '',
            author: newPost.author || {
              _id: newPost.userId || 'temp-id',
              fullName: 'Tôi',
              profilePicture: ''
            },
            media: newPost.media || (newPost.filePath ? [{ url: newPost.filePath }] : []),
            likesCount: newPost.likesCount || 0,
            commentsCount: newPost.commentsCount || 0,
            createdAt: newPost.createdAt || new Date().toISOString()
          };
          
          console.log('Formatted post for Redux store:', formattedPost);
          
          // Add to timeline posts
          state.timelinePosts.unshift(formattedPost);
          
          // Add to user posts - only if we're on the first page
          // We'll let the fetchUserPosts handle refreshing the full list
          if (state.userPostsPage === 1) {
            state.userPosts.unshift(formattedPost);
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
        
        console.log('fetchUserPosts fulfilled with data:', action.payload);
        
        // Cập nhật danh sách bài viết người dùng
        if (action.payload && action.payload.posts) {
          if (action.meta.arg.page === 1) {
            // If it's page 1, replace the entire list
            state.userPosts = action.payload.posts;
            state.userPostsPage = 1;
          } else {
            // Nối thêm bài viết mới vào danh sách hiện tại
            // Ensure no duplicates by checking post IDs
            const existingIds = new Set(state.userPosts.map(post => post._id));
            const newPosts = action.payload.posts.filter(post => !existingIds.has(post._id));
            state.userPosts = [...state.userPosts, ...newPosts];
            state.userPostsPage = action.payload.currentPage || action.meta.arg.page;
          }
          
          state.userPostsTotalPages = action.payload.totalPages || 1;
        }
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoadingUserPosts = false;
        state.userPostsError = action.payload;
      });
  },
});

export const { clearPostErrors, resetCreatePostStatus, clearUserPosts, setUserPosts } = postSlice.actions;

export default postSlice.reducer; 
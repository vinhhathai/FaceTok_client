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
      console.log(`Fetching timeline posts: page ${page}, limit ${limit}`);
      const response = await getTimelinePosts(page, limit);
      console.log('Timeline API response:', response.data);
      
      // API function đã xử lý response.data.data
      const responseData = response.data;
      
      if (!responseData) {
        console.error('No data returned from API');
        return rejectWithValue('Không nhận được dữ liệu từ server');
      }
      
      // Kiểm tra xem dữ liệu có cấu trúc đúng không
      if (Array.isArray(responseData)) {
        // Trường hợp API trả về mảng posts trực tiếp
        console.log('API returned array of posts directly');
        return {
          posts: responseData,
          currentPage: page,
          totalPages: Math.ceil(responseData.length / limit) || 1,
          totalPosts: responseData.length
        };
      } else if (responseData.posts) {
        // Trường hợp API trả về object có chứa posts
        console.log('API returned object with posts field');
        return {
          posts: responseData.posts || [],
          currentPage: responseData.currentPage || page,
          totalPages: responseData.totalPages || 1,
          totalPosts: responseData.totalPosts || (responseData.posts ? responseData.posts.length : 0)
        };
      } else {
        // Trường hợp không xác định
        console.error('Unexpected API response format:', responseData);
        return {
          posts: [],
          currentPage: page,
          totalPages: 1,
          totalPosts: 0
        };
      }
    } catch (error) {
      console.error('Error fetching timeline posts:', error);
      return rejectWithValue(error.message || 'Không thể tải bài viết');
    }
  }
);

// Thunk để lấy bài viết của người dùng cụ thể
export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      console.log(`Fetching user posts for user ${userId}: page ${page}, limit ${limit}`);
      const response = await getUserPosts(userId, page, limit);
      console.log('User posts API response:', response.data);
      
      // API function đã xử lý response.data.data
      const responseData = response.data;
      
      if (!responseData) {
        console.error('No data returned from API');
        return rejectWithValue('Không nhận được dữ liệu từ server');
      }
      
      // Kiểm tra xem dữ liệu có cấu trúc đúng không
      if (Array.isArray(responseData)) {
        // Trường hợp API trả về mảng posts trực tiếp
        console.log('API returned array of posts directly');
        return {
          posts: responseData.map(post => ({
            ...post,
            content: post.caption || post.content || '',
            media: post.filePath 
              ? [{ url: post.filePath }]
              : (post.media || [])
          })),
          currentPage: page,
          totalPages: Math.ceil(responseData.length / limit) || 1
        };
      } else if (responseData.posts) {
        // Trường hợp API trả về object có chứa posts
        console.log('API returned object with posts field');
        return {
          posts: responseData.posts.map(post => ({
            ...post,
            content: post.caption || post.content || '',
            media: post.filePath 
              ? [{ url: post.filePath }]
              : (post.media || [])
          })),
          currentPage: responseData.currentPage || page,
          totalPages: responseData.totalPages || 1
        };
      } else {
        // Trường hợp không xác định
        console.error('Unexpected API response format:', responseData);
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
      .addCase(fetchTimelinePosts.pending, (state, action) => {
        // Chỉ set isLoading = true nếu đang load trang đầu tiên
        // Để tránh hiển thị loading spinner khi load thêm
        if (action.meta.arg.page === 1) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchTimelinePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Kiểm tra nếu có dữ liệu posts
        if (action.payload && action.payload.posts) {
          // Nếu đang load trang đầu tiên, thay thế hoàn toàn danh sách cũ
          if (action.meta.arg.page === 1) {
            state.timelinePosts = action.payload.posts;
          } else {
            // Nếu không, thêm vào danh sách hiện tại
            // Loại bỏ các bài viết trùng lặp (nếu có)
            const existingIds = new Set(state.timelinePosts.map(post => post._id));
            const newPosts = action.payload.posts.filter(post => !existingIds.has(post._id));
            
            state.timelinePosts = [...state.timelinePosts, ...newPosts];
          }
          
          // Cập nhật thông tin phân trang
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        } else {
          // Nếu không có dữ liệu và đang ở trang đầu tiên, đặt lại danh sách
          if (action.meta.arg.page === 1) {
            state.timelinePosts = [];
          }
        }
      })
      .addCase(fetchTimelinePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch timeline posts';
      })
      
      // Xử lý fetchUserPosts
      .addCase(fetchUserPosts.pending, (state, action) => {
        state.isLoadingUserPosts = true;
        state.userPostsError = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoadingUserPosts = false;
        
        if (action.payload && action.payload.posts) {
          if (action.meta.arg.page === 1) {
            // Replace current posts if loading first page
            state.userPosts = action.payload.posts;
          } else {
            // Append new posts and ensure no duplicates
            const existingIds = new Set(state.userPosts.map(post => post._id));
            const newPosts = action.payload.posts.filter(post => !existingIds.has(post._id));
            
            state.userPosts = [...state.userPosts, ...newPosts];
          }
          
          state.userPostsPage = action.payload.currentPage;
          state.userPostsTotalPages = action.payload.totalPages;
        }
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoadingUserPosts = false;
        state.userPostsError = action.payload || 'Failed to fetch user posts';
      });
  },
});

export const { clearPostErrors, resetCreatePostStatus, clearUserPosts, setUserPosts } = postSlice.actions;

export default postSlice.reducer; 
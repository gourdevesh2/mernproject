import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  status:'idel',
  loading: false,
  error: null,
  success: false,
  data: null,
  selectData:null
};

// Define async thunk for fetching data from an API
export const fetchData = createAsyncThunk('posts/fetchData', async () => {
    try {
      const response = await fetch('getblog');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      console.log("data",data)
      return data;
    } catch (error) {
      throw new Error('Error fetching posts:', error.message);
    }
  });
   
  



// Define async thunk for saving a post
export const savePost = createAsyncThunk('posts/savePost', async ({ title, description, categories, image, username }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('categories', categories);
  formData.append('image', image);
  formData.append('username', username);

  const response = await fetch('/posts', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to save post');
  }

  return response.json();
});


export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ id, newData,file }, { rejectWithValue }) => {
      console.log("file",file)
      try {
        // Make a PUT request to update the post using Axios
        const response = await axios.put(`update/${id}`, newData,file);
  
        if (response.status === 200) {
          return response.data; // Return the updated post data
        } else {
          // Handle the case when the response status is not successful
          return rejectWithValue({
            status: response.status,
            message: response.data.message,
          });
        }
      } catch (error) {
        // Handle any network or request error
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    }
  );

  export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`deletePost/${id}`);
  
        if (response.status === 200) {
          return { id }; // Return the deleted post ID
        } else {
          return rejectWithValue({
            status: response.status,
            message: response.data.message,
          });
        }
      } catch (error) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message,
        });
      }
    }
  );
  
// Create a slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updatetPostById: (state, action) => {
        state.selectData = state.data.find((post) => post._id === action.payload.postId);
      },
      cleanStatus: (state, action) => {
        state.status = "Ok";
      },

  },
  extraReducers: (builder) => {
    builder
      .addCase(savePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.data = []; // Reset data when starting to fetch new data

      })
      .addCase(savePost.fulfilled, (state,action) => {
        state.loading = false;
        state.success = true;
        state.status = "fulfilled"
        state.data = [...state.data, action.payload]; // Append new post to existing data

      })
      .addCase(savePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
      })
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.data = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.status ="deleted";
        const deletedPostId = action.payload.id;
      
        // Filter out the deleted post from state.data
        state.data = state.data.filter((post) => post._id !== deletedPostId);
      })
      .addCase(deletePost.pending, (state) => {
        
        state.loading = true;
        state.error = null;
      })
     

      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.data = null;
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.status ="updated";
        state.data = state.data.map((item) =>
          item._id === action.payload._id
            ? action.payload
            : item
        );
      })
      .addCase(updatePost.pending, (state) => {
        
        state.loading = true;
        state.error = null;
      })
     

      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.data = null;
      });
  },
});

export const {
    updatetPostById,cleanStatus
  } = postsSlice.actions;
  export const getData = (state) => state.data.selectData;


export default postsSlice.reducer;

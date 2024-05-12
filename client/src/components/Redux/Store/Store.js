import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/CreatePostRedux';
import LoginRedux from '../features/LoginRedux';
const Store = configureStore({
  reducer: {
    data: postsReducer,
    user: LoginRedux
  },
});

export default Store;

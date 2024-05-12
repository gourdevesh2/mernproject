import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Define the initial state
const initialState = {
    user: null,
    status: 'idle', // or 'loading', 'succeeded', 'failed'
    error: null
};

// Create an async thunk for user registration
export const registerUser = createAsyncThunk('auth/registerUser', async ({ fname, email, password, cpassword }) => {
    alert(fname)
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fname,
            email,
            password,
            cpassword
        })
    });

    const data = await response.json();

    if (response.status === 201) {
        toast.success("Registration Successfully done 😃!", {
            position: "top-center"
        });

        return data; // Assuming data includes any response information you want to handle
    } else {
        throw new Error('Failed to register user');
    }
});

// Create an auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Additional reducers can be defined here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload; // Assuming payload contains user data after registration
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { } = authSlice.actions; 
export default authSlice.reducer;

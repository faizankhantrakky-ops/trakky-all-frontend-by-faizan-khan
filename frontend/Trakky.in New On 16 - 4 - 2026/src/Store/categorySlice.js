
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories } from "../Components/listPage/pageapi";

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async ({ city }, { dispatch, rejectWithValue }) => {
        try {
            const response = await getCategories(city);
            response.city = city;
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        data: [],
        loading: true,
        error: null,
        city: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.city = action.payload.city; 

            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const categoryReducer = categorySlice.reducer;



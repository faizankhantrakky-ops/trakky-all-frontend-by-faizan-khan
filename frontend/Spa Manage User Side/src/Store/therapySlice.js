
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTherapy } from "../Components/listpage/pageapi";

export const fetchTherapy = createAsyncThunk(
    "therapy/fetchTherapy",
    async ({ city }, { dispatch, rejectWithValue }) => {
        try {
            const response = await getTherapy(city);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const therapySlice = createSlice({
    name: "therapy",
    initialState: {
        data: [],
        loading: false,
        error: null,
        city: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTherapy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTherapy.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                if (
                    action.payload.length > 0
                ) {
                    state.city = action.payload[0].city;
                }

            })
            .addCase(fetchTherapy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const therapyReducer = therapySlice.reducer;



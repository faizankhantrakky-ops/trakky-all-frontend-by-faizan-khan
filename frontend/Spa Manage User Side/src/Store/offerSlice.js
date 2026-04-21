
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOffers } from "../Components/listpage/pageapi";

export const fetchOffer = createAsyncThunk(
    "offers/fetchOffers",
    async ({city}, { dispatch, rejectWithValue }) => {
        try {
            const response = await getOffers(city);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const offerSlice = createSlice({
    name: "offers",
    initialState: {
        data: [],
        loading: false,
        error: null,
        city: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                if (action.payload.length > 0) {
                    state.city = action.payload[0].city;
                }
            })
            .addCase(fetchOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const offerReducer = offerSlice.reducer;



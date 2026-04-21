
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNearBySpas } from "../Components/listpage/pageapi";

export const fetchNearBySpas = createAsyncThunk(
    "nearbyspas/fetchNearBySpas",
    async ({ latitude , longitude , page }, { dispatch, rejectWithValue }) => {
        try {
            const response = await getNearBySpas(latitude , longitude , page);
            response.latitude = latitude;
            response.page = page;
            response.longitude = longitude;
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const nearbyspas = createSlice({
    name: "nearbyspas",
    initialState: {
        data: [],
        loading: false,
        error: null,
        page: 1,
        isNextPage: false,
        latitude: 0,
        longitude: 0,
        preferableCity: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNearBySpas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNearBySpas.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.page === 1) {
                    state.data = action.payload.results;
                } else {
                    state.data = [...state.data, ...action.payload.results];
                }
                state.page = action.payload.page + 1;
                state.isNextPage = action.payload.next !== null;
                state.latitude = action.payload.latitude;
                state.longitude = action.payload.longitude;
                state.preferableCity = action.payload?.results?.[0]?.city;
            })
            .addCase(fetchNearBySpas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
    
});

export const nearBySpas = nearbyspas.reducer;




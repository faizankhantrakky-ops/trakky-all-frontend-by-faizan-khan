import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSalonsNearYou } from "../Components/listPage/pageapi";

export const fetchNearBySalons = createAsyncThunk(
  "nearbysalons/fetchNearBySalons",
  async ({ latitude, longitude, page }, { dispatch, rejectWithValue }) => {
    try {
      // Default → Sindhu Bhavan Pakwan Char Rasta
      const defaultLat = 23.0386;
      const defaultLng = 72.5118;

      const lat = latitude || defaultLat;
      const lng = longitude || defaultLng;

      const response = await getSalonsNearYou(lat, lng, page);

      response.latitude = lat;
      response.longitude = lng;
      response.page = page;

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const nearbysalons = createSlice({
  name: "nearbysalons",
  initialState: {
    data: [],
    loading: false,
    error: null,
    page: 1,
    isNextPage: false,

    latitude: 23.0386,
    longitude: 72.5118,

    preferableCity: "Ahmedabad",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearBySalons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchNearBySalons.fulfilled, (state, action) => {
  state.loading = false;

  const salons =
    action.payload.results ||
    action.payload.data ||
    action.payload.salons ||
    [];

  if (action.payload.page === 1) {
    state.data = salons;
  } else {
    state.data = [...state.data, ...salons];
  }

  state.page = action.payload.page + 1;
  state.isNextPage = action.payload.next !== null;
  state.latitude = action.payload.latitude;
  state.longitude = action.payload.longitude;

  if (salons.length > 0) {
   state.preferableCity = action.payload?.results?.[0]?.city || "Ahmedabad";
  }
})

      .addCase(fetchNearBySalons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const nearBySalons = nearbysalons.reducer;

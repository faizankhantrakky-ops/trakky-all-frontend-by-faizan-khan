// spaSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTopRatedSpas, getLuxuriosSpas, getBeautySpas, getBodyMassageSpas, getBodyMassageCenters, getMenSpas, getWomenSpas, getBestSpas, getThaiBodyMassage } from '../Components/listpage/pageapi';
// import { fetchspasByCategory } from 'your-api-module';

// Helper function to generate dynamic action type
const generateAsyncType = (category, status) => `spas/fetchByCategoryAsync_${category}_${status}`;

// Generic AsyncThunk to fetch spas data for a specific category and page
export const fetchspasByCategoryAsync = createAsyncThunk(
  'spas/fetchByCategoryAsync',
  async ({ category, page, city }, { dispatch, rejectWithValue }) => {
    try {
      const asyncTypePending = generateAsyncType(category, 'pending');
      const asyncTypeFulfilled = generateAsyncType(category, 'fulfilled');
      const asyncTypeRejected = generateAsyncType(category, 'rejected');

      let response;

      // Replace the following line with the actual API call
      if (category === 'topRated') {
        response = await getTopRatedSpas(city, null, page);
        response.page = page;
        response.city = city;
      }
      else if (category === 'luxurios') {
        response = await getLuxuriosSpas(city, null, page);
        response.page = page;
        response.city = city;
      }
      else if (category === 'beauty') {
        response = await getBeautySpas(city, null, page);
        response.page = page;
        response.city = city;
      }
      else if (category === 'bodyMassage') {
        response = await getBodyMassageSpas(city, null, page);
        response.page = page;
        response.city = city;

      }
      else if (category === 'bodyMassageCenters') {
        response = await getBodyMassageCenters(city, null, page);
        response.page = page;
        response.city = city;
      }
      else if (category === 'mens') {
        response = await getMenSpas(city, null, page);
        response.page = page;
        response.city = city;
      }
      else if (category === 'womens') {
        response = await getWomenSpas(city, null, page);
        response.page = page;
        response.city = city;
      }
      else if (category === 'best') {
        response = await getBestSpas(city, null, page);
        response.page = page;
        response.city = city;
      }
      else if (category === 'thaiBodyMassage') {
        response = await getThaiBodyMassage(city , null , page);
        response.page = page;
        response.city = city;
      }
      else {
        response = { data: ['dad'] };
      }


      dispatch({ type: asyncTypePending });
      dispatch({ type: asyncTypeFulfilled, payload: response });

      return response.data;
    } catch (error) {
      const asyncTypeRejected = generateAsyncType(category, 'rejected');
      dispatch({ type: asyncTypeRejected, payload: error.message || `Failed to fetch ${category} spas for page ${page}` });
      return rejectWithValue(error.message || `Failed to fetch ${category} spas for page ${page}`);
    }
  }
);

// Create a generic function to generate a slice for a specific category
const createSpaSlice = (category) => {
  const asyncTypePending = generateAsyncType(category, 'pending');
  const asyncTypeFulfilled = generateAsyncType(category, 'fulfilled');
  const asyncTypeRejected = generateAsyncType(category, 'rejected');

  return createSlice({
    name: `${category}Spas`,
    initialState: {
      data: [],
      loading: true,
      page: 1,
      isNextPage: false,
      error: null,
      city: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(asyncTypePending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(asyncTypeFulfilled, (state, action) => {
          state.loading = false;
          // state.data = [...state.data, ...action.payload.results];
          if (action.payload.page === 1) {
            state.data = action.payload.results;
          }
          else {
            state.data = [...state.data, ...action.payload.results];
          }
          state.city = action.payload.city;
          state.page = action.payload.page + 1;
          state.isNextPage = action.payload.next !== null;
        })
        .addCase(asyncTypeRejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || `Failed to fetch ${category} spas for page ${state.page}`;
        });
    },
  });
};

// Example usage
export const topRatedSpasSlice = createSpaSlice('topRated');
export const luxuriosSpasSlice = createSpaSlice('luxurios');
export const beautySpasSlice = createSpaSlice('beauty');
export const bodyMassageSpasSlice = createSpaSlice('bodyMassage');
export const bodyMassageCentersSlice = createSpaSlice('bodyMassageCenters');
export const mensSpasSlice = createSpaSlice('mens');
export const womensSpasSlice = createSpaSlice('womens');
export const bestSpasSlice = createSpaSlice('best');
export const thaiBodyMassageSlice = createSpaSlice('thaiBodyMassage');


// Add slices for other categories as needed

// Export reducers for each category
export const topRatedSpasReducer = topRatedSpasSlice.reducer;
export const luxuriosSpasReducer = luxuriosSpasSlice.reducer;
export const beautySpasReducer = beautySpasSlice.reducer;
export const bodyMassageSpasReducer = bodyMassageSpasSlice.reducer;
export const bodyMassageCentersReducer = bodyMassageCentersSlice.reducer;
export const mensSpasReducer = mensSpasSlice.reducer;
export const womensSpasReducer = womensSpasSlice.reducer;
export const bestSpasReducer = bestSpasSlice.reducer;
export const thaiBodyMassageReducer = thaiBodyMassageSlice.reducer;


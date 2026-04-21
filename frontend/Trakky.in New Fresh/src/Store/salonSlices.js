// salonSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTopRatedSalons, getUnisexSalons , getBridalSalons , getKidsSalons ,getFemaleBeautySalons , getAcademySalons , getMakeupSalons, getMaleSalons} from '../Components/listPage/pageapi';
// import { fetchSalonsByCategory } from 'your-api-module';

// Helper function to generate dynamic action type
const generateAsyncType = (category, status) =>    `salons/fetchByCategoryAsync_${category}_${status}`;

// Generic AsyncThunk to fetch salons data for a specific category and page
export const fetchSalonsByCategoryAsync = createAsyncThunk(
  'salons/fetchByCategoryAsync',
  async ({ category, page, city }, { dispatch, rejectWithValue }) => {
    try {
      const asyncTypePending = generateAsyncType(category, 'pending');
      const asyncTypeFulfilled = generateAsyncType(category, 'fulfilled');
      const asyncTypeRejected = generateAsyncType(category, 'rejected');

      dispatch({ type: asyncTypePending });

      let response;

      // Replace the following line with the actual API call
      if ( category === 'topRated' ) {
         response = await getTopRatedSalons(city ,null, page);
         response.page = page;
         response.city = city;
      }
      else if ( category === 'unisex' ) {
        response = await getUnisexSalons(city ,null, page);
        response.page = page;
        response.city = city;
      }
      else if ( category === 'bridal' ) {
        response = await getBridalSalons(city ,null, page); 
        response.page = page;
        response.city = city;
      }
      else if ( category === 'kids' ) {
        response = await getKidsSalons(city ,null, page);
        response.page = page;
        response.city = city;
      }
      else if ( category === 'femaleBeauty' ) {
        response = await getFemaleBeautySalons(city ,null, page);
        response.page = page;
        response.city = city;
      }
      else if ( category === 'academy' ) {
        response = await getAcademySalons(city ,null, page);
        response.page = page;
        response.city = city;
      }
      else if ( category === 'makeup' ) {
        response = await getMakeupSalons(city ,null, page);
        response.page = page;
        response.city = city;
      }
      else if ( category === 'male' ) {
        response = await getMaleSalons(city ,null, page);
        response.page = page;
        response.city = city;
      }
      else{
       response = { data: ['dad'] }; 
      }


      dispatch({ type: asyncTypePending });
      dispatch({ type: asyncTypeFulfilled, payload: response });

      return response.data;
    } catch (error) {
      const asyncTypeRejected = generateAsyncType(category, 'rejected');
      dispatch({ type: asyncTypeRejected, payload: error.message || `Failed to fetch ${category} salons for page ${page}` });
      return rejectWithValue(error.message ||  `Failed to fetch ${category} salons for page ${page}`);
    }
  }
);

// Create a generic function to generate a slice for a specific category
const createSalonSlice = (category) => {
  const asyncTypePending = generateAsyncType(category, 'pending');
  const asyncTypeFulfilled = generateAsyncType(category, 'fulfilled');
  const asyncTypeRejected = generateAsyncType(category, 'rejected');

  return createSlice({
    name:  `${category}Salons`,
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
          console.log('action.payload.results', state.page);

          if (action.payload.page === 1) {
            state.data = action.payload.results;
          } else {
            state.data = [...state.data, ...action.payload.results];
          }
          state.city = action.payload.city;
          state.page = action.payload.page + 1;
          state.isNextPage = action.payload.next !== null;
        })
        .addCase(asyncTypeRejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || `Failed to fetch ${category} salons for page ${state.page}`;
        });
    },
  });
};

// Example usage
export const topRatedSalonsSlice = createSalonSlice('topRated');
export const unisexSalonsSlice = createSalonSlice('unisex');
export const bridalSalonsSlice = createSalonSlice('bridal');
export const kidsSalonsSlice = createSalonSlice('kids');
export const femaleBeautySlice = createSalonSlice('femaleBeauty');
export const academySlice = createSalonSlice('academy');
export const makeupSlice = createSalonSlice('makeup');
export const maleSlice = createSalonSlice('male');

// Add slices for other categories as needed

// Export reducers for each category
export const topRatedSalonsReducer = topRatedSalonsSlice.reducer;
export const unisexSalonsReducer = unisexSalonsSlice.reducer;
export const bridalSalonsReducer = bridalSalonsSlice.reducer;
export const kidsSalonsReducer = kidsSalonsSlice.reducer;
export const femaleBeautyReducer = femaleBeautySlice.reducer;
export const academyReducer = academySlice.reducer;
export const makeupReducer = makeupSlice.reducer;
export const maleReducer = maleSlice.reducer;

// Add reducers for other categories as needed]
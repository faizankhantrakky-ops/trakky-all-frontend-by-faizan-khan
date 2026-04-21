import { configureStore } from '@reduxjs/toolkit';
import { topRatedSalonsReducer, unisexSalonsReducer , bridalSalonsReducer , kidsSalonsReducer ,femaleBeautyReducer , academyReducer , makeupReducer, maleReducer} from './salonSlices'; 
import { categoryReducer } from './categorySlice';
import { offerReducer } from './offerSlice';
import { nearBySalons } from './nearbySlice';

const store = configureStore({
  reducer: {
    topRatedSalons: topRatedSalonsReducer,
    unisexSalons: unisexSalonsReducer,
    bridalSalons: bridalSalonsReducer,
    kidsSalons: kidsSalonsReducer,
    femaleBeautySalons : femaleBeautyReducer,
    academySalons : academyReducer,
    makeupSalons : makeupReducer,
    maleSalons : maleReducer,
    categories: categoryReducer,
    offers: offerReducer,
    nearBySalons: nearBySalons,
  },
});

export default store;
import { configureStore } from '@reduxjs/toolkit';
import {   topRatedSpasReducer , luxuriosSpasReducer ,beautySpasReducer , bodyMassageSpasReducer , bodyMassageCentersReducer , mensSpasReducer , womensSpasReducer, bestSpasReducer, thaiBodyMassageReducer  } from './spaSlices'; 
import { nearBySpas } from './nearbySlice';
import { therapyReducer } from './therapySlice';
import { offerReducer } from './offerSlice';

const store = configureStore({
  reducer: {
    topRatedSpas: topRatedSpasReducer,
    luxuriosSpas: luxuriosSpasReducer,
    beautySpas: beautySpasReducer,
    bodyMassageSpas: bodyMassageSpasReducer,
    bodyMassageCenters: bodyMassageCentersReducer,
    mensSpas: mensSpasReducer,
    womensSpas: womensSpasReducer,
    nearbySpas: nearBySpas,
    therapy: therapyReducer,
    offers : offerReducer,
    bestSpas : bestSpasReducer,
    thaiBodyMassage : thaiBodyMassageReducer,
  },
});

export default store;
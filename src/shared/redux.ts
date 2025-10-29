import { combineSlices, configureStore, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

export type AppState = any;
export type AppThunk<R = void> = ThunkAction<
    R,
    AppState,
    any,
    UnknownAction
  >;

export type AppDispatch = typeof store.dispatch

export const rootReducer = combineSlices()

export const store = configureStore({
    reducer: rootReducer
})

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispath = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>

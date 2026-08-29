"use client";

import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./index";

/**
 * Pre-typed Redux hooks.
 *
 * Import these instead of the react-redux originals and every selector and
 * dispatch is typed automatically - no `RootState` annotation at the call site,
 * and no `any` sneaking in through an untyped `useSelector`.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

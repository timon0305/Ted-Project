// NGRX
import { createSelector } from '@ngrx/store';
// Lodash
import { each, find, some } from 'lodash';

export const selectAuthState = state => state.auth;

export const isLoggedIn = createSelector(
    selectAuthState,
    auth => auth.loggedIn
);
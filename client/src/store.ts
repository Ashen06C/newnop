import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import issueReducer from './features/issues/issueSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        issue: issueReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

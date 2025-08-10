import { configureStore } from '@reduxjs/toolkit'
import gameDataReducer from './gameData/gameDataSlice'
import  gameLoggerReducer  from './gameLogger/gameLoggerSlice'
import listCreationDataSlice from './listCreationData/listCreationDataSlice'
export const store = configureStore({
    reducer: {
        gamePageData: gameDataReducer,
        gamePageLogger: gameLoggerReducer,
        listCreationData: listCreationDataSlice
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
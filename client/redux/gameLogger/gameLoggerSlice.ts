import { createSlice } from '@reduxjs/toolkit'

interface GamePageState {
    data: boolean;
}

const initialState: GamePageState = {
    data: false,
};

export const gameLoggerReducer = createSlice({
    name: 'gameLogger',
    initialState,
    reducers: {
        updateLogger: (state) => {
            state.data = !state.data;
        },
        clearLogger: (state) => {
            state.data = false;
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateLogger, clearLogger } = gameLoggerReducer.actions

export default gameLoggerReducer.reducer
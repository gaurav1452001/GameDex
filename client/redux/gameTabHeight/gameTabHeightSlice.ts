import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GamePageState {
    data: number | 0;
}

const initialState: GamePageState = {
    data: 0,
};

export const gameHeightReducer = createSlice({
    name: 'gameHeight',
    initialState,
    reducers: {
        updateHeight: (state, action: PayloadAction<number>) => {
            state.data = action.payload;
        },
        clearHeight: (state) => {
            state.data = 0;
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateHeight, clearHeight } = gameHeightReducer.actions

export default gameHeightReducer.reducer
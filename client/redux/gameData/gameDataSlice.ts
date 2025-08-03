import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GamePageDataType } from '@/types/gameTypes'

interface GamePageState {
    data: GamePageDataType | null;
}

const initialState: GamePageState = {
    data: null,
};

export const gameDataReducer = createSlice({
    name: 'gameData',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<GamePageDataType>) => {
            state.data = action.payload;
        },
        clearData: (state) => {
            state.data = null;
        },
    },
})

// Action creators are generated for each case reducer function
export const { update, clearData } = gameDataReducer.actions

export default gameDataReducer.reducer
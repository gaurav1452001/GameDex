import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { listType } from '@/types/listTypes'

interface ListCreationState {
    data: listType | null;
}

const initialState: ListCreationState = {
    data: null,
};

export const listCreationDataReducer = createSlice({
    name: 'listCreationData',
    initialState,
    reducers: {
        updateList: (state, action: PayloadAction<listType>) => {
            state.data = action.payload;
        },
        clearList: (state) => {
            state.data = null;
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateList, clearList } = listCreationDataReducer.actions

export default listCreationDataReducer.reducer
import { createSlice } from '@reduxjs/toolkit'

export interface user {
    id: number,
    name: string,
    age: number | string,
    email: string,
    password: string,
    telephone: string,
    address: string,
    departId: Number[],
    role: string
}

interface initialState {
    users: user[],
    search: string, 
    selected: number[]
}

const initialState: initialState = {
    users: [],
    search: "",
    selected: []
}

const sliceMemberInfor = createSlice({
    name: 'infor',
    initialState,
    reducers: {
        updateStateUser: (state, action) => {
            state.users = action.payload
        },
        addStateUser: (state, action) => {
            state.users = [...state.users, action.payload]
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter((item) => item.id !== action.payload)
        },
        updateEditUser: (state, action) => {
            const statePrev = [...state.users];
            const stateNew = statePrev.map((item) =>
                item.id === action.payload.id ? (item = { ...item, ...action.payload }) : item
            );
            state.users = stateNew
        },
        filterUser: (state, action) => {
            state.users = action.payload
        },
        selectedRow: (state, action) => {
            let selectedOld = state.selected
            if (selectedOld.includes(action.payload)) {
                selectedOld = selectedOld.filter((item) => item !== action.payload)
                state.selected = selectedOld
            } else {
                state.selected = [...selectedOld, action.payload]
            }
        },
        test: (state) => {
            console.log("test ok")
        }
    }
})

export const { updateStateUser, addStateUser, deleteUser, updateEditUser, filterUser, selectedRow, test } = sliceMemberInfor.actions

export default sliceMemberInfor.reducer
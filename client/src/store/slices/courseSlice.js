import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    course: []
}

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers:{
        setCourses: (state, action) => {
            state.course = action.payload;
        },
        addCourse: (state, action) => {
            state.course.push(action.payload);
        }
    }
})

export const {setCourses, addCourse} = courseSlice.actions;
export default courseSlice.reducer;
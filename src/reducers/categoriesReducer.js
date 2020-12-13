
const initialState = {
    activeCategoryId: 0,
    activeCategoryName: "",
    data: []
}
export default function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case "LOAD_CATEGORIES":
            return { ...state, data: action.categories }
        case "SET_ACTIVE_CATEGORY_ID":
            return { ...state, activeCategoryId: action.categoryId }
        case "SET_ACTIVE_CATEGORY_NAME":
            return { ...state, activeCategoryName: action.categoryName }
        default:
            return state;
    }
}
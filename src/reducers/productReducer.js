const initialState = {
    data: [],
    next: {},
    previous: {},
    loading: false
};
export default function productReducer(state = initialState, action) {
    switch (action.type) {
        case "LOAD_PRODUCTS":
            return {
                ...state,
                data: action.paginatedProducts.data,
                next: action.paginatedProducts.next,
                previous: action.paginatedProducts.previous
            }
        case "LOADING":
            return { ...state, loading: action.loading }
        default:
            return state;
    }
}
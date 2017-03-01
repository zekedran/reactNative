export default (state = {
    orders: {},
    inProgress: [],
    error: {},
    totalCount: null,
    totalPages: null,
    lastPageFetched: null,
}, action) => {
    switch(action.type) {
        case "FETCH_ORDER_IN_PROGRESS":
            return {...state,
                inProgress: [...state.inProgress, action.id]};
        case "FETCH_ORDER_FULFILLED":
            return {...state,
                inProgress: state.inProgress.filter(id => id!=action.id),
                orders: {...state.orders, [action.payload.id]: action.payload},
                error: {...state.error, [action.payload.id]: null}};
        case "FETCH_ORDERS_FULFILLED":
            return {...state,
                totalPages: action.totalPages,
                totalCount: action.totalCount,
                lastPageFetched: -action.id,
                inProgress: state.inProgress.filter(id => id!=action.id),
                error: {...state.error, [action.id]: null}};
        case "FETCH_ORDER_FAILED":
            return {...state,
                inProgress: state.inProgress.filter(id => id!=action.id),
                error: {...state.error, [action.id]: action.payload}};
    }
    return state;
}
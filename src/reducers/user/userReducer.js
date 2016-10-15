export default (state = {
    jwt: null,
    processing: false,
    name: null,
    mobile: null,
    email: null,
    error: null
},action) => {
    const newState = {...state};
    switch(action.type) {
        case "FETCH_JWT_FULFILLED": newState.jwt = action.payload; newState.error = null; break;
        case "FETCH_JWT_FAILED": newState.jwt = null; newState.error = action.payload; break;
        case "FETCH_USER_FULFILLED": newState.user = action.payload; newState.error = null; break;
        case "FETCH_USER_FAILED": newState.error = action.payload; break;
    }
    newState.processing = action.type === "PROCESSING";
    return newState;
};
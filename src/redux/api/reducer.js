import {
    store
} from "../store";
import {
    API_SHOW_SPINNER,
    API_HIDE_SPINNER
} from "../api/actions";

const initialState = {
    loading: 0,
    fetch: null,
    sentido: ""

};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state
    };
    switch (action.type) {
        case API_SHOW_SPINNER:
            newState.loading += 1
            newState.fetch = action.fetch
            newState.sentido = "ida"
            break;
        case API_HIDE_SPINNER:
            newState.loading -= 1
            newState.fetch = action.fetch
            newState.sentido = "vuelta"
            break;
    }
    return newState;
};
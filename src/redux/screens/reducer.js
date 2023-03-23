import {
    SHOW_SCREEN,

} from "./actions";

const initialState = {
    name: null,
    layouts: {
        small: {
            name: "",
            areas: []
        },
        medium: {
            name: "",
            areas: []
        },
        large: {
            name: "",
            areas: []
        }
    },
    timeStamp: null


};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state
    };

    switch (action.type) {
        case SHOW_SCREEN:
            newState.timeStamp = (new Date()).getTime()
            newState.layouts = action.layouts
            newState.name = action.name
    }
    return newState;
};
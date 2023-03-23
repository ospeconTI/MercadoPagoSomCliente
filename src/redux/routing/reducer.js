import {
    SET_CURRENT,
    POP_HISTORY,
    PUSH_HISTORY

} from "./actions";

const initialState = {
    current: {
        pointer: 0,
        name: ""
    },
    history:[]

};

export const reducer = (state = initialState, action) => {
    const newState = {
        ...state
    };
    switch (action.type) {
        case SET_CURRENT:
            newState.current = action.node
            break;
        case POP_HISTORY:
            newState.history.pop()
            break;
        case PUSH_HISTORY:
            if ([...newState.history].pop() != action.name) newState.history.push(action.name)
            break;
    
        
    }
    return newState;
};
/** @format */

import { GO_HISTORY_PREV, GO_NEXT, GO_PREV, GO_TO, setCurrent, SET_CURRENT, popHistory, pushHistory } from "./actions";
import { next as nextNode, prev as prevNode, goTo as goToNode, getNode } from "./functions";
import { showScreen } from "../screens/actions";
import { largeRoute } from "./routs";

export const goNext = ({ dispatch, getState }) => (next) => (action) => {
    next(action);
    if (action.type == GO_NEXT) {
        let pointer = nextNode(getState().routing.current.pointer, largeRoute);
        dispatch(setCurrent(getNode(pointer, largeRoute)));
        dispatch(pushHistory(pointer));
    }
};

export const goPrev = ({ dispatch, getState }) => (next) => (action) => {
    next(action);
    if (action.type == GO_PREV) {
        let pointer = prevNode(getState().routing.current.pointer, largeRoute);
        dispatch(setCurrent(getNode(pointer, largeRoute)));
        dispatch(popHistory());
    }
};

export const goTo = ({ dispatch, getState }) => (next) => (action) => {
    next(action);
    if (action.type == GO_TO) {
        if (action.name == "login") {
            viewMode("login");
        } else {
            let pointer = goToNode(action.name, largeRoute);
            dispatch(setCurrent(getNode(pointer, largeRoute)));
            dispatch(pushHistory(action.name));
        }
        if (!action.preventHistory) {
            window.history.pushState(
                {
                    option: action.name,
                    suboption: 1,
                },
                null,
                ""
            );
        }
    }
};

export const goHistoryPrev = ({ dispatch, getState }) => (next) => (action) => {
    next(action);
    if (action.type == GO_HISTORY_PREV) {
        let history = getState().routing.history;
        if (history.length > 1) {
            let pointer = goToNode(history[history.length - 2], largeRoute);
            dispatch(setCurrent(getNode(pointer, largeRoute)));
            dispatch(popHistory());
        } else {
            let pointer = goToNode(largeRoute[0].split("-")[1], largeRoute);
            dispatch(setCurrent(getNode(pointer, largeRoute)));
            dispatch(popHistory());
        }
    }
};
export const set = ({ dispatch, getState }) => (next) => (action) => {
    next(action);
    if (action.type == SET_CURRENT) {
        dispatch(showScreen(getState().routing.current.name));
    }
};

export const middleware = [goNext, goPrev, goTo, set, goHistoryPrev];

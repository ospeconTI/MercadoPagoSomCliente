import {
    screenLayuts
} from "./screenLayouts"
export const SHOW_SCREEN = "[screen] show screen";

export const showScreen = (name) => {
    const layouts = screenLayuts[name]
    return {
        type: SHOW_SCREEN,
        name: name,
        layouts: layouts
    }
};
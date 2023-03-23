export const WebSocketNotificaciones = (dispatch, url, id, onOpen, onMessage, onError, onClose, autoConnect = true) => {
    if (!url) {
        console.log("no se especifico url para el WebSocket");
        return;
    }
    let ws = new WebSocket(url);

    ws.onopen = () => {
        if (onOpen) dispatch(onOpen(ws, id));
    };

    ws.onerror = (err) => {
        if (onError) dispatch(onError(err));
    };

    ws.onclose = (e) => {
        if (onClose) dispatch(onClose(e));
        if (autoConnect) reconect(1000);
    };

    ws.onmessage = (msg) => {
        if (onMessage) dispatch(onMessage(JSON.parse(msg.data)));
    };

    const reconect = (timeOut) => {
        setTimeout(() => {
            ws.close();
            ws = WebSocketNotificaciones(dispatch, url, id, onOpen, onMessage, onError, onClose, autoConnect);
        }, timeOut);
    };

    return ws;
};

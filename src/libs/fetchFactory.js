/** @format */

export const fetchFactory = (url, entity) => {
    url = url + "/" + entity;

    const _getHeaders = (token) => {
        return {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
    };

    return {
        get: (id, token) => {
            let newUrl = url;
            if (id) newUrl = url + "/" + id;
            return fetch(newUrl, {
                method: "GET",
                headers: _getHeaders(token),
            })
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const bodyAsJson = JSON.parse(text || "{}");
                    return bodyAsJson;
                });
        },

        post: (body, token, id) => {
            let newUrl = url;
            if (id) newUrl = url + "(" + id + ")";
            return fetch(newUrl, {
                method: "POST",
                body: JSON.stringify(body),
                headers: _getHeaders(token),
            })
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const bodyAsJson = JSON.parse(text || "{}");
                    return bodyAsJson;
                });
        },

        patch: (id, body, token) => {
            let newUrl = url + "/" + id;
            return fetch(newUrl, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: _getHeaders(token),
            })
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const bodyAsJson = JSON.parse(text || "{}");
                    return bodyAsJson;
                });
        },

        put: (id, body, token) => {
            let newUrl = url + "/" + id;
            return fetch(newUrl, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: _getHeaders(token),
            })
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const bodyAsJson = JSON.parse(text || "{}");
                    return bodyAsJson;
                });
        },

        delete: (id, token) => {
            let newUrl = url + "/" + id;
            return fetch(newUrl, {
                method: "DELETE",
                headers: _getHeaders(token),
            })
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const bodyAsJson = JSON.parse(text || "{}");
                    return bodyAsJson;
                });
        },
    };
};

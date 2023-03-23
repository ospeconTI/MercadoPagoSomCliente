const isBrother = (codeA, codeB) => {
    const elementsCodeA = codeA.split("/")
    const elementsCodeB = codeB.split("/")
    elementsCodeA.pop()
    elementsCodeB.pop()
    return elementsCodeA.join() == elementsCodeB.join()
}
const isParent = (currentCode, prevCode) => {
    return currentCode.trim().split("/").length - 1 == prevCode.trim().split("/").length
}
export const next = (pointer, route) => {
    let originalPointer = pointer
    let currentCode = route[pointer].split("-")[0]
    while (pointer < route.length - 1) {
        pointer += 1
        let nextCode = route[pointer].split("-")[0]
        if (isBrother(currentCode, nextCode)) {
            return pointer
        }
    }
    return originalPointer
}
export const prev = (pointer, route) => {
    let currentCode = route[pointer].split("-")[0]
    while (pointer > 0) {
        pointer -= 1
        let prevCode = route[pointer].split("-")[0]
        if (isBrother(currentCode, prevCode) || isParent(currentCode, prevCode)) {
            return pointer
        }
    }
    return pointer
}

export const goTo = (option, route) => {
    return route.findIndex(item => {
        return item.split("-")[1] == option
    })
}

export const getNode = (pointer, route) => {
    return {
        pointer: pointer,
        name: route[pointer].split("-")[1].trim()
    }
}
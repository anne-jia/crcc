var errorArray = [];

function format(message, element) {
    // return `${message}:[元素ID标识：${element.id}]`
    return { message, element: element.id }
}

function processError(message, element) {
    element ? errorArray.push(format(message, element)) : errorArray.push({ message })
}

function clear() {
    errorArray = []
}

function getErrors() {
    return errorArray;
}

export default {
    getErrors,
    clear
}

export {
    processError
}
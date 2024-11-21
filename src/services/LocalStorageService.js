const merge = require('deepmerge');

const APP_NAMESPACE = 'happy-grant';

/**
 * @returns Current data at the app's namespace or empty object.
 */
function getData() {
    return JSON.parse(localStorage.getItem(APP_NAMESPACE)) || {};
}

function putData(data) {
    const mergeOptions = { arrayMerge: (first, second, options) => second };
    const updated = merge(getData(), data, mergeOptions);
    localStorage.setItem(APP_NAMESPACE, JSON.stringify(updated));
}

export { getData, putData };

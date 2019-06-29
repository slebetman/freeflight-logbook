
function alarm (type) {
    return function (message, callback) {
        if (callback == undefined) {
            callback = function(){};
        }

        navigator.notification.alert(
            message,
            callback,
            type
        );
    }
}

module.exports = {
    info: alarm('Info'), 
    warning: alarm('Warning!'),
    error: alarm('Error!')
}

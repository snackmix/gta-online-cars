const format = require('string-format');
format.extend(String.prototype, null);

function modalSizeMaker(width, closeable) {
    return {
        clickToClose: closeable,
        adaptive: true,
        scrollable: true,
        width: width,
        maxWidth: window.innerWidth - 200,
        height: 'auto',
        pivotY: 0.05
    };
}

window.App = {
    Modals: {
        Options: {
            dynamic: true
        },
        LargeCloseable: modalSizeMaker('80%', true)
    }
};
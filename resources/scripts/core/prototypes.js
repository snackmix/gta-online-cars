const {uniq, sortBy} = require('lodash');

Array.prototype.uniq = function () {
    return uniq(this);
};

Array.prototype.sortBy = function () {
    return sortBy(this);
};

Array.prototype.hasAny = function (other) {
    return this.some(function (value) {
        return other.includes(value);
    });
};
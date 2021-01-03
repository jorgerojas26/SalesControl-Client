module.exports = {
    roundUpProductPrice(price) {
        var val = 0;
        if (price.toString().length == 4) {
            val = Math.ceil(price / 100) * 100;
        } else if (price.toString().length > 4) {
            val = Math.ceil(price / 1000) * 1000;
        }

        return val;
    },

    numberWithCommas(number, separator) {
        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, separator);
    },

    formatPhoneNumber(number) {
        var cleaned = number.replace(/\D/g, '');
        var match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return number;
    },
};

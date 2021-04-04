const calculateSaleTotal = (sale, frozenPrice, currentDolarReference, checkIndividualProduct) => {
    let saleTotal = 0;
    sale.saleProducts.forEach(saleProduct => {
        let productPrice = 0;
        if (checkIndividualProduct) {
            let oldProductPrice = roundUpProductPrice(saleProduct.price * sale.dolarReference);
            let actualProductPrice = roundUpProductPrice(saleProduct.product.price * currentDolarReference);
            if (oldProductPrice < actualProductPrice) {
                productPrice = actualProductPrice;
            }
            else {
                productPrice = oldProductPrice;
            }
        }
        else {
            productPrice = (frozenPrice)
                ? roundUpProductPrice(saleProduct.price * sale.dolarReference)
                : roundUpProductPrice(saleProduct.product.price * currentDolarReference);
        }
        saleTotal += productPrice * saleProduct.quantity;
    });
    return Math.round(saleTotal);
};
const calculatePaymentsTotal = (payments) => {
    let paymentTotal = 0;
    payments.forEach(pm => {
        if (pm.currency == 'USD') {
            let dolarReference = 0;
            let paymentTypeArray = pm[pm.paymentmethod.name.toLowerCase().replace(/-/g, '')];
            paymentTypeArray.forEach(type => {
                if (type.paymentId == pm.id) {
                    dolarReference = type.dolarReference;
                }
            });
            paymentTotal += pm.amount * dolarReference;
        } else {
            paymentTotal += pm.amount;
        }
    });
    return Math.round(paymentTotal);
};
const getHigherAmountPayment = (payments) => {
    let higherPayment = null;
    let higherPaymentAmount = 0;
    let dolarReference = 0;

    payments != null && payments.forEach(payment => {
        if (payment.currency == "Bs" && payment.amount > higherPaymentAmount) {
            higherPayment = payment;
            higherPaymentAmount = payment.amount;
        }
        else if (payment.currency == "USD") {
            if (payment.pointofsale.length) {
                payment.pointofsale.map(pos => {
                    dolarReference = pos.dolarReference ? pos.dolarReference : dolarReference;
                });
            }
            if (payment.banktransfer.length) {
                payment.banktransfer.map(bt => {
                    dolarReference = bt.dolarReference ? bt.dolarReference : dolarReference;
                });
            }
            if (payment.cash.length) {
                payment.cash.map(c => {
                    dolarReference = c.dolarReference ? c.dolarReference : dolarReference;
                });
            }
            if (payment.amount * dolarReference > higherPaymentAmount) {
                higherPayment = payment;
                higherPaymentAmount = payment.amount * dolarReference;
            }
        }
    });
    return {
        payment: higherPayment,
        dolarReference
    };
};
const showMessageInfo = (innerThis, type, message) => {
    if (this.timeout) clearTimeout(this.timeout);
    innerThis.setState(
        {
            messageInfo: {
                type: null,
                message: null,
            },
        },
        () => {
            innerThis.setState(
                {
                    messageInfo: {
                        type,
                        message,
                    },
                },
                () => {
                    this.timeout = setTimeout(() => {
                        innerThis.setState({
                            messageInfo: {
                                type: null,
                                message: null,
                            },
                        });
                    }, 3000);
                },
            );
        },
    );
};
function roundUpProductPrice(price) {
    var val = 0;
    if (price < 10000) {
        val = Math.ceil(price / 100) * 100;
    }
    else {
        val = Math.ceil(price / 1000) * 1000;
    }
    return val;
}

module.exports = {
    roundUpProductPrice,
    showMessageInfo,
    getHigherAmountPayment,
    calculatePaymentsTotal,
    calculateSaleTotal,
    numberWithCommas(number, separator) {
        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, separator);
    },

    sanitizeCurrencyAmount(input) {
        input = input.replace(/[\D\s\._\-]+/g, "");
        input = input ? parseFloat(input, 10) : 0;

        return input;
    },
    //This method receives an array of payments from a sale that comes directly from the DB and returns the higher payment object along with
    // the currency and the dollar reference used in the payment method to calculate the higher payment amount in case of a USD currency payment.
    isProductStockEnough: async (innerThis, id, quantity) => {
        let inventoryRequests = require("./requests/inventory");
        let productInfo = await inventoryRequests.default.fetchByProductId(id);
        console.log(productInfo);
        if (productInfo.data) {
            let stock = parseFloat(productInfo.data[0].inventario);
            if (stock <= 0 || quantity > stock) {
                showMessageInfo(innerThis, 'error', 'No hay suficientes productos en el inventario');
            } else {
                return true;
            }
        }
        return false;
    },
    // This method receives an array of payments that comes directly from the invoice state
    getHigherAmountClientPayment(payments) {
        let higherPaymentAmount = 0;
        let higherPayment = null;
        payments.forEach(payment => {
            if (payment.currency === "USD") {
                let amount = payment.amount * payment.paymentDetails.dolarReference;
                if (amount > higherPaymentAmount) {
                    higherPaymentAmount = amount;
                    higherPayment = payment;
                }
            }
            else if (payment.currency === "Bs") {
                if (payment.amount > higherPaymentAmount) {
                    higherPayment = payment;
                    higherPaymentAmount = payment.amount;
                }
            }
        });

        return higherPayment;
    },
    calculateDebtTotal(sale, currentDolarReference, historyView) {
        let invoiceTotalBs = calculateSaleTotal(sale, true);
        let expressedPaymentTotal = calculatePaymentsTotal(sale.payment);
        let debtTotal = 0;
        let debtCurrency = "";
        let higherPayment = getHigherAmountPayment(sale.payment);

        if ((invoiceTotalBs - expressedPaymentTotal) < 0) { // business owes money
            debtTotal = higherPayment.payment.currency === "Bs"
                ? invoiceTotalBs - expressedPaymentTotal
                : ((invoiceTotalBs - expressedPaymentTotal) / higherPayment.dolarReference);
            debtCurrency = higherPayment.payment.currency;

        }
        else if ((invoiceTotalBs - expressedPaymentTotal) > 0) { // client owes money
            if (!historyView) {
                invoiceTotalBs = calculateSaleTotal(sale, true, currentDolarReference, true);
            }
            if (higherPayment.payment) {
                debtTotal = invoiceTotalBs - expressedPaymentTotal;
                debtCurrency = "Bs";
            }
            else {
                debtTotal = invoiceTotalBs;
                debtCurrency = "Bs";
            }
        }
        return { debtTotal, debtCurrency, dolarReference: higherPayment.dolarReference };
    },

    formatPhoneNumber(number) {
        if (!number) return "";
        var cleaned = number.replace(/\D/g, '');
        var match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return number;
    },

    parsePaymentMethodName(name) {
        if (name.toLowerCase().includes("bank transfer")) {
            return "Transferencia Bancaria";
        }
        else if (name.toLowerCase().includes("cash")) {
            return "Efectivo";
        }
        else if (name.toLowerCase().includes("point of sale")) {
            return "Punto de Venta";
        }
    }
};

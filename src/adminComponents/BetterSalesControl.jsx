import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import { roundUpProductPrice, numberWithCommas, formatPhoneNumber } from '../helpers';
import inventoryRequests from '../requests/inventory';
import clientsRequests from '../requests/clients';
import salesRequests from '../requests/sales';
import paymentMethodsRequests from '../requests/paymentMethods';
import banksRequests from '../requests/banks';
import paymentRequests from '../requests/payments';

class BetterSalesControl extends Component {
    constructor() {
        super();
        this.state = {
            messageInfo: {
                type: null,
                message: null,
            },
            productsToSell: [],
            currentSelectedProduct: null,
            currentSelectedClient: {
                name: null,
                cedula: null,
                phoneNumber: null,
                sales: [],
            },
            totalDebt: 0,
            quantity: 1,
            paymentMethods: [],
            paymentInfo: {},
            bankList: [],
            totalDollars: 0,
            totalBs: 0,
            submittingSale: false,
        };

        this.productsTableDiv = React.createRef();
        this.productsTable = React.createRef();
        this.productSelect = React.createRef();
        this.clientSelect = React.createRef();
        this.saleSubmitButton = React.createRef();
        this.quantityInput = React.createRef();
        this.paymentMethodContainer = React.createRef();
        this.addPaymentMethodContainer = React.createRef();
        this.invoiceModal = React.createRef();
        this.openInvoiceModalButton = React.createRef();
        this.payDebtButton = React.createRef();

        this.productSelectionHandler = this.productSelectionHandler.bind(this);
        this.searchProductsHandler = this.searchProductsHandler.bind(this);
        this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
        this.addProductToTableHandler = this.addProductToTableHandler.bind(this);
        this.editProductQuantityHandler = this.editProductQuantityHandler.bind(this);
        this.deleteFromTable = this.deleteFromTable.bind(this);
        this.submitSaleHandler = this.submitSaleHandler.bind(this);
        this.showMessageInfo = this.showMessageInfo.bind(this);
        this.clientSelectionHandler = this.clientSelectionHandler.bind(this);
        this.addPaymentMethod = this.addPaymentMethod.bind(this);
        this.onChangeTicketIdHandler = this.onChangeTicketIdHandler.bind(this);
        this.onChangeDolarReferenceHandler = this.onChangeDolarReferenceHandler.bind(this);
        this.onChangeReferenceCodeHandler = this.onChangeReferenceCodeHandler.bind(this);
        this.onChangeBankHandler = this.onChangeBankHandler.bind(this);
        this.showInvoiceModal = this.showInvoiceModal.bind(this);
        this.changeCashCurrencyHandler = this.changeCashCurrencyHandler.bind(this);
        this.addDebtToInvoiceTotal = this.addDebtToInvoiceTotal.bind(this);
        this.removeDebtFromInvoiceTotal = this.removeDebtFromInvoiceTotal.bind(this);
        this.getAvailablePaymentMethods = this.getAvailablePaymentMethods.bind(this);
    }

    componentDidMount() {
        document.body.addEventListener('keyup', event => {
            if (event.keyCode == 13 && event.ctrlKey) {
                if (this.openInvoiceModalButton.current) {
                    this.openInvoiceModalButton.current.click();
                }
            }
        });

        document.querySelector('#invoiceModal').addEventListener('keyup', event => {
            if (event.keyCode == 13 && event.ctrlKey) {
                this.saleSubmitButton.current.click();
            }
        });

        window.$('#invoiceModal').on('shown.bs.modal', () => {
            this.clientSelect.current.focus();
            if (Object.keys(this.state.paymentInfo).length == 0) {
                this.getAvailablePaymentMethods().then(paymentMethods => {
                    paymentMethods.forEach(pm => {
                        if (pm.name.toLowerCase().includes('point of sale')) {
                            this.addPaymentMethod({
                                id: pm.id,
                                name: pm.name.toLowerCase(),
                                amount: this.state.totalBs,
                                currency: 'Bs',
                                ticketId: null,
                            });
                        }
                    });
                });
            }
        });

        window.$('#invoiceModal').on('hide.bs.modal', () => {
            //this.setState({
            //currentSelectedClient: {
            //name: null,
            //cedula: null,
            //phoneNumber: null,
            //sales: [],
            //},
            //});
        });

        window.$('#paymentMethodsModal').on('show.bs.modal', () => {
            window.$('#paymentMethodsModal').find('.modal-body').html('');
            paymentMethodsRequests.fetchAll().then(response => {
                if (response.data) {
                    this.setState(
                        {
                            paymentMethods: response.data,
                        },
                        () => {
                            response.data.map(paymentMethod => {
                                let paymentMethodButton = document.createElement('button');
                                paymentMethodButton.className = 'btn btn-secondary ml-3';
                                paymentMethodButton.setAttribute('data-paymentMethodName', paymentMethod.name);
                                paymentMethodButton.setAttribute('data-paymentMethodId', paymentMethod.id);
                                paymentMethodButton.setAttribute('data-dismiss', 'modal');
                                paymentMethodButton.innerText = paymentMethod.name;
                                paymentMethodButton.addEventListener('click', async event => {
                                    let paymentMethodName = event.target.getAttribute('data-paymentMethodName');
                                    let paymentMethodId = event.target.getAttribute('data-paymentMethodId');
                                    let coincidences = 1;
                                    let paymentMethodNamePattern;

                                    switch (paymentMethodName) {
                                        case 'Bank Transfer':
                                            let bankList = await this.loadBanks();
                                            if (bankList.data) {
                                                this.setState(
                                                    {
                                                        bankList: bankList.data,
                                                    },
                                                    () => {
                                                        for (let paymentMethod of Object.keys(this.state.paymentInfo)) {
                                                            if (paymentMethod.toLowerCase().startsWith('bank transfer')) {
                                                                coincidences++;
                                                            }
                                                        }
                                                        paymentMethodNamePattern = `${paymentMethodName.toLowerCase()} ${coincidences}`;

                                                        if (this.state.paymentInfo[paymentMethodNamePattern] != null) {
                                                            paymentMethodNamePattern = `${paymentMethodName.toLowerCase()} ${coincidences + 1}`;
                                                        }

                                                        this.addPaymentMethod({
                                                            id: paymentMethodId,
                                                            name: paymentMethodNamePattern,
                                                            amount: 0,
                                                            currency: 'Bs',
                                                            referenceCode: null,
                                                            bankId: 1,
                                                        });
                                                    },
                                                );
                                            }
                                            break;
                                        case 'Cash':
                                            for (let paymentMethod of Object.keys(this.state.paymentInfo)) {
                                                if (paymentMethod.toLowerCase().startsWith('cash')) {
                                                    coincidences++;
                                                }
                                            }
                                            paymentMethodNamePattern = `${paymentMethodName.toLowerCase()} ${coincidences}`;
                                            if (this.state.paymentInfo[paymentMethodNamePattern] != null) {
                                                paymentMethodNamePattern = `${paymentMethodName.toLowerCase()} ${coincidences + 1}`;
                                            }
                                            this.addPaymentMethod({
                                                id: paymentMethodId,
                                                name: paymentMethodNamePattern,
                                                amount: 0,
                                                currency: 'Bs',
                                            });
                                            break;
                                        case 'Point Of Sale':
                                            for (let paymentMethod of Object.keys(this.state.paymentInfo)) {
                                                if (paymentMethod.toLowerCase().startsWith('point of sale')) {
                                                    coincidences++;
                                                }
                                            }
                                            paymentMethodNamePattern = `${paymentMethodName.toLowerCase()} ${coincidences}`;
                                            if (this.state.paymentInfo[paymentMethodNamePattern] != null) {
                                                paymentMethodNamePattern = `${paymentMethodName.toLowerCase()} ${coincidences + 1}`;
                                            }
                                            this.addPaymentMethod({
                                                id: paymentMethodId,
                                                name: paymentMethodNamePattern,
                                                amount: 0,
                                                currency: 'Bs',
                                                ticketId: null,
                                            });
                                            break;
                                    }
                                });

                                window.$('#paymentMethodsModal').find('.modal-body').append(paymentMethodButton);
                            });
                        },
                    );
                } else {
                    alert('Cannot load payment methods info');
                }
            });
        });
    }

    loadPaymentMethods() {
        paymentMethodsRequests.fetchAll().then(paymentMethods => {
            if (paymentMethods.data) {
                this.setState({
                    paymentMethods: paymentMethods.data,
                });
            } else {
                alert('Cannot fetch payment methods from database');
            }
        });
    }

    async searchProductsHandler(inputValue) {
        let results = await inventoryRequests.fetchByProductName(inputValue);
        if (results.data.length > 0) {
            results.data.forEach(product => {
                //product.value = product;
                product.label = (
                    <div className="row">
                        <div className="mx-auto">
                            <img className="my-auto" style={{ maxWidth: '40px' }} src={product.imagePath} />
                            <span className="my-auto">{product.name}</span>
                        </div>
                        <span className="my-auto mr-5">
                            {Intl.NumberFormat('es-VE', {
                                currency: 'VES',
                            }).format(roundUpProductPrice(product.price * this.props.dolarReference))}
                        </span>
                    </div>
                );
                if (product.stock == 0) product.isDisabled = true;
            });
        }
        return results.data;
    }

    async searchClientsHandler(name) {
        let results = await clientsRequests.fetchByNameWithDebts(name);
        if (results.data.length > 0) {
            results.data.forEach(client => {
                client.label = (
                    <div className="row mx-auto">
                        <span className="mx-auto">
                            <span className="">{client.name}</span>
                        </span>
                        <span className="mr-5">{numberWithCommas(client.cedula, '.')}</span>
                    </div>
                );
            });
        }
        return results.data;
    }

    productSelectionHandler(selectedProduct, actionType) {
        if (actionType.action == 'select-option') {
            this.quantityInput.current.select();
        }
        this.setState({
            currentSelectedProduct: selectedProduct,
        });
    }

    clientSelectionHandler(selectedClient, actionType) {
        if (actionType.action == 'select-option') {
            selectedClient.label = selectedClient.name;
            selectedClient.phoneNumber = formatPhoneNumber(selectedClient.phoneNumber);
            let invoiceTotal = 0,
                paymentTotal = 0;

            selectedClient.sales.forEach(sale => {
                sale.saleProducts.forEach(product => {
                    invoiceTotal += roundUpProductPrice(product.price * product.dolarReference);
                });

                sale.payment.forEach(payment => {
                    paymentTotal += payment.amount;
                });
            });

            this.paymentMethodContainer.current.querySelector('.codeNumber').focus();

            console.log(selectedClient);
            this.setState({
                currentSelectedClient: selectedClient,
            });
        } else if (actionType.action == 'clear') {
            this.setState({
                currentSelectedClient: {
                    name: null,
                    cedula: null,
                    phoneNumber: null,
                    sales: [],
                },
            });
        }
    }

    onFocusHandler(event) {
        event.target.select();
    }

    async onInputChangeHandler(event) {
        if (event.target.name == 'quantity') {
            this.setState({
                quantity: Number(event.target.value),
            });
        } else if (event.target.id == 'productQuantity') {
            let productId = event.target.parentElement.parentElement.getAttribute('productId');
            let quantity = Number(event.target.value);

            if (await this.isProductStockEnough(productId, quantity)) {
                let productsToSell = this.state.productsToSell;
                productsToSell.map(product => {
                    if (product.id == productId) {
                        product = this.updateProductTotal(product, quantity);
                    }
                });
                this.setState({
                    productsToSell,
                });
            } else {
                event.preventDefault();
            }
        } else {
            this.setState({
                [event.target.name]: event.target.value,
            });
        }
    }

    async isProductStockEnough(id, quantity) {
        let productInfo = await inventoryRequests.fetchByProductId(id);
        if (productInfo.data) {
            let stock = Number(productInfo.data[0].stock);
            if (stock <= 0 || quantity > stock) {
                this.showMessageInfo('error', 'No hay suficientes productos en el inventario');
            } else {
                return true;
            }
        }
        return false;
    }

    async addProductToTableHandler(event) {
        event.preventDefault();
        if (this.state.currentSelectedProduct != null) {
            let productInfo = await inventoryRequests.fetchByProductId(this.state.currentSelectedProduct.id);
            if (productInfo.data) {
                let stock = parseInt(productInfo.data[0].stock);
                let quantityToSell = parseInt(this.state.quantity);
                if (stock <= 0 || quantityToSell > stock) {
                    this.showMessageInfo('error', 'No hay suficientes productos en el inventario');
                } else {
                    let productsToSell = this.state.productsToSell;

                    let alreadyInTable = false;

                    productsToSell.forEach(productToSell => {
                        if (this.state.currentSelectedProduct.id == productToSell.id) {
                            alreadyInTable = true;
                        }
                    });

                    if (!alreadyInTable) {
                        let newProduct = {
                            id: this.state.currentSelectedProduct.id,
                            imagePath: this.state.currentSelectedProduct.imagePath,
                            name: this.state.currentSelectedProduct.name,
                            unitPriceDollars: this.state.currentSelectedProduct.price,
                            quantity: this.state.quantity,
                            discount: this.state.currentSelectedProduct.discount && this.state.currentSelectedProduct.discount.length ? this.state.currentSelectedProduct.discount[0].percent : null,
                        };

                        if (newProduct.discount != null) {
                            newProduct.unitPriceDollars = newProduct.unitPriceDollars - newProduct.unitPriceDollars * (newProduct.discount / 100);
                        }
                        newProduct.unitPriceBs = roundUpProductPrice(newProduct.unitPriceDollars * this.props.dolarReference);
                        newProduct.totalBs = newProduct.unitPriceBs * newProduct.quantity;
                        newProduct.totalDollars = newProduct.unitPriceDollars * newProduct.quantity;

                        productsToSell.push(newProduct);
                        this.setState({
                            productsToSell,
                            quantity: 1,
                            currentSelectedProduct: null,
                        });
                    } else {
                        productsToSell.map(product => {
                            if (product.id == this.state.currentSelectedProduct.id) {
                                product = this.updateProductTotal(product, this.state.quantity);
                            }
                        });
                        this.setState({
                            productsToSell,
                            quantity: 1,
                            currentSelectedProduct: null,
                        });
                    }
                    this.productSelect.current.select.state.value = [];
                    this.quantityInput.current.value = 1;
                    this.productSelect.current.focus();
                    this.updateSaleTotal();
                }
            }
        } else {
            this.showMessageInfo('error', 'Por favor seleccione un producto');
        }
    }

    updateProductTotal(product, quantity) {
        if (product != null && quantity != null) {
            product.quantity = quantity;
            product.totalBs = product.unitPriceBs * product.quantity;
            product.totalDollars = product.unitPriceDollars * product.quantity;
        }
        return product;
    }

    updateSaleTotal() {
        let totalBs = 0;
        let totalDollars = 0;
        this.state.productsToSell.forEach(product => {
            totalBs += product.totalBs;
            totalDollars += product.totalDollars;
        });
        this.setState({
            totalBs,
            totalDollars,
        });
    }

    async editProductQuantityHandler(event) {
        let quantity = window.prompt('Ingrese la cantidad: ');
        if (quantity != null && quantity != '') {
            let productId = event.target.parentElement.getAttribute('productId');
            if (await this.isProductStockEnough(productId, quantity)) {
                let productsToSell = this.state.productsToSell;
                productsToSell.forEach(product => {
                    if (product.id == productId) {
                        product = this.updateProductTotal(product, quantity);
                        this.setState(
                            {
                                productsToSell,
                            },
                            () => {
                                this.updateSaleTotal();
                            },
                        );
                    }
                });
            }
        }
        this.productSelect.current.focus();
    }

    deleteFromTable(event) {
        let productId = event.target.parentElement.parentElement.getAttribute('productid');
        let productsToSell = this.state.productsToSell.filter(product => {
            return product.id != productId;
        });
        this.setState(
            {
                productsToSell,
            },
            () => this.updateSaleTotal(),
        );
    }

    submitSaleHandler() {
        if (this.state.productsToSell.length <= 0) {
            this.showMessageInfo('error', 'Por favor seleccione un producto');
            return;
        }
        if (this.state.currentSelectedClient.name == null || this.state.currentSelectedClient.cedula == null || this.state.currentSelectedClient.phoneNumber == null) {
            this.showMessageInfo('error', 'Por favor seleccione un cliente');
            return;
        }
        if (Object.keys(this.state.paymentInfo).length == 0) {
            this.showMessageInfo('error', 'Por favor seleccione un método de pago');
            return;
        }

        let paymentInfo = this.state.paymentInfo;
        let paymentTotal = 0;
        let payments = [];
        for (let paymentMethod of Object.keys(paymentInfo)) {
            let paymentMethodInfo = paymentInfo[paymentMethod];
            if (isNaN(paymentMethodInfo.amount)) {
                this.showMessageInfo('error', `El monto del método de pago ${paymentMethod.toUpperCase()} debe ser de un valor numérico`);
                return;
            }
            //if (paymentMethodInfo.amount == 0) {
            //this.showMessageInfo('error', 'No puede haber un método de pago con valor 0');
            //return;
            //}

            if (paymentMethod.startsWith('point of sale') && (paymentMethodInfo.ticketId == null || paymentMethodInfo.ticketId == '')) {
                this.showMessageInfo('error', 'Número de ticket no puede estar vacío');
                return;
            }
            if (paymentMethod.startsWith('cash') && paymentMethodInfo.currency == 'USD' && (paymentMethodInfo.dolarReference == null || paymentMethodInfo.dolarReference == '')) {
                this.showMessageInfo('error', 'El valor del dolar no puede estar vacío');
                return;
            }
            if (paymentMethod.startsWith('bank transfer') && (paymentMethodInfo.referenceCode == null || paymentMethodInfo.referenceCode == '')) {
                this.showMessageInfo('error', 'El código de referencia de la transferencia no puede estar vacío');
                return;
            }
            if (paymentMethod.startsWith('bank transfer') && (paymentMethodInfo.bankId == null || paymentMethodInfo.bankId == '')) {
                this.showMessageInfo('error', 'El banco receptor no puede estar vacío');
                return;
            }
            if (paymentMethod.startsWith('cash') && paymentMethodInfo.currency == 'USD') {
                paymentTotal += paymentMethodInfo.amount * paymentMethodInfo.dolarReference;
            } else {
                paymentTotal += paymentMethodInfo.amount;
            }
            if (paymentMethod.startsWith('point of sale')) {
                payments.push({
                    paymentMethodId: paymentMethodInfo.id,
                    amount: paymentMethodInfo.amount,
                    currency: paymentMethodInfo.currency,
                    paymentDetails: {
                        ticketId: paymentMethodInfo.ticketId,
                    },
                });
            } else if (paymentMethod.startsWith('cash')) {
                if (paymentMethodInfo.currency == 'USD') {
                    payments.push({
                        paymentMethodId: paymentMethodInfo.id,
                        amount: paymentMethodInfo.amount,
                        currency: paymentMethodInfo.currency,
                        paymentDetails: {
                            dolarReference: paymentMethodInfo.dolarReference,
                        },
                    });
                } else if (paymentMethodInfo.currency == 'Bs') {
                    payments.push({
                        paymentMethodId: paymentMethodInfo.id,
                        amount: paymentMethodInfo.amount,
                        currency: paymentMethodInfo.currency,
                        paymentDetails: {},
                    });
                }
            } else if (paymentMethod.startsWith('bank transfer')) {
                payments.push({
                    paymentMethodId: paymentMethodInfo.id,
                    amount: paymentMethodInfo.amount,
                    currency: paymentMethodInfo.currency,
                    paymentDetails: {
                        referenceCode: paymentMethodInfo.referenceCode,
                        bankId: paymentMethodInfo.bankId,
                    },
                });
            }
        }

        let invoiceTotal = this.state.totalBs + this.state.totalDebt;
        let isPaid = 1;

        if (paymentTotal > invoiceTotal) {
            this.showMessageInfo('error', 'El monto a pagar es mayor al monto de la venta');
            return;
        }
        if (paymentTotal < this.state.totalDebt) {
            this.showMessageInfo('error', 'El monto a pagar no cubre la deuda');
            return;
        }
        if (paymentTotal < invoiceTotal) {
            let confirm = window.confirm('El pago expresado es menor al monto total de la factura, la venta se registrará como DEUDA. ¿Desea continuar?');
            if (!confirm) {
                return;
            } else {
                isPaid = 0;
            }
        }

        if (!this.state.submittingSale) {
            this.setState(
                {
                    submittingSale: true,
                },
                async () => {
                    let productsToSell = this.state.productsToSell;
                    productsToSell.forEach(product => {
                        product.dolarReference = this.props.dolarReference;
                        product.price = product.unitPriceDollars;
                        product.discount = product.discount || 0;
                    });
                    //console.log({
                    //clientId: this.state.currentSelectedClient.id,
                    //products: productsToSell,
                    //payments,
                    //isPaid,
                    //});
                    //return;
                    if (this.state.totalDebt > 0) {
                        for (let debt of this.state.currentSelectedClient.sales) {
                            let invoiceAmount = 0;
                            let debtPaidAmount = 0;
                            let debtTotal = 0;
                            debt.saleProducts.forEach(saleProduct => {
                                invoiceAmount += roundUpProductPrice(saleProduct.product.price * this.props.dolarReference);
                            });

                            debt.payment.forEach(pm => {
                                if (pm.currency == 'USD') {
                                    debtPaidAmount += pm.amount * pm.dolarReference;
                                } else {
                                    debtPaidAmount += pm.amount;
                                }
                            });

                            debtTotal = invoiceAmount - debtPaidAmount;

                            let higherPayment = {};
                            let higherPaymentAmount = 0;
                            payments.forEach((payment, index) => {
                                if ((payment.currency == 'Bs' && payment.amount > higherPaymentAmount) || (payment.currency == 'USD' && payment.amount * payment.dolarReference > higherPaymentAmount)) {
                                    higherPaymentAmount = payment.currency == 'Bs' ? payment.amount : payment.currency == 'USD' ? payment.amount * payment.dolarReference : 0;
                                    higherPayment = payment;
                                }
                            });

                            if (higherPaymentAmount >= debtTotal) {
                                let response = await paymentRequests.create({
                                    ...higherPayment,
                                    saleId: debt.id,
                                    amount: debtTotal,
                                });
                                if (response.error) {
                                    this.showMessageInfo('error', response.error.toString());
                                    return;
                                } else {
                                    higherPayment.amount -= debtTotal;
                                }
                            } else {
                                console.log(this.state.currentSelectedClient);
                                console.log(higherPaymentAmount, debtTotal);
                                return;
                            }
                        }
                    }
                    let response = await salesRequests.create({
                        clientId: this.state.currentSelectedClient.id,
                        products: productsToSell,
                        payments,
                        isPaid,
                    });
                    if (response.error) {
                        this.showMessageInfo('error', response.error.toString());
                        this.setState({
                            submittingSale: false,
                        });
                    } else {
                        this.showMessageInfo('success', 'La venta se ha realizado con éxito');
                        this.setState({
                            productsToSell: [],
                            currentSelectedProduct: null,
                            currentSelectedClient: {
                                name: null,
                                cedula: null,
                                phoneNumber: null,
                                sales: [],
                            },
                            quantity: 1,
                            totalDollars: 0,
                            totalBs: 0,
                            paymentInfo: {},
                            totalDebt: 0,
                            submittingSale: false,
                        });
                        this.clientSelect.current.select.state.value = [];
                        this.productSelect.current.select.state.value = [];
                        this.quantityInput.current.value = 1;
                        window.$(this.invoiceModal.current).modal('hide');
                        this.productSelect.current.focus();
                    }
                },
            );
        } else {
            this.showMessageInfo('error', 'Por favor espere, una venta ya está en proceso');
        }
    }

    addPaymentMethod(paymentInfo) {
        let currentPaymentInfo = this.state.paymentInfo;
        let paymentDetails = {};
        if (paymentInfo.name.startsWith('bank transfer')) {
            paymentDetails = {
                id: paymentInfo.id,
                amount: paymentInfo.amount,
                currency: paymentInfo.currency,
                referenceCode: paymentInfo.referenceCode,
                bankId: paymentInfo.bankId,
            };
        } else if (paymentInfo.name.startsWith('cash')) {
            paymentDetails = {
                id: paymentInfo.id,
                amount: paymentInfo.amount,
                currency: paymentInfo.currency,
            };
        } else if (paymentInfo.name.startsWith('point of sale')) {
            paymentDetails = {
                id: paymentInfo.id,
                amount: paymentInfo.amount,
                currency: paymentInfo.currency,
                ticketId: paymentInfo.ticketId,
            };
        }
        currentPaymentInfo[paymentInfo.name] = paymentDetails;
        this.setState(
            {
                paymentInfo: currentPaymentInfo,
            },
            () => {
                console.log(this.state.paymentInfo);
            },
        );
    }

    removePaymentMethod(name) {
        let paymentInfo = this.state.paymentInfo;
        delete paymentInfo[name];
        this.setState({
            paymentInfo,
        });
    }

    updatePaymentMethodAmount(paymentName, event) {
        let paymentInfo = this.state.paymentInfo;
        paymentInfo[paymentName].amount = parseInt(event.target.value.replace(/\D/g, ''), 10);

        this.setState({
            paymentInfo,
        });
        if (event.target.value.length > 0) {
            var amount = parseInt(event.target.value.replace(/\D/g, ''), 10);
            event.target.value = amount.toLocaleString();
        }
    }

    async loadBanks() {
        return await banksRequests.fetchAll();
    }

    changeCashCurrencyHandler(event, paymentMethodName) {
        let currency = event.target.value;

        if (currency == '$') {
            let paymentInfo = this.state.paymentInfo;
            paymentInfo[paymentMethodName].currency = 'USD';
            this.setState({
                paymentInfo,
            });
            document.querySelector(`#${paymentMethodName.replace(/\s/g, '') + 'DolarReferenceContainer'}`).classList.remove('d-none');
            document.querySelector(`#${paymentMethodName.replace(/\s/g, '') + 'Container'}`).classList.remove('col-9');
            document.querySelector(`#${paymentMethodName.replace(/\s/g, '') + 'Container'}`).classList.add('col-7', 'pr-0');
        } else if (currency == 'Bs.') {
            let paymentInfo = this.state.paymentInfo;
            paymentInfo[paymentMethodName].currency = 'Bs';
            this.setState({
                paymentInfo,
            });
            document.querySelector(`#${paymentMethodName.replace(/\s/g, '') + 'DolarReferenceContainer'}`).classList.add('d-none');
            document.querySelector(`#${paymentMethodName.replace(/\s/g, '') + 'Container'}`).classList.remove('col-7', 'pr-0');
            document.querySelector(`#${paymentMethodName.replace(/\s/g, '') + 'Container'}`).classList.add('col-9');
        }
    }

    onChangeTicketIdHandler(event, paymentMethodName) {
        let paymentInfo = this.state.paymentInfo;

        paymentInfo[paymentMethodName].ticketId = event.target.value;

        this.setState({
            paymentInfo,
        });
    }
    onChangeDolarReferenceHandler(event, paymentMethodName) {
        let paymentInfo = this.state.paymentInfo;

        paymentInfo[paymentMethodName].dolarReference = parseInt(event.target.value.replace(/\D/g, ''), 10);

        this.setState({
            paymentInfo,
        });
        var amount = parseInt(event.target.value.replace(/\D/g, ''), 10);
        event.target.value = amount.toLocaleString();
    }
    onChangeReferenceCodeHandler(event, paymentMethodName) {
        let paymentInfo = this.state.paymentInfo;

        paymentInfo[paymentMethodName].referenceCode = event.target.value;

        this.setState({
            paymentInfo,
        });
    }
    onChangeBankHandler(event, paymentMethodName) {
        let paymentInfo = this.state.paymentInfo;

        paymentInfo[paymentMethodName].bankId = event.target.value;

        this.setState({
            paymentInfo,
        });
    }

    calculatePaymentTotal() {
        let paymentInfo = this.state.paymentInfo;
        let paymentTotal = 0;
        for (let paymentMethod of Object.keys(paymentInfo)) {
            let paymentMethodInfo = paymentInfo[paymentMethod];
            if (paymentMethod.startsWith('cash') && paymentMethodInfo.currency == 'USD') {
                paymentTotal += paymentMethodInfo.amount * paymentMethodInfo.dolarReference;
            } else {
                paymentTotal += paymentMethodInfo.amount;
            }
        }

        return paymentTotal;
    }

    calculateClientDebt() {
        let client = this.state.currentSelectedClient;
        let invoiceTotal = 0,
            paymentTotal = 0;
        client.sales.map(sale => {
            sale.saleProducts.forEach(saleProduct => {
                invoiceTotal += roundUpProductPrice(saleProduct.product.price * this.props.dolarReference);
            });

            sale.payment.forEach(payment => {
                paymentTotal += payment.amount;
            });
        });

        return invoiceTotal - paymentTotal;
    }

    addDebtToInvoiceTotal() {
        let debt = this.calculateClientDebt();

        this.setState({
            totalDebt: debt,
        });

        if (this.payDebtButton.current) {
            this.payDebtButton.current.style.display = 'none';
        }
    }

    removeDebtFromInvoiceTotal() {
        this.setState({
            totalDebt: 0,
        });

        if (this.payDebtButton.current) {
            this.payDebtButton.current.style.display = 'block';
        }
    }

    async getAvailablePaymentMethods() {
        return new Promise((resolve, reject) => {
            if (this.state.paymentMethods.length == 0) {
                paymentMethodsRequests.fetchAll().then(response => {
                    if (response.error) {
                        reject({ error: response.error });
                    } else {
                        this.setState(
                            {
                                paymentMethods: response.data,
                            },
                            () => {
                                resolve(response.data);
                            },
                        );
                    }
                });
            } else {
                resolve(this.state.paymentMethods);
            }
        });
    }
    showMessageInfo(type, message) {
        if (this.timeout) clearTimeout(this.timeout);
        this.setState(
            {
                messageInfo: {
                    type: null,
                    message: null,
                },
            },
            () => {
                this.setState(
                    {
                        messageInfo: {
                            type,
                            message,
                        },
                    },
                    () => {
                        this.timeout = setTimeout(() => {
                            this.setState({
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
    }

    showInvoiceModal() {
        if (this.state.productsToSell.length > 0) {
            window.$('#invoiceModal').modal();
        } else {
            this.showMessageInfo('error', 'Por favor seleccione un producto');
        }
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <h1 className="text-danger">Control de Ventas</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-7 mt-2">
                        <label className="font-weight-bold">Productos</label>
                    </div>
                    <div className="col-12 col-lg-3 mt-2">
                        <label className="font-weight-bold">Cantidad</label>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <form onSubmit={this.addProductToTableHandler}>
                            <div className="row">
                                <div className="col-12 col-lg-7 mt-2">
                                    <AsyncSelect
                                        loadOptions={this.searchProductsHandler}
                                        ref={this.productSelect}
                                        placeholder="Buscar producto"
                                        autoFocus
                                        isClearable
                                        inputId="selectedProduct"
                                        onChange={this.productSelectionHandler}
                                        styles={{
                                            option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
                                                ...styles,
                                                color: data.stock > 0 && data.stock <= 10 ? 'orange' : data.stock > 0 ? 'green' : 'red',
                                                cursor: data.stock == 0 ? 'not-allowed' : 'pointer',
                                            }),
                                            singleValue: (styles, { data }) => ({
                                                ...styles,
                                                width: '100%',
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-lg-3 mt-2">
                                    <input onFocus={this.onFocusHandler} ref={this.quantityInput} onChange={this.onInputChangeHandler} type="number" className="form-control" placeholder="Cantidad" id="quantity" name="quantity" defaultValue="1" />
                                </div>
                                <div className="col-12 col-lg-2 mt-2">
                                    <input type="submit" className="form-control btn btn-info" value="Enviar" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row mb-2 mt-0">
                    <div className="col">
                        <span className={this.state.messageInfo.type == 'error' ? 'text-danger' : 'text-success'}>{this.state.messageInfo.message}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-2">
                        <div className="form-group">
                            <input ref={this.openInvoiceModalButton} onClick={this.showInvoiceModal} type="button" className="form-control btn btn-primary" value="Procesar venta" />
                        </div>
                    </div>
                    <div className="col-12 col-lg-10">
                        <div ref={this.productsTableDiv} className="table-responsive">
                            <table ref={this.productsTable} className="table table-dark table-striped table-bordered overflow-auto">
                                <thead>
                                    <tr>
                                        <th className="my-auto" scope="col">
                                            Product ID
                                        </th>
                                        <th className="my-auto" scope="col">
                                            Nombre
                                        </th>
                                        <th className="my-auto" scope="col">
                                            Precio Bs
                                        </th>
                                        <th className="my-auto" scope="col">
                                            Cantidad
                                        </th>
                                        <th className="my-auto" scope="col">
                                            Total <span className="font-weight-bold text-warning"> {' ' + Intl.NumberFormat('es-VE', { currency: 'VES' }).format(this.state.totalBs)} </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.productsToSell &&
                                        this.state.productsToSell.map((product, index) => {
                                            return (
                                                <tr key={index} productid={product.id}>
                                                    <th>{product.id}</th>
                                                    <th>
                                                        <img style={{ maxWidth: '40px' }} src={product.imagePath} /> {product.name}
                                                    </th>
                                                    <th>{Intl.NumberFormat('es-VE', { currency: 'VES' }).format(product.unitPriceBs)}</th>
                                                    <th onClick={this.editProductQuantityHandler} className="bg-dark" data-toggle="tooltip" data-placement="bottom" title="Editar Cantidad" role="button">
                                                        {product.quantity}
                                                    </th>
                                                    <th>{Intl.NumberFormat('es-VE', { currency: 'VES' }).format(product.totalBs)}</th>
                                                    <th>
                                                        <button onClick={this.deleteFromTable} className="btn btn-danger p-0">
                                                            Delete
                                                        </button>
                                                    </th>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div ref={this.invoiceModal} className="modal " id="invoiceModal" tabIndex="-1" aria-labelledby="invoiceModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered  modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="invoiceModalLabel">
                                    Datos de la factura
                                </h5>
                            </div>
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col">
                                        <div className="d-flex justify-content-between mb-3">
                                            <AsyncSelect
                                                loadOptions={this.searchClientsHandler}
                                                ref={this.clientSelect}
                                                className="w-100"
                                                placeholder="Buscar cliente"
                                                isClearable
                                                inputId="clientSelect"
                                                onChange={this.clientSelectionHandler}
                                                styles={{
                                                    singleValue: (styles, { data }) => ({
                                                        ...styles,
                                                        width: '100%',
                                                    }),
                                                }}
                                            />
                                            <button className="btn btn-secondary" type="button" id="newClientButton">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 pr-0">
                                        <input className="form-control" type="text" name="cedula" id="cedula" placeholder="Cédula" value={this.state.currentSelectedClient.cedula ? numberWithCommas(this.state.currentSelectedClient.cedula, '.') : ''} disabled />
                                    </div>
                                    <div className="col-6 pl-0">
                                        <input className="form-control" type="tel" name="phone" id="phone" placeholder="Teléfono" value={this.state.currentSelectedClient.phoneNumber ? this.state.currentSelectedClient.phoneNumber : ''} disabled />
                                    </div>
                                </div>
                                {this.state.currentSelectedClient.sales.length > 0 && (
                                    <div className="row mt-2 p-0">
                                        <div className="col-12">
                                            <input onClick={this.addDebtToInvoiceTotal} ref={this.payDebtButton} type="button" value="Pagar deuda" className="form-control btn-danger rounded-0" />
                                            <table className="table table-sm table-borderless text-danger text-center border border-danger">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Deuda</th>
                                                        <th>Fecha</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.currentSelectedClient.sales &&
                                                        this.state.currentSelectedClient.sales.map(sale => {
                                                            let invoiceTotal = 0,
                                                                paymentTotal = 0;
                                                            sale.saleProducts.forEach(saleProduct => {
                                                                invoiceTotal += roundUpProductPrice(saleProduct.product.price * this.props.dolarReference);
                                                            });

                                                            sale.payment.forEach(payment => {
                                                                paymentTotal += payment.amount;
                                                            });

                                                            return (
                                                                <tr>
                                                                    <th className="btn-link" role="button">
                                                                        {sale.id}
                                                                    </th>
                                                                    <th>{Intl.NumberFormat('es-VE', { currency: 'VES' }).format(invoiceTotal - paymentTotal)}</th>
                                                                    <th>{sale.createdAt}</th>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                <div id="paymentMethodContainer" ref={this.paymentMethodContainer}>
                                    <hr className="w-100 mt-0 mb-0" />
                                    <span className="btn btn-link" data-toggle="modal" data-target="#paymentMethodsModal">
                                        Agregar método de pago
                                    </span>
                                    {this.state.paymentInfo &&
                                        Object.keys(this.state.paymentInfo).map(key => {
                                            if (key.startsWith('point of sale')) {
                                                return (
                                                    <div className="paymentDetailsContainer row mb-3">
                                                        <div className="col-1 ">
                                                            <button
                                                                onClick={() => {
                                                                    this.removePaymentMethod(key);
                                                                }}
                                                                className="btn btn-danger ">
                                                                -
                                                            </button>
                                                        </div>
                                                        <div className="col-9">
                                                            <div className="input-group">
                                                                <button className="btn btn-dark" disabled="disabled">
                                                                    Punto de Venta
                                                                </button>
                                                                <input
                                                                    onFocus={function (event) {
                                                                        event.target.select();
                                                                    }}
                                                                    onChange={event => this.updatePaymentMethodAmount(key, event)}
                                                                    type="text"
                                                                    className="form-control text-right text-danger"
                                                                    value={numberWithCommas(this.state.paymentInfo[key].amount, '.')}
                                                                />
                                                                <button className="btn btn-dark" disabled="disabled">
                                                                    Bs.
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-2 pl-0">
                                                            <input
                                                                onChange={event => {
                                                                    this.onChangeTicketIdHandler(event, key);
                                                                }}
                                                                className="form-control codeNumber"
                                                                type="text"
                                                                name="ticketId"
                                                                id="ticketId"
                                                                placeholder="N°"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            if (key.startsWith('cash')) {
                                                return (
                                                    <div className="paymentDetailsContainer row mb-3">
                                                        <div className="col-1 ">
                                                            <button
                                                                onClick={() => {
                                                                    this.removePaymentMethod(key);
                                                                }}
                                                                className="btn btn-danger ">
                                                                -
                                                            </button>
                                                        </div>
                                                        <div id={key.replace(/\s/g, '') + 'Container'} className="col-9 ">
                                                            <div className="input-group">
                                                                <button className="btn btn-dark" style={{ width: '136px' }} disabled="disabled">
                                                                    Efectivo
                                                                </button>
                                                                <input
                                                                    onFocus={function (event) {
                                                                        event.target.select();
                                                                    }}
                                                                    onChange={event => this.updatePaymentMethodAmount(key, event)}
                                                                    type="text"
                                                                    className="form-control text-right text-danger"
                                                                    value={numberWithCommas(this.state.paymentInfo[key].amount, '.')}
                                                                    autoFocus
                                                                />
                                                                <select
                                                                    onChange={event => {
                                                                        this.changeCashCurrencyHandler(event, key);
                                                                    }}
                                                                    className="btn btn-dark p-0">
                                                                    <option selected value="Bs.">
                                                                        Bs.
                                                                    </option>
                                                                    <option value="$">$</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div id={key.replace(/\s/g, '') + 'DolarReferenceContainer'} className="col-4 d-none">
                                                            <input
                                                                onChange={event => {
                                                                    this.onChangeDolarReferenceHandler(event, key);
                                                                }}
                                                                className="form-control"
                                                                type="text"
                                                                name="dolarValue"
                                                                id="dolarValue"
                                                                placeholder="Valor dolar"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            if (key.startsWith('bank transfer')) {
                                                return (
                                                    <div className="paymentDetailsContainer row mb-3">
                                                        <div className="col-1 ">
                                                            <button
                                                                onClick={() => {
                                                                    this.removePaymentMethod(key);
                                                                }}
                                                                className="btn btn-danger ">
                                                                -
                                                            </button>
                                                        </div>
                                                        <div className="col-9 ">
                                                            <div className="input-group">
                                                                <button className="btn btn-dark" style={{ width: '136px' }} disabled="disabled">
                                                                    Transferencia
                                                                </button>
                                                                <input
                                                                    onFocus={function (event) {
                                                                        event.target.select();
                                                                    }}
                                                                    onChange={event => this.updatePaymentMethodAmount(key, event)}
                                                                    type="text"
                                                                    className="form-control text-right text-danger"
                                                                    value={numberWithCommas(this.state.paymentInfo[key].amount, '.')}
                                                                    autoFocus
                                                                />
                                                                <button className="btn btn-dark" disabled="disabled">
                                                                    Bs.
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-2 pl-0 mb-3">
                                                            <input
                                                                onChange={event => {
                                                                    this.onChangeReferenceCodeHandler(event, key);
                                                                }}
                                                                className="form-control codeNumber"
                                                                type="text"
                                                                name="numberId"
                                                                id="numberId"
                                                                placeholder="N°"
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <select
                                                                onChange={event => {
                                                                    this.onChangeBankHandler(event, key);
                                                                }}
                                                                className="form-control btn btn-secondary"
                                                                name="bankData"
                                                                id="bankData">
                                                                {this.state.bankList &&
                                                                    this.state.bankList.map(bankInfo => {
                                                                        return (
                                                                            <option value={bankInfo.id}>
                                                                                {bankInfo.bankName} | {bankInfo.ownerName}
                                                                            </option>
                                                                        );
                                                                    })}
                                                            </select>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                </div>
                                <hr className="w-100 mb-1" />
                                <div className="row p-0">
                                    <label className="col-9 pr-0 text-right font-weight-bold">Subtotal:</label>
                                    <label className="col-3 p-0 text-danger font-weight-bold">{numberWithCommas(this.state.totalBs, '.')}</label>
                                </div>
                                {this.state.totalDebt > 0 && (
                                    <div className="row p-0">
                                        <label className="col-9 pr-0 text-right font-weight-bold">
                                            <button onClick={this.removeDebtFromInvoiceTotal} className="btn-danger mr-3">
                                                -
                                            </button>
                                            Deuda:
                                        </label>
                                        <label className="col-3 p-0 text-danger font-weight-bold">{numberWithCommas(this.calculateClientDebt(), '.')}</label>
                                    </div>
                                )}
                                <div className="row p-0">
                                    <label className="col-9 pr-0 text-right font-weight-bold">Total:</label>
                                    <label className="col-3 p-0 text-danger font-weight-bold">{numberWithCommas(this.state.totalBs + this.state.totalDebt, '.')}</label>
                                </div>
                                <div className="row p-0">
                                    <label className="col-9 pr-0 text-right font-weight-bold">Total pago expresado:</label>
                                    <label className="col-3 p-0 text-danger font-weight-bold">{numberWithCommas(this.calculatePaymentTotal(), '.')}</label>
                                </div>
                            </div>
                            <div className="modal-footer p-0 m-0">
                                <div className="col-12">
                                    <span className={this.state.messageInfo.type == 'error' ? 'text-danger' : 'text-success'}>{this.state.messageInfo.message}</span>
                                </div>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                                <button ref={this.saleSubmitButton} onClick={this.submitSaleHandler} type="button" className="btn btn-primary">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="paymentMethodsModal" className="modal" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Payment Methods</h5>
                            </div>
                            <div className="modal-body"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BetterSalesControl;

import React, { Component } from "react";

import bootbox from "bootbox";

import InvoiceModal from "../screens/InvoiceModal";
import { formatPhoneNumber, showMessageInfo, getHigherAmountClientPayment } from "../../../helpers";

import salesRequests from "../../../requests/sales";
import paymentsRequests from "../../../requests/payments";
import paymentMethodsRequests from "../../../requests/paymentMethods";


require("bootstrap");

class InvoiceModalContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            invoiceTotal: props.invoiceTotal || 0,
            invoiceCurrency: props.invoiceCurrency || "",
            debtTotalBs: 0,
            paymentInfo: [],
            currentSelectedClient: props.client || null,
            showDebtDetails: false,
            showPaymentMethodsModal: false,
            showNewClientFormModal: false,
            cedulaToBeCreated: "",
            paymentMethodsModalProps: null,
            debtInfo: [],
            isMoneyBack: false,
            submittingSale: false,
            confirmingSale: false
        };

        this.onClientSelect = this.onClientSelect.bind(this);
        this.addPaymentMethod = this.addPaymentMethod.bind(this);
        this.removePaymentMethod = this.removePaymentMethod.bind(this);
        this.onPaymentPropertyChange = this.onPaymentPropertyChange.bind(this);
        this.calculateExpressedPaymentTotal = this.calculateExpressedPaymentTotal.bind(this);
        this.payIndividualDebtHandler = this.payIndividualDebtHandler.bind(this);
        this.onDebtIdClick = this.onDebtIdClick.bind(this);
        this.closePaymentMethodsModal = this.closePaymentMethodsModal.bind(this);
        this.openPaymentMethodsModalHandler = this.openPaymentMethodsModalHandler.bind(this);
        this.onSaleSubmitHandler = this.onSaleSubmitHandler.bind(this);
        this.saleSubmitValidationsPassed = this.saleSubmitValidationsPassed.bind(this);
        this.paymentSubmitValidationsPassed = this.paymentSubmitValidationsPassed.bind(this);
        this.onNewClientSubmitHandler = this.onNewClientSubmitHandler.bind(this);
        this.payCurrentDebt = this.payCurrentDebt.bind(this);
        this.paymentSubmitHandler = this.paymentSubmitHandler.bind(this);
        this.openNewClientFormModal = this.openNewClientFormModal.bind(this);
        this.closeNewClientFormModal = this.closeNewClientFormModal.bind(this);
    }

    componentDidMount() {
        if (this.props.action === "newSale") {
            this.loadPoinfOfSalesPayment();
        }
        /*
            let shortcutListener = (event) => {
                if (event.keyCode == 13 && event.ctrlKey) {
                    if (!this.state.confirmingSale) {
                        if (this.props.action == "newSale") {
                            this.onSaleSubmitHandler();
                        }
                        else if (this.props.action == "payDebt") {
                            this.paymentSubmitHandler();
                        }
                    }
                }
            };
            document.body.addEventListener("keyup", shortcutListener);
            */
        window.$("#invoiceModal").on("show.bs.modal", (event) => {
            if (this.props.action == "newSale") {
                this.setState({ invoiceTotal: this.props.invoiceTotal });
            }
            else if (this.props.action == "payDebt") {
                this.setState({
                    invoiceTotal: this.props.invoiceTotal,
                    invoiceCurrency: this.props.invoiceCurrency,
                    paymentInfo: [],
                    currentSelectedClient: this.props.client
                });
            }
        });
        window.$("#invoiceModal").on("hidden.bs.modal", (event) => {
            if (this.props.action == "newSale") {
                window.$("#productSearchInput").focus();
                //document.body.removeEventListener("keyup", shortcutListener);
            }
        });
    }

    async loadPoinfOfSalesPayment() {
        let paymentMethods = await paymentMethodsRequests.fetchAll();
        if (paymentMethods.data) {
            paymentMethods.data.map(pm => {
                if (pm.name.toLowerCase().includes("point of sale")) {
                    this.addPaymentMethod("PointOfSale", {
                        paymentMethodId: pm.id,
                        amount: Math.abs(this.props.invoiceTotal),
                        currency: "Bs",
                    });
                }
            });
        }
    }
    onClientSelect(selectedClient, actionType) {
        if (actionType.action == 'select-option') {
            selectedClient.label = selectedClient.name;
            selectedClient.phoneNumber = selectedClient.phoneNumber || "";
            window.$("#invoiceModal").find("input").focus();
        }

        this.setState({
            currentSelectedClient: selectedClient,
        });
    }

    calculateExpressedPaymentTotal() {
        let paymentInfo = this.state.paymentInfo;
        let paymentTotal = 0;
        paymentInfo.forEach(paymentType => {
            if (paymentType.currency === "Bs") {
                paymentTotal += paymentType.amount;
            }
            else if (paymentType.currency === "USD") {
                paymentTotal += paymentType.amount * paymentType.dolarReference;
            }
        });
        return paymentTotal;
    }

    calculateClientTotalDebt() {
        let client = this.state.currentSelectedClient;
        let debtTotal = 0;
        client.sales.forEach(sale => {
            if (sale.markedToBePaid && sale.debtTotal > 0) {
                debtTotal += sale.debtTotal;
            }
        });
        return debtTotal;
    }

    addPaymentMethod(paymentType, defaultInfo) {
        let paymentInfo = this.state.paymentInfo;
        let debtInfo = this.state.paymentMethodsModalProps;
        let isMoneyBack = this.state.isMoneyBack;
        paymentInfo.push({
            ...defaultInfo,
            id: Date.now(),
            type: paymentType,
            debtInfo,
            isMoneyBack
        });

        this.setState({ paymentInfo }, () => {
            console.log(this.state.paymentInfo);
        });
    }

    onPaymentPropertyChange(id, property, value) {
        let paymentInfo = this.state.paymentInfo;

        paymentInfo.map(payment => {
            if (payment.id == id) {
                payment[property] = value;
            }
        });

        this.setState({ paymentInfo });
    }


    removePaymentMethod(id) {
        let paymentInfo = this.state.paymentInfo;

        this.setState({
            paymentInfo: paymentInfo.filter(payment => payment.id != id)
        }, () => {
            console.log(this.state.paymentInfo);
        });
    }

    payIndividualDebtHandler(saleId) {
        let client = this.state.currentSelectedClient;
        client.sales && client.sales.map(sale => {
            if (sale.id == saleId) {
                sale.markedToBePaid = !sale.markedToBePaid;
            }
        });

        this.setState({
            currentSelectedClient: client,
            debtTotalBs: this.calculateClientTotalDebt()
        });
    }

    onDebtIdClick(debtDetails, callback) {
        this.setState({
            showDebtDetails: true,
            debtInfo: debtDetails
        }, () => {
            callback();
        });
    }

    openPaymentMethodsModalHandler(event, props, isMoneyBack) {
        this.setState({
            showPaymentMethodsModal: true,
            paymentMethodsModalProps: props,
            isMoneyBack
        }, () => {
            window.$("#paymentMethodsModal").modal("show");
        });

    }

    closePaymentMethodsModal() {
        this.setState({
            showPaymentMethodsModal: false
        });
    }

    saleSubmitValidationsPassed() {
        if (!this.state.currentSelectedClient) {
            showMessageInfo(this, "error", "Por favor seleccione un cliente");
            return false;
        }
        if (this.props.products == null || !this.props.products.length) {
            showMessageInfo(this, "error", "Por favor seleccione un producto");
            return false;
        }

        if (!this.state.paymentInfo.length) {
            showMessageInfo(this, "error", "Por favor seleccione un método de pago");
            return false;
        }
        for (let payment of this.state.paymentInfo) {
            if (payment.amount == null || payment.amount === "" || isNaN(payment.amount)) {
                showMessageInfo(this, "error", "El monto debe contener un valor numérico");
                return false;
            }
            if (payment.type === "PointOfSale") {
                if (payment.ticketId == null || payment.ticketId === "" || isNaN(payment.ticketId)) {
                    showMessageInfo(this, "error", "El número de ticket debe contener un valor numérico");
                    return false;
                }
            }
            else if (payment.type === "Cash") {
                if (payment.currency === "USD" && (payment.dolarReference == null || payment.dolarReference === "" || isNaN(payment.dolarReference))) {
                    showMessageInfo(this, "error", "El valor del dólar no puede estar vacío");
                    return false;
                }
            }
            else if (payment.type === "BankTransfer") {
                if (payment.referenceCode == null || payment.referenceCode === "" || isNaN(payment.referenceCode)) {
                    showMessageInfo(this, "error", "El número de referencia debe contener un valor numérico");
                    return false;
                }
                if (payment.bankId == null || payment.bankId === "" || isNaN(payment.bankId)) {
                    showMessageInfo(this, "error", "Debe seleccionar el banco receptor de la transferencia");
                    return false;
                }
            }

            if (payment.debtInfo) {
                if (payment.debtInfo.saleId == null || payment.debtInfo.debtTotal == null) {
                    showMessageInfo(this, "error", "El pago de la deuda no está asociado a ninguna factura");
                    return false;
                }
                if (payment.currency === payment.debtInfo.debtCurrency && payment.amount > Math.abs(payment.debtInfo.debtTotal.toFixed(2))) {
                    showMessageInfo(this, "error", "El monto deudor a pagar es mayor al de la deuda");
                    return;

                }
                if (payment.currency === "USD" && payment.debtInfo.debtCurrency === "Bs" && (payment.amount * payment.dolarReference) > Math.abs(payment.debtInfo.debtTotal.toFixed(2))) {
                    showMessageInfo(this, "error", "El monto deudor a pagar es mayor al de la deuda");
                    return;
                }
                if (payment.amount == 0) {
                    showMessageInfo(this, "error", "El monto deudor a pagar no puede ser igual a 0");
                    return false;
                }
            }

        }
        let expressedPaymentTotal = this.calculateExpressedPaymentTotal();
        if (expressedPaymentTotal < this.state.debtTotalBs) {
            showMessageInfo(this, "error", "El pago total expresado es inferior al total de la deuda a pagar");
            return false;
        }
        return true;
    }

    paymentSubmitValidationsPassed() {
        if (!this.state.currentSelectedClient) {
            showMessageInfo(this, "error", "Por favor seleccione un cliente");
            return false;
        }
        if (!this.state.paymentInfo.length) {
            showMessageInfo(this, "error", "Por favor seleccione un método de pago");
            return false;
        }
        for (let payment of this.state.paymentInfo) {
            if (payment.amount == null || payment.amount === "" || isNaN(payment.amount)) {
                showMessageInfo(this, "error", "El monto debe contener un valor numérico");
                return false;
            }
            if (payment.type === "PointOfSale") {
                if (payment.ticketId == null || payment.ticketId === "" || isNaN(payment.ticketId)) {
                    showMessageInfo(this, "error", "El número de ticket debe contener un valor numérico");
                    return false;
                }
            }
            else if (payment.type === "Cash") {
                if (payment.currency === "USD" && (payment.dolarReference == null || payment.dolarReference === "" || isNaN(payment.dolarReference))) {
                    showMessageInfo(this, "error", "El valor del dólar no puede estar vacío");
                    return false;
                }
            }
            else if (payment.type === "BankTransfer") {
                if (payment.referenceCode == null || payment.referenceCode === "" || isNaN(payment.referenceCode)) {
                    showMessageInfo(this, "error", "El número de referencia debe contener un valor numérico");
                    return false;
                }
                if (payment.bankId == null || payment.bankId === "" || isNaN(payment.bankId)) {
                    showMessageInfo(this, "error", "Debe seleccionar el banco receptor de la transferencia");
                    return false;
                }
            }
        }
        return true;
    }

    onSaleSubmitHandler() {
        if (this.saleSubmitValidationsPassed()) {
            let expressedPaymentTotal = this.calculateExpressedPaymentTotal();
            let totalToBePaid = this.props.invoiceTotal + this.state.debtTotalBs;
            let message = "";
            let canAcquireDebt = true;
            if (expressedPaymentTotal == totalToBePaid) {
                message = "¿Está seguro que desea continuar?";
                canAcquireDebt = false;
            }
            else if (expressedPaymentTotal < totalToBePaid) {
                message = "<span class='font-weight-bold'>El pago total expresado es <span class='text-danger h5'>INFERIOR </span> al monto total a pagar. El cliente podría adquirir una <span class='text-danger'>DEUDA</span> con la empresa. ¿Cómo desea continuar?</span>";
            }
            else if (expressedPaymentTotal > totalToBePaid) {
                message = "<span class='font-weight-bold'>El pago total expresado es <span class='text-success h5'>SUPERIOR </span> al monto total a pagar. La empresa podría adquirir una <span class='text-success'>DEUDA</span> con el cliente. ¿Cómo desea continuar?</span>";
            }
            this.setState({
                confirmingSale: true
            }, () => {
                this.showSaleConfirmDialog(message, canAcquireDebt, (fullyPaid) => {
                    this.submitCurrentSale(fullyPaid);
                });
            });
        }
    }
    submitCurrentSale(fullyPaid) {
        this.setState({
            submittingSale: true
        }, async () => {
            let products = [];
            let paymentInfo = this.state.paymentInfo;
            let salePayments = [];
            this.props.products.forEach(product => {
                products.push({
                    id: product.id,
                    quantity: product.quantity,
                    price: product.price,
                    profitPercent: product.profitPercent,
                    discount: product.discount.length ? product.discount[0].percent : 0
                });
            });
            paymentInfo.forEach(payment => {
                let pm = {
                    id: payment.id,
                    paymentMethodId: payment.paymentMethodId,
                    amount: payment.amount,
                    currency: payment.currency,
                };
                if (payment.type.includes("PointOfSale")) {
                    pm.paymentDetails = {
                        ticketId: payment.ticketId
                    };
                }
                else if (payment.type.includes("Cash") && payment.currency === "USD") {
                    pm.paymentDetails = {
                        dolarReference: payment.dolarReference
                    };

                }
                else if (payment.type.includes("Cash") && payment.currency === "Bs") {
                    pm.paymentDetails = {};
                }
                else if (payment.type.includes("BankTransfer")) {
                    pm.paymentDetails = {
                        referenceCode: payment.referenceCode,
                        bankId: payment.bankId
                    };

                }
                if (payment.debtInfo) {
                    salePayments.push({
                        ...pm,
                        payingDebtInfo: [{
                            saleId: payment.debtInfo.saleId,
                            amount: -pm.amount,
                            fullyPaid: payment.amount == Math.abs(payment.debtInfo.debtTotal.toFixed(2)) ? 1 : 0
                        }]
                    });
                }
                else {
                    salePayments.push(pm);
                }
            });
            let client = this.state.currentSelectedClient;
            if (client.sales) {
                for (let debt of client.sales) {
                    if (debt.markedToBePaid) {
                        let higherPayment = getHigherAmountClientPayment(salePayments);
                        let amountToBePaid = 0;
                        if (higherPayment.currency === "USD") {
                            amountToBePaid = debt.debtTotal / higherPayment.paymentDetails.dolarReference;
                        }
                        else if (higherPayment.currency === "Bs") {
                            amountToBePaid = debt.debtTotal;
                        }
                        salePayments.forEach(payment => {
                            let fullyPaid = false;
                            if (higherPayment.currency === debt.debtCurrency) {
                                fullyPaid = amountToBePaid == Math.abs(debt.debtTotal);
                            }
                            else if (higherPayment.currency === "USD" && debt.debtCurrency === "Bs") {
                                fullyPaid = (amountToBePaid * higherPayment.paymentDetails.dolarReference) == Math.abs(debt.debtTotal);
                            }
                            else if (higherPayment.currency === "Bs" && debt.debtCurrency === "USD") {
                                fullyPaid = (amountToBePaid / higherPayment.paymentDetails.dolarReference) == Math.abs(debt.debtTotal);
                            }
                            if (payment.id == higherPayment.id) {
                                if (payment.payingDebtInfo) {
                                    payment.payingDebtInfo.push({
                                        saleId: debt.id,
                                        amount: amountToBePaid,
                                        fullyPaid
                                    });
                                }
                                else {
                                    payment.payingDebtInfo = [{
                                        saleId: debt.id,
                                        amount: amountToBePaid,
                                        fullyPaid
                                    }];
                                }
                                payment.amount -= amountToBePaid;
                            }
                        });
                    }
                }
            }
            salePayments.forEach(payment => {
                delete payment.id;
            });
            try {
                let sale = await salesRequests.create({
                    clientId: this.state.currentSelectedClient.id,
                    products,
                    dolarReference: this.props.dolarReference,
                    isPaid: fullyPaid,
                    fullyPaidDate: fullyPaid ? new Date() : null,
                    payments: salePayments
                });
                if (sale.error) {
                    showMessageInfo(this, "error", sale.error.toString());
                }
                else {
                    this.setState({
                        submittingSale: false
                    }, () => {
                        window.$("#invoiceModal").modal("hide");
                        this.props.onSaleSubmit();
                    });
                }

            } catch (error) {
                showMessageInfo(this, "error", error.toString());
            }
        });
    }

    paymentSubmitHandler() {
        if (this.paymentSubmitValidationsPassed()) {
            let expressedPaymentTotal = this.calculateExpressedPaymentTotal();
            let totalToBePaid = Math.abs(this.state.invoiceTotal);
            let dolarReference = null;
            this.state.paymentInfo.map(payment => {
                if (payment.dolarReference) {
                    dolarReference = payment.dolarReference;
                }
            });
            if (this.state.invoiceCurrency === "USD") {
                if (dolarReference) {
                    totalToBePaid = Math.abs(this.state.invoiceTotal) * dolarReference;
                }
                else {
                    dolarReference = prompt("Por favor ingrese el valor actual del dolar");

                    if (dolarReference == null || isNaN(dolarReference)) {
                        this.setState({ submittingSale: false });
                        showMessageInfo(this, "error", "Valor del dolar incorrecto");
                        return;
                    }
                    else {
                        totalToBePaid = Math.abs(this.state.invoiceTotal) * dolarReference;
                    }
                }
                this.setState({ invoiceTotal: totalToBePaid, invoiceCurrency: "Bs" });
            }
            let message = "";
            let canAcquireDebt = true;
            if (expressedPaymentTotal == totalToBePaid) {
                message = "¿Está seguro que desea continuar?";
                canAcquireDebt = false;
            }
            else if (expressedPaymentTotal < totalToBePaid) {
                message = "<span class='font-weight-bold'>El pago total expresado es <span class='text-danger h5'>INFERIOR </span> al monto total a pagar. El cliente podría adquirir una <span class='text-danger'>DEUDA</span> con la empresa. ¿Cómo desea continuar?</span>";
            }
            else if (expressedPaymentTotal > totalToBePaid) {
                message = "<span class='font-weight-bold'>El pago total expresado es <span class='text-success h5'>SUPERIOR </span> al monto total a pagar. La empresa podría adquirir una <span class='text-success'>DEUDA</span> con el cliente. ¿Cómo desea continuar?</span>";
            }
            this.setState({
                confirmingSale: true
            }, () => {
                this.showSaleConfirmDialog(message, canAcquireDebt, (fullyPaid) => {
                    this.payCurrentDebt(fullyPaid);
                });
            });
        }
    }

    async payCurrentDebt(fullyPaid) {
        if (this.props.saleId == null) {
            showMessageInfo(this, "error", "ID de venta no especificado");
            return;
        }

        try {
            let paymentInfo = this.state.paymentInfo;
            let paymentsArray = [];
            paymentInfo.forEach(payment => {
                let pm = {
                    id: payment.id,
                    paymentMethodId: payment.paymentMethodId,
                    amount: this.props.invoiceTotal < 0 ? -payment.amount : payment.amount,
                    currency: payment.currency,
                };
                if (payment.type.includes("PointOfSale")) {
                    pm.paymentDetails = {
                        ticketId: payment.ticketId
                    };
                }
                else if (payment.type.includes("Cash") && payment.currency === "USD") {
                    pm.paymentDetails = {
                        dolarReference: payment.dolarReference
                    };

                }
                else if (payment.type.includes("Cash") && payment.currency === "Bs") {
                    pm.paymentDetails = {};
                }
                else if (payment.type.includes("BankTransfer")) {
                    pm.paymentDetails = {
                        referenceCode: payment.referenceCode,
                        bankId: payment.bankId
                    };

                }
                paymentsArray.push(pm);
            });

            for (let payment of paymentsArray) {
                let pm = await paymentsRequests.create({
                    ...payment,
                    saleId: this.props.saleId,
                    fullyPaid,
                });
                if (pm.error) {
                    showMessageInfo(this, "error", pm.error.toString());
                }
                else {
                    this.setState({
                        submittingSale: false
                    }, () => {
                        window.$("#invoiceModal").modal("hide");
                        this.props.onPaymentSubmit();
                    });
                }

            }
        } catch (error) {

        }
    }

    showSaleConfirmDialog(message, isDebt, cb) {
        let buttons = isDebt
            ?
            {
                close: {
                    label: "Cerrar",
                    className: "btn-secondary",
                    callback: function () {
                        dialog.modal("hide");
                    }
                },
                storeAsDebt: {
                    label: "Guardar deuda",
                    className: "btn-warning",
                    callback: function () {
                        cb(false);
                    }
                },
                confirm: {
                    label: "Continuar sin guardar deuda",
                    className: "btn btn-primary btn-success",
                    callback: function () {
                        cb(true);
                    }
                }
            }
            :
            {
                close: {
                    label: "Cerrar",
                    className: "btn-secondary",
                    callback: function () {
                        dialog.modal("hide");
                    }
                },
                confirm: {
                    label: "Confirmar",
                    className: "btn btn-primary btn-success",
                    autoFocus: true,
                    callback: function () {
                        cb(true);
                    }
                }
            };
        let dialog = bootbox.dialog({
            title: "Confirmación",
            message,
            size: "large",
            onEscape: true,
            closeButton: true,
            centerVertical: true,
            animate: false,
            backdrop: true,
            onHidden: () => {
                window.$("#invoiceModal").find("input").focus();
            },
            buttons
        });
    }

    onNewClientSubmitHandler(client) {
        client.label = client.name;
        this.setState({
            currentSelectedClient: client
        }, () => {
            console.log(this.state.currentSelectedClient);
            window.$("#newClientModal").modal("hide");
            window.$("#invoiceModal").find("input").focus();
        });

    }

    openNewClientFormModal(cedulaToBeCreated) {
        this.setState({
            showNewClientFormModal: true,
            cedulaToBeCreated
        }, () => {
            window.$("#newClientModal").modal("show");
        });
    }

    closeNewClientFormModal() {
        this.setState({
            showNewClientFormModal: false
        });
    }

    render() {
        return (
            <InvoiceModal
                action={this.props.action}
                client={this.state.currentSelectedClient}
                onClientSelect={this.onClientSelect}
                addPaymentMethod={this.addPaymentMethod}
                removePaymentMethod={this.removePaymentMethod}
                onPaymentPropertyChange={this.onPaymentPropertyChange}
                paymentInfo={this.state.paymentInfo}
                messageInfo={this.state.messageInfo}
                debtInfo={this.state.debtInfo}
                debtTotalBs={this.state.debtTotalBs}
                invoiceTotal={this.state.invoiceTotal}
                invoiceCurrency={this.state.invoiceCurrency}
                payIndividualDebtHandler={this.payIndividualDebtHandler}
                expressedPaymentTotal={this.calculateExpressedPaymentTotal()}
                showDebtDetails={this.state.showDebtDetails}
                showNewClientForm={this.state.showNewClientForm}
                showPaymentMethodsModal={this.state.showPaymentMethodsModal}
                onDebtIdClick={this.onDebtIdClick}
                dolarReference={this.props.dolarReference}
                openPaymentMethodsModalHandler={this.openPaymentMethodsModalHandler}
                closePaymentMethodsModal={this.closePaymentMethodsModal}
                onSaleSubmitHandler={this.onSaleSubmitHandler}
                paymentSubmitHandler={this.paymentSubmitHandler}
                onNewClientSubmitHandler={this.onNewClientSubmitHandler}
                openNewClientFormModal={this.openNewClientFormModal}
                closeNewClientFormModal={this.closeNewClientFormModal}
                showNewClientFormModal={this.state.showNewClientFormModal}
                cedulaToBeCreated={this.state.cedulaToBeCreated}
            />
        );
    }
}

export default InvoiceModalContainer;

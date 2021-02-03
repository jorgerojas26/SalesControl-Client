import React, {Component} from "react"

import InvoiceModal from "./InvoiceModal"

import {formatPhoneNumber, roundUpProductPrice} from "../../../helpers"

class InvoiceModalContainer extends Component {

    constructor() {
        super();

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            currentSelectedClient: null
        }


        this.onClientSelect = this.onClientSelect.bind(this)
        this.calculatePaymentsTotal = this.calculatePaymentsTotal.bind(this);
        this.calculateSaleTotal = this.calculateSaleTotal.bind(this);
    }

    onClientSelect(selectedClient, actionType) {
        if (actionType.action == 'select-option') {
            selectedClient.label = selectedClient.name;
            selectedClient.phoneNumber = formatPhoneNumber(selectedClient.phoneNumber);

            window.$("#invoiceModal").find("input").focus();
        }

        this.setState({
            currentSelectedClient: selectedClient,
        });

    }

    calculatePaymentsTotal(payments) {
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
    }

    calculateSaleTotal(sale, frozenPrice) {
        let saleTotal = 0;
        sale.saleProducts.forEach(saleProduct => {
            let productPrice = (frozenPrice) ? saleProduct.price : saleProduct.product.price;
            saleTotal += roundUpProductPrice(productPrice * this.props.dolarReference) * saleProduct.quantity;
        });
        return Math.round(saleTotal);
    }

    render() {
        return (
            <InvoiceModal
                client={this.state.currentSelectedClient}
                onClientSelect={this.onClientSelect}
                messageInfo={this.state.messageInfo}
                calculateSaleTotal={this.calculateSaleTotal}
                calculatePaymentsTotal={this.calculatePaymentsTotal}
            />
        )
    }
}

export default InvoiceModalContainer;

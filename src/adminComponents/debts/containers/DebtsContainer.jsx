import React, { Component } from "react";

import salesRequests from "../../../requests/sales";

import Debts from "../components/Debts";

import { calculateDebtTotal, calculateSaleTotal, calculatePaymentsTotal, showMessageInfo } from "../../../helpers";

class DebtsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            salesArray: null,
            showDebtDetails: false,
            debtDetails: null,
            showInvoiceModal: false,
            invoiceInfo: null
        };

        this.fetchAllDebts = this.fetchAllDebts.bind(this);
        this.openDebtDetails = this.openDebtDetails.bind(this);
        this.payDebtHandler = this.payDebtHandler.bind(this);
        this.onPaymentSubmit = this.onPaymentSubmit.bind(this);
    }

    componentDidMount() {

        this.fetchAllDebts();
    }
    async fetchAllDebts() {
        let sales = await salesRequests.fetchAllDebts();
        if (sales.data)
            sales.data.map(sale => {
                let nonFreezedSaleTotal = calculateSaleTotal(sale, false, this.props.dolarReference);
                let freezedSaleTotal = calculateSaleTotal(sale, true);
                let expressedPaymentTotal = calculatePaymentsTotal(sale.payment);
                let freezePrices = false;
                if (freezedSaleTotal - expressedPaymentTotal <= 0 || nonFreezedSaleTotal < freezedSaleTotal) {
                    freezePrices = true;
                }
                let debtInfo = calculateDebtTotal(sale, this.props.dolarReference, freezePrices);
                if (debtInfo.debtTotal < 0 && debtInfo.debtTotal.toFixed(2) == 0) {
                    debtInfo.debtTotal = -0.01;
                }
                else if (debtInfo.debtTotal > 0 && debtInfo.debtTotal.toFixed(2) == 0) {
                    debtInfo.debtTotal = 0.01;
                }
                sale.debtTotal = debtInfo.debtTotal;
                sale.debtCurrency = debtInfo.debtCurrency;
            });
        this.setState({
            salesArray: sales.data
        });
    }

    openDebtDetails(saleId) {
        this.state.salesArray.map(sale => {
            if (sale.id == saleId) {
                this.setState({
                    debtDetails: sale,
                    showDebtDetails: true
                }, () => {
                    window.$("#debtDetailsModal").modal("show");
                });
            }
        });
    }

    payDebtHandler(saleId) {
        this.state.salesArray.map(sale => {
            if (sale.id == saleId) {
                this.setState({
                    invoiceInfo: {
                        saleId,
                        debtTotal: sale.debtCurrency === "USD" ? sale.debtTotal.toFixed(2) : sale.debtTotal,
                        debtCurrency: sale.debtCurrency,
                        client: sale.client
                    },
                    showInvoiceModal: true
                }, () => {
                    window.$("#invoiceModal").modal("show");
                });
            }
        });
    }

    onPaymentSubmit() {
        showMessageInfo(this, "success", "La deuda ha sido pagada con éxito");
        this.fetchAllDebts();
    }

    render() {
        return (
            <Debts
                salesArray={this.state.salesArray}
                openDebtDetails={this.openDebtDetails}
                showDebtDetails={this.state.showDebtDetails}
                debtDetails={this.state.debtDetails}
                payDebtHandler={this.payDebtHandler}
                showInvoiceModal={this.state.showInvoiceModal}
                invoiceInfo={this.state.invoiceInfo}
                messageInfo={this.state.messageInfo}
                onPaymentSubmit={this.onPaymentSubmit}
                dolarReference={this.props.dolarReference}
            />
        );
    }
}

export default DebtsContainer;
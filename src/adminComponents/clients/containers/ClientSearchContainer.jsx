import React, { Component } from "react";

import ClientSearch from "../components/ClientSearch";

import clientRequests from "../../../requests/clients";

import { numberWithCommas, calculateDebtTotal, calculateSaleTotal, calculatePaymentsTotal } from "../../../helpers";

class ClientSearchContainer extends Component {
    constructor() {
        super();

        this.state = {
            inputValue: null,
            employee: false
        };
        this.clientSelectRef = React.createRef();

        this.onClientSelect = this.onClientSelect.bind(this);

    }


    componentDidMount() {
        let _this = this;
        window.$("#invoiceModal").on("shown.bs.modal", (event) => {
            if (event.target.id == "invoiceModal")
                _this.clientSelectRef.current.focus();
        });
    }

    async onSearchHandler(name) {
        let results = await clientRequests.fetchByNameOrCedulaWithDebts(name);
        if (results.length) {
            results.forEach(client => {
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
        return results;
    }

    onClientSelect(selectedClient, action) {
        if (action.action == "select-option") {
            if (selectedClient) {
                selectedClient.sales.forEach(sale => {
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

            }
            this.setState({
                employee: selectedClient.employee
            });
        }
        else if (action.action == "create-option") {
            this.props.openNewClientFormModal(this.state.inputValue);
        }
        this.props.onClientSelect(selectedClient, action);
    }

    render() {
        return (
            <ClientSearch
                value={this.props.value}
                onSearch={this.onSearchHandler}
                onClientSelect={this.onClientSelect}
                clientSelectRef={this.clientSelectRef}
                onInputChange={this.onInputChange}
                inputValue={this.state.inputValue}
                employee={this.state.employee}
            />
        );
    }
}

export default ClientSearchContainer;

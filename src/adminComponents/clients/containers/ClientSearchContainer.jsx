import React, { Component } from "react";

import ClientSearch from "../components/ClientSearch";

import clientRequests from "../../../requests/clients";

import { numberWithCommas, calculateDebtTotal, calculateSaleTotal, calculatePaymentsTotal } from "../../../helpers";

class ClientSearchContainer extends Component {
    constructor() {
        super();

        this.clientSelectRef = React.createRef();

        this.onClientSelect = this.onClientSelect.bind(this);
    }


    componentDidMount() {
        window.$("#invoiceModal").on("shown.bs.modal", () => {
            this.clientSelectRef.current.focus();
        });
    }

    async onSearchHandler(name) {
        let results = await clientRequests.fetchByNameOrCedulaWithDebts(name);
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

    onClientSelect(selectedClient, action) {
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
                sale.debtTotal = debtInfo.debtTotal;
                sale.debtCurrency = debtInfo.debtCurrency;
            });

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
            />
        );
    }
}

export default ClientSearchContainer;

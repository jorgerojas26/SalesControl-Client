import React, { Component } from 'react';

import DebtTable from "../components/DebtTable";

class DebtTableContainer extends Component {

    constructor() {
        super();

        this.state = {
            products: [],
            showPayButton: true
        };
        this.onDebtIdClickHandler = this.onDebtIdClickHandler.bind(this);
        this.payIndividualDebt = this.payIndividualDebt.bind(this);
    }

    componentDidMount() {
        window.$("#debtDetailsModal").on("hidden.bs.modal", () => {
            this.setState({
                showDebtDetails: false
            });
        });
    }

    onDebtIdClickHandler(event) {
        let saleObject = null;
        let match = false;
        this.props.client.sales.forEach(sale => {
            if (sale.id == event.target.innerText) {
                match = true;
                sale.client = this.props.client;
                saleObject = sale;
            }
        });

        if (match) {
            this.props.onDebtIdClick(saleObject, () => {
                window.$("#debtDetailsModal").modal("show");
            });
        }


    }

    payIndividualDebt(event) {
        let row = event.target.parentElement.parentElement;
        let saleId = event.target.getAttribute("data-saleid");
        this.props.client.sales.forEach(sale => {
            if (sale.id == saleId) {
                this.props.payIndividualDebtHandler(saleId);
                this.switchRowColor(row);
            }
        });
    }

    switchRowColor(row) {
        if (row.className.includes("bg-success")) {
            row.classList.remove("bg-success");
            row.classList.remove("text-light");
            row.classList.add("text-danger");
            row.querySelector("button").classList.remove("btn-danger");
            row.querySelector("button").classList.add("btn-success");
        }
        else {
            row.classList.add("bg-success");
            row.classList.add("text-light");
            row.classList.remove("text-danger");
            row.querySelector("button").classList.add("btn-danger");
            row.querySelector("button").classList.remove("btn-success");
        }
    }
    render() {
        return (
            < DebtTable
                client={this.props.client}
                onDebtIdClickHandler={this.onDebtIdClickHandler}
                payIndividualDebt={this.payIndividualDebt}
                openPaymentMethodsModalHandler={this.props.openPaymentMethodsModalHandler}
            />
        );
    }
}

export default DebtTableContainer;
import React, { Component } from "react";

import CashPayment from "../components/CashPayment";

class CashPaymentContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currency: props.currency,
            amount: props.defaultAmount || 0,
            formattedAmount: props.defaultAmount ? props.defaultAmount.toLocaleString("es-VE") : "0",
            dolarReference: props.defaultDolarReference || 0,
            formattedDolarReference: props.defaultDolarReference ? props.defaultDolarReference.toLocaleString("es-VE") : "",
            cashDollarToBs: props.defaultCashDollarToBs || "",
            formattedCashDollarToBs: props.defaultCashDollarToBs ? props.defaultCashDollarToBs.toLocaleString("es-VE") : ""
        };

        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onAmountChange = this.onAmountChange.bind(this);
        this.onDolarReferenceChange = this.onDolarReferenceChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    onRemove() {
        this.props.onRemove(this.props.id);
    }

    onAmountChange(event) {
        let input = event.target.value;
        if (this.state.currency === "Bs") {
            input = input.replace(/[\D\s\._\-]+/g, "");
            input = input ? parseFloat(input, 10) : 0;

            this.setState({
                amount: input,
                formattedAmount: input.toLocaleString("es-VE")
            });
        }
        else if (this.state.currency === "USD") {
            input = input.replace(/[^\.\d]+/g, "");

            this.setState({
                amount: input,
                formattedAmount: input.toLocaleString("es-VE")
            }, () => {
                this.updateDollarToBs();
            });
        }

        this.props.onPropertyChange(this.props.id, "amount", input);
    }

    onCurrencyChange(event) {
        if (event.target.value === "Bs") {
            this.setState({
                currency: "Bs",
                amount: 0,
                formattedAmount: "0",
                dollarToBs: ""
            });
        }
        else if (event.target.value === "USD") {
            this.setState({
                currency: "USD",
                amount: 0,
                formattedAmount: "0"
            });
        }

        this.props.onPropertyChange(this.props.id, "currency", event.target.value);
        this.props.onPropertyChange(this.props.id, "amount", 0);
    }

    onDolarReferenceChange(event) {
        let input = event.target.value;
        input = input.replace(/[\D\s\._\-]+/g, "");
        input = input ? parseFloat(input, 10) : 0;

        this.setState({
            dolarReference: input,
            formattedDolarReference: input.toLocaleString("es-VE")
        }, () => {
            this.updateDollarToBs();
        });

        this.props.onPropertyChange(this.props.id, "dolarReference", input);
    }

    updateDollarToBs() {
        let value = this.state.amount * this.state.dolarReference;
        this.setState({
            cashDollarToBs: value,
            formattedCashDollarToBs: value.toLocaleString("es-VE") + " Bs"
        });
    }

    render() {
        return <CashPayment
            onRemove={this.onRemove}
            onAmountChange={this.onAmountChange}
            onCurrencyChange={this.onCurrencyChange}
            onDolarReferenceChange={this.onDolarReferenceChange}
            currency={this.state.currency}
            amountValue={this.state.formattedAmount}
            dolarReferenceValue={this.state.formattedDolarReference}
            cashDollarToBs={this.state.formattedCashDollarToBs}
            disabled={this.props.disabled}
            debtInfo={this.props.debtInfo}
        />;
    }
}

export default CashPaymentContainer;

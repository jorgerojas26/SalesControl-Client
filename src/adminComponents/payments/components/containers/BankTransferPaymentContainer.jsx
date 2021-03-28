import React, { Component } from "react";

import BankTransferPayment from "../BankTransferPayment";

import bankRequests from "../../../../requests/banks";

import { numberWithCommas } from "../../../../helpers";

class BankTransferPaymentContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currency: props.currency,
            amount: props.defaultAmount || 0,
            formattedAmount: props.defaultAmount.toLocaleString("es-VE") || "0",
            bankList: [],
            currentSelectedBankId: props.defaultBankId || null,
            referenceCode: props.defaultReferenceCode || ""
        };

        this.onAmountChange = this.onAmountChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onReferenceCodeChange = this.onReferenceCodeChange.bind(this);
        this.onBankChange = this.onBankChange.bind(this);
    }

    componentDidMount() {
        this.loadBankList();
    }

    async loadBankList() {
        let bankList = await this.getBankList();
        this.setState({ bankList });
    }

    async getBankList() {
        let banks = await bankRequests.fetchAll();
        return banks.data || [];
    }

    onAmountChange(event) {
        let input = event.target.value;
        input = input.replace(/[\D\s\._\-]+/g, "");
        input = input ? parseFloat(input, 10) : 0;

        this.setState({
            amount: input,
            formattedAmount: input.toLocaleString("es-VE")
        });

        this.props.onPropertyChange(this.props.id, "amount", input);
    }

    onReferenceCodeChange(event) {
        this.setState({
            referenceCode: event.target.value
        });

        this.props.onPropertyChange(this.props.id, "referenceCode", event.target.value);
    }

    onBankChange(event) {
        this.setState({
            currentSelectedBankId: event.target.value
        });

        this.props.onPropertyChange(this.props.id, "bankId", event.target.value);
    }

    onRemove() {
        this.props.onRemove(this.props.id);
    }

    render() {
        return <BankTransferPayment
            onRemove={this.onRemove}
            onAmountChange={this.onAmountChange}
            onReferenceCodeChange={this.onReferenceCodeChange}
            onBankChange={this.onBankChange}
            bankList={this.state.bankList}
            currency={this.props.currency || "Bs"}
            amountValue={this.state.formattedAmount}
            referenceCodeValue={this.state.referenceCode}
            debtInfo={this.props.debtInfo}
            disabled={this.props.disabled}
        />;
    }
}

export default BankTransferPaymentContainer;

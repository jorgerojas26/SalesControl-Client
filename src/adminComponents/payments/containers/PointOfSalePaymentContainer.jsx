import React, { Component } from "react";

import PointOfSalePayment from "../components/PointOfSalePayment";

import { sanitizeCurrencyAmount } from "../../../helpers";
import pointOfSalesRequests from "../../../requests/pointofsales";

class PointOfSalePaymentContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: props.defaultAmount || 0,
            formattedAmount: props.defaultAmount ? props.defaultAmount.toLocaleString("es-VE") : "0",
            ticketId: props.defaultTicketId || ""
        };

        this.onAmountChange = this.onAmountChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onTicketIdChange = this.onTicketIdChange.bind(this);
    }

    async componentDidMount() {
        if (this.props.loadNextTicketId) {
            let ticketId = await this.getLastTicketId() + 1;
            this.setState({
                ticketId
            });
            this.props.onPropertyChange(this.props.id, "ticketId", ticketId);
        }
    }

    getLastTicketId() {
        return new Promise((resolve, reject) => {
            pointOfSalesRequests.fetchLastOne().then(response => {
                if (response.data.length > 0) {
                    resolve(response.data[0].ticketId);
                } else {
                    resolve(0);
                }
            });
        });
    }

    onAmountChange(event) {
        let input = sanitizeCurrencyAmount(event.target.value);

        this.setState({
            amount: input,
            formattedAmount: input.toLocaleString("es-VE")
        });

        this.props.onPropertyChange(this.props.id, "amount", input);
    }


    onTicketIdChange(event) {
        let input = event.target.value;
        input = input.replace(/[\D\s\._\-]+/g, "");
        input = input ? parseInt(input, 10) : 0;

        this.setState({
            ticketId: input === 0 ? "" : input
        });

        this.props.onPropertyChange(this.props.id, "ticketId", input === 0 ? "" : input);
    }

    onRemove() {
        this.props.onRemove(this.props.id);
    }

    render() {
        return < PointOfSalePayment
            id={this.props.id}
            name={this.props.name}
            currency={this.props.currency}
            onAmountChange={this.onAmountChange}
            onTicketIdChange={this.onTicketIdChange}
            onInputClick={this.onInputClick}
            onRemove={this.onRemove}
            amountValue={this.state.formattedAmount}
            ticketIdValue={this.state.ticketId}
            disabled={this.props.disabled}
            debtInfo={this.props.debtInfo}
        />;
    }
}

export default PointOfSalePaymentContainer;

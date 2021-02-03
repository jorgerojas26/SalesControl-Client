import React, {Component} from "react"

import PaymentMethod from "../components/PaymentMethod"

class PaymentMethodContainer extends Component {
    constructor() {
        super();

        this.state = {
            amount: 0,

        }

        this.onAmountUpdate = this.onAmountUpdate.bind(this);
    }

    onAmountUpdate(event) {

    }

    onInputClick(event) {

    }

    onRemove(event) {

    }

    render() {
        return (
            <PaymentMethod
                id={this.props.id}
                name={this.props.name}
                currency={this.props.currency}
                onAmountUpdate={this.onAmountUpdate}
                onInputClick={this.onInputClick}
                onRemove={this.onRemove}
            />
        )
    }
}

export default PaymentMethodContainer;

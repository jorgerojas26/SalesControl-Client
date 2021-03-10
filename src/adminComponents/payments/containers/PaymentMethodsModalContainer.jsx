import React, { Component } from 'react';

import PaymentMethodsModal from "../components/PaymentMethodsModal";

import paymentMethodRequests from "../../../requests/paymentMethods";

class PaymentMethodsModalContainer extends Component {

    constructor() {
        super();
        this.state = {
            paymentMethodList: null
        };

        this.modalRef = React.createRef();

        this.loadPaymentMethodsList = this.loadPaymentMethodsList.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        window.$("#paymentMethodsModal").on("hidden.bs.modal", () => {
            this.props.closePaymentMethodsModal();
        });
        this.loadPaymentMethodsList();
    }

    async loadPaymentMethodsList() {
        let paymentMethodList = await paymentMethodRequests.fetchAll();

        if (paymentMethodList.data) {
            paymentMethodList.data.map(paymentMethod => {
                if (paymentMethod.name.toLowerCase().includes("point of sale")) {
                    paymentMethod.type = "PointOfSale";
                }
                else if (paymentMethod.name.toLowerCase().includes("cash")) {
                    paymentMethod.type = "Cash";

                }
                else if (paymentMethod.name.toLowerCase().includes("bank transfer")) {
                    paymentMethod.type = "BankTransfer";
                }

            });

            this.setState({ paymentMethodList: paymentMethodList.data });
        }
    }

    onClick(event) {
        let paymentButton = event.target;
        let paymentMethodId = paymentButton.getAttribute("data-id");
        let paymentType = paymentButton.getAttribute("data-type");

        if (paymentType === "PointOfSale") {
            this.props.addPaymentMethod(paymentType, {
                paymentMethodId,
                currency: "Bs",
                amount: 0,
                ticketId: null
            });
        }
        else if (paymentType === "Cash") {
            this.props.addPaymentMethod(paymentType, {
                paymentMethodId,
                amount: 0,
                currency: "Bs"
            });
        }
        else if (paymentType === "BankTransfer") {
            this.props.addPaymentMethod(paymentType, {
                paymentMethodId,
                amount: 0,
                currency: "Bs",
                bankId: 1,
                referenceCode: null
            });
        }
        window.$("#paymentMethodsModal").modal("hide");
    }

    render() {
        return (
            <PaymentMethodsModal
                paymentMethodList={this.state.paymentMethodList}
                onClick={this.onClick}
                innerRef={this.modalRef}
            />
        );
    }
}

export default PaymentMethodsModalContainer;
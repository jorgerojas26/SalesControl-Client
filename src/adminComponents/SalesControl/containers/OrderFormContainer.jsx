import React, { Component } from "react";

import productsRequests from "../../../requests/products";

import { showMessageInfo, isProductStockEnough } from "../../../helpers";


import OrderForm from "../components/OrderForm";

class OrderFormContainer extends Component {
    constructor() {
        super();

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            quantity: 1,
            selectedProduct: null
        };

        this.quantityInputRef = React.createRef();
        this.productSelectRef = React.createRef();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onProductSubmit = this.onProductSubmit.bind(this);
        this.onProductSelect = this.onProductSelect.bind(this);
        this.onProductSearchFocus = this.onProductSearchFocus.bind(this);
    }

    onChangeHandler(event) {
        let value = event.target.value;

        if (isNaN(value)) {
            this.setState({
                quantity: 1
            });
            showMessageInfo(this, "error", "La cantidad debe ser un valor numérico");

        }
        else {
            this.setState({
                [event.target.name]: parseFloat(value)
            });
        }
    }

    onProductSelect(selectedProduct, action) {
        if (action.action === "select-option") {
            this.quantityInputRef.current.focus();
            this.quantityInputRef.current.select();
        }
        this.setState({
            selectedProduct: {
                ...selectedProduct,
            }
        });
    }

    onProductSearchFocus() {
        this.setState({
            selectedProduct: null
        });
    }

    async onProductSubmit(event) {
        event.preventDefault();

        if (isNaN(this.state.quantity) || this.state.quantity < 0) {
            showMessageInfo(this, "error", "La cantidad debe ser mayor a 0");
            return;
        }
        if (this.state.selectedProduct != null) {
            if (await isProductStockEnough(this, productsRequests, this.state.selectedProduct.id, this.state.quantity)) {
                this.props.onProductSubmit(this.state.selectedProduct, this.state.quantity);
                this.setState({
                    selectedProduct: null,
                    quantity: 1
                });
                this.productSelectRef.current.focus();
                this.quantityInputRef.current.value = "1";
            }
        } else {
            showMessageInfo(this, 'error', 'Por favor seleccione un producto');
        }

    }

    render() {
        return <OrderForm onChangeHandler={this.onChangeHandler}
            messageInfo={this.state.messageInfo}
            productSelectRef={this.productSelectRef}
            onProductSubmit={this.onProductSubmit}
            currentSelectedProduct={this.state.selectedProduct}
            quantityInputRef={this.quantityInputRef}
            onProductSelect={this.onProductSelect}
            dolarReference={this.props.dolarReference}
            onProductSearchFocus={this.onProductSearchFocus}
        />;
    }


}

export default OrderFormContainer;

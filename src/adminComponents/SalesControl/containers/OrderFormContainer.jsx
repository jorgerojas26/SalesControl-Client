import React, { Component } from "react";

import inventoryRequests from "../../../requests/inventory";

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

    async onProductSubmit(event) {
        event.preventDefault();

        if (isNaN(this.state.quantity) || this.state.quantity < 0) {
            showMessageInfo(this, "error", "La cantidad debe ser mayor a 0");
            return;
        }
        if (this.state.selectedProduct != null) {
            let productInfo = await inventoryRequests.fetchByProductId(this.state.selectedProduct.id);
            if (productInfo.data) {
                let stock = parseFloat(productInfo.data[0].stock);
                let quantityToSell = parseFloat(this.state.quantity);
                if (stock <= 0 || quantityToSell > stock) {
                    showMessageInfo(this, 'error', 'No hay suficientes productos en el inventario');
                } else {

                    this.props.onProductSubmit(this.state.selectedProduct, this.state.quantity);
                    this.setState({
                        selectedProduct: null,
                        quantity: 1
                    });
                    this.productSelectRef.current.focus();
                    this.quantityInputRef.current.value = "1";
                }
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
        />;
    }


}

export default OrderFormContainer;

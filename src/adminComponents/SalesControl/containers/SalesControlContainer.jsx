import React, { Component } from "react";

import SalesControl from "../screens/SalesControl";

import inventoryRequests from "../../../requests/inventory";

import { roundUpProductPrice, showMessageInfo, isProductStockEnough } from "../../../helpers";

class SalesControlContainer extends Component {

    constructor() {
        super();

        this.state = {
            showInvoiceModal: false,
            messageInfo: {
                type: null,
                message: null
            },
            productsToSell: [],
            totalBs: 0,
            totalDollars: 0
        };

        this.onProductSubmit = this.onProductSubmit.bind(this);
        this.onProductDelete = this.onProductDelete.bind(this);
        this.editProductQuantityHandler = this.editProductQuantityHandler.bind(this);
        this.openInvoiceModal = this.openInvoiceModal.bind(this);
        this.toggleInvoiceModal = this.toggleInvoiceModal.bind(this);
        this.onSaleSubmit = this.onSaleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.addEventListener('keyup', event => {
            if (event.keyCode == 13 && event.ctrlKey) {
                this.openInvoiceModal();
            }
        });
    }

    toggleInvoiceModal() {
        this.setState({
            showInvoiceModal: !this.state.showInvoiceModal
        });
    }

    async onProductSubmit(product, quantity) {
        let productsToSell = this.state.productsToSell;

        let productExists = false;

        productsToSell = productsToSell.map(productToSell => {
            if (productToSell.id === product.id) {
                productExists = true;
                productToSell.quantity += quantity;
            }
            return productToSell;
        });

        if (!productExists) {
            productsToSell.push(this.calculateProductTotal(product, quantity, "sum"));
        }

        this.setState({
            productsToSell
        }, () => {
            this.calculateSalesTotal();
        });
    }

    async editProductQuantityHandler(event) {
        let quantity = window.prompt('Ingrese la cantidad: ');
        if (quantity != null && quantity != '') {
            let productId = event.target.parentElement.getAttribute('productId');
            if (await isProductStockEnough(this, inventoryRequests, productId, quantity)) {
                let productsToSell = this.state.productsToSell;
                productsToSell.forEach(product => {
                    if (product.id == productId) {
                        product = this.calculateProductTotal(product, parseFloat(quantity), "equal");
                        this.setState(
                            {
                                productsToSell,
                            },
                            () => {
                                this.calculateSalesTotal();
                            },
                        );
                    }
                });
            }
        }
    }


    onProductDelete(event) {
        let productId = event.target.parentElement.parentElement.getAttribute('productid');
        let productsToSell = this.state.productsToSell.filter(product => {
            return product.id != productId;
        });
        this.setState(
            {
                productsToSell,
            },
            () => this.calculateSalesTotal(),
        );
    }

    calculateProductTotal(product, quantity, quantityOperation) {
        if (product != null && quantity != null) {
            if (quantityOperation === "sum") {
                product.quantity = (product.quantity) ? parseFloat(product.quantity + quantity) : parseFloat(quantity);
            }
            else if (quantityOperation === "equal") {
                product.quantity = parseFloat(quantity);
            }
            product.unitPriceBs = roundUpProductPrice(product.price * this.props.dolarReference);
            product.totalBs = roundUpProductPrice(product.unitPriceBs * product.quantity);
            product.totalDollars = product.unitPriceDollars * product.quantity;
        }
        return product;
    }

    calculateSalesTotal() {
        let totalBs = 0;
        let totalDollars = 0;
        this.state.productsToSell.forEach(product => {
            totalBs += product.totalBs;
            totalDollars += product.totalDollars;
        });

        this.setState({
            totalBs,
            totalDollars,
        });
    }

    openInvoiceModal() {
        if (this.state.productsToSell.length <= 0) {
            showMessageInfo(this, "error", "Por favor seleccione un producto");
            return;
        }

        this.setState({
            showInvoiceModal: true
        }, () => {
            window.$("#invoiceModal").modal();
        });
    }

    onSaleSubmit() {
        this.setState({
            showInvoiceModal: false,
            productsToSell: [],
        }, () => {
            showMessageInfo(this, "success", "La venta se ha procesado con éxito");
        });
    }

    render() {
        return (
            <SalesControl
                editProductQuantityHandler={this.editProductQuantityHandler}
                onProductSubmit={this.onProductSubmit}
                onProductDelete={this.onProductDelete}
                products={this.state.productsToSell}
                invoiceTotalBs={this.state.totalBs}
                invoiceTotalDollars={this.state.totalDollars}
                messageInfo={this.state.messageInfo}
                dolarReference={this.props.dolarReference}
                openInvoiceModal={this.openInvoiceModal}
                toggleInvoiceModal={this.toggleInvoiceModal}
                showInvoiceModal={this.state.showInvoiceModal}
                onSaleSubmit={this.onSaleSubmit}
            />
        );
    }

}

export default SalesControlContainer;

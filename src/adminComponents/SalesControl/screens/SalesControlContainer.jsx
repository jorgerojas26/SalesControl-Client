import React, {Component} from "react"

import SalesControl from "../screens/SalesControl"

import inventoryRequests from "../../../requests/inventory"

import {roundUpProductPrice} from "../../../helpers"

class SalesControlContainer extends Component {

    constructor() {
        super();

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            productsToSell: [],
            totalBs: 0,
            totalDollars: 0
        }

        this.onProductSubmit = this.onProductSubmit.bind(this);
        this.showMessageInfo = this.showMessageInfo.bind(this);
        this.onProductDelete = this.onProductDelete.bind(this);
        this.editProductQuantityHandler = this.editProductQuantityHandler.bind(this);
        this.openInvoiceModal = this.openInvoiceModal.bind(this);
    }

    componentDidMount() {
        document.body.addEventListener('keyup', event => {
            if (event.keyCode == 13 && event.ctrlKey) {
                this.openInvoiceModal();
            }
        });
    }

    onProductSubmit(product, quantity) {
        let productsToSell = this.state.productsToSell;

        let productExists = false;

        productsToSell = productsToSell.map(productToSell => {
            if (productToSell.id === product.id) {
                productExists = true;
                this.calculateProductTotal(productToSell, quantity, "sum");
            }
            return productToSell;
        })

        if (!productExists) {
            productsToSell.push(this.calculateProductTotal(product, quantity, "sum"))
        }

        this.setState({
            productsToSell
        })

        this.calculateSalesTotal();
    }

    showMessageInfo(type, message) {
        if (this.timeout) clearTimeout(this.timeout);
        this.setState(
            {
                messageInfo: {
                    type: null,
                    message: null,
                },
            },
            () => {
                this.setState(
                    {
                        messageInfo: {
                            type,
                            message,
                        },
                    },
                    () => {
                        this.timeout = setTimeout(() => {
                            this.setState({
                                messageInfo: {
                                    type: null,
                                    message: null,
                                },
                            });
                        }, 3000);
                    },
                );
            },
        );
    }

    async editProductQuantityHandler(event) {
        let quantity = window.prompt('Ingrese la cantidad: ');
        if (quantity != null && quantity != '') {
            let productId = event.target.parentElement.getAttribute('productId');
            if (await this.isProductStockEnough(productId, quantity)) {
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

    async isProductStockEnough(id, quantity) {
        let productInfo = await inventoryRequests.fetchByProductId(id);
        if (productInfo.data) {
            let stock = parseFloat(productInfo.data[0].stock);
            if (stock <= 0 || quantity > stock) {
                this.showMessageInfo('error', 'No hay suficientes productos en el inventario');
            } else {
                return true;
            }
        }
        return false;
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
            this.showMessageInfo("error", "Por favor seleccione un producto");
            return;
        }

        this.setState({
            showInvoiceModal: true
        }, () => {
            window.$("#invoiceModal").modal();
        })
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
                showMessageInfo={this.showMessageInfo}
                dolarReference={this.props.dolarReference}
                openInvoiceModal={this.openInvoiceModal}
                showInvoiceModal={this.state.showInvoiceModal}
            />
        )
    }

}

export default SalesControlContainer;

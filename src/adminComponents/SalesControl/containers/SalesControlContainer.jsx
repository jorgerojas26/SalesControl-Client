import React, { Component } from "react";

import SalesControl from "../screens/SalesControl";

import productsRequests from "../../../requests/products";
import clientsRequests from "../../../requests/clients";

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
            totalDollars: 0,
            currentSelectedClientIsEmployee: false
        };

        this.onProductSubmit = this.onProductSubmit.bind(this);
        this.onProductDelete = this.onProductDelete.bind(this);
        this.editProductQuantityHandler = this.editProductQuantityHandler.bind(this);
        this.openInvoiceModal = this.openInvoiceModal.bind(this);
        this.toggleInvoiceModal = this.toggleInvoiceModal.bind(this);
        this.onSaleSubmit = this.onSaleSubmit.bind(this);
        this.onClientSelect = this.onClientSelect.bind(this);
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
                productToSell.quantity = quantity;
            }
            return productToSell;
        });

        if (!productExists) {
            productsToSell.push(this.calculateProductTotal(product, quantity, "sum"));
        }

        this.setState({
            productsToSell,
        }, () => {
            this.calculateSalesTotal(this.state.currentSelectedClientIsEmployee);
        });
    }

    async editProductQuantityHandler(event) {
        let quantity = window.prompt('Ingrese la cantidad: ');
        if (quantity != null && quantity != '') {
            let productId = event.target.parentElement.getAttribute('productId');
            if (await isProductStockEnough(this, productsRequests, productId, quantity)) {
                let productsToSell = this.state.productsToSell;
                productsToSell.forEach(product => {
                    if (product.id == productId) {
                        product = this.calculateProductTotal(product, parseFloat(quantity), "equal");
                        this.setState(
                            {
                                productsToSell,
                            },
                            () => {
                                this.calculateSalesTotal(this.state.currentSelectedClientIsEmployee);
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
            () => this.calculateSalesTotal(this.state.currentSelectedClientIsEmployee),
        );
    }

    calculateProductTotal(product, quantity) {
        if (product != null && quantity != null) {
            product.quantity = parseFloat(quantity);
            product.unitPriceBs = roundUpProductPrice(product.price * this.props.dolarReference);
            product.totalBs = product.unitPriceBs * product.quantity;
            product.totalDollars = product.unitPriceDollars * product.quantity;
        }
        return product;
    }

    calculateSalesTotal(employee) {
        let totalBs = 0;
        let totalDollars = 0;
        let productsToSell = this.state.productsToSell;
        productsToSell.forEach(product => {
            product.unitPriceBs = roundUpProductPrice(product.price * this.props.dolarReference);
            product.totalBs = product.unitPriceBs * product.quantity;
            product.totalDollars = product.unitPriceDollars * product.quantity;

            if (employee) {
                product.discount = Math.round((product.unitPriceBs - Math.round(product.unitPriceBs / ((100 + product.profitPercent) / 100))) / 1000) * 1000;
                product.totalBs = roundUpProductPrice((product.unitPriceBs - product.discount) * product.quantity);
            }
            else {
                product.discount = 0;
            }
            totalBs += product.totalBs;
            totalDollars += product.totalDollars;
        });

        this.setState({
            totalBs,
            totalDollars,
            productsToSell
        });
        return totalBs;
    }

    async onClientSelect(clientId, callback) {
        let client = await clientsRequests.fetchById(clientId);
        if (client != null && client.length && client[0].employee) {
            callback(this.calculateSalesTotal(true));
            this.setState({
                currentSelectedClientIsEmployee: true
            });
        }
        else {
            callback(this.calculateSalesTotal(false));
        }
    }

    openInvoiceModal() {
        if (this.state.productsToSell.length <= 0) {
            showMessageInfo(this, "error", "Por favor seleccione un producto");
            return;
        }

        this.setState({
            showInvoiceModal: true
        }, () => {
            window.$("#invoiceModal").modal("show");
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
                onClientSelect={this.onClientSelect}
            />
        );
    }

}

export default SalesControlContainer;

import React, { Component } from "react";
import AsyncSelect from 'react-select/async';
import { roundUpProductPrice } from "../helpers";
import products from "../requests/products";
import productsRequests from "../requests/products";
import inventoryRequests from "../requests/inventory";
class BetterSalesControl extends Component {

    constructor() {
        super();

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            productsToSell: [],
            currentSelectedProduct: null,
            quantity: 1,
            totalDollars: 0,
            totalBs: 0
        }


        this.productsTableDiv = React.createRef();
        this.productsTable = React.createRef();
        this.productSelect = React.createRef();
        this.saleSubmitButton = React.createRef();
        this.quantityInput = React.createRef();

        this.productSelectionHandler = this.productSelectionHandler.bind(this);
        this.searchProductsHandler = this.searchProductsHandler.bind(this);
        this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
        this.onFocusHandler = this.onFocusHandler.bind(this);
        this.addProductToTableHandler = this.addProductToTableHandler.bind(this);
        this.editProductQuantityHandler = this.editProductQuantityHandler.bind(this);
    }

    componentDidMount() {

    }

    async searchProductsHandler(inputValue) {
        let results = await inventoryRequests.fetchByProductName(inputValue);
        if (results.data.length > 0) {
            results.data.forEach(product => {
                product.value = product;
                product.label =
                    <div className="row">
                        <div className="mx-auto">
                            <img className="my-auto" style={{ maxWidth: "40px", }} src={product.imagePath} />
                            <span className="my-auto">{product.name}</span>
                        </div>
                        <span className="my-auto mr-5">{Intl.NumberFormat("es-VE", { style: "currency", currency: "VES" }).format(roundUpProductPrice(product.price * this.props.dolarReference))}</span>
                    </div>
                    ;
                if (product.stock == 0) product.isDisabled = true;

            });
        }
        return results.data;
    }

    productSelectionHandler(selectedProduct, actionType) {
        if (actionType.action == "select-option") {
            this.quantityInput.current.select();
        }
        this.setState({
            currentSelectedProduct: selectedProduct
        })
    }

    onFocusHandler(event) {
        event.target.select();
    }

    async onInputChangeHandler(event) {
        if (event.target.name == "quantity") {
            this.setState({
                quantity: Number(event.target.value)
            })
        }
        else if (event.target.id == "productQuantity") {
            let productId = event.target.parentElement.parentElement.getAttribute("productId");
            let quantity = Number(event.target.value);

            if (await this.isProductStockEnough(productId, quantity)) {
                let productsToSell = this.state.productsToSell;
                productsToSell.map(product => {
                    if (product.id == productId) {
                        product = this.updateProductTotal(product, quantity);
                    }
                })
                this.setState({
                    productsToSell
                })
            }
            else {
                event.preventDefault();
            }

        }
        else {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    async isProductStockEnough(id, quantity) {
        let productInfo = await inventoryRequests.fetchByProductId(id);
        if (productInfo.data) {
            let stock = Number(productInfo.data[0].stock);
            if (stock <= 0 || quantity > stock) {
                this.setState({
                    messageInfo: {
                        type: "error",
                        message: `No hay suficientes productos en el inventario`
                    }
                })
            }
            else {
                return true;
            }
        }
        return false;
    }

    async addProductToTableHandler(event) {
        event.preventDefault();
        let productInfo = await inventoryRequests.fetchByProductId(this.state.currentSelectedProduct.id);
        if (productInfo.data) {
            let stock = parseInt(productInfo.data[0].stock);
            let quantityToSell = parseInt(this.state.quantity);
            if (stock <= 0 || quantityToSell > stock) {
                this.setState({
                    messageInfo: {
                        type: "error",
                        message: `No hay suficientes productos en el inventario`
                    }
                })
            }
            else {
                let productsToSell = this.state.productsToSell;

                let alreadyInTable = false;

                productsToSell.forEach(productToSell => {
                    if (this.state.currentSelectedProduct.id == productToSell.id) {
                        alreadyInTable = true;
                    }
                })

                if (!alreadyInTable) {
                    let newProduct = {
                        id: this.state.currentSelectedProduct.id,
                        imagePath: this.state.currentSelectedProduct.imagePath,
                        name: this.state.currentSelectedProduct.name,
                        unitPriceDollars: this.state.currentSelectedProduct.price,
                        unitPriceBs: this.state.currentSelectedProduct.price * this.props.dolarReference,
                        quantity: this.state.quantity
                    }
                    newProduct.totalBs = newProduct.unitPriceDollars * newProduct.quantity * this.props.dolarReference;
                    newProduct.totalDollars = newProduct.unitPriceDollars * newProduct.quantity;

                    this.setState({
                        productsToSell: this.state.productsToSell.concat(newProduct)
                    })
                }
                else {
                    productsToSell.map(product => {
                        if (product.id == this.state.currentSelectedProduct.id) {
                            product = this.updateProductTotal(product, this.state.quantity);
                        }
                    });

                    this.setState({
                        productsToSell
                    })
                }
                this.updateSaleTotal();
            }
        }

    }

    updateProductTotal(product, quantity) {
        if (product != null && quantity != null) {
            product.quantity = quantity;
            product.totalBs = product.unitPriceDollars * product.quantity * this.props.dolarReference;
            product.totalDollars = product.unitPriceDollars * product.quantity;
        }
        return product;
    }

    updateSaleTotal() {
        let totalBs = 0;
        let totalDollars = 0;
        this.state.productsToSell.forEach(product => {
            totalBs += product.totalBs;
            totalDollars += product.totalDollars;
        });
        this.setState({
            totalBs,
            totalDollars
        })
    }

    async editProductQuantityHandler(event) {
        let quantity = window.prompt("Ingrese la cantidad: ");
        if (quantity != null && quantity != "") {
            let productId = event.target.parentElement.getAttribute("productId");
            if (await this.isProductStockEnough(productId, quantity)) {
                let productsToSell = this.state.productsToSell;
                productsToSell.forEach(product => {
                    if (product.id == productId) {
                        product = this.updateProductTotal(product, quantity);
                        this.setState({
                            productsToSell
                        }, () => {
                            this.updateSaleTotal()
                        })
                    }
                })
            }
        }
    }

    submitSaleHandler() {

    }

    deleteFromTable() {

    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <h1 className="text-danger">Control de Ventas</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-7 mt-2">
                        <label className="font-weight-bold">Productos</label>
                    </div>
                    <div className="col-12 col-lg-3 mt-2">
                        <label className="font-weight-bold">Cantidad</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <form onSubmit={this.addProductToTableHandler}>
                            <div className="row">
                                <div className="col-12 col-lg-7 mt-2">
                                    <AsyncSelect
                                        loadOptions={this.searchProductsHandler}
                                        ref={this.productSelect}
                                        defaultOptions
                                        cacheOptions
                                        placeholder="Buscar producto"
                                        autoFocus
                                        isClearable
                                        inputId="selectedProduct"
                                        onChange={this.productSelectionHandler}
                                        styles={{
                                            option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
                                                ...styles,
                                                color: data.stock > 0 && data.stock <= 10
                                                    ? "orange"
                                                    : data.stock > 0
                                                        ? "green"
                                                        : "red",
                                                cursor: data.stock == 0
                                                    ? "not-allowed"
                                                    : "pointer"
                                            }),
                                            singleValue: (styles, { data }) => ({
                                                ...styles,
                                                width: "100%"
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-lg-3 mt-2">
                                    <input onFocus={this.onFocusHandler} ref={this.quantityInput} onChange={this.onInputChangeHandler} type="number" className="form-control" placeholder="Cantidad" id="quantity" name="quantity" defaultValue="1" />
                                </div>
                                <div className="col-12 col-lg-2 mt-2">
                                    <input type="submit" className="form-control btn btn-info" value="Enviar" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row mb-2 mt-0">
                    <div className="col">
                        <span className={(this.state.messageInfo.type == "error") ? "text-danger" : "text-success"}>
                            {this.state.messageInfo.message}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-2">
                        <div className="form-group">
                            <input ref={this.saleSubmitButton} onClick={this.submitSaleHandler} type="button" className="form-control btn btn-primary" value="Procesar venta" />
                        </div>
                        <div className="form-group">
                            <input ref={this.saleSubmitButton} type="button" className="form-control btn btn-warning" value="Enviar a deuda" />
                        </div>
                    </div>
                    <div className="col-12 col-lg-10">
                        <div ref={this.productsTableDiv} className="table-responsive" >
                            <table ref={this.productsTable} className="table table-dark table-striped overflow-auto">
                                <thead>
                                    <tr>
                                        <th scope="col">Product ID</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Precio Bs</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Total<span className="font-weight-bold text-warning">{" " + Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(this.state.totalBs)}</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.productsToSell.map((product, index) => {
                                            return (
                                                <tr key={index} productid={product.id}>
                                                    <th>{product.id}</th>
                                                    <th><img style={{ maxWidth: "40px" }} src={product.imagePath} />{product.name}</th>
                                                    <th>{Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(product.unitPriceBs)}</th>
                                                    <th onClick={this.editProductQuantityHandler} className="bg-dark border" style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="bottom" title="Editar Cantidad">{product.quantity}</th>
                                                    <th>{Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(product.totalBs)}</th>
                                                    <th>
                                                        <button onClick={this.deleteFromTable} className="btn btn-danger p-0">Delete</button>
                                                    </th>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BetterSalesControl;
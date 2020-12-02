import React, { Component } from "react";

import CustomSelect from "../globalComponents/CustomSelect";
import $ from "jquery";

class SalesControl extends Component {

    constructor() {
        super();

        this.state = {
            selectedProduct: null,
            addedProducts: [],
            subtotalDollars: null,
            subtotalBs: null,
            totalDollars: null,
            totalBs: null,
            quantity: 1,
            stockError: "",
            error: "",
            success: "",
            submittingSale: false
        }
        this.productsHandler = this.productsHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.optionChangeHandler = this.optionChangeHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);

        this.saleSubmitButton = React.createRef();


        this.sendSaleForm = React.createRef();
        this.quantityInput = React.createRef();
        this.CustomSelectRef = React.createRef();
        this.productsTableDiv = React.createRef();
        this.productsTable = React.createRef();
    }

    componentDidMount() {
        let bodySize = document.body.getBoundingClientRect();
        let tableSize = this.productsTableDiv.current.getBoundingClientRect();
        let tableMaxHeight = bodySize.height - tableSize.top - tableSize.height - 30;
        this.productsTableDiv.current.style.maxHeight = tableMaxHeight;

        document.body.addEventListener("keyup", (event) => {
            let key = event.key;
            if (event.ctrlKey && key == "Enter") {
                if (this.saleSubmitButton.current) this.saleSubmitButton.current.click()
            }
        });
    }

    optionChangeHandler(selectedOption, actionType) {
        if (actionType.action == "select-option") {
            this.quantityInput.current.focus();
            this.quantityInput.current.select();
        }
        this.setState({
            selectedProduct: selectedOption
        })
    }
    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    productsHandler(event) {
        event.preventDefault();

        if (this.state.selectedProduct != null) {
            fetch(`/api/inventory/${this.state.selectedProduct.id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    let stock = parseInt(res.data[0].stock);
                    if (stock > 0 && stock >= this.state.quantity) {
                        let product = this.state.selectedProduct;

                        let productFormatted = {};

                        let discount = 0;
                        if (product.discount.length) {
                            discount = product.discount[0].percent;
                        }

                        product.discount = discount;
                        product.quantity = this.state.quantity || 1;

                        product.totalDollars = product.price * product.quantity - (product.price * (discount / 100));
                        product.priceBs = this.roundToNiceNumber(product.price * this.props.dolarReference);
                        product.totalBs = this.roundToNiceNumber(product.priceBs * product.quantity - (product.priceBs * (discount / 100)));

                        if (discount) {
                            product.totalFormattedDollars = <span className={(discount) ? "text-danger" : ""}>{Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(product.totalDollars) + ` (-${discount}%)`}</span>;
                            product.totalFormattedBs = <span className={(discount) ? "text-danger" : ""}>{Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(product.totalBs) + ` (-${discount}%)`}</span>;
                        }
                        else {
                            product.totalFormattedDollars = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.totalDollars);
                            product.totalFormattedBs = Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(product.totalBs);
                        }

                        productFormatted = {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            priceBs: product.priceBs,
                            quantity: parseInt(product.quantity),
                            totalDollars: product.totalDollars,
                            totalBs: product.totalBs,
                            imagePath: product.imagePath,
                            totalFormattedDollars: product.totalFormattedDollars,
                            totalFormattedBs: product.totalFormattedBs,
                            discount: product.discount
                        };

                        this.CustomSelectRef.current.select.state.value = [];
                        this.quantityInput.current.value = 1
                        this.CustomSelectRef.current.focus();

                        let productExistsInTable = false;

                        this.state.addedProducts.forEach(product => {
                            if (productFormatted.id == product.id) {
                                productExistsInTable = true;
                                product.quantity += productFormatted.quantity;
                            }
                        })

                        if (!productExistsInTable) {
                            this.setState({
                                addedProducts: this.state.addedProducts.concat(productFormatted),
                                quantity: 1,
                                selectedProduct: null,
                                stockError: ""
                            }, function () {
                                let totalDollars = 0;
                                let totalBs = 0;
                                this.state.addedProducts.map(product => {
                                    totalDollars += parseFloat(product.totalDollars);
                                    totalBs += parseFloat(product.totalBs);
                                });
                                this.setState({
                                    subtotalDollars: totalDollars,
                                    subtotalBs: totalBs,
                                    totalDollars,
                                    totalBs
                                })
                                this.productsTable.current.parentElement.scrollTop = this.productsTable.current.scrollHeight;
                            });
                        }
                        else {
                            var index = this.state.addedProducts.findIndex(product => product.id === productFormatted.id);
                            this.setState({
                                addedProducts: [
                                    ...this.state.addedProducts.slice(0, index),
                                    Object.assign({}, this.state.addedProducts[index], { ...productFormatted }),
                                    ...this.state.addedProducts.slice(index + 1)
                                ],
                                quantity: 1,
                                selectedProduct: null,
                                stockError: ""
                            }, function () {
                                console.log(this.state.addedProducts);
                                let totalDollars = 0;
                                let totalBs = 0;
                                this.state.addedProducts.map(product => {
                                    totalDollars += parseFloat(product.totalDollars);
                                    totalBs += parseFloat(product.totalBs);
                                });
                                this.setState({
                                    subtotalDollars: totalDollars,
                                    subtotalBs: totalBs,
                                    totalDollars,
                                    totalBs
                                })
                            })
                        }
                    }
                    else {
                        this.setState({
                            stockError: "No hay productos suficientes en el inventario"
                        });
                    }
                });
        }
        else {
            this.setState({
                stockError: "Seleccione un producto"
            })
        }
    }
    clickHandler(event) {
        let newProducts = [];
        let totalToSubtractDollars = 0;
        let totalToSubtractBs = 0;

        this.state.addedProducts.forEach(product => {
            if (product.id != event.currentTarget.parentElement.parentElement.getAttribute("productid")) {
                newProducts.push(product);
            }
            else {
                totalToSubtractDollars += product.totalDollars;
                totalToSubtractBs += product.totalBs;
            }
        })
        this.setState({
            addedProducts: newProducts,
            subtotalDollars: this.state.subtotalDollars - totalToSubtractDollars,
            subtotalBs: this.state.subtotalBs - totalToSubtractBs,
            totalDollars: this.state.totalDollars - totalToSubtractDollars,
            totalBs: this.state.totalBs - totalToSubtractBs
        });
        this.CustomSelectRef.current.focus();
    }

    submitHandler() {
        if (!this.state.addedProducts.length) {
            this.setState({
                stockError: "Seleccione un producto"
            })
            return
        }
        if (!this.state.submittingSale) {
            this.setState({
                submittingSale: true
            }, () => {
                let saleProducts = [];
                this.state.addedProducts.forEach(product => {
                    saleProducts.push({
                        id: product.id,
                        quantity: product.quantity,
                        price: product.price,
                        dolarReference: this.props.dolarReference,
                        discount: product.discount
                    })
                });
                fetch("/api/sales", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("jwt"),
                        'Content-Type': 'application/json'

                    },
                    body: JSON.stringify({
                        products: saleProducts
                    })
                }).then(res => res.json())
                    .then(res => {
                        if (res.err || res.error) {
                            this.setState({
                                error: res.err
                            });
                        }
                        else {
                            this.setState({
                                success: "La venta se ha realizado con éxito",
                                selectedProduct: null,
                                addedProducts: [],
                                subtotalDollars: null,
                                subtotalBs: null,
                                totalDollars: null,
                                totalBs: null,
                                quantity: 1,
                                stockError: "",
                                error: "",
                                submittingSale: false
                            })
                            setTimeout(() => {
                                this.setState({
                                    success: ""
                                })
                            }, 3000);
                            this.CustomSelectRef.current.select.state.value = [];
                            this.quantityInput.current.value = 1
                            this.CustomSelectRef.current.focus();
                            this.saleSubmitButton.current.disabled = false;

                        }
                    })
            })
        }
        else {
            this.setState({
                error: "Se está ejecutando una venta, por favor espere..."
            })
        }
    }

    roundToNiceNumber(value) {
        var val = 0;
        if (value.toString().length == 4) {
            val = Math.ceil(value / 100) * 100
        }
        else if (value.toString().length > 4) {
            val = Math.ceil(value / 1000) * 1000
        }

        return val;
    }
    render() {
        var _this = this;
        return (
            <div className="container-fluid" id="container">
                <div className="row d-none d-lg-inline-block">
                    <div className="col-md-12">
                        <h1 className="text-danger">Control de Ventas</h1>
                    </div>
                </div>
                <div className="row mt-0 mt-lg-5">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <span className="text-danger">{this.state.stockError}</span>
                                <span className="text-danger h3">{this.state.error}</span>
                                <span className="text-success h3">{this.state.success}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <form className="" onSubmit={this.productsHandler}>
                                    <div className="row mb-3">
                                        <div className="col-12 col-lg-7 mt-2">
                                            <CustomSelect dolarReference={_this.props.dolarReference} isMulti={false} innerRef={this.CustomSelectRef} changeHandler={this.optionChangeHandler} name={"ProductSelect"} />
                                        </div>
                                        <div className="col-12 col-lg-3 mt-2">
                                            <input onChange={this.onChangeHandler} ref={this.quantityInput} type="text" className="form-control" placeholder="Cantidad" id="quantity" name="quantity" defaultValue="1" />
                                        </div>
                                        <div className="col-12 col-lg-2 mt-2">
                                            <input type="submit" className="form-control btn btn-info" value="Enviar" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-2">
                        <div className="form-group">
                            <input ref={this.saleSubmitButton} onClick={this.submitHandler} type="button" className="form-control btn btn-primary" value="Procesar venta" />
                        </div>
                        <div className="form-group">
                            <input ref={this.saleSubmitButton} onClick={this.submitHandler} type="button" className="form-control btn btn-warning" value="Enviar a deuda" />
                        </div>
                    </div>
                    <div className="col-12 col-lg-10">
                        <div ref={this.productsTableDiv} className="table-responsive" >
                            <table ref={this.productsTable} className="table table-dark table-striped overflow-auto">
                                <thead>
                                    <tr>
                                        <th scope="col">Count</th>
                                        <th scope="col">Product ID</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Precio $</th>
                                        <th scope="col">Precio Bs</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Total<span className="font-weight-bold text-warning">{" " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.totalDollars)}</span>
                                        </th>
                                        <th scope="col">Total<span className="font-weight-bold text-warning">{" " + Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(this.state.totalBs)}</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.addedProducts.map((product, index) => {
                                        return (
                                            <tr key={index} productid={product.id}>
                                                <th>{index + 1}</th>
                                                <th>{product.id}</th>
                                                <th><img className="" style={{ maxWidth: "40px" }} src={product.imagePath} />{product.name}</th>
                                                <th>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</th>
                                                <th>{Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(product.priceBs)}</th>
                                                <th>{product.quantity}</th>
                                                <th>{product.totalFormattedDollars}</th>
                                                <th>{product.totalFormattedBs}</th>
                                                <th>
                                                    <button onClick={this.clickHandler} className="btn btn-danger p-0">Delete</button>
                                                </th>
                                            </tr>
                                        )


                                    })}
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default SalesControl;

/*
<div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-column align-items-end">
                            <label className="font-weight-bold h4">{"Subtotal Bs: "}
                                <span className="font-weight-bold h4 text-danger">{Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(this.state.subtotalBs)}</span>
                            </label>
                            <label className="font-weight-bold h4">{"Total Bs: "}
                                <span className="font-weight-bold h4 text-danger">{Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(this.state.totalBs)}</span>
                            </label>
                            <hr className="w-100" />
                            <label className="font-weight-bold h4">{"Subtotal $: "}
                                <span className="font-weight-bold h4 text-danger">{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.subtotalDollars)}</span>
                            </label>
                            <label className="font-weight-bold h4">{"Total $: "}
                                <span className="font-weight-bold h4 text-danger">{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.totalDollars)}</span>
                            </label>
                        </div>

                    </div>
                </div>
                */
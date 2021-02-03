import React, {Component} from "react";
import moment from "moment";
import ResourceTable from "./ResourceTable";
import CustomSelect from "../globalComponents/CustomSelect";

import $ from "jquery";
const DataTable = require('datatables.net');

class Supplyings extends Component {
    constructor() {
        super()

        this.state = {
            supplier: null,
            product: null,
            price: null,
            quantity: null,
            success: null,
            error: null
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.supplierChangeHandler = this.supplierChangeHandler.bind(this);
        this.productChangeHandler = this.productChangeHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.setModalAction = this.setModalAction.bind(this);

        this.supplierSelect = React.createRef();
        this.productSelect = React.createRef();
        this.supplyingForm = React.createRef();

    }

    setModalAction(modalAction) {
        this.setState({
            modalAction
        })
    }

    supplierChangeHandler(selectedOption) {
        this.setState({
            supplier: selectedOption
        });
    }

    productChangeHandler(selectedOption) {
        this.setState({
            product: selectedOption
        });
    }

    inputChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    submitHandler(event) {
        event.preventDefault();
        if (this.state.supplier && this.state.product && this.state.price && this.state.quantity) {
            fetch("/api/supplyings", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    supplierId: this.state.supplier.id,
                    productId: this.state.product.id,
                    price: this.state.price,
                    quantity: this.state.quantity,
                    dolarReference: this.props.dolarReference
                })
            }).then(res => {
                if (res.status == 200) {
                    this.setState({
                        success: "Se ha registrado el abastecimiento con éxito"
                    })
                    this.supplyingForm.current.reset();
                    $("#resourceTable").DataTable().draw();
                }
                else {
                    res.text().then(error => {
                        this.setState({
                            error
                        })
                    })
                }
            })
        }
        else {
            alert("Por favor rellene todos los campos")
        }
    }



    render() {
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Abastecimiento</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <ResourceTable asyncTable={true} setModalAction={this.setModalAction} sourceURL={"/api/supplyings"} columns={[
                            {title: "ID", data: "id"},
                            {title: "ID Proveedor", data: "supplierId"},
                            {title: "Nombre Proveedor", data: "supplier.name"},
                            {title: "ID Product", data: "productId"},
                            {title: "Nombre Producto", data: "product.name"},
                            {
                                render: function (data) {
                                    return "$" + data
                                }, title: "Precio de Compra", data: "price"
                            },
                            {
                                render: function (data) {
                                    return (data > 1) ? data + " Unidades" : data + " Unidad"
                                }, title: "Cantidad", data: "quantity"
                            },
                            {title: "Fecha creación", data: "createdAt"},
                            {title: "Fecha actualización", data: "updatedAt"}

                        ]} actions={["add", "edit", "delete"]} modalStructure={
                            <form ref={this.supplyingForm} onSubmit={this.submitHandler} className="float-left">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Supplying</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="supplierId">Supplier ID: </label>
                                        <CustomSelect sourceURL="/api/suppliers"
                                            isMulti={false}
                                            innerRef={this.supplierSelect}
                                            changeHandler={this.supplierChangeHandler} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="productId">Product ID: </label>
                                        <CustomSelect
                                            isMulti={false}
                                            innerRef={this.productSelect}
                                            changeHandler={this.productChangeHandler} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price">Price: </label>
                                        <input onChange={this.inputChangeHandler} className="form-control" type="number" step="0.00000000000000001" name="price" id="price" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quantity">Quantity: </label>
                                        <input onChange={this.inputChangeHandler} className="form-control" type="number" step="0.00000000000000001" name="quantity" id="quantity" required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                                {this.state.success && <span className="text-success">{this.state.success}</span>}
                                {this.state.error && <span className="text-danger">{this.state.error}</span>}
                            </form>
                        } />
                    </div>
                </div>
            </div >
        )
    }
}

export default Supplyings;

import React, { Component } from "react";
import ResourceTable from "./ResourceTable";
import CustomSelect from "../globalComponents/CustomSelect";


import moment from "moment";
import $ from "jquery";
const DataTable = require('datatables.net');

class Products extends Component {

    constructor() {
        super()

        this.state = {
            selectedCategories: null,
            name: null,
            productImageFile: null,
            profitPercent: null,
            success: null,
            error: null,
            modalAction: null,
            discountPercent: null,
            discountStartDate: null,
            discountEndDate: null,
            selectedRowData: null
        }

        this.submitHandler = this.submitHandler.bind(this);
        this.discountSubmitHandler = this.discountSubmitHandler.bind(this);
        this.optionChangeHandler = this.optionChangeHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.setModalAction = this.setModalAction.bind(this);
        this.setSelectedRowData = this.setSelectedRowData.bind(this);

        this.CustomSelectRef = React.createRef();
        this.productForm = React.createRef();
        this.closeButton = React.createRef();
    }

    setModalAction(modalAction) {
        this.setState({
            modalAction
        })
    }

    setSelectedRowData(selectedRowData) {
        let categories = [];
        selectedRowData.category.forEach(category => {
            categories.push({ id: category.id, label: category.name, value: category.name });
        })

        this.setState({
            selectedRowData,
            selectedCategories: categories,
            name: selectedRowData.name,
            profitPercent: selectedRowData.profitPercent,
        }, () => {
            $("#name").val(this.state.selectedRowData.name);
            $("#profitPercent").val(this.state.selectedRowData.profitPercent);
        })
    }

    optionChangeHandler(selectedOptions, actionType) {
        this.setState({
            selectedCategories: selectedOptions
        });
    }

    changeHandler(event) {
        this.setState({
            [event.target.name]: (event.target.type == "file") ? event.target.files[0] : event.target.value
        });
    }

    submitHandler(event) {
        event.preventDefault();
        var categoriesID = "";
        if (this.state.selectedCategories) {
            this.state.selectedCategories.forEach((category, index) => {
                categoriesID += category.id
                if (index != this.state.selectedCategories.length - 1) {
                    categoriesID += ","
                }
            })
        }
        else {
            alert("Seleccione las categorías")
        }

        var formData = new FormData();

        formData.append("productImageFile", this.state.productImageFile);
        formData.append("name", this.state.name);
        formData.append("profitPercent", this.state.profitPercent);
        formData.append("categories", categoriesID);

        fetch((this.state.modalAction == "add") ? "/api/products" : `/api/products/${this.state.selectedRowData.id}`, {
            method: (this.state.modalAction == "add") ? "POST" : "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Accept": "application/json"
            },
            body: formData
        })
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        success: "El producto se ha registrado con exito"
                    });
                    this.productForm.current.reset();
                    this.closeButton.current.click();
                    $("#resourceTable").DataTable().ajax.reload(null, false);
                }
                else if (res.status == 409) {
                    res.json().then(response => {
                        this.setState({
                            error: response.error || response.err
                        })
                    })

                }
            })
            .catch(error => {
                this.setState({
                    error: error
                })
            })
    }

    discountSubmitHandler(event) {
        event.preventDefault();
        if (this.state.discountPercent && this.state.discountStartDate && this.state.discountEndDate) {
            fetch("/api/discounts", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: this.state.selectedRowData.id,
                    percent: this.state.discountPercent,
                    startDate: this.state.discountStartDate,
                    endDate: this.state.discountEndDate
                })
            })
                .then(res => {
                    if (res.status == 200) {
                        this.setState({
                            success: "Se ha registrado con éxito"
                        })
                    } else {
                        res.json().then(res => {
                            this.setState({
                                error: res.error || res.err
                            })
                        })
                    }
                })
        }
        else {
            alert("Rellene todos los campos")
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
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Productos</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <ResourceTable asyncTable={true} setSelectedRowData={this.setSelectedRowData} setModalAction={this.setModalAction} sourceURL={"/api/products"} columns={[
                            { title: "ID", data: "id" },
                            {
                                render: function (data, type, row, meta) {
                                    if (row.image) {
                                        var bufferBase64 = new Buffer.from(row.image, 'binary').toString('base64');
                                        return `<span class="p-0"><img class="img-responsive m-0 p-0" src="data:image/png;base64,${bufferBase64}" style="max-width:40px;"></img>${data}</span>`
                                    }
                                    else {
                                        return data
                                    }
                                },
                                title: "Nombre", data: "name"
                            },
                            { title: "Precio $", data: "price" },
                            {
                                render: (data) => {
                                    return Intl.NumberFormat("es-Ve", { style: "currency", currency: "VES" }).format(this.roundToNiceNumber(data * this.props.dolarReference))
                                }, title: "Precio Bs", data: "price"
                            },
                            {
                                render: function (data) {
                                    return data + "%"
                                }, title: "Porcentaje de Ganancia", data: "profitPercent"
                            },
                            {
                                render: function (data, type, row, meta) {
                                    let disc = data.map(discount => {
                                        return discount.percent
                                    })

                                    return (disc.length) ? disc + "%" : 0 + "%"
                                }, title: "Descuento", data: "discount"
                            },
                            /*
                            {
                                title: "Descuento desde", data: "discount[0].startDate"
                            },
                            {
                                title: "Descuento hasta", data: "discount[0].endDate"
                            },
                            */
                            { title: "Fecha creación", data: "createdAt" },
                            { title: "Fecha actualización", data: "updatedAt" }
                        ]} actions={["add", "edit", "delete", "discount"]} modalStructure={
                            <form ref={this.productForm} onSubmit={this.submitHandler} className="float-left">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Product</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="name">Product Name: </label>
                                        <input onChange={this.changeHandler} className="form-control" type="text" name="name" id="name" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profitPercent">Profit Percent: </label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">%</div>
                                            </div>
                                            <input onChange={this.changeHandler} className="form-control" type="number" step="0.1" name="profitPercent" id="profitPercent" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="productImageFile">Imagen: </label>
                                        <div className="custom-file">
                                            <input onChange={this.changeHandler} type="file" className="custom-file-input" id="productImageFile" name="productImageFile" />
                                            <label className="custom-file-label" htmlFor="image">Choose file</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price">Categorías: </label>
                                        <CustomSelect sourceURL="/api/categories"
                                            isMulti={true}
                                            innerRef={this.CustomSelectRef}
                                            changeHandler={this.optionChangeHandler}
                                            value={this.state.selectedCategories}
                                            required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button ref={this.closeButton} type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                                {this.state.success && <span className="text-success">{this.state.success}</span>}
                                {this.state.error && <span className="text-danger">{this.state.error}</span>}
                            </form>
                        } />
                        <div id="discountModal" className="modal" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"></h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <form onSubmit={this.discountSubmitHandler}>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label htmlFor="discountPercent">Discount Percent: </label>
                                                <div className="input-group">
                                                    <input onChange={this.changeHandler} className="form-control" type="number" step="0.01" min="0" name="discountPercent" id="discountPercent" required />
                                                    <div className="input-group-append">
                                                        <div className="input-group-text">%</div>
                                                    </div>
                                                </div>
                                                <label htmlFor="discountStartDate">Start Date:</label>
                                                <div className="input-group">
                                                    <input onChange={this.changeHandler} className="form-control" type="date" name="discountStartDate" id="discountStartDate" required />
                                                </div>
                                                <label htmlFor="discountEndDate">End Date:</label>
                                                <div className="input-group">
                                                    <input onChange={this.changeHandler} className="form-control" type="date" name="discountEndDate" id="discountEndDate" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                            <button type="submit" className="btn btn-primary">Enviar</button>
                                        </div>
                                        {this.state.success && <span className="text-success">{this.state.success}</span>}
                                        {this.state.error && <span className="text-danger">{this.state.error}</span>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Products;
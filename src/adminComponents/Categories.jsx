import React, { Component } from "react";
import categoriesRequests from "../requests/categories";

import $ from "jquery";
require("datatables.net")
class Categories extends Component {

    constructor() {
        super();

        this.state = {
            fetchMessage: null,
            submitMessage: null,
            submitMessageType: null,
            submitLoading: false,
            categoryName: null,
            categoryAction: null,
            selectedRowData: null
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);

        this.categoriesTable = React.createRef();

        this.addButton = {
            text: 'Add',
            name: 'add',
            className: "btn btn-success",
            attr: {
                "data-toggle": "modal",
                "data-target": "#categoryModal"
            },
            action: (e, datatable, node, config) => {
                $(".modal-title").text("Add new category");
                $("#categoryName").val("");
                this.setState({
                    categoryAction: "Add"
                })
            }
        }

        this.editButton = {
            text: 'Edit',
            name: 'edit',
            className: "btn btn-secondary",
            extend: "selected",
            attr: {
                "data-toggle": "modal",
                "data-target": "#categoryModal"
            },
            action: (e, datatable, node, config) => {
                let selectedRowData = datatable.row({ selected: true }).data();
                $(".modal-title").text("Edit category");
                $("#categoryName").val(selectedRowData.name);
                this.setState({
                    categoryAction: "Edit",
                    selectedRowData
                })
            }
        }
    }

    async componentDidMount() {
        let response = await categoriesRequests.fetchAll();
        if (response.data) {
            $(this.categoriesTable.current).DataTable({
                data: response.data,
                columns: [
                    { title: "ID", data: "id" },
                    { title: "Nombre", data: "name" },
                    { title: "Fecha creación", data: "createdAt" }
                ],
                dom: "Blftip",
                buttons: [this.addButton, this.editButton],
                select: "single",

            })
        }
        else { //error
            this.setState({
                fetchMessage: response.toString()
            })
        }
    }

    changeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitHandler(event) {
        event.preventDefault();

        var response = null;

        this.setState({
            submitLoading: true
        }, async () => {
            if (this.state.categoryAction == "Add") {
                response = await categoriesRequests.create({
                    name: this.state.categoryName
                });


            }
            else if (this.state.categoryAction == "Edit") {
                response = await categoriesRequests.edit({
                    id: this.state.selectedRowData.id,
                    name: this.state.categoryName
                });


                let rowData = $(this.categoriesTable.current).DataTable().rows().data();
                rowData.map((row, index) => {
                    if (row.id == this.state.selectedRowData.id) {
                        let row = $(this.categoriesTable.current).DataTable().row(index);
                        let rowData = row.data();
                        row.data({
                            ...rowData,
                            name: this.state.categoryName
                        })
                    }
                })

            }

            if (response.error) {
                this.setState({
                    submitMessage: response.error,
                    submitMessageType: "Error",
                    submitLoading: false
                })
            }
            else {
                this.setState({
                    submitMessage: "Se ha registrado con éxito",
                    submitMessageType: "Success",
                    submitLoading: false
                })
                setTimeout(() => {
                    this.setState({
                        submitMessage: null,
                        submitMessageType: null
                    })
                }, 3000);
            }
        })


    }

    render() {
        return (
            <div>
                {this.state.fetchMessage && <span className="text-danger">{this.state.fetchMessage}</span>}
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Categorías</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <table ref={this.categoriesTable} id="categoriesTable" name="categoriesTable" className="table table-bordered" />
                    </div>
                </div>
                <div className="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="categoryModalLabel">Add new category</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={this.submitHandler}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="name">Category Name: </label>
                                        <input onChange={this.changeHandler} className="form-control" type="text" name="categoryName" id="categoryName" required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                    <button type="submit" className="btn btn-primary">
                                        {this.state.submitLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                                        Enviar</button>
                                </div>
                                {this.state.submitMessage && <span className={(this.state.submitMessageType == "Error") ? "text-danger" : "text-success"}>{this.state.submitMessage}</span>}
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
export default Categories;
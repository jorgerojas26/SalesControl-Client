import React, { Component } from "react";
import ResourceTable from "./ResourceTable";

import moment from "moment";

const $ = require("jquery");
const DataTable = require('datatables.net');

class Categories extends Component {

    constructor() {
        super();

        this.state = {
            submitSuccess: null,
            submitError: null,
            selectedRowData: null,
            modalAction: null
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.setSelectedRowData = this.setSelectedRowData.bind(this);
        this.editCategoryHandler = this.editCategoryHandler.bind(this);
        this.setModalAction = this.setModalAction.bind(this);

        this.categoryName = React.createRef();
    }

    submitHandler(event) {
        event.preventDefault();
        fetch((this.state.modalAction == "add") ? "/api/categories" : `/api/categories/${this.state.selectedRowData.id}`, {
            method: (this.state.modalAction == "add") ? "POST" : "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: this.categoryName.current.value })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error || res.err) {
                    this.setState({
                        submitError: res.error || res.err
                    });
                }
                else {
                    this.setState({
                        submitSuccess: "Se ha registrado con éxito"
                    })
                    $("#resourceTable").DataTable().draw();
                }
            })


    }

    editCategoryHandler() {
        console.log("hola");
    }

    setSelectedRowData(selectedRowData) {
        this.setState({
            selectedRowData
        }, function () {
            $("#name").val(this.state.selectedRowData.name);
        })
    }

    setModalAction(modalAction) {
        this.setState({
            modalAction
        })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Categorías</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <ResourceTable asyncTable={true} setModalAction={this.setModalAction} setSelectedRowData={this.setSelectedRowData} sourceURL={"/api/categories"} columns={[
                            { title: "ID", data: "id" },
                            { title: "Nombre", data: "name" },
                            { title: "Fecha creación", data: "createdAt" }
                        ]} actions={["add", "edit"]} modalStructure={
                            <form onSubmit={this.submitHandler} className="float-left">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Category</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="name">Category Name: </label>
                                        <input ref={this.categoryName} className="form-control" type="text" name="name" id="name" required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                                {this.state.submitError && <span className="text-danger">{this.state.submitError}</span>}
                                {this.state.submitSuccess && <span className="text-success">{this.state.submitSuccess}</span>}
                            </form>
                        } />
                    </div>
                </div>
            </div >
        )
    }
}
export default Categories;
import React, { Component } from "react";
import moment from "moment";
import ResourceTable from "./ResourceTable";

import $ from "jquery";
import DataTable from "datatables.net";
class Suppliers extends Component {
    constructor() {
        super()

        this.state = {
            name: null,
            rif: null,
            success: null,
            error: null
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.setModalAction = this.setModalAction.bind(this);

    }

    setModalAction(modalAction) {
        this.setState({
            modalAction
        })
    }

    submitHandler(event) {
        event.preventDefault();
        if (this.state.name && this.state.rif) {
            fetch("/api/suppliers", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: this.state.name,
                    rif: this.state.rif
                })
            })
                .then(res => {
                    if (res.status == 200) {
                        this.setState({
                            success: "Se ha registrado de forma exitosa."
                        });
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
    }

    inputChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Proveedores</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <ResourceTable asyncTable={true} setModalAction={this.setModalAction} sourceURL={"/api/suppliers"} columns={[
                            { title: "ID", data: "id" },
                            { title: "Nombre", data: "name" },
                            { title: "RIF", data: "rif" },
                            { title: "Fecha creación", data: "createdAt" }

                        ]} actions={["add", "edit", "delete"]} modalStructure={
                            <form onSubmit={this.submitHandler} className="float-left">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Supplier</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="name">Supplier Name: </label>
                                        <input onChange={this.inputChangeHandler} className="form-control" type="text" name="name" id="name" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="rif">RIF: </label>
                                        <input onChange={this.inputChangeHandler} className="form-control" type="text" name="rif" id="rif" required />
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

export default Suppliers;
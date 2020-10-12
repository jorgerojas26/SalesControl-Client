import React, { Component } from "react";
import ResourceTable from "./ResourceTable";
import $ from "jquery";
const moment = require("moment");

class Clients extends Component {
    constructor() {
        super();

        this.submitHandler = this.submitHandler.bind(this);
        this.setSelectedRowData = this.setSelectedRowData.bind(this);
        this.setModalAction = this.setModalAction.bind(this);
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

    submitHandler(event) {
        event.preventDefault();
    }
    render() {
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Clientes</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <ResourceTable asyncTable={true} setSelectedRowData={this.setSelectedRowData} setModalAction={this.setModalAction} sourceURL={"/api/clients"} columns={[
                            { title: "ID", data: "id" },
                            { title: "Nombre", data: "name" },
                            { title: "Cédula", data: "cedula" },
                            {
                                render: function (data, type, row, meta) {
                                    return moment.utc(row.createdAt).format("DD/MM/YYYY");
                                }, title: "Fecha creación", data: "createdAt", type: "date"
                            },
                            {
                                render: function (data, type, row, meta) {
                                    return moment.utc(row.updatedAt).format("DD/MM/YYYY");
                                }, title: "Fecha actualización", data: "updatedAt", type: "date"
                            },
                        ]} actions={["add", "edit", "delete"]} modalStructure={
                            <form onSubmit={this.submitHandler} className="float-left">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Client</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="name">Client Name: </label>
                                        <input className="form-control" type="text" name="name" id="name" autoFocus />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cedula">Cédula: </label>
                                        <input className="form-control" type="text" name="cedula" id="cedula" autoFocus />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                            </form>
                        } />
                    </div>
                </div>
            </div >
        )
    }
}

export default Clients;
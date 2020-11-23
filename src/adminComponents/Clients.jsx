import React, { Component } from "react";
import clientRequests from "../requests/clients";
import $ from "jquery";

require("datatables.net")
class Clients extends Component {

    constructor() {
        super();

        this.state = {
            fetchMessage: null,
            submitMessage: null,
            submitMessageType: null,
            submitLoading: false,
            name: null,
            cedula: null,
            phoneNumber: null,
            selectedRowData: null,
            clientAction: null

        }
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.optionChangeHandler = this.optionChangeHandler.bind(this);

        this.clientTable = React.createRef();
        this.customSelectRef = React.createRef();

        this.addButton = {
            text: 'Add',
            name: 'add',
            className: "btn btn-success",
            attr: {
                "data-toggle": "modal",
                "data-target": "#clientModal"
            },
            action: (e, datatable, node, config) => {
                $(".modal-title").text("Add new client");
                $("#name").val("");
                $("#cedula").val("");
                $("#phoneNumber").val("");
                this.setState({
                    clientAction: "Add"
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
                "data-target": "#clientModal"
            },
            action: (e, datatable, node, config) => {
                let selectedRowData = datatable.row({ selected: true }).data();
                $(".modal-title").text("Edit client");
                $("#name").val(selectedRowData.name);
                $("#cedula").val(selectedRowData.cedula);
                $("#phoneNumber").val(selectedRowData.phoneNumber);
                this.setState({
                    clientAction: "Edit",
                    selectedRowData,
                    name: selectedRowData.name,
                    cedula: selectedRowData.cedula,
                    phoneNumber: selectedRowData.phoneNumber
                })
            }
        }
    }

    async componentDidMount() {
        let response = await clientRequests.fetchAll();
        if (response.data) {
            console.log(response.data);
            $(this.clientTable.current).DataTable({
                data: response.data,
                columns: [
                    { title: "ID", data: "id" },
                    { title: "Nombre", data: "name" },
                    { title: "Cédula", data: "cedula" },
                    { title: "Teléfono", data: "phoneNumber" },
                    { title: "Fecha creación", data: "createdAt" }
                ],
                dom: "Blftip",
                buttons: [this.addButton, this.editButton],
                select: "single",
                order: [0, "DESC"]
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

    optionChangeHandler(selectedOption, actionType) {
        this.setState({
            selectedClient: selectedOption
        })
    }

    submitHandler(event) {
        event.preventDefault();

        var response = null;

        this.setState({
            submitLoading: true
        }, async () => {
            if (this.state.clientAction == "Add") {
                response = await clientRequests.create({
                    name: this.state.name,
                    cedula: this.state.cedula,
                    phoneNumber: this.state.phoneNumber
                });
            }
            else if (this.state.clientAction == "Edit") {
                console.log(this.state);
                response = await clientRequests.update({
                    id: this.state.selectedRowData.id,
                    name: this.state.name,
                    cedula: this.state.cedula,
                    phoneNumber: this.state.phoneNumber
                });
                let rowData = $(this.clientTable.current).DataTable().rows().data();
                rowData.map((row, index) => {
                    if (row.id == this.state.selectedRowData.id) {
                        let row = $(this.clientTable.current).DataTable().row(index);
                        let rowData = row.data();
                        row.data({
                            ...rowData,
                            name: this.state.name,
                            cedula: this.state.cedula,
                            phoneNumber: this.state.phoneNumber
                        })
                    }
                })

            }

            if (response && response.error) {
                this.setState({
                    submitMessage: JSON.stringify(response.error),
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
                        <h1 className="text-danger float-left">Clientes</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <table ref={this.clientTable} id="clientTable" name="clientTable" className="table table-bordered" />
                    </div>
                </div>
                <div className="modal fade" id="clientModal" tabindex="-1" aria-labelledby="clientModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="clientModalLabel">Add new client</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={this.submitHandler}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Nombre: </label>
                                        <input onChange={this.changeHandler} type="text" className="form-control" name="name" id="name" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Cédula: </label>
                                        <input onChange={this.changeHandler} type="text" className="form-control" name="cedula" id="cedula" required />
                                    </div>
                                    <label htmlFor="debtTotal">Teléfono: </label>
                                    <input onChange={this.changeHandler} type="text" className="form-control" name="phoneNumber" id="phoneNumber" />
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
export default Clients;
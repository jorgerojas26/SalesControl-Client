import React, { Component } from "react";
import debtsRequests from "../requests/debts";
import CustomSelect from "../globalComponents/CustomSelect";
import $ from "jquery";
require("datatables.net")
class Debt extends Component {

    constructor() {
        super();

        this.state = {
            fetchMessage: null,
            submitMessage: null,
            submitMessageType: null,
            submitLoading: false,
            debtType: 0,
            debtTotal: null,
            debtAction: null,
            selectedRowData: null,
            selectedClient: null
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.optionChangeHandler = this.optionChangeHandler.bind(this);

        this.debtTable = React.createRef();

        this.addButton = {
            text: 'Add',
            name: 'add',
            className: "btn btn-success",
            attr: {
                "data-toggle": "modal",
                "data-target": "#debtModal"
            },
            action: (e, datatable, node, config) => {
                $(".modal-title").text("Add new debt");
                $("#debtTotal").val("");
                this.setState({
                    debtAction: "Add",
                    selectedClient: null
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
                "data-target": "#debtModal"
            },
            action: (e, datatable, node, config) => {
                let selectedRowData = datatable.row({ selected: true }).data();
                $(".modal-title").text("Edit debt");
                $("#debtTotal").val(selectedRowData.total);

                this.setState({
                    debtAction: "Edit",
                    selectedRowData,
                    selectedClient: {
                        label: selectedRowData.client.name,
                        value: selectedRowData.client
                    },
                    debtType: selectedRowData.type,
                    debtTotal: selectedRowData.total
                })
            }
        }
    }

    async componentDidMount() {
        let response = await debtsRequests.fetchAll();
        if (response.data) {
            $(this.debtTable.current).DataTable({
                data: response.data,
                columns: [
                    { title: "ID", data: "id" },
                    { title: "Client ID", data: "client.id" },
                    { title: "Nombre", data: "client.name" },
                    { title: "Cédula", data: "client.cedula" },
                    { title: "Teléfono", data: "client.phoneNumber" },
                    {
                        render: function (data) {
                            return (data == 0) ? "Deuda" : "Credito"
                        }, title: "Tipo", data: "type"
                    },
                    {
                        render: function (data) {
                            return Intl.NumberFormat("es-VE", { style: "currency", currency: "VES" }).format(data)
                        }, title: "Total", data: "total"
                    },
                    {
                        render: function (data) {
                            return (data == 0) ? `<span class="text-danger">SIN PAGAR</span>` : `<span class="text-success">PAGADO</span>`
                        }, title: "Estado", data: "cancelled"
                    },
                    { title: "Fecha creación", data: "createdAt" },
                    { title: "Fecha actualización", data: "updatedAt" }
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
            if (this.state.debtAction == "Add") {
                response = await debtsRequests.create({
                    clientId: this.state.selectedRowData.client.id,
                    type: this.state.debtType,
                    total: this.state.debtTotal
                });
            }
            else if (this.state.debtAction == "Edit") {
                response = await debtsRequests.update({
                    id: this.state.selectedRowData.id,
                    clientId: this.state.selectedRowData.clientId,
                    type: this.state.debtType,
                    total: this.state.debtTotal,
                    cancelled: this.state.selectedRowData.cancelled
                });
                let rowData = $(this.debtTable.current).DataTable().rows().data();
                rowData.map((row, index) => {
                    if (row.id == this.state.selectedRowData.id) {
                        let row = $(this.debtTable.current).DataTable().row(index);
                        let rowData = row.data();
                        row.data({
                            ...rowData,
                            type: this.state.debtType,
                            total: this.state.debtTotal
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
                        <h1 className="text-danger float-left">Deuda</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <table ref={this.debtTable} id="debtTable" name="debtTable" className="table table-bordered" />
                    </div>
                </div>
                <div className="modal fade" id="debtModal" tabindex="-1" aria-labelledby="debtModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="debtModalLabel">Add new debt</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={this.submitHandler}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Client: </label>
                                        <CustomSelect
                                            sourceURL="/api/clients"
                                            value={this.state.selectedClient}
                                            changeHandler={this.optionChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label>Type: </label>
                                        <select onChange={this.changeHandler} className="form-control" name="debtType" id="debtType">
                                            <option value="0">DEUDA</option>
                                            <option value="1">CREDITO</option>
                                        </select>
                                    </div>
                                    <label htmlFor="debtTotal">Total: </label>
                                    <div className="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">Bs</div>
                                        </div>
                                        <input onChange={this.changeHandler} className="form-control" type="number" step="0.01" name="debtTotal" id="debtTotal" />
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
export default Debt;
import React, {Component} from "react";
import clientRequests from "../requests/clients";
import $ from "jquery";
import ClientRegistration from "./ClientRegistration"

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
        this.optionChangeHandler = this.optionChangeHandler.bind(this);

        this.insertClientHandler = this.insertClientHandler.bind(this)
        this.updateClientHandler = this.updateClientHandler.bind(this)

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
                let selectedRowData = datatable.row({selected: true}).data();
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
            $(this.clientTable.current).DataTable({
                data: response.data,
                columns: [
                    {title: "ID", data: "id"},
                    {title: "Nombre", data: "name"},
                    {title: "Cédula", data: "cedula"},
                    {title: "Teléfono", data: "phoneNumber"},
                    {title: "Fecha creación", data: "createdAt"}
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

    optionChangeHandler(selectedOption, actionType) {
        this.setState({
            selectedClient: selectedOption
        })
    }

    updateClientHandler(client) {
        return clientRequests.update({
            id: this.state.selectedRowData.id,
            name: client.name || this.state.name,
            cedula: client.cedula || this.state.cedula,
            phoneNumber: client.phoneNumber || this.state.phoneNumber
        });
    }

    insertClientHandler(client) {
        return clientRequests.create({
            name: client.name,
            cedula: client.cedula,
            phoneNumber: client.phoneNumber,
        });
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
                            <ClientRegistration action={this.state.clientAction} insertHandler={this.insertClientHandler} updateHandler={this.updateClientHandler} />

                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
export default Clients;

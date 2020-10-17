import React, { Component } from "react";
import moment from "moment";
import ResourceTable from "./ResourceTable";

import $ from "jquery";
import DataTable from "datatables.net";

class Users extends Component {
    constructor() {
        super()

        this.state = {
            email: null,
            password: null,
            permissions: null,
            success: null,
            error: null
        }

        this.submitHandler = this.submitHandler.bind(this);

        this.inputChangeHandler = this.inputChangeHandler.bind(this);

        this.form = React.createRef();
    }

    submitHandler(event) {
        event.preventDefault();

        if (this.state.email && this.state.password && this.state.permissions) {

            fetch("/api/users", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    permissions: this.state.permissions
                })
            }).then(res => {
                if (res.status == 200) {
                    this.setState({
                        success: "Se ha registrado con éxito"
                    });
                    this.form.current.reset();
                    $("resourceTable").DataTable().draw();
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
                        <h1 className="text-danger float-left">Usuarios</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <ResourceTable asyncTable={true} sourceURL={"/api/users"} columns={[
                            { title: "ID", data: "id" },
                            { title: "Email", data: "email" },
                            { title: "Permisos", data: "permissions" },
                            { title: "Fecha creación", data: "createdAt" }

                        ]} actions={["add", "delete"]} modalStructure={
                            <form ref={this.form} onSubmit={this.submitHandler} className="float-left">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Supplier</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="email">Email: </label>
                                        <input onChange={this.inputChangeHandler} className="form-control" type="text" name="email" id="email" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password: </label>
                                        <input onChange={this.inputChangeHandler} className="form-control" type="password" name="password" id="password" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="permissions">Permissions: </label>
                                        <input onChange={this.inputChangeHandler} className="form-control" type="text" name="permissions" id="permissions" required />
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

export default Users;
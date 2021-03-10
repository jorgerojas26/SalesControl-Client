import React, { Component } from "react";

import Categories from "./categories/Categories";
import Clients from "./clients/Clients";
import Products from "./products/Products";
import Sales from "./sales/Sales";
import Suppliers from "./suppliers/Suppliers";
import Supplyings from "./supplyings/Supplyings";
import Users from "./users/Users";
import Navigation from "./Navigation";
import SalesControl from "./SalesControl/containers/SalesControlContainer";
import BetterSalesControl from "./SalesControl/BetterSalesControl";
import Inventory from "./inventory/Inventory";
import Reports from "./reports/screens/ReportsContainer";
import Debt from "./debts/containers/DebtsContainer";

import PrivateRoute from "../components/PrivateRoute";
import { Route } from "react-router-dom";
import $ from "jquery";
class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            formattedDolareReference: "",
            dolarReference: 0,
            loading: false,
            newDolarReference: null
        };

        this.fetchDolarReference = this.fetchDolarReference.bind(this);
        this.dolarReferenceSubmitHandler = this.dolarReferenceSubmitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.closeEditDolarModalButton = React.createRef();
    }

    componentDidMount() {
        this.fetchDolarReference();
    }

    fetchDolarReference() {
        this.setState({
            loading: true
        });
        fetch("/api/dolarReference", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    this.setState({
                        dolarReference: res.data.price,
                        formattedDolareReference: Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(res.data.price),
                        loading: false
                    });
                }
                else {
                    this.setState({
                        dolarReference: 0,
                        formattedDolareReference: Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(0),
                        loading: false
                    });
                }
            });
    }

    changeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    dolarReferenceSubmitHandler(event) {
        event.preventDefault();

        fetch("/api/dolarReference", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ price: this.state.newDolarReference })
        })
            .then(res => {
                if (res.status == 204) {
                    window.location.reload();
                } else {
                    alert("Error");
                }
            });
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row sticky-top">
                    <div className="col-md-12 p-0">
                        <Navigation />
                    </div>
                </div>
                <div className="row">
                    <div className="bg-danger text-light col-12">
                        Precio del Dolar <span id="dolarReference" className="badge badge-light">{(this.state.loading) ? "Loading..." : this.state.formattedDolareReference}</span>
                        <button className="btn btn-secondary ml-4" data-toggle="modal" data-target="#dolarEditModal" >Editar</button>
                    </div>

                </div>
                <main className="mt-5">
                    <Route path="/control-de-ventas" render={(props) => (<SalesControl {...props} dolarReference={this.state.dolarReference} />)} />
                    <Route path="/inventario" component={Inventory} />
                    <Route path="/reportes" render={(props) => (<Reports {...props} dolarReference={this.state.dolarReference} />)} />
                    <Route path="/deuda" render={(props) => (<Debt {...props} dolarReference={this.state.dolarReference} />)} />
                    <Route path="/categorias" component={Categories} />
                    <Route path="/clientes" component={Clients} />
                    <Route path="/productos" render={(props) => (<Products {...props} dolarReference={this.state.dolarReference} />)} />
                    <Route path="/ventas" component={Sales} />
                    <Route path="/abastecimiento" render={(props) => (<Supplyings {...props} dolarReference={this.state.dolarReference} />)} />
                    <Route path="/proveedores" component={Suppliers} />
                    <Route path="/usuarios" component={Users} />
                </main>
                <div className="modal fade" id="dolarEditModal" tabIndex="-1" aria-labelledby="dolarEditModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="dolarEditModalLabel">Nuevo precio del dolar</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={this.dolarReferenceSubmitHandler}>
                                <div className="modal-body">
                                    <input name="newDolarReference" onChange={this.changeHandler} className="form-control" type="number" placeholder="Ingrese el nuevo precio del dolar. Ej: 400000" />
                                </div>
                                <div className="modal-footer">
                                    <button ref={this.closeEditDolarModalButton} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default Dashboard;

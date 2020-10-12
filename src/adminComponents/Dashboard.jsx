import React, { Component } from "react";

import Categories from "./Categories";
import Clients from "./Clients";
import Products from "./Products";
import Sales from "./Sales";
import Suppliers from "./Suppliers";
import Supplyings from "./Supplyings";
import Users from "./Users";
import Navigation from "./Navigation";
import SalesControl from "./SalesControl";
import Inventory from "./Inventory";
import Reports from "./Reports";
import PrivateRoute from "../components/PrivateRoute";

import { Switch } from "react-router-dom";
class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            formattedDolareReference: "",
            dolarReference: 0,
            loading: false
        }

        this.fetchDolarReference = this.fetchDolarReference.bind(this);
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
                    })
                }
            })
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
                    </div>
                </div>
                <main className="mt-5">
                    <Switch>
                        <PrivateRoute path="/admin/dashboard/control-de-ventas" component={SalesControl} dolarReference={this.state.dolarReference} />
                        <PrivateRoute path="/admin/dashboard/inventario" component={Inventory} />
                        <PrivateRoute path="/admin/dashboard/reportes" component={Reports} dolarReference={this.state.dolarReference} />
                        <PrivateRoute path="/admin/dashboard/categorias" component={Categories} />
                        <PrivateRoute path="/admin/dashboard/clientes" component={Clients} />
                        <PrivateRoute path="/admin/dashboard/productos" component={Products} dolarReference={this.state.dolarReference} />
                        <PrivateRoute path="/admin/dashboard/ventas" component={Sales} />
                        <PrivateRoute path="/admin/dashboard/abastecimiento" component={Supplyings} dolarReference={this.state.dolarReference} />
                        <PrivateRoute path="/admin/dashboard/proveedores" component={Suppliers} />
                        <PrivateRoute path="/admin/dashboard/usuarios" component={Users} />
                    </Switch>
                </main>
            </div>


        )
    }
}


export default Dashboard;
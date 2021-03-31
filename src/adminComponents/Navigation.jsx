import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Navigation extends Component {

    constructor() {
        super();

        this.clickHandler = this.clickHandler.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
        localStorage.removeItem("jwt");
    }

    clickHandler(event) {
        this.setState({
            activeNavLink: event.target.innerText
        });
    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-lg-column flex-xl-row">
                <a className="navbar-brand text-danger" href="/">Supermercado Melquisedec</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse row p-0 m-0" id="navbarSupportedContent">
                    <ul className="navbar-nav flex-lg-row mx-auto container-fluid p-0 m-0">
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/control-de-ventas"><span className="d-md-inline">Control de Ventas</span></NavLink>
                        </li>
                        {
                            /*
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/inventario"><span className="d-md-inline">Inventario</span></NavLink>
                        </li>
                            */
                        }
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/reportes"><span className="d-md-inline">Reportes</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/deuda"><span className="d-md-inline">Deuda</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/categorias"><span className="d-md-inline">Categorías</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/clientes"><span className="d-md-inline">Clientes</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/productos"><span className="d-md-inline">Productos</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/ventas"><span className="d-md-inline">Ventas</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/abastecimiento"><span className="d-md-inline">Abastecimiento</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/proveedores"><span className="d-md-inline">Proveedores</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link" onClick={this.clickHandler} to="/usuarios"><span className="d-md-inline">Usuarios</span></NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <NavLink className="nav-link btn btn-danger px-0" onClick={this.logout} to="/signin">Cerrar Sesión</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navigation;
import React, { Component } from "react";

class Navigation extends Component {

    render() {
        return (
            <div className="row mt-3 mt-lg-0">
                <div className="col-12">
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark pl-0 pr-0">
                        <button className="navbar-toggler col-sm-12" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto container">
                                <li className="nav-item">
                                    <a className="nav-link text-light font-weight-bold" href="#">HOME</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-light font-weight-bold" href="#">PRODUCTOS</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link text-light font-weight-bold" href="#">SERVICIOS</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link text-light font-weight-bold" href="#">DESCUENTOS</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link text-light font-weight-bold" href="#">PROMOCIONES</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>

        )
    }
}

export default Navigation
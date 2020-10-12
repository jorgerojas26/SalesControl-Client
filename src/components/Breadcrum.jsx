import React, { Component } from "react";

class Breadcrum extends Component {

    render() {
        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                </ol>
            </nav>
        )
    }
}

export default Breadcrum
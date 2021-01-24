import React from "react"

import OrderForm from "./OrderForm"

const SalesControl = (props) => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col text-center text-lg-left">
                    <h1 className="text-danger">Control de Ventas</h1>
                </div>
            </div>
            <div className="row mb-2 mt-0">
                <div className="col">
                    <span className={(props.messageInfo && props.messageInfo.type) === "error" ? "text-danger" : "text-success"}>{(props.messageInfo && props.messageInfo.message)}</span>
                </div>
            </div>
            <OrderForm />
        </div>
    )
}

export default SalesControl

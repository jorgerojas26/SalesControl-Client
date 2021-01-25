import React from "react"

import OrderForm from "../containers/OrderFormContainer"
import ProductsTable from "../components/ProductsTable"

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
            <div className="row">
                <div className="col-12 col-lg-2">
                    <div className="form-group">
                        <input type="button" className="form-control btn btn-primary" value="Procesar venta" />
                    </div>
                </div>
                <div className="col-12 col-lg-10">
                    <ProductsTable />
                </div>
            </div>
        </div>
    )
}

export default SalesControl

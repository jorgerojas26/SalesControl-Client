import React from "react"

import OrderForm from "../containers/OrderFormContainer"
import ProductsTable from "../components/ProductsTable"
import InvoiceModal from "../screens/InvoiceModalContainer"

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
            <OrderForm onProductSubmit={props.onProductSubmit}
                showMessageInfo={props.showMessageInfo}
                dolarReference={props.dolarReference}
            />
            <div className="row">
                <div className="col-12 col-lg-2">
                    <div className="form-group">
                        <input onClick={props.openInvoiceModal} type="button" className="form-control btn btn-primary" value="Procesar venta" />
                    </div>
                </div>
                <div className="col-12 col-lg-10">
                    <ProductsTable
                        editProductQuantityHandler={props.editProductQuantityHandler}
                        invoiceTotalBs={props.invoiceTotalBs}
                        invoiceTotalDollars={props.invoiceTotalDollars}
                        onProductDelete={props.onProductDelete}
                        products={props.products} />
                </div>
            </div>
            {props.showInvoiceModal &&
                <InvoiceModal dolarReference={props.dolarReference} />
            }
        </div>
    )
}

export default SalesControl

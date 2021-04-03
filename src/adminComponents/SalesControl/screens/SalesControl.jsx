import React from "react";

import OrderForm from "../containers/OrderFormContainer";
import ProductsTable from "../../products/components/ProductsTable";
import InvoiceModal from "../containers/InvoiceModalContainer";

const SalesControl = (props) => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col text-center text-lg-left">
                    <h1 className="text-danger">Control de Ventas</h1>
                </div>
            </div>
            <div className="row mb-2 mt-0">
                <div className="col-12">
                    {props.messageInfo.message &&
                        <div className={props.messageInfo.type == 'error' ? 'alert alert-danger' : 'alert alert-success'}>{props.messageInfo.message}</div>
                    }
                </div>
            </div>
            <OrderForm onProductSubmit={props.onProductSubmit}
                showMessageInfo={props.showMessageInfo}
                dolarReference={props.dolarReference}
            />
            <div className="row mt-2">
                <div className="col-12 col-lg-2">
                    <div className="form-group">
                        <input onClick={props.openInvoiceModal} type="button" className="form-control btn btn-primary" value="Procesar venta" />
                    </div>
                </div>
                <div className="col-12 col-lg-10">
                    <ProductsTable
                        editProductQuantityHandler={props.editProductQuantityHandler}
                        invoiceTotalDollars={props.invoiceTotalDollars}
                        onProductDelete={props.onProductDelete}
                        products={props.products} />
                </div>
            </div>
            {props.showInvoiceModal &&
                <InvoiceModal
                    action="newSale"
                    dolarReference={props.dolarReference}
                    invoiceTotal={props.invoiceTotalBs}
                    products={props.products}
                    toggleInvoiceModal={props.toggleInvoiceModal}
                    onSaleSubmit={props.onSaleSubmit}
                    onClientSelect={props.onClientSelect}
                />
            }
        </div>
    );
};

export default SalesControl;

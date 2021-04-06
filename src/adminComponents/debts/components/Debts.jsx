import React from "react";

import DebtDetailsModal from "../components/DebtDetailsModal";
import InvoiceModal from "../../SalesControl/containers/InvoiceModalContainer";

const Debts = (props) => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-danger float-left">Deudas</h1>
                </div>
            </div>
            <div className="row mb-2 mt-0">
                <div className="col-12">
                    {props.messageInfo.message &&
                        <div className={props.messageInfo.type == 'error' ? 'alert alert-danger' : 'alert alert-success'}>{props.messageInfo.message}</div>
                    }
                </div>
            </div>
            <div className="row">
                <table className="table text-center table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID Venta</th>
                            <th>Cliente</th>
                            <th>Cédula</th>
                            <th>Deuda</th>
                            <th>Fecha Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.salesArray && props.salesArray.map(sale => {
                            return (
                                <tr key={sale.id}>
                                    <th onClick={() => props.openDebtDetails(sale.id)} role="button" className="btn-link">{sale.id}</th>
                                    <th>{sale.client.name}</th>
                                    <th>{sale.client.cedula}</th>
                                    <th className={sale.debtTotal < 0 ? "text-success" : "text-danger"}>{sale.debtCurrency == "Bs" ? Math.abs(sale.debtTotal).toLocaleString("es-VE") : Math.abs(sale.debtTotal).toFixed(2).toLocaleString("es-VE")}</th>
                                    <th>{sale.createdAt}</th>
                                    <th><button onClick={() => props.payDebtHandler(sale.id)} className="btn btn-primary">Pagar</button></th>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {props.showDebtDetails &&
                <DebtDetailsModal
                    sale={props.debtDetails}
                    dolarReference={props.dolarReference}
                />
            }
            {props.showInvoiceModal &&
                <InvoiceModal
                    action="payDebt"
                    dolarReference={props.dolarReference}
                    saleId={props.invoiceInfo.saleId} typeoetypeof
                    invoiceTotal={props.invoiceInfo.debtTotal}
                    invoiceCurrency={props.invoiceInfo.debtCurrency}
                    client={props.invoiceInfo.client}
                    onPaymentSubmit={props.onPaymentSubmit}
                />
            }
        </div>
    );
};

export default Debts;
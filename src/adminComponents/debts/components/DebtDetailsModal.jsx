import React from "react";

import ProductsTable from "../../products/components/ProductsTable";
import PointOfSalePayment from "../../payments/containers/PointOfSalePaymentContainer";
import CashPayment from "../../payments/containers/CashPaymentContainer";
import BankTransferPayment from "../../payments/components/containers/BankTransferPaymentContainer";

import { calculatePaymentsTotal, calculateSaleTotal, roundUpProductPrice, calculateDebtTotal } from "../../../helpers";

const DebtDetailsModal = (props) => {

    console.log(props.sale);
    // let nonFreezedSaleTotal = calculateSaleTotal(props.sale, false, props.dolarReference);
    /*
    let freezedSaleTotal = calculateSaleTotal(props.sale, true).invoiceTotal;
    let payments = props.sale.payment;
    let expressedPaymentTotal = calculatePaymentsTotal(payments);
    let invoiceTotalBs = 0;
    let debtInfo, debtTotal, debtCurrency;
    let products = [];
    let businessDebt = freezedSaleTotal - expressedPaymentTotal <= 0;

    if (businessDebt || props.historyView) {
        let saleTotalInfo = calculateSaleTotal(props.sale, true, props.dolarReference, false, props.sale.client.employee);
        invoiceTotalBs = saleTotalInfo.invoiceTotal;
        products = saleTotalInfo.productList;
        debtInfo = calculateDebtTotal(props.sale, props.dolarReference, true);
    }
    else {
        let saleTotalInfo = calculateSaleTotal(props.sale, true, props.dolarReference, true, props.sale.client.employee);
        invoiceTotalBs = saleTotalInfo.invoiceTotal;
        products = saleTotalInfo.productList;
        debtInfo = calculateDebtTotal(props.sale, props.dolarReference, false);
    }
    debtTotal = debtInfo.debtTotal;
    debtCurrency = debtInfo.debtCurrency;
*/

    /*
    if (debtInfo.debtTotal < 0 && debtInfo.debtTotal.toFixed(2) == 0) {
        debtInfo.debtTotal = -0.01;
    }
    else if (debtInfo.debtTotal > 0 && debtInfo.debtTotal.toFixed(2) == 0) {
        debtInfo.debtTotal = 0.01;
    }
    */



    return (
        <div id="debtDetailsModal" className="modal" tabIndex="-1" aria-labelledby="debtDetailsModalLabel" aria-hidden="true" >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="debtDetailsModalLabel">Detalles de la deuda</h5>
                        <button onClick={() => { window.$("#debtDetailsModal").modal("hide"); }} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>

                    </div>
                    <div className="modal-body">
                        <div className="row mb-3 border-bottom">
                            <div className="col-7 border-right">
                                <h4 className="col-12 mb-2">Información de pago</h4>
                                {props.sale.payment && props.sale.payment.map(payment => {
                                    if (payment.cash.length) {
                                        return payment.cash.map(pm => {
                                            return <CashPayment
                                                key={Math.random()}
                                                id={Math.random()}
                                                currency={payment.currency}
                                                defaultAmount={payment.amount || null}
                                                defaultDolarReference={pm.dolarReference || null}
                                                defaultCashDollarToBs={payment.amount * pm.dolarReference}
                                                disabled={true}
                                            />;
                                        });
                                    }
                                    else if (payment.paymentmethod.name.toLowerCase().includes("cash")) {
                                        return <CashPayment
                                            key={Math.random()}
                                            id={Math.random()}
                                            currency={payment.currency}
                                            defaultAmount={payment.amount || null}
                                            disabled={true}
                                        />;

                                    }
                                    else if (payment.banktransfer.length) {
                                        return payment.banktransfer.map(pm => {
                                            if (payment.banktransfer.length) {
                                                return <BankTransferPayment
                                                    key={Math.random()}
                                                    id={Math.random()}
                                                    currency={payment.currency}
                                                    defaultAmount={payment.amount || null}
                                                    defaultReferenceCode={pm.referenceCode || null}
                                                    defaultBankId={pm.bankId}
                                                    disabled={true}
                                                />;
                                            }
                                        });
                                    }
                                    else if (payment.pointofsale.length) {
                                        return payment.pointofsale.map(pm => {
                                            if (payment.pointofsale.length) {
                                                return <PointOfSalePayment
                                                    key={Math.random()}
                                                    id={Math.random()}
                                                    currency={payment.currency}
                                                    defaultAmount={payment.amount || null}
                                                    defaultTicketId={pm.ticketId || null}
                                                    disabled={true}
                                                />;
                                            }
                                        });

                                    }
                                })}
                            </div>
                            <div className="col-5 my-auto border-left">
                                <h4 className="col-12 mb-2">Resumen de totales</h4>
                                <div className="row">
                                    <div className="col-6 text-right">
                                        <span className="font-weight-bold">Subtotal: </span>
                                    </div>
                                    <div className="col-6 text-left">
                                        <span className="text-danger">{props.sale.invoiceTotalBs.toLocaleString("es-VE")}</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 text-right">
                                        <span className="font-weight-bold">Total: </span>
                                    </div>
                                    <div className="col-6 text-left">
                                        <span className="text-danger">{props.sale.invoiceTotalBs.toLocaleString("es-VE")}</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 text-right">
                                        <span className="font-weight-bold">Pago total expresado: </span>
                                    </div>
                                    <div className="col-6 text-left">
                                        <span className="text-danger">{props.sale.paymentTotalBs.toLocaleString("es-VE")}</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 text-right">
                                        <span className="font-weight-bold">Diferencia: </span>
                                    </div>
                                    <div className="col-6 text-left">
                                        <span className={props.sale.debtTotal < 0 ? "text-success" : "text-danger"}>
                                            {props.sale.debtCurrency ? props.sale.debtCurrency === "USD" ? "$" : "Bs" : "Bs "}{" " + Math.abs(props.sale.debtTotal.toFixed(2)).toLocaleString("es-VE")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h4 className="col-12 mb-2">Productos</h4>
                        <ProductsTable
                            fontSize="small"
                            products={props.sale.products}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebtDetailsModal;
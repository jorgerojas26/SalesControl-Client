import React from "react";

import { formaPhonenumber } from "../../../helpers";

const DebtPaymentModal = (props) => {
    return (
        <div id="debtPaymentModal" className="modal" data-backdrop="static" data-keyboard="false" aria-labelledby="debtPaymentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="debtPaymentModalLabel">
                            Datos de pago
                        </h5>
                        <button onClick={() => { window.$("#debtPaymentModal").modal("hide"); }} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col">
                                <input type="text" id="clientName" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 pr-0">
                                <input className="form-control" type="text" name="ced" id="ced" placeholder="Cedula" value={(props.client) ? props.client.cedula.toLocaleString("es-VE") : ""} disabled />
                            </div>
                            <div className="col-6 pl-0">
                                <input className="form-control" type="tel" name="phone" id="phone" placeholder="Telefono" value={(props.client) ? formatPhoneNumber(props.client.phoneNumber) : ""} disabled />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col">
                                <span role="button" onClick={props.openPaymentMethodsModalHandler} className="btn-link"> Agregar método de pago </span>
                                {props.paymentInfo && props.paymentInfo.map(payment => {
                                    switch (payment.type.toLowerCase()) {
                                        case "pointofsale":
                                            return <PointOfSalePayment
                                                key={payment.id}
                                                id={payment.id}
                                                currency="Bs"
                                                defaultAmount={payment.amount || null}
                                                onRemove={props.removePaymentMethod}
                                                onPropertyChange={props.onPaymentPropertyChange}
                                                debtInfo={payment.debtInfo}
                                                loadNextTicketId={true}
                                            />;
                                            break;
                                        case "cash":
                                            return <CashPayment
                                                key={payment.id}
                                                id={payment.id}
                                                currency={payment.currency}
                                                defaultAmount={payment.amount || null}
                                                onRemove={props.removePaymentMethod}
                                                onPropertyChange={props.onPaymentPropertyChange}
                                                debtInfo={payment.debtInfo}
                                            />;
                                            break;
                                        case "banktransfer":
                                            return <BankTransferPayment
                                                key={payment.id}
                                                id={payment.id}
                                                currency="Bs"
                                                defaultAmount={payment.amount || null}
                                                onRemove={props.removePaymentMethod}
                                                onPropertyChange={props.onPaymentPropertyChange}
                                                debtInfo={payment.debtInfo}
                                            />;
                                            break;
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <hr className="col mt-0 mb-1" />
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-9 text-right pr-0">
                                <span className="font-weight-bold">Subtotal: </span>
                            </div>
                            <div className="col-3 text-center p-0">
                                <span className="text-danger">{props.invoiceTotalBs.toLocaleString("es-VE")}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-9 text-right pr-0">
                                <span className="font-weight-bold">Total: </span>
                            </div>
                            <div className="col-3 text-center p-0">
                                <span className="text-danger">{(props.invoiceTotalBs).toLocaleString("es-VE")}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-9 text-right pr-0">
                                <span className="font-weight-bold">Pago total expresado: </span>
                            </div>
                            <div className="col-3 text-center p-0">
                                <span className="text-danger">{props.expressedPaymentTotal.toLocaleString("es-VE")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer p-0 m-0 mt-1">
                        <div className="col-12 p-0 m-0">
                            {props.messageInfo.message &&
                                <div className={props.messageInfo.type == 'error' ? 'alert alert-danger' : 'alert alert-success'}>{props.messageInfo.message}</div>
                            }
                        </div>
                        <button onClick={() => { window.$("#invoiceModal").modal("hide"); }} type="button" className="btn btn-secondary" >
                            Cerrar
                        </button>
                        <button ref={props.saleSubmitButton} onClick={props.onSaleSubmitHandler} type="button" className="btn btn-primary">
                            Enviar
                        </button>
                    </div>
                </div>

            </div>
            <NewClientForm
                onSubmitHandler={props.onNewClientSubmitHandler}
                action="Add"
            />
            {props.showPaymentMethodsModal &&
                <PaymentMethodsModal
                    addPaymentMethod={props.addPaymentMethod}
                    closePaymentMethodsModal={props.closePaymentMethodsModal}
                />
            }
            {props.showDebtDetails &&
                <DebtDetailsModal
                    sale={props.debtInfo}
                    dolarReference={props.dolarReference}
                    freezePrices={false}
                />
            }
        </div >
    );
};

export default DebtPaymentModal;
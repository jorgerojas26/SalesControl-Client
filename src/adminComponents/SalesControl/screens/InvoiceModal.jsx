import React from "react";


import ClientSearch from "../../clients/containers/ClientSearchContainer";
import DebtTable from "../../debts/containers/DebtTableContainer";
import PointOfSalePayment from "../../payments/containers/PointOfSalePaymentContainer";
import CashPayment from "../../payments/containers/CashPaymentContainer";
import BankTransferPayment from "../../payments/components/containers/BankTransferPaymentContainer";
import PaymentMethodsModal from "../../payments/containers/PaymentMethodsModalContainer";
import DebtDetailsModal from "../../debts/components/DebtDetailsModal";
import NewClientForm from "../../clients/containers/NewClientFormContainer";

import { formatPhoneNumber } from "../../../helpers";

const InvoiceModal = (props) => {

    let clientCedula = props.client ? props.client.cedula : "";
    let clientPhoneNumber = props.client ? props.client.phoneNumber : "";
    return (
        <div id="invoiceModal" className="modal" data-backdrop="static" data-keyboard="false" aria-labelledby="invoiceModalLabel" aria-hidden="true" tabIndex="-1">
            <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="invoiceModalLabel">
                            Datos de la factura
                        </h5>
                        <button onClick={() => { window.$("#invoiceModal").modal("hide"); }} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-between mb-3">
                                    {props.action === "newSale" &&
                                        <ClientSearch
                                            onClientSelect={props.onClientSelect}
                                            value={props.client}
                                            dolarReference={props.dolarReference}
                                            openNewClientFormModal={props.openNewClientFormModal}
                                            onClientSearchInputChange={props.onClientSearchInputChange}
                                        />
                                    }
                                    {props.action === "payDebt" &&
                                        <input className="form-control text-center" type="text" value={props.client.name} disabled />
                                    }
                                    {props.action === "newSale" &&
                                        <button onClick={props.openNewClientFormModal} className="btn btn-secondary" type="button" id="newClientButton">
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                            </svg>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 pr-0">
                                <input className="form-control" type="text" name="ced" id="ced" placeholder="Cedula" value={clientCedula.toLocaleString("es-VE")} disabled />
                            </div>
                            <div className="col-6 pl-0">
                                <input className="form-control" type="text" name="phoneNumber" id="phoneNumber" placeholder="Telefono" value={formatPhoneNumber(clientPhoneNumber)} disabled />
                            </div>
                        </div>
                        <div className="row mt-2 border-bottom">
                            {(props.client && props.client.sales && props.client.sales.length > 0) &&
                                <DebtTable
                                    client={props.client}
                                    calculateSaleTotal={props.calculateSaleTotal}
                                    calculatePaymentsTotal={props.calculatePaymentsTotal}
                                    payIndividualDebtHandler={props.payIndividualDebtHandler}
                                    onDebtIdClick={props.onDebtIdClick}
                                    dolarReference={props.dolarReference}
                                    openPaymentMethodsModalHandler={props.openPaymentMethodsModalHandler}
                                />
                            }
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
                                <span className="text-danger">{Math.abs(props.invoiceTotal).toLocaleString("es-VE") + (props.invoiceCurrency === "USD" ? ` ${props.invoiceCurrency}` : "")}</span>
                            </div>
                        </div>
                        {props.debtTotalBs > 0 &&
                            <div className="row">
                                <div className="col-9 text-right pr-0">
                                    <span className="font-weight-bold">Deuda: </span>
                                </div>
                                <div className="col-3 text-center p-0">
                                    <span className="text-danger">{props.debtTotalBs.toLocaleString("es-VE")}</span>
                                </div>
                            </div>
                        }
                        <div className="row">
                            <div className="col-9 text-right pr-0">
                                <span className="font-weight-bold">Total: </span>
                            </div>
                            <div className="col-3 text-center p-0">
                                <span className="text-danger">{(Math.abs(props.invoiceTotal) + props.debtTotalBs).toLocaleString("es-VE") + (props.invoiceCurrency === "USD" ? ` ${props.invoiceCurrency}` : "")}</span>
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
                        <button ref={props.saleSubmitButton} onClick={props.action === "newSale" ? props.onSaleSubmitHandler : props.action === "payDebt" ? props.paymentSubmitHandler : () => { }} type="button" className="btn btn-primary">
                            Enviar
                        </button>
                    </div>
                </div>

            </div>
            {props.showNewClientFormModal &&
                < NewClientForm
                    onSubmitHandler={props.onNewClientSubmitHandler}
                    clientData={{ name: "", cedula: props.cedulaToBeCreated, phoneNumber: "" }}
                    action="Add"
                    closeNewClientFormModal={props.closeNewClientFormModal}
                />
            }
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

export default InvoiceModal;

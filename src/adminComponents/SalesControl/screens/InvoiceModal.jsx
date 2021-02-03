import React from "react"


import ClientSearch from "../containers/ClientSearchContainer"
import DebtTable from "../components/DebtTable"
import PaymentMethod from "../containers/PaymentMethodContainer"

const InvoiceModal = (props) => {
    return (
        <div id="invoiceModal" className="modal" tabIndex="-1" aria-labelledby="invoiceModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="invoiceModalLabel">
                            Datos de la factura
                        </h5>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-between mb-3">
                                    <ClientSearch
                                        onClientSelect={props.onClientSelect}
                                        value={props.client}
                                    />
                                    <button data-toggle="modal" data-target="#clientModal" className="btn btn-secondary" type="button" id="newClientButton">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 pr-0">
                                <input className="form-control" type="text" name="cedula" id="cedula" placeholder="Cedula" value={(props.client) ? props.client.cedula : ""} disabled />
                            </div>
                            <div className="col-6 pl-0">
                                <input className="form-control" type="tel" name="phone" id="phone" placeholder="Telefono" value={(props.client) ? props.client.phoneNumber : ""} disabled />
                            </div>
                        </div>
                        <div className="row mt-2 border-bottom">
                            {(props.client && props.client.sales.length > 0) &&
                                <DebtTable
                                    client={props.client}
                                    calculateSaleTotal={props.calculateSaleTotal}
                                    calculatePaymentsTotal={props.calculatePaymentsTotal}
                                />
                            }
                        </div>
                        <div className="row mt-2">
                            <div className="col">
                                <span onClick={props.onPaymentAdd} className="btn-link"> Agregar método de pago </span>
                                <PaymentMethod
                                    id="1"
                                    name="PointOfSale"
                                    currency="VES"
                                />
                                <PaymentMethod
                                    id="1"
                                    name="PointOfSale"
                                    currency="VES"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer p-0 m-0">
                        <div className="col-12">
                            <span className={props.messageInfo.type == 'error' ? 'text-danger' : 'text-success'}>{props.messageInfo.message}</span>
                        </div>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                        <button ref={props.saleSubmitButton} onClick={props.onSaleSubmit} type="button" className="btn btn-primary">
                            Enviar
                        </button>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default InvoiceModal;

import React from "react";

const PointOfSalePayment = (props) => {
    return (
        <div className="row my-2">
            {props.debtInfo &&
                <span className="text-success col-12">DEUDA (FACTURA {props.debtInfo.saleId})</span>
            }
            {!props.disabled &&
                <div className="col-1">
                    <button
                        onClick={props.disabled ? null : props.onRemove}
                        disabled={props.disabled}
                        className="btn btn-danger rounded-0">
                        -
                </button>
                </div>
            }
            <div className={props.disabled ? "col-10" : "col-9"}>
                <div className="input-group">
                    <button className="btn btn-dark rounded-0" disabled="disabled">
                        Punto de Venta
                    </button>
                    <input
                        onClick={event => event.target.select()}
                        onChange={props.disabled ? null : props.onAmountChange}
                        type="text"
                        value={props.amountValue}
                        placeholder="Ingrese el valor"
                        className="form-control text-right text-danger"
                        disabled={props.disabled}
                    />
                    <button className="btn btn-dark rounded-0" disabled="disabled">
                        {props.currency}
                    </button>
                </div>
            </div>
            <div className="col-2 pl-0">
                <input
                    onChange={props.disabled ? null : props.onTicketIdChange}
                    className="form-control"
                    type="text"
                    value={props.ticketIdValue}
                    placeholder="COD"
                    disabled={props.disabled}
                />
            </div>
        </div>
    );
};

export default PointOfSalePayment;

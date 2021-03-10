import React from "react";

const CashPayment = (props) => {
    return (
        <div className="row my-2">
            {props.debtInfo &&
                <span className="text-success col-12">DEUDA (FACTURA {props.debtInfo.saleId})</span>
            }
            <div className="col-1">
                {!props.disabled &&
                    <button
                        onClick={props.disabled ? null : props.onRemove}
                        className="btn btn-danger rounded-0"
                        disabled={props.disabled}
                    > - </button>
                }
            </div>
            <div className={props.currency === "Bs" ? "col-9" : "col-7 pr-0"}>
                <div className="input-group">
                    <button className="btn btn-dark rounded-0" disabled="disabled">
                        Efectivo
                    </button>
                    <input
                        onClick={function (event) {
                            event.target.select();
                        }}
                        onChange={props.disabled ? null : props.onAmountChange}
                        type="text"
                        className="form-control text-right text-danger"
                        placeholder="Ingrese el valor"
                        value={props.amountValue}
                        disabled={props.disabled}
                    />
                    <select
                        onChange={props.disabled ? null : props.onCurrencyChange}
                        defaultValue={props.currency}
                        disabled={props.disabled}
                        className="btn btn-dark p-0 rounded-0">
                        <option value="Bs">
                            Bs.
                        </option>
                        <option value="USD">$</option>
                    </select>
                </div>
            </div>
            <div className={props.currency === "Bs" ? "d-none" : "col-4 p-floating-container"}>
                <input
                    onChange={props.disabled ? null : props.onDolarReferenceChange}
                    className="form-control"
                    type="text"
                    value={props.dolarReferenceValue}
                    placeholder="Valor dolar"
                    disabled={props.disabled}
                />
                <label className="text-danger">{props.cashDollarToBs}</label>
            </div>
        </div>
    );
};

export default CashPayment;

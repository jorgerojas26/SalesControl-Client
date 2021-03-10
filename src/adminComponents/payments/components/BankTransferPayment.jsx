import React from "react";

const BankTransferPayment = (props) => {
    return (
        <div className="row my-2">
            {props.debtInfo &&
                <span className="text-success col-12">DEUDA (FACTURA {props.debtInfo.saleId})</span>
            }
            <div className="col-1">
                {!props.disabled &&
                    <button onClick={props.onRemove} className="btn btn-danger rounded-0"> - </button>
                }
            </div>
            <div className="col-9">
                <div className="input-group">
                    <button className="btn btn-dark rounded-0" disabled="disabled">
                        Transferencia
                    </button>
                    <input
                        onClick={function (event) {
                            event.target.select();
                        }}
                        onChange={props.onAmountChange}
                        type="text"
                        value={props.amountValue}
                        placeholder="Ingrese el valor"
                        className="form-control text-right text-danger"
                    />
                    <button className="btn btn-dark rounded-0" disabled="disabled">
                        {props.currency}
                    </button>
                </div>
            </div>
            <div className="col-2 pl-0 mb-2">
                <input
                    onChange={props.onReferenceCodeChange}
                    className="form-control"
                    type="text"
                    value={props.referenceCodeValue}
                    placeholder="COD"
                />
            </div>
            <div className="col-12">
                <select
                    onChange={props.onBankChange}
                    className="form-control btn btn-secondary rounded-0"
                >
                    {props.bankList &&
                        props.bankList.map(bankInfo => {
                            return (
                                <option key={bankInfo.id} value={bankInfo.id}>
                                    {bankInfo.bankName} | {bankInfo.ownerName}
                                </option>
                            );
                        })}
                </select>
            </div>
        </div>
    );
};

export default BankTransferPayment;

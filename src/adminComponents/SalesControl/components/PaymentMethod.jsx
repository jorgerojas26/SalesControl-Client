import React from "react"

const PaymentMethod = (props) => {
    return (
        <div key={props.id} className="row my-1">
            <div className="col-1">
                <button
                    onClick={props.onRemove}
                    className="btn btn-danger">
                    -
                </button>
            </div>
            <div className="col-9">
                <div className="input-group">
                    <button className="btn btn-dark" disabled="disabled">
                        {props.name}
                    </button>
                    <input
                        onClick={event => event.target.select()}
                        onChange={props.onAmountUpdate}
                        type="text"
                        className="form-control text-right text-danger"
                    />
                    <button className="btn btn-dark" disabled="disabled">
                        {props.currency}
                    </button>
                </div>
            </div>
            <div className="col-2 pl-0">
                <input
                    className="form-control"
                    type="text"
                    name="code"
                    id="code"
                    placeholder="N°"
                />
            </div>
        </div>
    );
}

export default PaymentMethod;

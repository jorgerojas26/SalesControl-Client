import React from 'react';

const PaymentMethodsModal = (props) => {
    return (
        <div ref={props.innerRef} id="paymentMethodsModal" className="modal" data-backdrop="static" data-keyboard="false" aria-hidden="true">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Métodos de pago</h5>
                        <button onClick={() => { window.$("#paymentMethodsModal").modal("hide"); }} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {props.paymentMethodList && props.paymentMethodList.map(paymentMethod => {
                            return <button
                                key={paymentMethod.id}
                                className="btn btn-secondary mx-2 my-2"
                                data-id={paymentMethod.id}
                                data-type={paymentMethod.type}
                                onClick={props.onClick}
                            >{paymentMethod.name}</button>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodsModal;
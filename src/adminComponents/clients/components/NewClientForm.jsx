import React from "react";

const NewClientForm = (props) => {
    return (
        <div id="newClientModal" className="modal" data-backdrop="static" data-keyboard="false" aria-hidden="true">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Registro de clientes</h5>
                        <button onClick={() => { window.$("#newClientModal").modal("hide"); }} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={props.submitHandler}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>* Nombre: </label>
                                <input ref={props.nameInputRef} onChange={props.onChangeHandler} value={props.clientData.name || ""} type="text" className="form-control text-capitalize" name="name" id="name" required />
                            </div>
                            <div className="form-group">
                                <label>* Cédula: </label>
                                <input onChange={props.onChangeHandler} value={props.clientData.cedula || ""} type="number" className="form-control" name="cedula" id="cedula" required />
                            </div>
                            <label htmlFor="debtTotal">Teléfono: </label>
                            <input onChange={props.onChangeHandler} value={props.clientData.phoneNumber || ""} type="number" className="form-control" name="phoneNumber" id="phoneNumber" />
                        </div>
                        {props.messageInfo.message &&
                            <div className={props.messageInfo.type == 'error' ? 'alert alert-danger' : 'alert alert-success'}>{props.messageInfo.message}</div>
                        }
                        <div className="modal-footer">
                            <button onClick={() => { window.$("#newClientModal").modal("hide"); }} type="button" className="btn btn-secondary" >Cerrar</button>
                            <button type="submit" className="btn btn-primary">
                                {props.submitting && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                                        Enviar</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default NewClientForm;

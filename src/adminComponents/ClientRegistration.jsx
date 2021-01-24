import React, {Component} from "react"
import clientRequests from "../requests/clients"
class ClientRegistration extends Component {

    constructor() {
        super()

        this.state = {
            name: null,
            cedula: null,
            phoneNumber: null,
            submitLoading: false,
            submitMessage: null,
            submitMessageType: null
        }

        this.submitHandler = this.submitHandler.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
    }

    changeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitHandler(event) {
        event.preventDefault();

        var response = null;

        this.setState({
            submitLoading: true
        }, async () => {
            if (this.props.action == "Add") {
                response = await this.props.insertHandler({
                    name: this.state.name,
                    cedula: this.state.cedula,
                    phoneNumber: this.state.phoneNumber
                })
            }
            else if (this.props.action == "Edit") {
                response = await this.props.updateHandler({
                    name: this.state.name,
                    cedula: this.state.cedula,
                    phoneNumber: this.state.phoneNumber
                });
            }
            if (response.error) {
                this.setState({
                    submitMessage: JSON.stringify(response.error),
                    submitMessageType: "error",
                    submitLoading: false
                })
            }
            else {
                this.setState({
                    submitMessage: "Se ha registrado con éxito",
                    submitMessageType: "success",
                    submitLoading: false
                })
                setTimeout(() => {
                    this.setState({
                        submitMessage: null,
                        submitMessageType: null
                    })
                }, 3000);
            }
        })
    }
    render() {
        return (
            <form onSubmit={this.submitHandler}>
                <div className="modal-body">
                    <div className="form-group">
                        <label>* Nombre: </label>
                        <input onChange={this.changeHandler} type="text" className="form-control" name="name" id="name" required />
                    </div>
                    <div className="form-group">
                        <label>* Cédula: </label>
                        <input onChange={this.changeHandler} type="text" className="form-control" name="cedula" id="cedula" required />
                    </div>
                    <label htmlFor="debtTotal">Teléfono: </label>
                    <input onChange={this.changeHandler} type="text" className="form-control" name="phoneNumber" id="phoneNumber" />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="submit" className="btn btn-primary">
                        {this.state.submitLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                                        Enviar</button>
                </div>
                {this.state.submitMessage && <span className={(this.state.submitMessageType == "error") ? "text-danger" : "text-success"}>{this.state.submitMessage}</span>}
            </form>

        )
    }
}

export default ClientRegistration

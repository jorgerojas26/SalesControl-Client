import React, { Component } from "react";

import NewClientForm from "../components/NewClientForm";
import clientsRequests from "../../../requests/clients";

import { showMessageInfo } from "../../../helpers";

class NewClientFormContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            submitting: false,
            clientData: props.clientData ? props.clientData : {
                name: null,
                cedula: null,
                phoneNumber: null
            }
        };

        this.nameInputRef = React.createRef();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    componentDidMount() {
        window.$("#newClientModal").on("shown.bs.modal", () => {
            setTimeout(() => {
                this.nameInputRef.current.focus();
            });
        });
        window.$("#newClientModal").on("hide.bs.modal", () => {
            this.props.closeNewClientFormModal();
        });
    }
    onChangeHandler(event) {
        let clientData = this.state.clientData;

        clientData[event.target.name] = event.target.value;
        this.setState({ clientData });
    }

    submitHandler(event) {
        event.preventDefault();
        var response = null;
        this.setState({
            submitting: true
        }, async () => {
            if (this.props.action == "Add") {
                response = await clientsRequests.create({
                    name: this.state.clientData.name,
                    cedula: this.state.clientData.cedula,
                    phoneNumber: this.state.clientData.phoneNumber
                });
            }
            else if (this.props.action == "Edit") {
                response = await clientsRequests.update({
                    name: this.state.clientData.name,
                    cedula: this.state.clientData.cedula,
                    phoneNumber: this.state.clientData.phoneNumber
                });
            }

            if (!response) {
                showMessageInfo(this, "error", "Response error");
                this.setState({
                    submitting: false
                });
                return;
            }
            if (response && response.error) {
                showMessageInfo(this, "error", response.error);
                this.setState({
                    submitting: false
                });
                return;
            }
            this.setState({
                submitting: false
            }, () => {
                showMessageInfo(this, "success", "El client se ha registrado de forma exitosa");
                if (this.props.onSubmitHandler) this.props.onSubmitHandler(response);
            });
        });
    }

    render() {
        return (
            <NewClientForm
                submitting={this.state.submitting}
                messageInfo={this.state.messageInfo}
                onChangeHandler={this.onChangeHandler}
                clientData={this.state.clientData}
                submitHandler={this.submitHandler}
                nameInputRef={this.nameInputRef}
            />
        );
    }
}

export default NewClientFormContainer;

import React, {Component} from "react"

import ClientSearch from "../components/ClientSearch"

import clientRequests from "../../../requests/clients"

import {numberWithCommas} from "../../../helpers"

class ClientSearchContainer extends Component {
    constructor() {
        super();

        this.clientSelectRef = React.createRef();

        this.onClientSelect = this.onClientSelect.bind(this);
    }


    componentDidMount() {
        setTimeout(() => {
            this.clientSelectRef.current.focus();
        })
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.clientSelectRef.current.focus();

        })
    }

    async onSearchHandler(name) {
        let results = await clientRequests.fetchByNameOrCedulaWithDebts(name);
        if (results.data.length > 0) {
            results.data.forEach(client => {
                client.label = (
                    <div className="row mx-auto">
                        <span className="mx-auto">
                            <span className="">{client.name}</span>
                        </span>
                        <span className="mr-5">{numberWithCommas(client.cedula, '.')}</span>
                    </div>
                );
            });
        }
        return results.data;

    }

    onClientSelect(selectedClient, action) {
        this.props.onClientSelect(selectedClient, action);
    }

    render() {
        return (
            <ClientSearch
                value={this.props.value}
                onSearch={this.onSearchHandler}
                onClientSelect={this.onClientSelect}
                clientSelectRef={this.clientSelectRef}
            />
        )
    }
}

export default ClientSearchContainer;

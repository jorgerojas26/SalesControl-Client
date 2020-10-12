import React, { Component } from "react";

import ResourceTable from "./ResourceTable";

class Inventory extends Component {


    componentDidMount() {

    }
    render() {
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Ventas</h1>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <ResourceTable asyncTable={true} sourceURL={"/api/inventory"} columns={[
                            { title: "Product ID", data: "id" },
                            { title: "Nombre Producto", data: "name" },
                            {
                                title: "Inventario", data: "stock", render: function (data, type, row) {
                                    if (data <= 0) {
                                        return `<span class="text-danger">${data}</span>`
                                    }
                                    return `<span class="text-success">${data}</span>`
                                }
                            },
                            { title: "Total productos vendidos", data: "salesTotal" },
                            { title: "Total productos comprados", data: "supplyingsTotal" }
                        ]} actions={[]} />
                    </div>
                </div>
            </div >
        )
    }
}

export default Inventory;
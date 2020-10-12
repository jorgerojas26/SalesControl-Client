import React, { Component } from "react";

import moment from "moment";
import ResourceTable from "./ResourceTable";
class Sales extends Component {
    constructor() {
        super()
        this.submitHandler = this.submitHandler.bind(this);
    }

    submitHandler(event) {
        event.preventDefault()
        console.log("hola");
    }

    childFormat(d) {
        let childRowInfo = "";
        d.saleProducts.forEach(saleProduct => {
            childRowInfo += `
            <div class='form-row align-items-center'>
                    <div class="col-1">
                        <label for="productId">Product ID</label>
                        <input class="form-control" id="productId" value="${saleProduct.productId}" disabled/>
                    </div>
                    <div class="col-4">
                        <label for="productName">Name</label>
                        <input class="form-control" id="productName" value="${saleProduct.product[0].name}" disabled/>
                    </div>
                    <div class="col-1">
                        <label for="productPrice">Price</label>
                        <input class="form-control" id="productPrice" value="$${saleProduct.price}" disabled/>
                    </div>
                    <div class="col-1">
                        <label for="discount">Discount</label>
                        <input class="form-control" id="discount" value="${saleProduct.discount}%" disabled/>
                    </div>
                    <div class="col-1">
                        <label for="productQuantity">Quantity</label>
                        <input class="form-control" id="productQuantity" value="${saleProduct.quantity}" disabled/>
                    </div>
                    <div class="col-2">
                        <label for="dolarValue">Dolar value</label>
                        <input class="form-control" id="dolarValue" value="${Intl.NumberFormat("es-VE", { style: "currency", currency: "VES" }).format(saleProduct.dolarReference)}" disabled/>
                    </div>
            </div>
            `
        })
        childRowInfo += ""
        return childRowInfo

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
                        <ResourceTable asyncTable={true} childFormat={this.childFormat} sourceURL={"/api/sales"} columns={[
                            { title: "ID", data: "id" },
                            {
                                "title": "Productos",
                                "className": 'details-control',
                                "orderable": false,
                                "data": null,
                                "defaultContent": '<button class="btn btn-success">Ver Productos</button>'
                            },
                            {
                                render: function (data, type, row, meta) {
                                    return moment.utc(row.createdAt).format("DD/MM/YYYY");
                                }, title: "Fecha creación", data: "sales.createdAt", type: "date"
                            },
                            {
                                render: function (data, type, row, meta) {
                                    return moment.utc(row.updatedAt).format("DD/MM/YYYY");
                                }, title: "Fecha actualización", data: "sales.updatedAt", type: "date"
                            },
                        ]} actions={["edit", "delete", "date-range"]} />
                    </div>
                </div>
            </div >
        )
    }
}

export default Sales;
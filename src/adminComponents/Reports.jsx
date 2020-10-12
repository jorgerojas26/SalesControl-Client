import React, { Component } from "react"
import ResourceTable from "./ResourceTable";

const moment = require("moment");

const $ = require("jquery");
const DataTable = require("datatables.net");

class Reports extends Component {

    constructor() {
        super();

        this.state = {
            resource: "sales",
            parameters: ""
        }

        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);

        this.reportForm = React.createRef();
        this.resourceTable = React.createRef();
    }

    changeHandler(event) {
        let dateRangeFromValue = document.body.querySelector("#rangeDateFrom").value;
        let dateRangeToValue = document.body.querySelector("#rangeDateTo").value;
        let greaterThanDate = document.body.querySelector("#greaterThanDate").value;
        let lowerThanDate = document.body.querySelector("#lowerThanDate").value;
        let equalDate = document.body.querySelector("#equalDate").value;

        var previousParameters = this.state.parameters;
        var parameters = "";
        if (event.target.name == "dateRadios") {
            $("form").find("input[type=date]").val("");
            switch (event.target.id) {
                case "today":
                    parameters = `from=${moment(new Date()).format("YYYY-MM-DD")}&to=${moment(new Date()).format("YYYY-MM-DD")}`
                    break;
                case "yesterday":
                    parameters = `from=${moment(new Date()).subtract(1, "days").format("YYYY-MM-DD")}&to=${moment(new Date()).subtract(1, "days").format("YYYY-MM-DD")}`
                    break;
                case "lastWeek":
                    parameters = `from=${moment(new Date()).subtract(7, "days").format("YYYY-MM-DD")}&to=${moment(new Date()).format("YYYY-MM-DD")}`
                    break;
                case "fortnight":
                    parameters = `from=${moment(new Date()).subtract(15, "days").format("YYYY-MM-DD")}&to=${moment(new Date()).format("YYYY-MM-DD")}`
                    break;
                case "month":
                    parameters = `from=${moment(new Date()).subtract(1, "months").format("YYYY-MM-DD")}&to=${moment(new Date()).format("YYYY-MM-DD")}`
                    break;
                case "quarter":
                    parameters = `from=${moment(new Date()).subtract(3, "months").format("YYYY-MM-DD")}&to=${moment(new Date()).format("YYYY-MM-DD")}`
                    break;
                case "semester":
                    parameters = `from=${moment(new Date()).subtract(6, "months").format("YYYY-MM-DD")}&to=${moment(new Date()).format("YYYY-MM-DD")}`
                    break;
                default:
                    break;
            }
            parameters += "&group=true"
        }
        else if (event.target.name == "reportType") {
            this.setState({
                resource: event.target.id,
                parameters: ""
            }, function () {
                this.setState({
                    parameters: previousParameters
                })
            });
            return;
        }
        else {
            $("form").find("input[name=dateRadios]").prop("checked", false);
            $("form").find("input[type=date]").val("");
            switch (event.target.id) {
                case "greaterThanDate":
                    parameters = `createdAt=${greaterThanDate}&operation=gte`
                    event.target.value = greaterThanDate;
                    break;
                case "lowerThanDate":
                    parameters = `createdAt=${lowerThanDate}&operation=lte`
                    event.target.value = lowerThanDate;
                    break;
                case "equalDate":
                    parameters = `createdAt=${equalDate}&operation=eq`
                    event.target.value = equalDate;
                    break;
                case "rangeDateFrom":
                    if (dateRangeToValue) {
                        parameters = `from=${moment(dateRangeFromValue || "").format("YYYY-MM-DD")}&to=${dateRangeToValue}`
                    }
                    else {
                        parameters = `from=${moment(dateRangeFromValue || "").format("YYYY-MM-DD")}`
                    }
                    event.target.value = dateRangeFromValue;
                    $("#rangeDateTo").val(dateRangeToValue);
                    break;
                case "rangeDateTo":
                    if (dateRangeFromValue) {
                        parameters = `from=${dateRangeFromValue}&to=${moment(dateRangeToValue || "").format("YYYY-MM-DD")}`
                    }
                    else {
                        parameters = `to=${moment(dateRangeToValue || "").format("YYYY-MM-DD")}`
                    }
                    event.target.value = dateRangeToValue;
                    $("#rangeDateFrom").val(dateRangeFromValue);
                    break;
                default:
                    break;
            }
            parameters += "&group=true"
        }
        this.setState({
            parameters
        });
    }
    componentDidUpdate() {
        if (this.resourceTable.current) {
            this.resourceTable.current.changeSourceURL(`/api/${this.state.resource}?${this.state.parameters}`);
        }
    }
    submitHandler(event) {
        event.preventDefault();
        console.log(this.state.parameters);
        this.reportForm.current.reset();
    }
    render() {
        var salesColumns = [
            {
                render: function (data, type, row, meta) {
                    return `<img src="${row.product.imagePath}" style="max-width:35px;"/>`
                },
                title: "Imagen", data: "product.imagePath"
            },
            { title: "Product ID", data: "product.id" },
            { title: "Nombre", data: "product.name" },
            { title: "Transacciones", data: "transactions" },
            { title: "Cantidad de productos", data: "salesTotal" },
            {
                render: function (data, type, row, meta) {
                    return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.grossTotalDollars)
                }, title: (this.state.resource == "sales") ? "Ganancia bruta $" : "Costo bruto $", data: "grossTotalDollars"
            },
            {
                render: function (data, type, row, meta) {
                    return Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(row.grossTotalBs)
                }, title: (this.state.resource == "sales") ? "Ganancia bruta Bs" : "Costo bruto Bs", data: "grossTotalBs"
            },
            {
                render: function (data, type, row, meta) {
                    return Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(row.netIncomeDollars)
                }, title: (this.state.resource == "sales") ? "Ganancia Neta $" : "Ganancia neta $", data: "netIncomeDollars"
            },
            {
                render: function (data, type, row, meta) {
                    return Intl.NumberFormat('es-VE', {
                        style: 'currency',
                        currency: 'VES',
                    }).format(row.netIncomeBs)
                }, title: (this.state.resource == "sales") ? "Ganancia Neta Bs" : "Ganancia Neta Bs", data: "netIncomeBs"
            }
        ];

        var supplyingsColumns = [
            {
                render: function (data, type, row, meta) {
                    return `<img src="${row.product.imagePath}" style="max-width:35px;"/>`
                },
                title: "Imagen", data: "product.imagePath"
            },
            { title: "Product ID", data: "product.id" },
            { title: "Nombre", data: "product.name" },
            { title: "Transacciones", data: "transactions" },
            { title: "Cantidad de productos", data: "quantity" },
            {
                render: function (data, type, row, meta) {
                    return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.grossTotalDollars)
                }, title: (this.state.resource == "sales") ? "Ganancia bruta $" : "Costo bruto $", data: "grossTotalDollars"
            },
            {
                render: function (data, type, row, meta) {
                    return Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(row.grossTotalBs)
                }, title: (this.state.resource == "sales") ? "Ganancia bruta Bs" : "Costo bruto Bs", data: "grossTotalBs"
            }
        ];

        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-danger float-left">Reportes</h1>
                    </div>
                </div>
                <hr />
                <form ref={this.reportForm} onSubmit={this.submitHandler}>
                    <div className="col-12">
                        <div className="form-check form-check-inline">
                            <h3 className="mr-4">Tipo de reporte:</h3>
                        </div>
                        <div className="form-check form-check-inline">
                            <input onChange={this.changeHandler} className="form-check-input" type="radio" name="reportType" id="supplyings" value="supplyingRadio" />
                            <label className="form-check-label" htmlFor="supplyingRadio">Compra</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input onChange={this.changeHandler} className="form-check-input" type="radio" name="reportType" id="sales" value="saleRadio" defaultChecked />
                            <label className="form-check-label" htmlFor="saleRadio">Venta</label>
                        </div>
                    </div>
                    <hr className="col-12 p-0" />
                    <div className="row">
                        <div className="col-12 col-lg-2">
                            <h5 className="mr-4">Rango de fechas:</h5>
                            <div className="form-group">
                                <input onChange={this.changeHandler} type="date" name="rangeDateFrom" id="rangeDateFrom" />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changeHandler} type="date" name="rangeDateTo" id="rangeDateTo" />
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="form-check form-check-inline">
                                <label className="btn btn-secondary" htmlFor="semester" name="labelDateRadios">
                                    <input onChange={this.changeHandler} className="form-check-input" type="radio" name="dateRadios" id="semester" />
                                    6 meses
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="btn btn-secondary" htmlFor="quarter" name="labelDateRadios">
                                    <input onChange={this.changeHandler} className="form-check-input" type="radio" name="dateRadios" id="quarter" />
                                3 meses
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="btn btn-secondary" htmlFor="month" name="labelDateRadios">
                                    <input onChange={this.changeHandler} className="form-check-input" type="radio" name="dateRadios" id="month" />
                                1 mes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="btn btn-secondary" htmlFor="fortnight" name="labelDateRadios">
                                    <input onChange={this.changeHandler} className="form-check-input" type="radio" name="dateRadios" id="fortnight" />
                                15 días
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="btn btn-secondary" htmlFor="lastWeek" name="labelDateRadios">
                                    <input onChange={this.changeHandler} className="form-check-input" type="radio" name="dateRadios" id="lastWeek" />
                                Útima semana
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="btn btn-secondary" htmlFor="yesterday" name="labelDateRadios">
                                    <input onChange={this.changeHandler} className="form-check-input" type="radio" name="dateRadios" id="yesterday" />
                                Ayer
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="btn btn-secondary" htmlFor="today" name="labelDateRadios">
                                    <input onChange={this.changeHandler} className="form-check-input" type="radio" name="dateRadios" id="today" />
                                Hoy
                                </label>
                            </div>
                        </div>
                        <div className="col-12 col-lg-2">
                            <div className="">
                                <h5 className="">Fecha mayor o igual a:</h5>
                                <input onChange={this.changeHandler} type="date" name="greaterThanDate" id="greaterThanDate" />
                            </div>

                        </div>
                        <div className="col-12 col-lg-2">
                            <div className="">
                                <h5 className="">Fecha menor o igual a:</h5>
                                <input onChange={this.changeHandler} type="date" name="lowerThanDate" id="lowerThanDate" />
                            </div>

                        </div>
                        <div className="col-12 col-lg-2">
                            <div className="">
                                <h5 className="">Fecha igual a:</h5>
                                <input onChange={this.changeHandler} type="date" name="equalDate" id="equalDate" />
                            </div>
                        </div>
                    </div>

                    <hr />
                </form>

                <div className="row mt-3">
                    <div className="col-md-12">
                        {this.state.parameters != "" && <ResourceTable ref={this.resourceTable} asyncTable={true} sourceURL={`/api/${this.state.resource}?${this.state.parameters}`} columns={
                            (this.state.resource == "sales") ? salesColumns : supplyingsColumns
                        } actions={[]} dolarReference={this.props.dolarReference} />}
                    </div>
                </div>
            </div >
        )
    }
}

export default Reports;
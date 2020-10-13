import React, { Component } from "react";
import debounce from "lodash.debounce";


const $ = require('jquery');
const DataTable = require('datatables.net');
const jsZip = require('jszip');
require('pdfmake');
require('datatables.net-buttons-dt');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.print.js');
require('datatables.net-select-dt');
window.JSZip = jsZip;

class ResourceTable extends Component {

    constructor(props) {
        super();

        this.recordsTable = React.createRef();
        this.modal = React.createRef();

        this.state = {
            selectedRowData: null,
            sourceURL: props.sourceURL
        }

    }

    changeSourceURL(newSourceURL) {
        let recordsTable = this.recordsTable.current;
        let $recordsTable = $(recordsTable);

        $recordsTable.DataTable().ajax.url(newSourceURL).load();
    }

    componentDidMount() {
        let recordsTable = this.recordsTable.current;
        let $recordsTable = $(recordsTable);
        var _this = this;
        if (this.props.asyncTable) {
            $recordsTable = $recordsTable.DataTable({
                initComplete: function () {
                    this.api().columns().every(function () {
                        var column = this;
                        if (column.dataSrc() == "createdAt" || column.dataSrc() == "updatedAt") {
                            $(this.header()).append("<br><input class='p-0 m-0 h-100' type='date' />");
                        }
                        else {
                            $(this.header()).append("<br><input class='p-0 m-0 h-100' type='text' placeholder='Filtrar'/>");
                        }
                        $('input', this.header()).on("keyup change", function () {
                            let splittedDataSrc = column.dataSrc().split(".");
                            let parameter = "";
                            splittedDataSrc.forEach((split, index) => {
                                if (index == 0) {
                                    parameter = splittedDataSrc[0];
                                }
                                else {
                                    parameter += splittedDataSrc[index].charAt(0).toUpperCase() + splittedDataSrc[index].slice(1);
                                }
                            });
                            $recordsTable.ajax.url(`${_this.state.sourceURL}?${parameter}=${this.value.trim()}`).load();
                        });

                    });
                },
                footerCallback: function (row, data) {
                    var api = this.api();
                    api.columns().every(function () {
                        var column = this;
                        if (column.dataSrc() == "grossTotalDollars") {
                            let totalDollars = api
                                .column(5)
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);
                            let pageTotalDollars = api
                                .column(5, { page: 'current' })
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);

                            if (totalDollars) {
                                $(column.footer()).html(
                                    `${Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pageTotalDollars)} <br>
                                            <span class="text-danger">(${Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDollars)} Total)</span>`
                                );
                            }
                            else {
                                $(column.footer()).html("");
                            }

                        }
                        if (column.dataSrc() == "grossTotalBs") {
                            let totalBs = api
                                .column(6)
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);

                            let pageTotalBs = api
                                .column(6, { page: 'current' })
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);
                            if (pageTotalBs) {
                                $(column.footer()).html(
                                    `${Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(pageTotalBs)} <br>
                                        <span class="text-danger">(${Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(totalBs)} Total)</span>`
                                );
                            } else {
                                $(column.footer()).html("");
                            }
                        }
                        if (column.dataSrc() == "netIncomeDollars") {
                            let totalDollars = api
                                .column(7)
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);

                            let pageTotalDollars = api
                                .column(7, { page: 'current' })
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);
                            if (pageTotalDollars) {
                                $(column.footer()).html(
                                    `${Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(pageTotalDollars)} <br>
                                        <span class="text-danger">(${Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(totalDollars)} Total)</span>`
                                );
                            } else {
                                $(column.footer()).html("");
                            }
                        }
                        if (column.dataSrc() == "netIncomeBs") {
                            let totalBs = api
                                .column(8)
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);

                            let pageTotalBs = api
                                .column(8, { page: 'current' })
                                .data()
                                .reduce(function (a, b) {
                                    return a + b
                                }, 0);
                            if (pageTotalBs) {
                                $(column.footer()).html(
                                    `${Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(pageTotalBs)} <br>
                                        <span class="text-danger">(${Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(totalBs)} Total)</span>`
                                );
                            } else {
                                $(column.footer()).html("");
                            }
                        }
                    })
                },
                dom: 'Brtip',
                select: "single",
                buttons: [{
                    text: "Imprimir",
                    name: "imprimir",
                    className: "btn btn-secondary float-right",
                    extend: "print",
                    messageTop: "Reporte",
                    footer: true,
                    exportOptions: {
                        modifier: {
                            page: 'all'
                        }
                    }
                }].concat(this.props.actions.map(action => {
                    if (action == "add") {
                        return {
                            text: 'Add',
                            name: 'add',
                            className: "btn btn-success",
                            attr: {
                                "data-toggle": "modal",
                                "data-target": "#exampleModal"
                            },
                            action: function () {
                                _this.props.setModalAction("add")
                            }
                        }
                    }
                    if (action == "edit") {
                        return {
                            text: 'Edit',
                            name: 'edit',
                            className: "btn btn-secondary",
                            extend: "selected",
                            attr: {
                                "data-toggle": "modal",
                                "data-target": "#exampleModal"
                            },
                            action: (e, datatable, node, config) => {
                                var selectedRowData = datatable.row({ selected: true }).data();
                                _this.props.setSelectedRowData(selectedRowData);
                                _this.props.setModalAction("edit");
                            }
                        };
                    }
                    if (action == "delete") {
                        return {
                            text: 'Delete',
                            name: 'delete',
                            className: "btn btn-danger",
                            extend: "selected",
                            action: function (e, datatable, node, config) {
                                var selectedRowData = datatable.row({ selected: true }).data();
                                fetch(`${_this.props.sourceURL}/${selectedRowData.id}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                                    }
                                })
                                    .then(res => {
                                        console.log(res);
                                        if (res.status == 204) {
                                            datatable.ajax.reload();
                                        }
                                        else {
                                            res.json().then(error => {
                                                _this.setState({
                                                    error
                                                })
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        _this.setState({
                                            error
                                        })
                                    })
                            }
                        }
                    }
                    if (action == "date-range") {
                        return {
                            text: 'Reload',
                            name: 'reload',
                            className: "btn btn-primary",
                            action: function (e, datatable, node, config) {
                                datatable.ajax.url(_this.state.sourceURL).load();
                            }
                        }
                    }
                    if (action == "discount") {
                        return [
                            {
                                text: 'Apply Discount',
                                name: 'discountButton',
                                className: "btn btn-primary",
                                attr: {
                                    "data-toggle": "modal",
                                    "data-target": "#discountModal"
                                },
                                extend: "selected",
                                action: function (e, datatable, node, config) {
                                    var selectedRowData = datatable.row({ selected: true }).data();
                                    _this.props.setSelectedRowData(selectedRowData);
                                    _this.props.setModalAction("applyDiscount")

                                }

                            },
                            {
                                text: 'Cancel Discount',
                                name: 'cancelDiscountButton',
                                className: "btn btn-danger",
                                extend: "selected",
                                action: function (e, datatable, node, config) {
                                    let response = window.confirm("¿Seguro que desea eliminar el descuento?");
                                    if (response == true) {
                                        let selectedRowData = datatable.row({ selected: true }).data();
                                        let discountId = selectedRowData.discount[0].id;
                                        fetch(`/api/discounts/${discountId}`, {
                                            headers: {
                                                "Authorization": "Bearer " + localStorage.getItem("jwt")
                                            },
                                            method: "DELETE"
                                        })
                                            .then(res => {
                                                if (res.status == 204) {
                                                    datatable.ajax.reload();
                                                }
                                            })
                                    }
                                    else {

                                    }
                                }
                            }

                        ]
                    }

                })),
                //serverSide: true,
                ajax: {
                    url: this.state.sourceURL,
                    dataSrc: function (results) {
                        if (typeof results.count == "object") {
                            results.data.forEach((row, index) => {
                                if (row.productId == results.count[index].id) {
                                    row.count = results.count[index].count
                                }
                            })
                        }

                        if (_this.props.sourceURL.includes("/api/sales") && _this.props.sourceURL.includes("group=true")) {
                            results.data.forEach((row, index) => {
                                row.product = row.product[0];
                                row.transactions = results.count[index].count;
                                row.grossTotalBs = row.grossTotalDollars * row.dolarReference;

                                row.netIncomeDollars = row.grossTotalDollars * (row.product.profitPercent / 100);
                                row.netIncomeBs = row.netIncomeDollars * row.dolarReference;
                            })
                        }
                        else if (_this.props.sourceURL.includes("/api/supplyings")) {
                            results.data.forEach(row => {
                                row.transactions = row.count;
                                row.grossTotalBs = row.grossTotalDollars * row.dolarReference;
                            })
                        }
                        return results.data;
                    },
                    headers: { 'Authorization': `Bearer ${localStorage.getItem("jwt")}` },
                    data: function (d) {
                        d.page = d.start / d.length + 1;
                        d.limit = d.length;
                    },
                    error: function (xhr, error, code) {
                        //alert(code)
                    }
                },
                paging: true,
                pageLength: 10,
                columns: this.props.columns,
                ordering: false
            });

            if (this.props.actions.includes("date-range")) {
                $(".dt-buttons").append(`<div class="d-flex justify-content-end">
                    <label class="mr-2" for="dateFrom">From:</label>
                    <input type="date" id="dateFrom" name="dateFrom">
                    <label class="mr-2 ml-2" for="dateTo">To:</label>
                    <input type="date" id="dateTo" name="dateTo">
                    </div>`)

                $(".dt-buttons input[type=date]").on("change", function () {
                    $recordsTable.ajax.url(`${_this.state.sourceURL}?from=${$("#dateFrom").val()}&to=${$("#dateTo").val()}`).load();
                })
            }

            $('#resourceTable tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = $recordsTable.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    console.log(_this.props.childFormat(row.data()));
                    row.child(_this.props.childFormat(row.data())).show();
                    tr.addClass('shown');
                }
            });
        }
        else {
            $recordsTable = $recordsTable.DataTable({
                dom: "",
                data: this.props.data,
                columns: this.props.columns
            });
        }



        this.modal.current.addEventListener("focus", () => {
            this.modal.current.querySelector(".form-group").children[0].focus();
        });
    }

    render() {
        return (
            <div className="bg-light table-responsive">
                <table id="resourceTable" className="table table-bordered" ref={this.recordsTable} >
                    <thead></thead>
                    <tbody></tbody>
                    <tfoot>
                        <tr>
                            {this.props.columns.map((column, index) => {
                                return <td key={index}></td>
                            })}
                        </tr>
                    </tfoot>
                </table>
                {this.state.error && <span className="text-danger">{this.state.error}</span>}
                <div ref={this.modal} className="modal" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            {this.props.modalStructure}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResourceTable;
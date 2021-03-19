import React from 'react';

import DebtDetailsModal from '../../debts/components/DebtDetailsModal';


const Reports = (props) => {
    return (
        <div id="reportContainer" className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-danger float-left">Reportes</h1>
                    <button onClick={props.sendToDiscord} type="submit" className="btn btn-dark float-right" disabled={props.salesInfo == null}>
                        {props.sendingToDiscord && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                                        Enviar a Discord</button>
                </div>
            </div>
            <div className="row mb-2 mt-0">
                <div className="col-12">
                    {props.messageInfo.message &&
                        <div className={props.messageInfo.type == 'error' ? 'alert alert-danger' : 'alert alert-success'}>{props.messageInfo.message}</div>
                    }
                </div>
            </div>
            <div className="row h-lg-75">
                <div className="col-12 col-xl-3 text-center border-right border-top">
                    <fieldset className="d-flex justify-content-center">
                        <legend className="w-auto">Período a consultar</legend>

                        <div className="w-lg-50">
                            <label className="float-left">Desde</label>
                            <input onChange={props.onChangeHandler} className="form-control mb-2  bg-transparent" type="date" value={props.startDate} id="startDateInput" />
                            <label className="float-left">Hasta</label>
                            <input onChange={props.onChangeHandler} className="form-control mb-2  bg-transparent" type="date" value={props.endDate} id="endDateInput" />
                        </div>

                    </fieldset>
                    <div className="d-flex justify-content-center">
                        <div className="form-check form-check-inline">
                            <input onClick={props.onClickHandler} className="form-check-input" type="radio" name="dateRadios" id="todayRadio" defaultChecked />
                            <label className="form-check-label" htmlFor="todayRadio">Hoy</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input onClick={props.onClickHandler} className="form-check-input" type="radio" name="dateRadios" id="yesterdayRadio" />
                            <label className="form-check-label" htmlFor="yesterdayRadio">Ayer</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input onClick={props.onClickHandler} className="form-check-input" type="radio" name="dateRadios" id="weekRadio" />
                            <label className="form-check-label" htmlFor="weekRadio">1 Semana</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input onClick={props.onClickHandler} className="form-check-input" type="radio" name="dateRadios" id="fortnightRadio" />
                            <label className="form-check-label" htmlFor="fortnightRadio">15 Días</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input onClick={props.onClickHandler} className="form-check-input" type="radio" name="dateRadios" id="monthRadio" />
                            <label className="form-check-label" htmlFor="monthRadio">1 Mes</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                        <div className="w-25">
                            <button onClick={props.submitQuery} type="submit" className="btn btn-primary">
                                {props.submitLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                                        Consultar</button>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-9 mt-3 mt-xl-0 p-0 border-left border-top">
                    <input onChange={(event) => {
                        var input, filter, table, tr, td, i, txtValue;
                        input = event.target;
                        filter = input.value.toUpperCase();
                        table = document.getElementById("salesReportTable");
                        tr = table.getElementsByTagName("tr");

                        // Loop through all table rows, and hide those who don't match the search query
                        for (i = 0; i < tr.length; i++) {
                            td = tr[i].getElementsByTagName("td")[1];
                            if (td) {
                                txtValue = td.textContent || td.innerText;
                                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                    tr[i].style.display = "";
                                } else {
                                    tr[i].style.display = "none";
                                }
                            }
                        }
                    }} type="search" className="form-control bg-transparent font-weight-bold" placeholder="Buscar" />
                    <div className="overflow-auto sticky-footer" style={{ maxHeight: "45vh" }}>
                        <table id="salesReportTable" className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Vendidos</th>
                                    <th>Bruto $</th>
                                    <th>Neto $</th>
                                    <th>Bruto Bs</th>
                                    <th>Neto Bs</th>
                                </tr>
                                <tr>

                                </tr>
                            </thead>
                            <tbody className="h6">
                                {props.salesInfo && props.salesInfo.map(row => {
                                    return (
                                        <tr key={row.productId}>
                                            <td>{row.productId}</td>
                                            <td>{row.productName}</td>
                                            <td>{row.soldQuantity % 1 != 0 ? row.soldQuantity.toFixed(3) : row.soldQuantity}</td>
                                            <td>{row.grossIncome.toFixed(2).toLocaleString("es-VE")}</td>
                                            <td>{row.netIncome.toFixed(2).toLocaleString("es-VE")}</td>
                                            <td>{row.grossIncomeBs.toLocaleString("es-VE")}</td>
                                            <td>{row.netIncomeBs.toLocaleString("es-VE")}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {(props.grossIncomeTotal && props.netIncomeTotal && props.grossIncomeTotalBs && props.netIncomeTotalBs) &&
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th>Totales:</th>
                                        <th>{props.grossIncomeTotal.toFixed(2).toLocaleString("es-VE")}</th>
                                        <th>{props.netIncomeTotal.toFixed(2).toLocaleString("es-VE")}</th>
                                        <th>{props.grossIncomeTotalBs.toLocaleString("es-VE")}</th>
                                        <th>{props.netIncomeTotalBs.toLocaleString("es-VE")}</th>
                                    </tr>
                                </tfoot>
                            }
                        </table>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xl-9 offset-xl-3 mt-3 border">
                    <div className="row">
                        <div className="col-6">
                            {props.paymentInfo &&
                                <div className="mt-2">
                                    <h4 className="text-danger">Reporte de pagos</h4>
                                    <table id="paymentsReportTable" className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Método de pago</th>
                                                <th>Moneda</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody className="h6" >
                                            {props.paymentInfo.map(payment => {
                                                if (payment.paymentMethodName.toLowerCase().includes("cash")) {
                                                    return (
                                                        <tr key={new Date().getTime() + Math.random()}>
                                                            <td>EFECTIVO</td>
                                                            <td>{payment.currency}</td>
                                                            <td>{payment.amount.toLocaleString("es-VE")}</td>
                                                        </tr>
                                                    );
                                                }
                                                else if (payment.paymentMethodName.toLowerCase().includes("point of sale")) {
                                                    return (
                                                        <tr key={new Date().getTime() + Math.random()}>
                                                            <td>PUNTO DE VENTA</td>
                                                            <td>{payment.currency}</td>
                                                            <td>{payment.amount.toLocaleString("es-VE")}</td>
                                                        </tr>
                                                    );
                                                }
                                                else if (payment.paymentMethodName.toLowerCase().includes("bank transfer")) {
                                                    return (
                                                        <tr key={new Date().getTime() + Math.random()}>
                                                            <td>TRANSFERENCIA BANCARIA</td>
                                                            <td>{payment.currency}</td>
                                                            <td>{payment.amount.toLocaleString("es-VE")}</td>
                                                        </tr>
                                                    );

                                                }
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                        <div className="col-6">
                            {props.debtInfo &&
                                <div className="mt-2">
                                    <h4 className="text-danger">Reporte de deudas</h4>
                                    <table id="debtsReportTable" className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID Venta</th>
                                                <th>Nombre</th>
                                                <th>Cédula</th>
                                                <th>Fecha Venta</th>
                                                <th>Fecha Pago</th>
                                            </tr>
                                        </thead>
                                        <tbody className="h6">
                                            {props.debtInfo.map(debt => {
                                                return (
                                                    <tr key={debt.id}>
                                                        <td onClick={props.onDebtIdClick} role="button" className="btn-link" data-debtid={debt.id}>{debt.id}</td>
                                                        <td>{debt.client.name}</td>
                                                        <td>{debt.client.cedula}</td>
                                                        <td>{debt.createdAt}</td>
                                                        <td>{debt.fullyPaidDate ? debt.fullyPaidDate : "NO PAGADO"}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                props.debtDetailsInfo &&
                <DebtDetailsModal
                    sale={props.debtDetailsInfo}
                    dolarReference={props.dolarReference}
                    freezePrices={true}
                />
            }
        </div >
    );
};

export default Reports;
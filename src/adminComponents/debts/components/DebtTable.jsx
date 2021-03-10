import React from "react";


const DebtTable = (props) => {
    return (
        <div className="container-fluid">
            <table className="table table-sm table-borderless text-center border border-danger">
                <thead>
                    <tr className="text-light bg-danger">
                        <th>ID</th>
                        <th>Deuda</th>
                        <th>Fecha</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {(props.client && props.client.sales.length > 0) &&
                        props.client.sales.map(sale => {
                            let isDebtPositiveNumber = sale.debtTotal > 0;
                            return (
                                <tr key={sale.id} className={isDebtPositiveNumber ? "text-danger" : "text-success"}>
                                    <th onClick={props.onDebtIdClickHandler} className="btn-link" role="button">
                                        {sale.id}
                                    </th>
                                    <th>{sale.debtCurrency ? sale.debtCurrency === "USD" ? "$" : "Bs " : "Bs "}{Math.abs(sale.debtTotal.toFixed(2)).toLocaleString("es-VE")}</th>
                                    <th>{sale.createdAt}</th>
                                    <th>
                                        <button
                                            onClick={isDebtPositiveNumber ? props.payIndividualDebt : (event) => props.openPaymentMethodsModalHandler(event, {
                                                saleId: sale.id,
                                                debtTotal: sale.debtTotal,
                                                debtCurrency: sale.debtCurrency
                                            })}
                                            data-saleid={sale.id}
                                            className="btn btn-success p-0"
                                        >
                                            Pagar
                                        </button>
                                    </th>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default DebtTable;

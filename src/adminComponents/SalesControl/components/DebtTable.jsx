import React from "react";

const DebtTable = (props) => {
    return (
        <div className="container-fluid">
            <input onClick={props.addDebtToInvoiceTotal} ref={props.payDebtButton} type="button" value="Pagar deuda" className="form-control btn-danger rounded-0" />
            <table className="table table-sm table-borderless text-danger text-center border border-danger">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Deuda</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {(props.client && props.client.sales.length > 0) &&
                        props.client.sales.map(sale => {
                            return (
                                <tr key={sale.id}>
                                    <th className="btn-link" role="button">
                                        {sale.id}
                                    </th>
                                    <th>{Intl.NumberFormat('es-VE', {currency: 'VES'}).format(props.calculateSaleTotal(sale, false) - props.calculatePaymentsTotal(sale.payment))}</th>
                                    <th>{sale.createdAt}</th>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    )
}

export default DebtTable;

import React, { Component } from 'react';

import Reports from "./Reports";
import moment from 'moment';
import { showMessageInfo, roundUpProductPrice, calculateDebtTotal } from "../../../helpers";
import domtoimage from "dom-to-image";

import reportsRequests from "../../../requests/reports";
import salesRequests from "../../../requests/sales";
import Discord, { MessageAttachment } from "discord.js";

const webhook = new Discord.WebhookClient("818831359678087198", "zSv6m3zRqrWCfeCipwA7J5wt2hdOEr7GkV8odpSz31GJpl-CttX6Imch7yVeCgdcpPRi");

class ReportsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            salesInfo: null,
            paymentInfo: null,
            debtInfo: null,
            debtDetailsInfo: null,
            startDate: moment(new Date()).format("YYYY-MM-DD"),
            endDate: moment(new Date()).format("YYYY-MM-DD"),
            grossIncomeTotal: null,
            netIncomeTotal: null,
            grossIncomeTotalBs: null,
            netIncomeTotalBs: null,
            submitLoading: false,
            sendingToDiscord: false
        };

        this.webHookURL = "https://discord.com/api/webhooks/818831359678087198/zSv6m3zRqrWCfeCipwA7J5wt2hdOEr7GkV8odpSz31GJpl-CttX6Imch7yVeCgdcpPRi";

        this.onClickHandler = this.onClickHandler.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onDebtIdClick = this.onDebtIdClick.bind(this);
        this.sendToDiscord = this.sendToDiscord.bind(this);
    }

    componentDidMount() { }

    onClickHandler(event) {
        let targetId = event.target.id;
        let startDate = "";
        let endDate = "";
        switch (targetId) {
            case "todayRadio":
                startDate = moment(new Date()).format("YYYY-MM-DD");
                endDate = moment(new Date()).format("YYYY-MM-DD");
                break;
            case "yesterdayRadio":
                startDate = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
                endDate = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
                break;
            case "weekRadio":
                startDate = moment(new Date()).subtract(7, "days").format("YYYY-MM-DD");
                endDate = moment(new Date()).format("YYYY-MM-DD");
                break;
            case "fortnightRadio":
                startDate = moment(new Date()).subtract(15, "days").format("YYYY-MM-DD");
                endDate = moment(new Date()).format("YYYY-MM-DD");
                break;
            case "monthRadio":
                startDate = moment(new Date()).subtract(1, "months").format("YYYY-MM-DD");
                endDate = moment(new Date()).format("YYYY-MM-DD");
                break;
        }
        this.setState({ startDate, endDate });
    }

    onChangeHandler(event) {
        let targetId = event.target.id;
        if (targetId === "startDateInput") {
            this.setState({ startDate: event.target.value });
        }
        else if (targetId === "endDateInput") {
            this.setState({ endDate: event.target.value });
        }
    }
    submitQuery() {
        if (!this.state.submitLoading) {
            this.setState({ submitLoading: true }, async () => {
                try {
                    let salesReport = await reportsRequests.salesReport(this.state.startDate, this.state.endDate);
                    let paymentsReport = await reportsRequests.paymentsReport(this.state.startDate, this.state.endDate);
                    let debtsReport = await reportsRequests.debtsReport(this.state.startDate, this.state.endDate);
                    let grossIncomeTotal = 0, netIncomeTotal = 0, grossIncomeTotalBs = 0, netIncomeTotalBs = 0;
                    console.log(paymentsReport);
                    salesReport.map(product => {
                        grossIncomeTotal += product.grossIncome;
                        netIncomeTotal += product.netIncome;
                        grossIncomeTotalBs += product.grossIncomeBs;
                        netIncomeTotalBs += product.netIncomeBs;
                    });
                    this.setState({
                        salesInfo: salesReport,
                        paymentInfo: paymentsReport,
                        debtInfo: debtsReport,
                        grossIncomeTotal,
                        netIncomeTotal,
                        grossIncomeTotalBs,
                        netIncomeTotalBs,
                        submitLoading: false
                    });
                } catch (error) {
                    this.setState({ submitLoading: false });
                    showMessageInfo(this, "error", error.toString());
                }
            });
        }
    }

    async sendToDiscord() {
        let state = this.state;
        this.setState({
            salesInfo: null,
            paymentInfo: null,
            debtInfo: null,
            debtDetailsInfo: null,
            startDate: moment(new Date()).format("YYYY-MM-DD"),
            endDate: moment(new Date()).format("YYYY-MM-DD"),
            grossIncomeTotal: null,
            netIncomeTotal: null,
            grossIncomeTotalBs: null,
            netIncomeTotalBs: null,
            submitLoading: false,
            sendingToDiscord: false
        }, () => {
            this.setState({
                ...state,
                sendingToDiscord: true
            }, async () => {
                var salesTable = document.getElementById("salesReportTable");
                var paymentsTable = document.getElementById("paymentsReportTable");
                var debtsTable = document.getElementById("debtsReportTable");

                try {
                    let salesReport = await domtoimage.toBlob(salesTable, { bgcolor: "white" });
                    let paymentsReport = await domtoimage.toBlob(paymentsTable, { bgcolor: "white" });
                    let debtsReport = await domtoimage.toBlob(debtsTable, { bgcolor: "white" });
                    let date = this.state.startDate == this.state.endDate ? moment(this.state.startDate).format("DD-MM-YYYY") : `${moment(this.state.startDate).format("DD-MM-YYYY")} / ${moment(this.state.endDate).format("DD-MM-YYYY")}`;
                    await webhook.send("Reporte de ventas: " + date, { files: [new MessageAttachment(salesReport)] });
                    await webhook.send("Reporte de pagos: " + date, { files: [new MessageAttachment(paymentsReport)] });
                    await webhook.send("Reporte de deudas: " + date, { files: [new MessageAttachment(debtsReport)] });

                    this.setState({ sendingToDiscord: false });
                    showMessageInfo(this, "success", "Reporte enviado con éxito");
                } catch (error) {
                    this.setState({ sendingToDiscord: false });
                    showMessageInfo(this, "error", error.toString());
                }
            });
        });
        return;
        if (this.state.salesInfo) {
            let paymentFields = [];
            let debtInfo = "";
            let date = this.state.startDate == this.state.endDate ? moment(this.state.startDate).format("DD-MM-YYYY") : `${moment(this.state.startDate).format("DD-MM-YYYY")} - ${moment(this.state.endDate).format("DD-MM-YYYY")}`;

            this.state.paymentInfo.map(payment => {
                if (payment.paymentMethodName.includes("point of sale")) {
                    paymentFields.push({
                        name: "Punto de venta",
                        inline: true,
                        value: `${payment.amount.toLocaleString("es-VE")}`
                    });
                }
                else if (payment.paymentMethodName.includes("cash")) {
                    paymentFields.push({
                        name: payment.currency == "Bs" ? "Bs" : payment.currency == "USD" ? "USD" : "Other currency",
                        inline: true,
                        value: `${payment.currency === "Bs" ? payment.amount.toLocaleString("es-VE") : payment.amount.toFixed(2).toLocaleString("es-VE")}`
                    });
                }
                else if (payment.paymentMethodName.includes("bank transfer")) {
                    paymentFields.push({
                        name: "Transferencia",
                        inline: true,
                        value: `${payment.amount.toLocaleString("es-VE")}`
                    });
                }
            });

            this.state.debtInfo.map(debt => {
                debtInfo += `${JSON.stringify(debt)}
                `;
            });
            fetch(this.webHookURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    embeds: [
                        {
                            title: "Reporte de ventas totales",
                            fields: [
                                {
                                    name: "Bruto $",
                                    inline: true,
                                    value: `${this.state.grossIncomeTotal.toFixed(2).toLocaleString("es-VE")}`
                                },
                                {
                                    name: "Bruto Bs",
                                    inline: true,
                                    value: `${this.state.grossIncomeTotalBs.toLocaleString("es-VE")}`
                                },
                                {
                                    name: "Neto $",
                                    inline: true,
                                    value: `${this.state.netIncomeTotal.toFixed(2).toLocaleString("es-VE")}`
                                },
                                {
                                    name: "Neto Bs",
                                    inline: true,
                                    value: `${this.state.netIncomeTotalBs.toLocaleString("es-VE")}`
                                }
                            ],
                            footer: {
                                text: date
                            }
                        },
                        {
                            title: "Reporte de pagos totales",
                            fields: paymentFields,
                            footer: {
                                text: date
                            }
                        },
                        {
                            title: "Report de deudas",
                            fields: [{
                                name: "Info",
                                value: debtInfo
                            }],
                            footer: {
                                text: date
                            }
                        }
                    ]
                })
            });
        }
    }

    async onDebtIdClick(event) {
        let debtId = event.target.getAttribute('data-debtid');
        let sale = await salesRequests.fetchById(debtId);
        if (sale.data[0]) {
            sale = sale.data[0];
            let debtInfo = calculateDebtTotal(sale, this.props.dolarReference, true);
            sale.debtTotal = debtInfo.debtTotal;
            sale.debtCurrency = debtInfo.debtCurrency;
            this.setState({
                debtDetailsInfo: sale
            }, () => {
                window.$("#debtDetailsModal").modal("show");
            });
        }
    }

    render() {
        return (
            <Reports
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onClickHandler={this.onClickHandler}
                submitQuery={this.submitQuery}
                onChangeHandler={this.onChangeHandler}
                salesInfo={this.state.salesInfo}
                paymentInfo={this.state.paymentInfo}
                debtInfo={this.state.debtInfo}
                debtDetailsInfo={this.state.debtDetailsInfo}
                dolarReference={this.props.dolarReference}
                onDebtIdClick={this.onDebtIdClick}
                submitLoading={this.state.submitLoading}
                grossIncomeTotal={this.state.grossIncomeTotal}
                netIncomeTotal={this.state.netIncomeTotal}
                grossIncomeTotalBs={this.state.grossIncomeTotalBs}
                netIncomeTotalBs={this.state.netIncomeTotalBs}
                sendToDiscord={this.sendToDiscord}
                sendingToDiscord={this.state.sendingToDiscord}
                messageInfo={this.state.messageInfo}
            />
        );
    }
}

export default ReportsContainer;;;
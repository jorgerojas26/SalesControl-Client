import React, {Component} from "react";

import AsyncSelect from "react-select/async";
import {roundUpProductPrice, numberWithCommas, formatPhoneNumber } from "../helpers";
import inventoryRequests from "../requests/inventory";
import clientsRequests from "../requests/clients";
import salesRequests from "../requests/sales";
class BetterSalesControl extends Component {
	constructor() {
		super();
		this.state = {
			messageInfo: {
				type: null,
				message: null,
			},
			productsToSell: [],
			currentSelectedProduct: null,
			currentSelectedClient: {
				name: null,
				cedula: null,
				phoneNumber: null,
			},
			quantity: 1,
			totalDollars: 0,
			totalBs: 0,
			submittingSale: false,
		};

		this.productsTableDiv = React.createRef();
		this.productsTable = React.createRef();
		this.productSelect = React.createRef();
		this.clientSelect = React.createRef();
		this.saleSubmitButton = React.createRef();
		this.quantityInput = React.createRef();

		this.productSelectionHandler = this.productSelectionHandler.bind(this);
		this.searchProductsHandler = this.searchProductsHandler.bind(this);
		this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
		this.onFocusHandler = this.onFocusHandler.bind(this);
		this.addProductToTableHandler = this.addProductToTableHandler.bind(this);
		this.editProductQuantityHandler = this.editProductQuantityHandler.bind(this);
		this.deleteFromTable = this.deleteFromTable.bind(this);
		this.submitSaleHandler = this.submitSaleHandler.bind(this);
		this.showMessageInfo = this.showMessageInfo.bind(this);
		this.sendToDebts = this.sendToDebts.bind(this);
		this.clientSelectionHandler = this.clientSelectionHandler.bind(this);
	}

	componentDidMount() {
		window.$("#clientsModal").on("shown.bs.modal", () => {
			this.clientSelect.current.focus();
		})

		window.$("#clientsModal").on("hide.bs.modal", () => {
			this.setState({
				currentSelectedClient: {
					name: null,
					cedula: null,
					phoneNumber: null
				}

			})
		})
	}

	async searchProductsHandler(inputValue) {
		let results = await inventoryRequests.fetchByProductName(inputValue);
		if (results.data.length > 0) {
			results.data.forEach((product) => {
				//product.value = product;
				product.label = (
					<div className="row">
						<div className="mx-auto">
							<img className="my-auto" style={{maxWidth: "40px"}} src={product.imagePath} />
							<span className="my-auto">{product.name}</span>
						</div>
						<span className="my-auto mr-5">
							{Intl.NumberFormat("es-VE", {
								style: "currency",
								currency: "VES",
							}).format(roundUpProductPrice(product.price * this.props.dolarReference))}
						</span>
					</div>
				);
				if (product.stock == 0) product.isDisabled = true;
			});
		}
		return results.data;
	}

	async searchClientsHandler(name) {
		let results = await clientsRequests.fetchByName(name);
		if (results.data.length > 0) {
			results.data.forEach(client => {
				client.label = (
					<div className="row mx-auto">
						<span className="mx-auto">
							<span className="">{client.name}</span>
						</span>
						<span className="mr-5">
							{numberWithCommas(client.cedula, ".")}	
						</span>
					</div>
				)
			});
		}
		return results.data
	}

	productSelectionHandler(selectedProduct, actionType) {
		if (actionType.action == "select-option") {
			this.quantityInput.current.select();
		}
		this.setState({
			currentSelectedProduct: selectedProduct,
		});
	}

	clientSelectionHandler(selectedClient, actionType) {
		if (actionType.action == "select-option") {
			selectedClient.label = selectedClient.name;
			selectedClient.phoneNumber = formatPhoneNumber(selectedClient.phoneNumber);
			this.setState({
				currentSelectedClient: selectedClient,
			});
		}
		else if(actionType.action == "clear"){
			this.setState({
				currentSelectedClient: {
					name: null,
					cedula: null,
					phoneNumber: null
				}
			})
		}
	}

	onFocusHandler(event) {
		event.target.select();
	}

	async onInputChangeHandler(event) {
		if (event.target.name == "quantity") {
			this.setState({
				quantity: Number(event.target.value),
			});
		} else if (event.target.id == "productQuantity") {
			let productId = event.target.parentElement.parentElement.getAttribute("productId");
			let quantity = Number(event.target.value);

			if (await this.isProductStockEnough(productId, quantity)) {
				let productsToSell = this.state.productsToSell;
				productsToSell.map((product) => {
					if (product.id == productId) {
						product = this.updateProductTotal(product, quantity);
					}
				});
				this.setState({
					productsToSell,
				});
			} else {
				event.preventDefault();
			}
		} else {
			this.setState({
				[event.target.name]: event.target.value,
			});
		}
	}

	async isProductStockEnough(id, quantity) {
		let productInfo = await inventoryRequests.fetchByProductId(id);
		if (productInfo.data) {
			let stock = Number(productInfo.data[0].stock);
			if (stock <= 0 || quantity > stock) {
				this.showMessageInfo("error", "No hay suficientes productos en el inventario");
			} else {
				return true;
			}
		}
		return false;
	}

	async addProductToTableHandler(event) {
		event.preventDefault();
		if (this.state.currentSelectedProduct != null) {
			let productInfo = await inventoryRequests.fetchByProductId(this.state.currentSelectedProduct.id);
			if (productInfo.data) {
				let stock = parseInt(productInfo.data[0].stock);
				let quantityToSell = parseInt(this.state.quantity);
				if (stock <= 0 || quantityToSell > stock) {
					this.showMessageInfo("error", "No hay suficientes productos en el inventario");
				} else {
					let productsToSell = this.state.productsToSell;

					let alreadyInTable = false;

					productsToSell.forEach((productToSell) => {
						if (this.state.currentSelectedProduct.id == productToSell.id) {
							alreadyInTable = true;
						}
					});

					if (!alreadyInTable) {
						let newProduct = {
							id: this.state.currentSelectedProduct.id,
							imagePath: this.state.currentSelectedProduct.imagePath,
							name: this.state.currentSelectedProduct.name,
							unitPriceDollars: this.state.currentSelectedProduct.price,
							quantity: this.state.quantity,
							discount: this.state.currentSelectedProduct.discount && this.state.currentSelectedProduct.discount.length ? this.state.currentSelectedProduct.discount[0].percent : null,
						};

						if (newProduct.discount != null) {
							newProduct.unitPriceDollars = newProduct.unitPriceDollars - newProduct.unitPriceDollars * (newProduct.discount / 100);
						}
						newProduct.unitPriceBs = roundUpProductPrice(newProduct.unitPriceDollars * this.props.dolarReference);
						newProduct.totalBs = newProduct.unitPriceBs * newProduct.quantity;
						newProduct.totalDollars = newProduct.unitPriceDollars * newProduct.quantity;

						productsToSell.push(newProduct)
						this.setState({
							productsToSell,
							quantity: 1,
							currentSelectedProduct: null,

						});
					} else {
						productsToSell.map((product) => {
							if (product.id == this.state.currentSelectedProduct.id) {
								product = this.updateProductTotal(product, this.state.quantity);
							}
						});
						this.setState({
							productsToSell,
							quantity: 1,
							currentSelectedProduct: null,
						});
					}
					this.productSelect.current.select.state.value = [];
					this.quantityInput.current.value = 1;
					this.productSelect.current.focus();
					this.updateSaleTotal();
				}
			}
		}
		else {
			this.showMessageInfo("error", "Por favor seleccione un producto")
		}
	}

	updateProductTotal(product, quantity) {
		if (product != null && quantity != null) {
			product.quantity = quantity;
			product.totalBs = product.unitPriceBs * product.quantity;
				product.totalDollars = product.unitPriceDollars * product.quantity;
		}
		return product;
	}

	updateSaleTotal() {
		let totalBs = 0;
		let totalDollars = 0;
		this.state.productsToSell.forEach(product => {
			totalBs += product.totalBs;
			totalDollars += product.totalDollars;
		});
		this.setState({
			totalBs,
			totalDollars,
		});
	}

	async editProductQuantityHandler(event) {
		let quantity = window.prompt("Ingrese la cantidad: ");
		if (quantity != null && quantity != "") {
			let productId = event.target.parentElement.getAttribute("productId");
			if (await this.isProductStockEnough(productId, quantity)) {
				let productsToSell = this.state.productsToSell;
				productsToSell.forEach((product) => {
					if (product.id == productId) {
						product = this.updateProductTotal(product, quantity);
						this.setState({
							productsToSell,
						}, () => {
							this.updateSaleTotal();
						});
					}
				});
			}
		}
		this.productSelect.current.focus();
	}

	deleteFromTable(event) {
		let productId = event.target.parentElement.parentElement.getAttribute("productid");
		let productsToSell = this.state.productsToSell.filter((product) => {
			return product.id != productId;
		});

		this.setState({
			productsToSell,
		}, () => this.updateSaleTotal());
	}

	submitSaleHandler() {
		if (!this.state.productsToSell.length > 0) {
			this.showMessageInfo("error", "Por favor seleccione un producto");
			return;
		}
		if (!this.state.submittingSale) {
			this.setState({
				submittingSale: true
			}, async () => {
				let productsToSell = this.state.productsToSell;
				productsToSell.forEach((product) => {
					product.dolarReference = this.props.dolarReference;
					product.price = product.unitPriceDollars;
					product.discount = product.discount || 0;
				});
				let response = await salesRequests.create({
					products: productsToSell,
				});
				if (response.error) {
					this.showMessageInfo("error", response.error);
				} else {
					this.showMessageInfo("success", "La venta se ha realizado con éxito");
					this.setState({
						productsToSell: [],
						currentSelectedProduct: null,
						quantity: 1,
						totalDollars: 0,
						totalBs: 0,
						submittingSale: false,
					});
					this.productSelect.current.select.state.value = [];
					this.quantityInput.current.value = 1;
					this.productSelect.current.focus();
				}
			}
			);
		} else {
			this.showMessageInfo("error", "Por favor espere, una venta ya está en proceso");
		}
	}

	sendToDebts() {
		if (this.state.productsToSell.length > 0) {
			window.$('#clientsModal').modal();
		}
		else {
			this.showMessageInfo("error", "Por favor seleccione un producto");

		}
	}

	showMessageInfo(type, message) {
		if (this.timeout) clearTimeout(this.timeout);
		this.setState({
			messageInfo: {
				type: null,
				message: null,
			},
		}, () => {
			this.setState({
				messageInfo: {
					type,
					message,
				},
			}, () => {
				this.timeout = setTimeout(() => {
					this.setState({
						messageInfo: {
							type: null,
							message: null,
						},
					});
				}, 3000);
			}
			);
		}
		);
	}


	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col">
						<h1 className="text-danger">Control de Ventas</h1>
					</div>
				</div>
				<div className="row">
					<div className="col-12 col-lg-7 mt-2">
						<label className="font-weight-bold">Productos</label>
					</div>
					<div className="col-12 col-lg-3 mt-2">
						<label className="font-weight-bold">Cantidad</label>
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						<form onSubmit={this.addProductToTableHandler}>
							<div className="row">
								<div className="col-12 col-lg-7 mt-2">
									<AsyncSelect
										loadOptions={this.searchProductsHandler}
										ref={this.productSelect}
										placeholder="Buscar producto"
										autoFocus
										isClearable
										inputId="selectedProduct"
										onChange={this.productSelectionHandler}
										styles={{
											option: (styles, {data, isDisabled, isFocused, isSelected}) => ({
												...styles,
												color: data.stock > 0 && data.stock <= 10 ? "orange" : data.stock > 0 ? "green" : "red",
												cursor: data.stock == 0 ? "not-allowed" : "pointer",
											}),
											singleValue: (styles, {data}) => ({
												...styles,
												width: "100%",
											}),
										}}
									/>
								</div>
								<div className="col-12 col-lg-3 mt-2">
									<input onFocus={this.onFocusHandler} ref={this.quantityInput} onChange={this.onInputChangeHandler} type="number" className="form-control" placeholder="Cantidad" id="quantity" name="quantity" defaultValue="1" />
								</div>
								<div className="col-12 col-lg-2 mt-2">
									<input type="submit" className="form-control btn btn-info" value="Enviar" />
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className="row mb-2 mt-0">
					<div className="col">
						<span
							onBlur={() => {
								this.setState({
									messageInfo: null,
								});
							}}
							className={this.state.messageInfo.type == "error" ? "text-danger" : "text-success"}
						>
							{this.state.messageInfo.message}
						</span>
					</div>
				</div>
				<div className="row">
					<div className="col-12 col-lg-2">
						<div className="form-group">
							<input ref={this.saleSubmitButton} onClick={this.submitSaleHandler} type="button" className="form-control btn btn-primary" value="Procesar venta" />
						</div>
						<div className="form-group">
							<input onClick={this.sendToDebts} className="form-control btn btn-warning" value="Enviar a deudas" />
						</div>
					</div>
					<div className="col-12 col-lg-10">
						<div ref={this.productsTableDiv} className="table-responsive">
							<table ref={this.productsTable} className="table table-dark table-striped table-bordered overflow-auto">
								<thead>
									<tr>
										<th className="my-auto" scope="col">Product ID</th>
										<th className="my-auto" scope="col">Nombre</th>
									<th className="my-auto"scope="col">Precio Bs</th>
										<th className="my-auto"scope="col">Cantidad</th>
										<th className="my-auto"scope="col"> Total <span className="font-weight-bold text-warning"> {" " + Intl.NumberFormat("es-VE", { style: "currency", currency: "VES", }).format(this.state.totalBs)} </span> </th>
									</tr>
								</thead>
								<tbody>
									{this.state.productsToSell && this.state.productsToSell.map((product, index) => {
										return (
											<tr key={index} productid={product.id}>
												<th>{product.id}</th>
												<th>
													<img style={{maxWidth: "40px", }} src={product.imagePath} /> {product.name}
												</th>
												<th>
													{Intl.NumberFormat("es-VE", {style: "currency", currency: "VES", }).format(product.unitPriceBs)}
												</th>
												<th onClick={this.editProductQuantityHandler} className="bg-dark" data-toggle="tooltip" data-placement="bottom" title="Editar Cantidad" role="button">
													{product.quantity}
												</th>
												<th>
													{Intl.NumberFormat("es-VE", {style: "currency", currency: "VES"}).format(product.totalBs)}
												</th>
												<th>
													<button onClick={this.deleteFromTable} className="btn btn-danger p-0"> Delete </button>
												</th>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="modal fade" id="clientsModal" tabIndex="-1" aria-labelledby="clientsModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="clientsModalLabel">Datos del cliente</h5>
							</div>
							<div className="modal-body">
								<div className="d-flex justify-content-between mb-3">
									<AsyncSelect 
									loadOptions={this.searchClientsHandler}
									ref={this.clientSelect}
									className="w-100"
									autoFocus
									placeholder="Buscar cliente"
									isClearable
										inputId="clientSelect"
									onChange={this.clientSelectionHandler}
									styles={{
										singleValue: (styles, {data}) => ({
											...styles,
											width: "100%",
										}),
									}}
									/>
									<button className="btn btn-secondary " type="button" id="newClientButton">
										<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
										</svg>
									</button>
								</div>
								<div className="d-flex justify-content-between mb-3">
									<input className="form-control" type="text" name="cedula" id="cedula" placeholder="Cédula" value={(this.state.currentSelectedClient.cedula) ? numberWithCommas(this.state.currentSelectedClient.cedula, ".") : ""} disabled />
									<input className="form-control" type="tel" name="phone" id="phone" placeholder="Teléfono" value={(this.state.currentSelectedClient.phoneNumber) ? this.state.currentSelectedClient.phoneNumber : ""} disabled />

								</div>

								<div className="mt-3">

								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-dismiss="modal"> Close </button>
								<button type="button" className="btn btn-primary"> Enviar </button>
							</div>
						</div>
					</div>
				</div>
			</div >
		);
	}
}

export default BetterSalesControl;

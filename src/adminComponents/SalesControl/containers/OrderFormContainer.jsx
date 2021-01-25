import React, {Component} from "react"

import OrderForm from "../components/OrderForm"

class OrderFormContainer extends Component {
    constructor() {
        super();

        this.state = {
            messageInfo: {
                type: null,
                message: null
            },
            quantity: 1,
            selectedProduct: null
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onProductSelect = this.onProductSelect.bind(this);
    }

    onProductSelect(selectedProduct) {
        this.setState({
            selectedProduct
        })
    }

    onChangeHandler(event) {
        let value = event.target.value;
        console.log(value)

        if (isNaN(value)) {
            this.setState({
                messageInfo: {
                    type: "error",
                    message: "La cantidad del producto debe ser un número"
                }
            })
        }
        else {
            this.setState({
                [event.target.name]: value
            })
        }
    }

    onSubmitHandler() {

    }


    render() {

        return <OrderForm onChangeHandler={this.onChangeHandler} onSubmitHandler={this.onSubmitHandler} />
    }


}

export default OrderFormContainer;

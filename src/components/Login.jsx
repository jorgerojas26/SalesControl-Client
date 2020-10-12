import React, { Component } from "react";
import { isAuthenticated } from "../requests/isAuthenticated"
class Login extends Component {

    constructor() {
        super();

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.inputHandler = this.inputHandler.bind(this);

        this.state = {
            email: null,
            password: null,
            logginError: null
        }
    }
    componentDidMount() {
        isAuthenticated().then(authenticated => {
            if (authenticated) {
                this.props.history.push("/admin/dashboard")
            }
        })
    }
    onSubmitHandler(event) {
        event.preventDefault();
        this.setState({
            logginError: null
        })
        fetch("/sessions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then(result => result.json())
            .then(result => {
                if (result.err) {
                    this.setState({
                        logginError: result.err
                    })
                }
                else {
                    localStorage.setItem("jwt", result.token);
                    this.props.history.push("/admin/dashboard");
                }
            });
    }

    inputHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div className="container h-100 col-10 col-md-4">
                <div className="row h-100 justify-content-center align-items-center">
                    <form onSubmit={this.onSubmitHandler} className="col-12" action="/sessions" method="POST">
                        <div className="form-group">
                            <input onChange={this.inputHandler} type="text" className="form-control" name="email" id="email" placeholder="Email" />
                        </div>
                        <div className="form-group">
                            <input onChange={this.inputHandler} type="password" className="form-control" name="password" id="password" placeholder="Password" />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">Enviar</button>
                        </div>
                        <div className="form-group">
                            <p className="text-danger">{this.state.logginError}</p>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}


export default Login;
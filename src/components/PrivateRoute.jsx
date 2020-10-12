import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import isAuthenticated from "../requests/isAuthenticated";

class PrivateRoute extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            isAuthenticated: false
        }
    }

    componentDidMount() {
        isAuthenticated().then(isAuthenticated => {
            this.setState({
                loading: false,
                isAuthenticated
            })
        })
    }

    render() {
        const { component: Component, ...rest } = this.props
        return (
            <Route
                render={props =>
                    this.state.isAuthenticated ? (
                        <Component {...props} {...rest} />
                    ) : (
                            this.state.loading ? (
                                <div>LOADING</div>
                            ) : (
                                    <Redirect to={{ pathname: '/signin', state: { from: this.props.location } }} />
                                )
                        )
                }
            />
        )
    }
}

export default PrivateRoute;
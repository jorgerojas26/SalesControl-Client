import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import ProductCategories from "./components/ProductCategories";
import ProductList from "./components/ProductList";
import BackToTopButton from "./components/BackToTopButton";
import Login from "./components/Login";
import Dashboard from "./adminComponents/Dashboard";

import PrivateRoute from "./components/PrivateRoute";

import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

const store = configureStore();

function App() {

  /*
  <Route path="/">
              <div className="container-fluid">
                <div className="row bg-dark" style={{ height: "30px" }} />
                <div className="row sticky-top">
                  <div className="col-12">
                    <Header />
                  </div>
                </div>
                <Navigation />

                <div className="row">
                  <div className="col-md-12 mt-2">
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 mt-2">
                    <div className="row">
                      <div className="col-12">
                        <ProductCategories />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 d-flex flex-column align-items-center">
                        <BackToTopButton />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8 mt-2 d-flex flex-wrap justify-content-start">
                    <ProductList />
                  </div>
                </div>
              </div>
            </Route>
  */
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/signin" component={Login} />
            <PrivateRoute path="/" component={Dashboard} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;

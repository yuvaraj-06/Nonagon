import React, { Component } from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import IndexView from "views/Index.js";
// import { PageView, initGA } from './components/Tracking';

import { Provider } from 'react-redux'
import store from './redux/store'
import { ToastContainer } from 'react-toastify';
import {
    Button,
    Modal,
} from "reactstrap";

const hist = createBrowserHistory();

const initialState = {
    isSignedIn: false,
    name: '',
    email: '',
    outlet: '',
    position: '',
    deviations: [],
};

const Auth = {
    isAuthenticated: false,
    authenticate(cb) {
        sessionStorage.setItem('isAuthenticated', true);
        Auth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb, id) {
        sessionStorage.removeItem('isAuthenticated');
        hist.push('/auth/login');
        Auth.isAuthenticated = false;
        setTimeout(cb, 100);
    },
    authenticated() {
        return sessionStorage.getItem('isAuthenticated');
    }
};

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                Auth.authenticated() ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
}
class App extends Component {

    constructor() {
        super();
        const persisState = localStorage.getItem('rootState');
        if (persisState) {
            try {
                this.state = JSON.parse(persisState);
            } catch (e) {
                console.warn("Error: ", e);
            }
        }
        else {
            this.state = initialState;
        }
        this._ismounted = true;
    }

    setupBeforeUnloadListener = () => {

    };

    toggleModal() {
        this.setState({
            modalState: !this.state.modalState
        });
    }

    componentDidMount() {
        localStorage.setItem('rootState', JSON.stringify(this.state));
        this.setupBeforeUnloadListener();

        if (window.innerWidth < 576) {
            this.setState({ modalState: true });
        }

        const persisState = localStorage.getItem('rootState');
        if (persisState) {
            try {
                this._ismounted && this.setState(JSON.parse(persisState));
            } catch (e) {
                console.warn("Error: ", e);
            }
        }
    }

    loadUser = (data) => {
        this._ismounted && this.setState({ isSignedIn: true });
        this._ismounted && this.setState(Object.assign(this.state, {
            name: data.name,
            email: data.email,
            outlet: data.outlet,
            position: data.position
        }));
        localStorage.setItem('rootState', JSON.stringify(this.state));
    };

    signOutUser = () => {
        this._ismounted && this.setState(initialState);
        hist.push('/login');
    };

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <>
                <Provider store={store}>
                    <ToastContainer />
                    <BrowserRouter>
                        <Switch>
                            <Route path="/admin"
                                component=
                                {
                                    (props) => <AdminLayout {...props}
                                        store={store}
                                        outlet={this.state.outlet}
                                        name={this.state.name}
                                        signOutUser={this.signOutUser} />
                                }
                            />
                            <Route path="/auth" render={props => <AuthLayout {...props} Auth={Auth} loadUser={this.loadUser} />} />
                            <Route path="/home" render={props => <IndexView {...props} Auth={Auth} loadUser={this.loadUser} />} />
                            <Redirect from="*" to="/admin/dashboard" />
                        </Switch>
                    </BrowserRouter>
                </Provider>
                <Modal
                    className="modal-dialog-centered modal-danger"
                    // contentClassName="bg-gradient-danger"
                    contentClassName="mobile-view-modal"
                    isOpen={this.state.modalState}
                    toggle={() => this.toggleModal()}
                >
                    <div className="modal-header">
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal()}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="py-3 text-center">
                            <i className="ni ni-bell-55 ni-3x" />
                            <h4 className="heading mt-4">Note</h4>
                            <p>
                                The mobile view dashboard is still in beta. The full version is currently available on desktop/laptops.
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button className="btn-white" color="default" type="button" onClick={() => this.toggleModal()}>
                            Ok, Got it
                        </Button>
                    </div>
                </Modal>
            </>
        );
    }
}

export default App;

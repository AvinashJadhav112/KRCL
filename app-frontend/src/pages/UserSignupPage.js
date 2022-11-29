    import React from 'react';
    import Input from '../components/Input';
    import ButtonWithProgress from '../components/ButtonWithProgress'
    import { connect } from 'react-redux';
    import * as authActions from '../redux/authActions';

    export class UserSignupPage extends React.Component {

        state = {
            email: '',
            password: '',
            repeatPassword: '',
            pendingApiCall: false,
            errors: {},
            passwordRepeatConfirmed: true,
        }

        onChangeEmail = (event) => {
            const value = event.target.value;
            const errors = { ...this.state.errors }
            delete errors.email;
            this.setState({ email: value, errors })
        };

        onChangePassword = (event) => {
            const value = event.target.value;
            const passwordRepeatConfirmed = this.state.passwordRepeat === value;
            const errors = { ...this.state.errors };
            delete errors.password;
            errors.repeatPassword = passwordRepeatConfirmed
            ? ''
            : 'Does not match to password';
            this.setState({ password: value, passwordRepeatConfirmed, errors });
        };

        onChangeRepeatPassword = (event) => {
            const value = event.target.value;
            const passwordRepeatConfirmed = this.state.password === value;
            const errors = { ...this.state.errors };
            errors.repeatPassword = passwordRepeatConfirmed
            ? ''
            : 'Does not match to password';
            this.setState({ repeatPassword: value, passwordRepeatConfirmed, errors });
        };

        onClickSignup = () => {
            const user = {
                email: this.state.email,
                password: this.state.password,
            };
            this.setState({ pendingApiCall: true });
            this.props.actions
                .postSignup(user)
                .then((response) => {
                    this.setState({ pendingApiCall: false }, () =>
                        this.props.history.push('/')
                    );
                })
                .catch((apiError) => {
                    let errors = { ...this.state.errors };
                    if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = { ...apiError.response.data.validationErrors };
                    }
                    this.setState({ pendingApiCall: false, errors });
                });
        };

        render() {
            return (
                <div className="container">
                    <h1 className="text-center">Sign Up</h1>
                    <div className="col-12 mb-3">
                        <Input
                            label="Email"
                            placeholder="Enter Email"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                            hasError={this.state.errors.email && true}
                            error={this.state.errors.email}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <Input
                            label="Password"
                            placeholder="Enter Password"
                            type="password"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            hasError={this.state.errors.password && true}
                            error={this.state.errors.password}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <Input
                            label="Confirm Password"
                            placeholder="Enter Password Again"
                            type="password"
                            value={this.state.repeatPassword}
                            onChange={this.onChangeRepeatPassword}
                            hasError={this.state.errors.repeatPassword && true}
                            error={this.state.errors.repeatPassword}
                        />
                    </div>
                    <div className="text-center">
                        <ButtonWithProgress
                            onClick={this.onClickSignup}
                            disabled={
                                this.state.pendingApiCall || !this.state.passwordRepeatConfirmed
                            }
                            pendingApiCall={this.state.pendingApiCall}
                            text="Enroll User"
                        >
                        </ButtonWithProgress>
                    </div>
                </div>
            )
        }
    }

    UserSignupPage.defaultProps = {
        actions: {
            postSignup: () => new Promise((resolve, reject) => {
                resolve({})
            })
        },
        history: {
        push: () => {} 
        }
    }

    const mapDispatchToProps = (dispatch) => {
        return {
            actions: {
                postSignup: (user) => dispatch(authActions.signupHandler(user))
            }
        }
    }

    export default connect(null, mapDispatchToProps)(UserSignupPage);
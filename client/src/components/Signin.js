import React from 'react';
import { Container, Box, Heading, Text, TextField, Button } from 'gestalt';
import Strapi from "strapi-sdk-javascript/build/main";

import ToastMessage from './ToastMessage';
import { setToken } from '../utils';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signin extends React.Component {

    state = {
        username: "",
        password: "",
        toast: false,
        toastMessage: "",
        loading: false
    };

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({
            [event.target.name]: value
        })
    };

    handleSubmit = async event => {
        event.preventDefault();
        const { username, password } = this.state;

        if (this.isFormEmpty(this.state)) {
            this.showToast("Fill in all the Fields");
            return;
        }

        // Sign in User 
        try {
            // Set Loading - true
            this.setState({ loading: true })
            // make request to register user with strapi
            const response = await strapi.login(username, password);
            // set loading - false
            this.setState({ loading: false });
            // put token    (to manage user session)  in local storage
            setToken(response.jwt);
            // redirect user to the homepage
            this.redirectUser('/');

        } catch (err) {
            // set loading to false
            this.setState({ loading: false });
            // show error message with the toast message
            this.showToast(err.message);
        }
    };

    redirectUser = path => this.props.history.push(path);

    isFormEmpty = ({ username, password }) => {
        return !username || !password;
    }

    showToast = toastMessage => {
        this.setState({ toast: true, toastMessage });

        setTimeout(() => {
            this.setState({
                toast: false,
                toastMessage: ''
            })
        }, 5000)
    };




    render() {
        const { toastMessage, toast, loading } = this.state;
        return (
            <Container>
                <Box
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor: "#d6a3b1"
                        }
                    }}
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* Sign in Form */}
                    <form style={{
                        display: "inlineBlock",
                        textAlign: "center",
                        maxwidth: 450
                    }}
                        onSubmit={this.handleSubmit}
                    >
                        {/* Sign in Heading */}
                        <Box
                            marginBottom={2}
                            display="flex"
                            direction="column"
                            alignItems="center"
                        >
                            <Heading color="midnight">Welcome Back</Heading>
                        </Box>
                        {/* Username input */}
                        <TextField
                            id="username"
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={this.handleChange}
                        />
                        {/* Password Input */}
                        <TextField
                            id="password"
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={this.handleChange}
                        />
                        <Button
                            inline
                            disabled={loading}
                            color="blue"
                            text="Submit"
                            type="submit"
                        />

                    </form>
                </Box>
                <ToastMessage show={toast} message={toastMessage} />
            </Container>
        );
    }
}

export default Signin;
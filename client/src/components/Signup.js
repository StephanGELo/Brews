import React from 'react';
import { Container, Box, Heading, Text, TextField, Button } from 'gestalt';

import ToastMessage from './ToastMessage';

class Signup extends React.Component {

    state = {
        username: "",
        email: "",
        password: "",
        toast: false,
        toastMessage: ""
    };

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({
            [event.target.name]: value
        })
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormEmpty(this.state)) {
            this.showToast("Fill in all the Fields");
            return;
        }
        console.log("submitted")
    };

    showToast = toastMessage => {
        this.setState({ toast: true, toastMessage });

        setTimeout(() => {
            this.setState({
                toast: false,
                toastMessage: ''
            })
        }, 5000)
    };

    isFormEmpty = ({ username, email, password }) => {
        return !username || !email || !password;
    }

    render() {
        const { toastMessage, toast } = this.state;
        return (
            <Container>
                <Box
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor: "#ebe2da"
                        }
                    }}
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* Sign up Form */}
                    <form style={{
                        display: "inlineBlock",
                        textAlign: "center",
                        maxwidth: 450
                    }}
                        onSubmit={this.handleSubmit}
                    >
                        {/* Sign Up Heading */}
                        <Box
                            marginBottom={2}
                            display="flex"
                            direction="column"
                            alignItems="center"
                        >
                            <Heading color="midnight">Let's Get Started'</Heading>
                            <Text italic color="orchid">Sign up to order some brews</Text>
                        </Box>
                        {/* Username input */}
                        <TextField
                            id="username"
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={this.handleChange}
                        />
                        {/* Email Input */}
                        <TextField
                            id="email"
                            type="email"
                            placeholder="Email"
                            name="email"
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

export default Signup;
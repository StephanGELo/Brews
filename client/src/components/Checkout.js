import React from 'react';
import { Container, Box, Heading, TextField, Button} from 'gestalt';
import Strapi from "strapi-sdk-javascript/build/main";

import ToastMessage from './ToastMessage';
import { setToken } from '../utils';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);


class Checkout extends React.Component {

    state = {
        address:"",
        postalCode:"",
        city:"",
        confirmationEmailAddress:"",
        toast: false,
        toastMessage:""

    }

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({
            [event.target.name]: value
        })
    };

    handleConfirmOrder = async event => {
        event.preventDefault();
        const { shippingAddress, postalCode, city, confirmationEmailAddress } = this.state;

        if (this.isFormEmpty(this.state)) {
            this.showToast("Fill in all the Fields");
            return;
        }

        // Sign up User 
        try {
            // Set Loading - true
            this.setState({ loading: true })
            // make request to register user with strapi
            const response = await strapi.register(shippingAddress, postalCode, city, confirmationEmailAddress);
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

    isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress}) => {
        return !address || !postalCode || !city ||!confirmationEmailAddress;
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


    render () {
        const { toast, toastMessage }= this.state
        return (
            <Container>
                <Box
                  color="darkWash"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    margin={4}
                    padding={4}
                    shape="rounded"
            >
                {/* Checkout Form */}
                <form style={{
                        display:"inlineBlock",              
                        textAlign:"center",
                        maxWidth:450
                    }}
                    onSubmit={this.handleConfirmOrder}
                >
    
                    <Heading color="midnight">Checkout</Heading>
                    
                    {/* Shipping Address */}
                    <TextField
                        name="address"
                        id="address"
                        type="text"
                        placeholder="Shipping Address"
                        onChange={this.handleChange}

                    />
                    {/* Postal Code*/}
                    <TextField
                        id="postalCode"
                        name="postalCode"
                        type="number"
                        placeholder="Postal Code"
                        onChange={this.handleChange}
                    />
                           {/* City */}
                    <TextField
                        id="city"
                        name="city"
                        type="text"
                        placeholder="City of Residence"
                        onChange={this.handleChange}
                    />
                           {/* Confirmation Email Address */}
                    <TextField
                        id="confirmationEmailAddress"
                        name="confirmationEmailAddress"
                        type="email"
                        placeholder="Confirmation Email Address"
                        onChange={this.handleChange}
                    />

                    <button id="stripe__button"type="submit">Submit</button>
            
                </form>

            </Box>
            <ToastMessage show={toast} message={toastMessage} />
            </Container>

        );
    }
}

export default Checkout;
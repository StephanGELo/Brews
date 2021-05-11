import React from 'react';
import { Container, Box, Heading, Text, TextField} from 'gestalt';
import Strapi from "strapi-sdk-javascript/build/main";

import ToastMessage from './ToastMessage';
import { calculatePrice, getCart, setToken } from '../utils';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);


class Checkout extends React.Component {

    state = {
        cartItems: [],
        address:"",
        postalCode:"",
        city:"",
        confirmationEmailAddress:"",
        toast: false,
        toastMessage:""

    }

    componentDidMount() {
        this.setState({cartItems: getCart()});
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
        const { toast, toastMessage, cartItems }= this.state
        return (
            <Container>
        
                <Box
                  color="darkWash"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    margin={4}
                    padding={4}
                    shape="rounded"
                >
                    {/* Checkout Form Heading  */}
                    <Heading color="midnight">Checkout</Heading>
                    {cartItems.length > 0 ? 
                        <React.Fragment>
                            {/* User Cart  */}
                            <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            marginTop={2}
                            marginBottom={6}
                        >
                            <Text color="darkGray" italic>{cartItems.length} items for Checkout</Text>
                            <Box padding={2}>
                                {cartItems.map((item) => (
                                    <Box key={item._id} padding={1}>
                                        <Text color="midnight">
                                            {item.name} x {item.quantity} - ${item.quantity * item.price}
                                        </Text>
                                    </Box>
                                ))}
                            </Box>
                            <Text bold>Amount: {calculatePrice(cartItems)}</Text>
                        </Box>

                             {/* Checkout Form */}
                            <form style={{
                            display:"inlineBlock",              
                            textAlign:"center",
                            maxWidth:450
                        }}
                        onSubmit={this.handleConfirmOrder}
                    >
        
                        
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
                        </React.Fragment> : (
                            // Default Text if no items in Cart 
                            <Box
                                color="darkWash"
                                shape="rounded"
                                padding={4}
                            >
                                <Heading align="center" color="watermelon" size="xs">Your Cart is Empty</Heading>
                                <Text align="center" italic color="green">Add some brews!</Text>
                            </Box>
                        )
                    }
                </Box>
                <ToastMessage show={toast} message={toastMessage} />
            </Container>
        );
    }
}

export default Checkout;
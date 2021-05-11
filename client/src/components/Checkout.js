import React from 'react';
import { Container, Box, Heading, Text, Button, TextField, Modal, Spinner } from 'gestalt';
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
        toastMessage:"",
        orderProcessing: true,
        modal: false
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

        // // Sign up User 
        // try {
        //     // Set Loading - true
        //     this.setState({ loading: true })
        //     // make request to register user with strapi
        //     const response = await strapi.register(shippingAddress, postalCode, city, confirmationEmailAddress);
        //     // set loading - false
        //     this.setState({ loading: false });
        //     // put token    (to manage user session)  in local storage
        //     setToken(response.jwt);
        //     // redirect user to the homepage
        //     this.redirectUser('/');

        // } catch (err) {
        //     // set loading to false
        //     this.setState({ loading: false });
        //     // show error message with the toast message
        //     this.showToast(err.message);
        // }

        this.setState({ modal: true})

    };

    handleSubmitOrder = () => {

    }

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

    closeModal = () => {};

    render () { 
        const { toast, toastMessage, cartItems, modal, orderProcessing }= this.state
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
                {/* Confirmation Modal  */}
                {modal && (
                    <ConfirmationModal 
                        orderProcessing={orderProcessing} 
                        cartItems={cartItems} 
                        closeModal={this.closeModal} 
                        handleSubmitOrder={this.handleSubmitOrder}
                    />
                )}
                <ToastMessage show={toast} message={toastMessage} />

            </Container>
        );
    }
}

const ConfirmationModal = ({ orderProcessing, cartItems, closeModal, handleSubmitOrder }) => (
    <Modal
        accessibilityModalLabel="Confirm Your Order"
        accessibilityCloseLabel="close"
        heading= "Confirm Your Order"
        onDismiss={closeModal}
        footer={
            <Box
                display="flex" marginRight={-1} marginLeft={-1} justifyContent="center"
            >
                <Box padding={1}>
                    <Button 
                        size="lg"
                        color="red"
                        text="Submit"
                        disabled={orderProcessing}
                        onClick={handleSubmitOrder}
                    />
                </Box>
                <Box padding={1}>
                    <Button 
                        size="lg"
                        text="Cancel"
                        disabled={orderProcessing}
                        onClick={closeModal}
                    />
                </Box>
            </Box>
        }
        role="alertdialog"
        size="sm"
    >
        {/* Order Summary  */}
        {!orderProcessing && (
            <Box display="flex" justifyContent="center" alignItems="center" direction="column" padding={2} color="darkWash">
                {cartItems.map(item => (
                    <Box key={item._id} padding={1}>
                        <Text size="lg" color="red">
                            {item.name} x {item.quantity} - ${item.quantity * item.price}
                        </Text>
                    </Box>
                ))}
                <Box paddingY={2}>
                    <Text size="lg" bold>
                        Total: {calculatePrice(cartItems)}
                    </Text>
                </Box>
            </Box>
        )}
       
        <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner" />
         {orderProcessing && <Text align="center" italic>Submitting Order...</Text>}

        
    </Modal>
);

export default Checkout;
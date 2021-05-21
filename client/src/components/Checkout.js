import React from 'react';
import { Container, Box, Heading, Text, Button, TextField, Modal, Spinner } from 'gestalt';
import Strapi from "strapi-sdk-javascript/build/main";
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements';
import ToastMessage from './ToastMessage';
import { calculatePrice, getCart, clearCart, calculateAmount, setToken } from '../utils';
import { withRouter } from 'react-router-dom';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
const stripeApiKey = process.env.REACT_APP_STRIPE_API_KEY;

class _CheckoutForm extends React.Component {

    state = {
        cartItems: [],
        address: "",
        postalCode: "",
        city: "",
        confirmationEmailAddress: "",
        toast: false,
        toastMessage: "",
        orderProcessing: false,
        modal: false
    }

    componentDidMount() {
        this.setState({ cartItems: getCart() });
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
        this.setState({ modal: true })

    };

    handleSubmitOrder = async () => {
        const { cartItems, city, address, postalCode, confirmationEmailAddress } = this.state;

        const amount = calculateAmount(cartItems);
        // Process our order
        this.setState({ orderProcessing: true });
        let token;

        try {
            // create stripe token
            const response = await this.props.stripe.createToken();
            token = response.token.id;
            // create order with strapi sdk (make request to backend)
            await strapi.createEntry('orders', {
                amount,
                brews: cartItems,
                city,
                postalCode,
                address,
                token
            });

            await strapi.request('POST', '/email', {
                data: {
                    to: confirmationEmailAddress,
                    subject: `Order Confirmation - BrewHaha ${new Date(Date.now())}`,
                    text: 'Your Order has been processed',
                    html: '<bold>Expect your order to arrive in 2-3 shipping days</bold>'
                }
            })

            // set orderProcessing to false , set modal to false
            this.setState({ orderProcessing: false, modal: false });

            // clear user cart of brews 
            clearCart();

            // show success toast 
            this.showToast('Your order has been successfully submitted!', true);

        } catch (err) {

            // set order processing - false, modal - false 
            this.setState({ orderProcessing: false, modal: false });
            // show error toast 
            this.showToast(err.message);

        }
    }

    redirectUser = path => this.props.history.push(path);

    isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
        return !address || !postalCode || !city || !confirmationEmailAddress;
    }

    showToast = (toastMessage, redirect = false) => {
        this.setState({ toast: true, toastMessage });

        setTimeout(() =>
            this.setState({
                toast: false,
                toastMessage: ''
            },
                // if true passed to 'redirect' argument, redirect home
                () => redirect && this.props.history.push('/')
            )
            , 5000);
    };

    closeModal = () => { };

    render() {
        const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state
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
                                display: "inlineBlock",
                                textAlign: "center",
                                maxWidth: 450
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
                                    type="text"
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
                                {/* Card Element  */}
                                <CardElement id="stripe__input" onReady={input => input.focus()} />
                                <button id="stripe__button" type="submit">Submit</button>

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
        heading="Confirm Your Order"
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

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
    // <StripeProvider apiKey="XXXXXtest_51IgxDiELXXXXXX">
    <StripeProvider apiKey={`${stripeApiKey}`}>
        <Elements>
            <CheckoutForm />
        </Elements>
    </StripeProvider>
)
export default Checkout;
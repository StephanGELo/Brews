import React from 'react';
import { Box, Text, Heading, Image, Button } from 'gestalt';
import { NavLink, withRouter } from 'react-router-dom';

import { getToken, clearCart, clearToken } from '../utils';

class Navbar extends React.Component {
    handleSignOut = () => {
        // clear token
        clearToken();
        // clear cart
        clearCart();
        // redirect home
        this.props.history.push('/');
    }

    render() {
        return getToken() !== null ? <AuthNav handleSignOut={this.handleSignOut} /> : <UnAuthNav />;
    }
};

const AuthNav = ({ handleSignOut }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="around"
            height={70}
            color="midnight"
            padding={1}
            shape='roundedBottom'
        >
            {/* Checkout Link */}
            <NavLink id='text' activeClassName='active' to='/checkout'>
                <Text size='xl' color='white'>Checkout</Text>
            </NavLink>

            {/* Title and Logo */}
            <NavLink id='text' activeClassName='active' exact to='/'>
                <Box display="flex" alignItems="center">
                    <Box margin={2} width={50} height={50}>
                        <Image
                            alt="BrewHaha Logo"
                            naturalHeight={1}
                            naturalWidth={1}
                            src="icons/logo.svg"
                        />
                    </Box>
                    {/* Title */}
                    <div className="main-title">
                        <Heading size="xs" color="orange">
                            BrewHaha
                    </Heading>
                    </div>
                </Box>
            </NavLink>

            {/* Signout Button*/}
            <Button
                color="transparent"
                text="Sign Out"
                inline
                size="md"
                onClick={handleSignOut} />
        </Box>
    )

};

const UnAuthNav = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="around"
            height={70}
            color="midnight"
            padding={1}
            shape='roundedBottom'
        >
            {/* Sign In Link */}
            <NavLink id='text' activeClassName='active' to='/signin'>
                <Text size='xl' color='white'>Sign In</Text>
            </NavLink>

            {/* Title and Logo */}
            <NavLink id='text' activeClassName='active' exact to='/'>
                <Box display="flex" alignItems="center">
                    <Box margin={2} width={50} height={50}>
                        <Image
                            alt="BrewHaha Logo"
                            naturalHeight={1}
                            naturalWidth={1}
                            src="icons/logo.svg"
                        />
                    </Box>
                    {/* Title */}
                    <div className="main-title">
                        <Heading size="xs" color="orange">
                            BrewHaha
                        </Heading>
                    </div>
                </Box>
            </NavLink>

            {/* Sign Up Link */}
            <NavLink id='text' activeClassName='active' to='/signup'>
                <Text size='xl' color='white'>Sign Up</Text>
            </NavLink>

        </Box>
    )
}

export default withRouter(Navbar);
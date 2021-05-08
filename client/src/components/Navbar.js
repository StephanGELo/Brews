import React from 'react';
import { Box, Text, Heading, Image, Button } from 'gestalt';
import { NavLink } from 'react-router-dom';

import { getToken } from '../utils';

const Navbar = () => {
    return getToken() !== null ? <AuthNav /> : <UnAuthNav />;
};

const AuthNav = () => {
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
                    <Heading size="xs" color="orange">
                        BrewHaha
                    </Heading>
                </Box>
            </NavLink>

            {/* Signout Button*/}
            <Button
                color="transparent"
                text="Sign Out"
                inline
                size="md"
            />
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
                    <Heading size="xs" color="orange">
                        BrewHaha
                    </Heading>
                </Box>
            </NavLink>

            {/* Sign Up Link */}
            <NavLink id='text' activeClassName='active' to='/signup'>
                <Text size='xl' color='white'>Sign Up</Text>
            </NavLink>

        </Box>
    )
}

export default Navbar;
import React from 'react';
import { Box, Text, Heading, Image } from 'gestalt';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
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
            <NavLink  id='text' activeClassName='active' to='/signin'>
                <Text size='x1' color='white'>Sign In</Text>
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
                <Text size='x1' color='white'>Sign Up</Text>
            </NavLink>

        </Box>
    )
}

export default Navbar;
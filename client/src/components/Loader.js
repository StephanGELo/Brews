import React from 'react';
import { RingLoader } from 'react-spinners';
import { Box } from 'gestalt';

const Loader = ({ show }) => (
    show && <Box
        position="fixed"
        dangerouslySetInlineStyle={{
            __style: {
                bottom: 600,
                left: "50%",
                transform: "translatex(-50%)"
            }
        }}
    >
        <RingLoader color="#D79FE2" size={60} />
    </Box>
);

export default Loader;
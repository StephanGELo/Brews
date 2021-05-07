import React from 'react';
import { Box, Toast } from 'gestalt';

const ToastMessage = ({ show, message }) => (
    show && (
        <Box
            dangerouslySetInlineStyle={{
                __style: {
                    bottom: 400,
                    left: "50%",
                    transform: "translateX(-50%)"
                }
            }}
            position="fixed"
            paddingX={1}
        >
            <Toast color="orange" text={message} />
        </Box>
    )
);

export default ToastMessage;
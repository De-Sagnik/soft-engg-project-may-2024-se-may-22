import React from 'react';
import { Button } from '@mui/material';

const SummarizeButton = ({ onClick, buttonText }) => {
    return (
        <Button variant="contained" onClick={onClick}>
            {buttonText}
        </Button>
    );
};

export default SummarizeButton;

import React from 'react';
import { Button } from '@mui/material';

const GenerateButton = ({ onClick, buttonText }) => {
    return (
        <Button variant="contained" onClick={onClick}>
            {buttonText}
        </Button>
    );
};

export default GenerateButton;

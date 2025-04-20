import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { SpinnerContainer, SpinnerWrapper, SpinnerText, getSize } from './styles';

/**
 * LoadingSpinner component using MUI CircularProgress
 * @param {Object} props - Component props
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - Size of the spinner.
 * @param {'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'} [props.color='primary'] - Color of the spinner.
 * @param {string} [props.text] - Optional text displayed below the spinner.
 * @param {boolean} [props.fullScreen=false] - If true, spinner covers the entire screen.
 */
const LoadingSpinner = ({ size = 'medium', color = 'primary', text, fullScreen = false }) => {
  const spinnerSize = getSize(size);

  return (
    <SpinnerContainer fullScreen={fullScreen}>
      <SpinnerWrapper>
        <CircularProgress size={spinnerSize} color={color} />
        {text && <SpinnerText variant="caption">{text}</SpinnerText>}
      </SpinnerWrapper>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 
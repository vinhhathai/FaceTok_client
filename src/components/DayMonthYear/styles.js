import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

export const DateSelectorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const DateFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  flex: 1,
}));

export const DateSelect = styled(Select)(({ theme }) => ({
  width: '100%',
})); 
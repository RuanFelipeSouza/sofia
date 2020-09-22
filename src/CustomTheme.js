import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import api from './services/Intelliboard';

import { createMuiTheme } from '@material-ui/core/styles';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';

export default function Theme(props) {
  const [primaryColor, setPrimaryColor] = useState(PRIMARY_COLOR);
  const [secondaryColor, setSecondaryColor] = useState(SECONDARY_COLOR);

  const palette = {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: primaryColor,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: will be calculated from palette.secondary.main,
      main: secondaryColor,
      // dark: will be calculated from palette.secondary.main,
      // contrastText: will be calculated to contrast with palette.secondary.main
    },
  };
  const themeName = 'Default Theme';

  useEffect(() => {
    api.get('/basicSettings').then(({data}) => {
      console.log(data);
      setPrimaryColor(previousColor => data.primaryColor || previousColor);
      setSecondaryColor(previousColor => data.secondaryColor || previousColor);
    });
  }, []);

  return (
    <ThemeProvider theme={createMuiTheme({ palette, themeName })}>
      {props.children}
    </ThemeProvider>
  );
}

Theme.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
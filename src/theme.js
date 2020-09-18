import { createMuiTheme } from '@material-ui/core/styles';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';
// import api from './services/Intelliboard';

let primaryColor;
let secondaryColor;

// api.get('/basicSettings').then(result => {
//   console.log(result.data);
//   primaryColor = '#0F0';
//   secondaryColor = '#F00';
// });

const palette = {
  primary: {
    // light: will be calculated from palette.primary.main,
    main: primaryColor || PRIMARY_COLOR,
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
  },
  secondary: {
    // light: will be calculated from palette.secondary.main,
    main: secondaryColor || SECONDARY_COLOR,
    // dark: will be calculated from palette.secondary.main,
    // contrastText: will be calculated to contrast with palette.secondary.main
  },
};
const themeName = 'Default Theme';

export default createMuiTheme({ palette, themeName });
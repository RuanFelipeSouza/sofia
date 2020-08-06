import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
  primary: {
    // light: will be calculated from palette.primary.main,
    main: '#4A148C',
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
  },
  secondary: {
    // light: will be calculated from palette.secondary.main,
    main: '#AC222A',
    // dark: will be calculated from palette.secondary.main,
    // contrastText: will be calculated to contrast with palette.secondary.main
  },
};
const themeName = 'Default Theme';

export default createMuiTheme({ palette, themeName });
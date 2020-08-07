import { createMuiTheme } from '@material-ui/core/styles';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './constants';

const palette = {
  primary: {
    // light: will be calculated from palette.primary.main,
    main: PRIMARY_COLOR,
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
  },
  secondary: {
    // light: will be calculated from palette.secondary.main,
    main: SECONDARY_COLOR,
    // dark: will be calculated from palette.secondary.main,
    // contrastText: will be calculated to contrast with palette.secondary.main
  },
};
const themeName = 'Default Theme';

export default createMuiTheme({ palette, themeName });
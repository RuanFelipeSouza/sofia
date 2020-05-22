import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { string, func } from 'prop-types';

export default function MaterialUIPickers(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="normal"
        id={props.id}
        label={props.label}
        value={props.value}
        onChange={props.handleChangeDate}
        disableFuture={true}
        autoOk={true}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

MaterialUIPickers.propTypes = {
  id: string.isRequired,
  label: string.isRequired,
  value: string.isRequired,
  handleChangeDate: func.isRequired
};

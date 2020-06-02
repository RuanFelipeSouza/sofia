import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: 16,
    marginBottom: 8,
    minWidth: 200,
  }
}));

export default function NativeSelects(props) {
  const classes = useStyles();

  function handleChange(e) {
    props.handleSelectChange(e.target.value);
  }

  return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="uncontrolled-native">Projeto</InputLabel>
        <NativeSelect
          inputProps={{
            name: 'project',
          }}
          onChange={handleChange}
          value={props.value}
        >
          <option value={"Login"}>Login</option>
          <option value={"Fornecedor"}>Fornecedor</option>
          <option value={"Cliente"}>Cliente</option>
        </NativeSelect>
      </FormControl>
  );
}

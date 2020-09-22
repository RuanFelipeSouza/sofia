import React from 'react';
import { string, func } from 'prop-types';
import { ChromePicker } from 'react-color';

export default function MaterialUIPickers(props) {
  return (
    <ChromePicker
      disableAlpha={true}
      color={props.color}
      onChangeComplete={(color) => props.handleChange(color, props.name)}
    />
  );
}

MaterialUIPickers.propTypes = {
  name: string.isRequired,
  color: string.isRequired,
  handleChange: func.isRequired
};

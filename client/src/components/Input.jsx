import React from 'react';
import TextField from "@mui/material/TextField"

function Input(props) {
  return <TextField onChange={props.onChange} id="outlined-basic" label={props.l} variant="outlined" name={props.name} />;

}

export default Input;

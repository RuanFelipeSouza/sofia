import React, { Component } from 'react';
import { func, number, bool } from 'prop-types';

import { InputWrapper, RoundTextField } from './elements';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };
  }

  componentDidMount() {
    this.inputRef.focus();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatSelectCount !== this.props.chatSelectCount) {
      this.inputRef.focus();
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  handleOnChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  sendMessage() {
    const { inputValue } = this.state;
    if (inputValue) {
      this.props.sendMessage(inputValue);
      this.setState({ inputValue: '' });
    }
  }

  render() {
    return (
      <InputWrapper>
        <RoundTextField
          variant='outlined'
          fullWidth
          id='message'
          name='message'
          label='Digite sua mensagem'
          margin='dense'
          innerRef={ref => { this.inputRef = ref; }}
          value={this.state.inputValue}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onChange={(e) => this.handleOnChange(e)}
          disabled={this.props.isDisabled}
          InputProps={{
            endAdornment:(
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => this.sendMessage()}>
                  <SendRoundedIcon color='primary' />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

      </InputWrapper>
    );
  }
}

ChatInput.propTypes = {
  sendMessage: func.isRequired,
  chatSelectCount: number.isRequired,
  isDisabled: bool
};

ChatInput.defaultProps = {
  isDisabled: false
};

export default ChatInput;
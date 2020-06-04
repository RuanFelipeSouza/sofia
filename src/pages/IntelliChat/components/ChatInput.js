import React, { Component } from 'react';
import { func, number, bool } from 'prop-types';

import { InputWrapper, RoundTextField } from './elements';

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
        <hr />
        <RoundTextField
          variant='outlined'
          fullWidth
          id='message'
          name='message'
          label='Digite sua mensagem'
          innerRef={ref => { this.inputRef = ref; }}
          value={this.state.inputValue}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onChange={(e) => this.handleOnChange(e)}
          disabled={this.props.isDisabled}
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
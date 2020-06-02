import React, { useState, useEffect } from 'react';
import ReactTooltip from "react-tooltip";
import { green, red } from '@material-ui/core/colors';
import { EmojiObjects } from '@material-ui/icons';

export default function TableIndicador(props) {
  const { messages } = props;
  const [tooltip, setTooltip] = useState('');

  useEffect(() => {
    if (messages.length > 0 && tooltip === '') {
      const misunderstoodMessages = messages.reduce((acc, current) => acc += `- ${current}<br>`, '');
      setTooltip(misunderstoodMessages);
    }
  }, [tooltip, messages]);

  return (
    <div>
      {messages.length > 0 && <ReactTooltip place="top" type="error" effect="float" multiline={true} />}
      <EmojiObjects data-tip={tooltip} style={{ color: messages.length > 0 ? red[500] : green[500] }} />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import ReactTooltip from "react-tooltip";
import { green, red } from '@material-ui/core/colors';
import { EmojiObjects } from '@material-ui/icons';
import api from '../services/api'

export default function TableIndicador(props) {
  const { id, anythingElse } = props;
  const [tooltip, setTooltip] = useState('');

  useEffect(() => {
    if (anythingElse && tooltip === '') {
      api.get(`/conversation/${id}`).then(({ data }) => {
        const { messages } = data;
        const misunderstoodMessages = messages.reduce((acc, current, index) => {
          if (current.message.startsWith('Eu não entendi') || current.message.startsWith('Você pode reformular')) {
            acc += `- ${messages[index - 1].message}<br>`;
          };
          return acc;
        }, '');
        setTooltip(misunderstoodMessages);
      });
    }
  }, [anythingElse, tooltip, id]);

  return (
    <div>
      {anythingElse && <ReactTooltip place="top" type="error" effect="float" multiline="true" />}
      <EmojiObjects data-tip={tooltip} style={{ color: anythingElse ? red[500] : green[500] }} />
    </div>
  );
}
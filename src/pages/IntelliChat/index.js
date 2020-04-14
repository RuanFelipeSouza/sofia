import React from 'react';
import Sidebar from '../../components/Sidebar'

import './styles.css';

function IntelliChat() {
  return (
    <>
      <Sidebar />
      <div className={"intellichat"}>
        <h1>IntelliChat</h1>
      </div>
    </>
  );
}

export default IntelliChat;
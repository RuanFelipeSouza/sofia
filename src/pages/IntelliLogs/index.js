import React from 'react';
import Sidebar from '../../components/Sidebar'

import './styles.css';

function IntelliLogs() {
  return (
    <>
      <Sidebar expanded={true}/>
      <div className={"intellilogs"}>
        <h1>IntelliLogs</h1>
      </div>
    </>
  );
}

export default IntelliLogs;
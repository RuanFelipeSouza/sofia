import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';
import * as moment from 'moment';

export default function Table(props) {

  const columns = [
    { title: 'Aluno', field: 'studentName' },
    { title: 'Professor', field: 'teacherName' },
    { title: 'ID', field: '_id' },
    { title: 'Data', field: 'createdAt', render: props => <React.Fragment>{ moment(props.value).format("DD/MM/YYYY") }</React.Fragment>, type: 'date' },
    { title: 'Detalhes', field: '_id', render: props => <Link to={`/conversation/${props._id}`}> Visualizar conversa <ArrowForwardOutlined size={16} /></Link>, export: false }
  ]

  return (
    <MaterialTable
      title="Atendimentos"
      columns={columns}
      data={props.atendimentos}
      options={{
        exportButton: true,
        pageSizeOptions: [5, 20, 50],
        exportAllData: true
      }}
      
    />
  );
}
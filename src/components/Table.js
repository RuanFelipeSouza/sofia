import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';

export default function Table(props) {

  console.log(props.atendimentos);

  const columns = [
    { title: 'Cliente', field: 'studentName' },
    { title: 'Advogado', field: 'teacherName' },
    { title: 'Nº Processo', field: 'lawsuit' },
    { title: 'Data', field: 'createdAt' },
    { title: 'Detalhes', field: '_id', render: props => <Link to={`/conversation/${props._id}`}> Visualizar conversa <ArrowForwardOutlined size={16} /></Link>, export: false }
  ]

  return (
    <MaterialTable
      title="Atendimentos"
      columns={columns}
      data={props.atendimentos}
      isLoading={props.isLoading}
      options={{
        exportButton: true,
        pageSizeOptions: [5, 20, 50],
        exportAllData: true
      }}
      
    />
  );
}
import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';

export default function Table(props) {
  const _renderUnderstood = ({ understood }) => understood ? <ThumbUpRoundedIcon style={{ color: '#4caf50' }} /> : <ThumbDownRoundedIcon style={{ color: '#f44336' }}  />;
  const _renderLink = ({ _id }) => <Link to={`/conversation/${_id}`}> Visualizar conversa <ArrowForwardOutlined size={16} /></Link>

  const columns = [
    { title: 'Aluno', field: 'studentName' },
    { title: 'Professor', field: 'teacherName' },
    { title: 'Status', field: 'class.status' },
    { title: 'Entendimento', field: 'understood', render: _renderUnderstood },
    { title: 'Board', field: 'class.boardId' },
    { title: 'ID', field: '_id' },
    { title: 'Data', field: 'createdAt' },
    { title: 'Detalhes', field: '_id', render: _renderLink, export: false }
  ]

  return (
    <MaterialTable
      title="Atendimentos"
      columns={columns}
      data={props.atendimentos}
      isLoading={props.isLoading}
      options={{
        exportButton: true,
        pageSizeOptions: [5, 20, 50, 100],
        exportAllData: true,
        pageSize: props.pageSize,
        initialPage: props.initialPage
      }}
      onChangePage={page => props.onChangePage(page)}
      onChangeRowsPerPage={pageSize => {
        props.onChangePage(0);
        props.onChangeRowsPerPage(pageSize);
      }}
      localization={{
        pagination: {
          labelDisplayedRows: '{from}-{to} de {count}'
        },
        header: {
          actions: 'Ações'
        },
        body: {
          emptyDataSourceMessage: 'Nenhum registro para ser exibido',
          addTooltip: 'Adicionar',
          deleteTooltip: 'Apagar',
          editTooltip: 'Editar',
          filterRow: {
            filterTooltip: 'Filtro'
          },
          editRow: {
            deleteText: 'Tem certeza que deseja apagar esse registro?',
            cancelText: 'Cancelar',
            saveText: 'Salvar',
          }
        },
        toolbar: {
          exportTitle: 'Exportar',
          exportAriaLabel: 'Exportar',
          exportName: 'Exportar como CSV',
          searchTooltip: 'Buscar',
          searchPlaceholder: 'Buscar'
        }
      }}
    />
  );
}

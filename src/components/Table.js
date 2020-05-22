import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { func, bool, array, number } from 'prop-types';
import api from './../services/api';

export default function Table(props) {

  const columns = [
    { title: 'Aluno', field: 'studentName' },
    { title: 'Professor', field: 'teacherName' },
    { title: 'ID', field: '_id' },
    { title: 'Data', field: 'createdAt' },
    // eslint-disable-next-line react/prop-types, react/display-name
    { title: 'Detalhes', field: '_id', render: props => <Link to={`/conversation/${props._id}`}> Visualizar conversa <ArrowForwardOutlined size={16} /></Link>, export: false }
  ];

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
      editable={{
        onRowUpdate: async (newData, oldData) => {
          if (oldData) {
            props.setAtendimentos((prevState) => {
              const data = prevState;
              data[data.indexOf(oldData)].viewed = newData.viewed;
              return data;
            });

            await api.put('/updateViewed', newData);
          }
        }
      }}
    />
  );
}

Table.propTypes = {
  atendimentos: array,
  isLoading: bool.isRequired,
  initialPage: number.isRequired,
  pageSize: number.isRequired,
  onChangePage: func.isRequired,
  onChangeRowsPerPage: func.isRequired,
  setAtendimentos: func.isRequired
};
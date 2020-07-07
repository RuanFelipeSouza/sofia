import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { func, bool, array, number } from 'prop-types';

export default function Table(props) {

  const columns = [
    { title: 'ID', field: 'id' },
    // eslint-disable-next-line react/prop-types
    { title: 'Data', render: props => `${props.dia}/${props.mes}/${props.ano}` },
    { title: 'Cód Cliente', field: 'cliente_id' },
    { title: 'Nome', field: 'nome' },
    { title: 'CPF/CNPJ', field: 'cpf_cnpj' },
    { title: 'Telefone', field: 'telefone' },
    { title: 'Status', field: 'status' },
    // eslint-disable-next-line react/prop-types, react/display-name
    { title: 'Detalhes', field: 'id', render: props => <Link to={`/conversation/${props.id}`}> Visualizar conversa <ArrowForwardOutlined size={16} /></Link>, export: false }
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
        body: {
          emptyDataSourceMessage: 'Nenhum registro para ser exibido',
          addTooltip: 'Adicionar',
          deleteTooltip: 'Apagar',
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

Table.propTypes = {
  atendimentos: array,
  isLoading: bool.isRequired,
  initialPage: number.isRequired,
  pageSize: number.isRequired,
  onChangePage: func.isRequired,
  onChangeRowsPerPage: func.isRequired,
  setAtendimentos: func.isRequired
};
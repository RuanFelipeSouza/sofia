import React from 'react';
import MaterialTable from 'material-table';
import { func, bool, array, number } from 'prop-types';

export default function Table(props) {
  return (
    <MaterialTable
      title={props.title}
      columns={props.columns}
      data={props.data}
      isLoading={props.isLoading}
      options={{
        exportButton: true,
        pageSizeOptions: [5, 20, 50, 100],
        exportAllData: true,
        pageSize: props.pageSize,
        initialPage: props.initialPage,
      }}
      onChangePage={(page) => props.onChangePage(page)}
      onChangeRowsPerPage={(pageSize) => {
        props.onChangePage(0);
        props.onChangeRowsPerPage(pageSize);
      }}
      localization={{
        pagination: {
          labelDisplayedRows: '{from}-{to} de {count}',
        },
        header: {
          actions: 'Ações',
        },
        body: {
          emptyDataSourceMessage: 'Nenhum registro para ser exibido',
          addTooltip: 'Adicionar',
          deleteTooltip: 'Apagar',
          editTooltip: 'Editar',
          filterRow: {
            filterTooltip: 'Filtro',
          },
          editRow: {
            deleteText: 'Tem certeza que deseja apagar esse registro?',
            cancelText: 'Cancelar',
            saveText: 'Salvar',
          },
        },
        toolbar: {
          exportTitle: 'Exportar',
          exportAriaLabel: 'Exportar',
          exportName: 'Exportar como CSV',
          searchTooltip: 'Buscar',
          searchPlaceholder: 'Buscar',
        },
      }}
      editable={{ onRowUpdate: props.onRowUpdate }}
    />
  );
}

Table.propTypes = {
  data: array,
  title: String.isRequired,
  isLoading: bool.isRequired,
  initialPage: number.isRequired,
  pageSize: number.isRequired,
  onChangePage: func.isRequired,
  onChangeRowsPerPage: func.isRequired,
  columns: array.isRequired,
  onRowUpdate: func,
};

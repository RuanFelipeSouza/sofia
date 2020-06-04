import React from 'react';
import MaterialTable from 'material-table';

const defaultOptions = {
  paging: true,
  pageSizeOptions: [5, 20, 50, 100],
  pageSize: 5,
  initialPage: 0,
  searchFieldAlignment: 'left',
  toolbarButtonAlignment: 'left',
  exportButton: true,
  exportAllData: true,
  addRowPosition: 'first',
  rowStyle: {
    verticalAlign: 'initial'
  },
  filtering: true
};

const defaultLocalization = {
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
    searchPlaceholder: 'Buscar',
    nRowsSelected: '{0} Linha(s) selecionada(s)'
  }
};

export default function GenericTable(props) {
  const {
    title, columns, data, options, isLoading, onFilterChange
    , onChangePage, onChangeRowsPerPage, onSelectionChange
  } = props;
  const mergedOptions = {
    ...defaultOptions,
    ...options
  };

  return (
    <MaterialTable
      title={title}
      columns={columns}
      data={data}
      isLoading={isLoading}
      options={mergedOptions}
      localization={defaultLocalization}
      onFilterChange={
        columns => {
          if (onFilterChange) {
            const newFilter = columns.reduce((acc, current) => { return { ...acc, [current.column.field]: current.value } }, {});
            onFilterChange(newFilter);
          }
        }
      }
      onChangePage={page => onChangePage && onChangePage(page)}
      onChangeRowsPerPage={pageSize => {
        if (onChangePage && onChangeRowsPerPage) {
          onChangePage(0);
          onChangeRowsPerPage(pageSize);
        }
      }}
      onSelectionChange={rows => onSelectionChange && onSelectionChange(rows)}
    />
  );
}
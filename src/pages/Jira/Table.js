import React from 'react';
import MaterialTable from 'material-table';

export default function Table(props) {
  const columns = [
    { 
      title: 'ID', 
      field: '_id', 
      editable: 'never', 
    render: elem => <a href={`https://suporte-intelliway.atlassian.net/jira/servicedesk/projects/INTELLIWAY/queues/custom/7/${elem._id}`}  target="_blank">{elem._id}</a>
    },
    // https://suporte-intelliway.atlassian.net/jira/servicedesk/projects/INTELLIWAY/queues/custom/7/
    { title: 'Data', field: 'fields.dataReferencia', editable: 'never' },
    { title: 'Quantidade de horas', field: 'fields.horasUtilizadas', editable: 'never' },
    { title: 'Finalizado', field: 'fields.concluido', editable: 'never', type: 'boolean' },
  ]

  return (
    <MaterialTable
      title="Chamados"
      columns={columns}
      data={props.issues}
    //   isLoading={props.isLoading}
      options={{
        exportButton: true,
        pageSizeOptions: [5, 20, 50, 100],
        exportAllData: true,
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
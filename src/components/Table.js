import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';
import api from './../services/api'
import TableIndicador from './TableIndicador';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';

function _renderRating({rating}) {
  switch(rating) {
    case 10:
      return <Paper style={{backgroundColor: 'green', color: 'white', textAlign: 'center'}}>
        Promotor
      </Paper>
    case 8:
      return <Paper style={{backgroundColor: 'yellow', textAlign: 'center'}}>
        Neutro
      </Paper>
    case 6:
      return <Paper style={{backgroundColor: 'red', color: 'white', textAlign: 'center'}}>
        Detrator
      </Paper>
    default:
      return <Paper style={{textAlign: 'center'}}>
        Não definido
      </Paper>
  }
}

export default function Table(props) {
  console.log(props.atendimentos.filter(e=>e.rating));
  const _sortCreatedAt = (a, b) => {
    return moment(a.createdAt, 'DD/MM/YYYY').isAfter(moment(b.createdAt, 'DD/MM/YYYY')) ? 1 : -1;
  };

  const columns = [
    { title: 'ID', field: '_id', editable: 'never' },
    { title: 'Data', field: 'createdAt', editable: 'never', customSort: _sortCreatedAt },
    { 
      title: 'Avaliação', 
      field: 'rating', 
      editable: 'never', 
      render: _renderRating,
      lookup: { 10: 'Promotor', 8: 'Neutro', 6: 'Detrator' },
    },
    {
      title: 'Indicador',
      field: 'misunderstoodMessages.length',
      editable: 'never',
      filtering: false,
      render: ({ misunderstoodMessages }) => <TableIndicador messages={misunderstoodMessages} />
    },
    { title: 'Visualizado', field: 'viewed', type: 'boolean', editable: 'onUpdate' },
    { 
      title: 'Detalhes', 
      field: '_id', 
      editable: 'never', 
      render: props2 => 
        <Link 
          id={props2._id} 
          to={`/conversation/${props2._id}`}
        > 
          Visualizar conversa <ArrowForwardOutlined size={16} />
        </Link>, 
      export: false,
      filtering: false
    }
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
        initialPage: props.initialPage,
        filtering: true
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
        onRowUpdate: async (newData, oldData) =>   {        
            if(oldData) {
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
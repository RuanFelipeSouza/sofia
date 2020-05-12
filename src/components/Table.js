import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { green, red } from '@material-ui/core/colors';
import { ArrowForwardOutlined, EmojiObjects } from '@material-ui/icons';
import api from './../services/api'

export default function Table(props) {
  const columns = [
    { title: 'ID', field: '_id', editable: 'never' },
    { title: 'Data', field: 'createdAt', editable: 'never' },
    { title: 'Indicador', field: 'anythingElse', editable: 'never', render: props2 => props2.anythingElse ? <EmojiObjects style={{ color: red[500] }}/> : <EmojiObjects style={{ color: green[500] }}/>},
    { title: 'Visualizado', field: 'viewed', type: 'boolean', editable: 'onUpdate' },
    { 
      title: 'Detalhes', 
      field: '_id', 
      editable: 'never', 
      render: props2 => 
        <Link 
          id={props2._id} 
          to={`/conversation/${props2._id}`}
          onClick={(e) => {
            const data = props.atendimentos;
            const oldData = data.find(d => d._id === e.target.id);
            data[data.indexOf(oldData)].viewed = true;
            props.setAtendimentos(data);
            api.put('/updateViewed', {_id: e.target.id, viewed: true});
          }} 
        > 
          Visualizar conversa <ArrowForwardOutlined size={16} />
        </Link>, 
      export: false 
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
        pageSizeOptions: [5, 20, 50],
        exportAllData: true,
        initialPage: props.initialPage
      }}
      onChangePage={page => props.onChangePage(page)}
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
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';
// import { DropzoneDialog } from 'material-ui-dropzone';
// import Button from '@material-ui/core/Button';
// import Modal from '@material-ui/core/Modal';
// import Backdrop from '@material-ui/core/Backdrop';
// import Fade from '@material-ui/core/Fade';
// import * as parse from 'html-react-parser';



const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%'
  },
  table: {
    // minWidth: '100%'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    boxShadow: theme.shadows[5],
  }
}));

export default function Table(props) {
    const classes = useStyles();
    // const [imageDialogOpen, setImageDialogOpen] = useState(false);
    // const [imageOpen, setImageOpen] = useState(false);
    // const [itemSelecionado, setItemSelecionado] = useState({});

    const columns = [
        { title: 'Nome', field: 'name' },
        { title: 'Email', field: 'email', initialEditValue: '' },
        { title: 'Endereço', field: 'address', initialEditValue: '' },
        { title: 'Telefone', field: 'phone', initialEditValue: '' },
    ]

    return (
        <MaterialTable
            className={classes.table}
            title="Central de Clientes"
            columns={columns}
            data={props.clients}
            isLoading={props.isLoading}
            options={{
                paging: false,
                searchFieldAlignment: 'left',
                toolbarButtonAlignment: 'left',
                exportButton: true,
                exportAllData: true,
                rowStyle: {
                    verticalAlign: 'initial'
                },
                addRowPosition: 'first'
            }}
            localization={{
              pagination: {
                  labelDisplayedRows: '{from}-{to} de {count}'
              },
              toolbar: {
                  nRowsSelected: '{0} linha(s) selected'
              },
              header: {
                  actions: 'Ações'
              },
              body: {
                  emptyDataSourceMessage: 'Nenhum registro para ser exibido',
                  filterRow: {
                      filterTooltip: 'Filter'
                  }
              }
          }}
            editable={{
                onRowAdd: async newData =>{
                    // props.setCuradorias((prevState) => {
                    //     newData.updatedAt = new Date();
                    //     newData.bot = props.botName;
                    //     return [...prevState, newData];
                    // });
                    // await api.post('/curadoria', newData);
                },
                onRowUpdate: async (newData, oldData) => {
                    // if(oldData) {
                    //     props.setCuradorias((prevState) => {
                    //         const data = prevState;
                    //         for(let key in newData) {
                    //             data[data.indexOf(oldData)][key] = newData[key];
                    //         }
                    //         data[data.indexOf(oldData)].updatedAt = new Date();
                    //         return [...data];
                    //     });
                    //     await api.put('/curadoria', newData);
                    // }
                },
                onRowDelete: async (oldData) => {
                    // props.setCuradorias((prevState) => {
                    //     const data = prevState;
                    //     data.splice(data.indexOf(oldData), 1);
                    //     return [...data];
                    // });
                    // console.log(oldData);

                    // await api.delete('/curadoria', {params: {_id: oldData._id}});
                }
            }}
        />
    );
}
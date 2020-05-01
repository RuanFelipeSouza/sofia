import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import * as parse from 'html-react-parser';

import api from '../../services/api'

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%'
  }
}));

export default function Curadoria(props) {
    const classes = useStyles();

    const columns = [
        { title: 'Arquivo', field: 'arquivo' },
        { title: 'Tema', field: 'tema', initialEditValue: '' },
        { 
            title: 'Possíveis perguntas', 
            field: 'perguntas', 
            cellStyle: { width: '30%' },
            editComponent: props => {
                return <TextareaAutosize 
                    className={classes.textField} 
                    aria-label="Possíveis perguntas" 
                    rowsMin={5}
                    onChange={e => 
                        props.onRowDataChange({
                            ...props?.rowData,
                            perguntas: e?.target?.value
                        })
                    }
                    value={props.rowData.perguntas} 
                />
            },
            render: props => <React.Fragment>{parse(props?.perguntas?.replace(/\n/g, '<br/>'))}</React.Fragment>,
        },
        { 
            title: 'Possíveis respostas', 
            field: 'respostas', 
            cellStyle: { width: '30%' },
            editComponent: props => {
                console.log(props);
                return <TextareaAutosize 
                    className={classes.textField} 
                    aria-label="Possíveis respostas" 
                    rowsMin={5}
                    onChange={e => 
                        props.onRowDataChange({
                            ...props?.rowData,
                            respostas: e?.target?.value
                        })
                    }
                    value={props?.rowData?.respostas} 
                />
            },
            render: props => <React.Fragment>{parse(props?.respostas?.replace(/\n/g, '<br/>'))}</React.Fragment>,
        },
        { title: 'Validação do conteúdo', field: 'validacaoConteudo', type: 'boolean' },
        { title: 'Possível validar no BOT', field: 'possivelValidarBOT', type: 'boolean' },
        { title: 'Validação BOT', field: 'validacaoBOT', type: 'boolean' },
        { title: 'Responsável', field: 'responsavel' },
        { title: 'Última atualização', field: 'updatedAt', type: 'date', editable: 'never' },
    ]

    return (
        <MaterialTable
            title="Curadoria"
            columns={columns}
            data={props.curadorias.filter(e => e.bot === props.botName)}
            options={{
                paging: false,
                searchFieldAlignment: 'left',
                toolbarButtonAlignment: 'left',
                exportButton: true,
                exportAllData: true,
                rowStyle: {
                    verticalAlign: 'initial'
                }
            }}
            editable={{
                onRowAdd: async newData =>{
                    props.setCuradorias((prevState) => {
                        newData.updatedAt = new Date();
                        newData.bot = props.botName;
                        return [...prevState, newData];
                    });
                    await api.post('/curadoria', newData);
                },
                onRowUpdate: async (newData, oldData) => {
                    if(oldData) {
                        props.setCuradorias((prevState) => {
                            const data = prevState;
                            for(let key in newData) {
                                data[data.indexOf(oldData)][key] = newData[key];
                            }
                            data[data.indexOf(oldData)].updatedAt = new Date();
                            return [...data];
                        });
                        await api.put('/curadoria', newData);
                    }
                },
                onRowDelete: async (oldData) => {
                    props.setCuradorias((prevState) => {
                        const data = prevState;
                        data.splice(data.indexOf(oldData), 1);
                        return [...data];
                    });

                    await api.delete('/curadoria', {params: oldData});
                }
            }}
        />
    );
}
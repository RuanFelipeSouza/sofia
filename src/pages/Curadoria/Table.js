import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { DropzoneDialog } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import * as parse from 'html-react-parser';

import api from '../../services/api'

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

export default function Curadoria(props) {
    const classes = useStyles();
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState({});

    const columns = [
        { title: 'Arquivo', field: 'arquivo' },
        { title: 'Tema', field: 'tema', initialEditValue: '' },
        { 
            title: 'Vídeo', 
            field: 'videoLink', 
            cellStyle: { width: '10%' },
            sorting: false,
            render: props2 => <a href={props2.videoLink} target={"_black"}>{props2.videoLink}</a> 
        },
        { 
            title: 'Imagem', 
            field: 'image', 
            editable: 'never',
            sorting: false,
            filtering: false,
            render: props2 => {
                if(!props2) return <></>
                if(!props2.image) {
                    return <React.Fragment>
                        <Button onClick={() => {setItemSelecionado(props2); setImageDialogOpen(true);}}>
                            Adicionar imagem
                        </Button>
                        <DropzoneDialog
                            open={imageDialogOpen}
                            onSave={files => {
                                var file = files[0]
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    props.setCuradorias((prevState) => {
                                        const data = prevState;
                                        console.log(itemSelecionado);
                                        data[data.indexOf(itemSelecionado)].image = event.target.result;
                                        api.put('/curadoria', data[data.indexOf(itemSelecionado)]);
                                        return [...data];
                                    });
                                };
                                reader.readAsDataURL(file);

                                setImageDialogOpen(false);
                            }}
                            acceptedFiles={['image/*']}
                            showPreviews={true}
                            filesLimit={1}
                            maxFileSize={5000000}
                            onClose={() => setImageDialogOpen(false)}
                        />
                    </React.Fragment>
                }else{
                    return <React.Fragment>
                        <img alt={props2.arquivo} style={{width: '150px', cursor: 'pointer'}} src={props2.image} onClick={() => { setItemSelecionado(props2); setImageOpen(true); }} />
                        
                        <Button 
                            onClick={() => {
                                props.setCuradorias((prevState) => {
                                    const data = prevState;
                                    console.log(props2);
                                    data[data.indexOf(props2)].image = null;
                                    api.put('/curadoria', data[data.indexOf(props2)]);
                                    return [...data];
                                });
                            }}
                        >
                            remover imagem
                        </Button>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={imageOpen}
                            onClose={() => {
                                setImageOpen(false)
                                setItemSelecionado({});
                            }}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                            timeout: 500,
                            }}
                        >
                            <Fade in={imageOpen}>
                            <div className={classes.paper}>
                                <img alt={itemSelecionado?.arquivo} src={itemSelecionado?.image} />
                            </div>
                            </Fade>
                        </Modal>
                    </React.Fragment>
                }
            }
        },
        { 
            title: 'Possíveis perguntas', 
            field: 'perguntas', 
            cellStyle: { width: '20%' },
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
            render: props => <React.Fragment>{props.perguntas && parse(props?.perguntas?.replace(/\n/g, '<br/>'))}</React.Fragment>,
        },
        { 
            title: 'Possíveis respostas', 
            field: 'respostas', 
            cellStyle: { width: '20%' },
            editComponent: props => {
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
            render: props => <React.Fragment>{props.respostas && parse(props?.respostas?.replace(/\n/g, '<br/>'))}</React.Fragment>,
        },
        { title: 'Validação do conteúdo', field: 'validacaoConteudo', type: 'boolean' },
        { title: 'Possível validar no BOT', field: 'possivelValidarBOT', type: 'boolean' },
        { title: 'Validação BOT', field: 'validacaoBOT', type: 'boolean' },
        { title: 'Responsável', field: 'responsavel' },
        { title: 'Última atualização', field: 'updatedAt', type: 'date', editable: 'never' },
    ]

    return (
        <MaterialTable
            className={classes.table}
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
                    console.log(oldData);

                    await api.delete('/curadoria', {params: {_id: oldData._id}});
                }
            }}
        />
    );
}
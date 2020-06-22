import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Editor from './Editor';
import * as parse from 'html-react-parser';
import * as moment from 'moment';

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
    },
    editor: {
        boxShadow: theme.shadows[5],
        height: '100%',
        width: '100%',
        padding: '1% 10%',
        overflowY: 'scroll',
    },
    formTop: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    arquivoTema: {
        width: '40%'
    },
    perguntas: {
        width: '100%'
    },
    editorSubmitButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '0 !important',
        marginTop: 0,
    },
    editorHeader: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}));

export default function Curadoria(props) {
    const classes = useStyles();
    // const [imageModalOpen, setImageModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    // const [imageSource, setImageSource] = useState('');
    const [itemSelecionado, setItemSelecionado] = useState(null);
    
    // const getImage = id => {
    //     setLoading(true);
    //     setImageModalOpen(true);
    //     api.get(`/curadoria/${id}`).then(response => {
    //         setImageSource(response.data.image);
    //         setLoading(false);
    //     })
    // }

    const columns = [
        // { 
        //     title: 'Mídias', 
        //     // width: 200,
        //     sorting: false,
        //     editable: 'never',
        //     readonly: true,
        //     defaultFilter: props.filter.videoLink,
        //     render: fields => 
        //         <React.Fragment>
        //             {fields?.hasImage && <Button onClick={() => getImage(fields?._id)}><ImageIcon /></Button>} 
        //             {fields?.hasVideo && <Button onClick={() => console.log('coe')}><VideoIcon /></Button>}
        //             <Modal
        //                 aria-labelledby="transition-modal-title"
        //                 aria-describedby="transition-modal-description"
        //                 className={classes.modal}
        //                 open={imageModalOpen}
        //                 onClose={() => {
        //                     setImageModalOpen(false);
        //                     setImageSource('');
        //                     // setItemSelecionado({});
        //                 }}
        //                 closeAfterTransition
        //                 BackdropComponent={Backdrop}
        //                 BackdropProps={{
        //                     timeout: 500,
        //                 }}
        //             >
        //                 <Fade in={imageModalOpen}>
        //                     {loading ? 
        //                         (<CircularProgress size={25} />) 
        //                         : 
        //                         <div className={classes.paper}>
        //                             <img alt={'imagem'} src={imageSource} />
        //                         </div>
        //                     }
        //                 </Fade>
        //             </Modal>
        //         </React.Fragment>
        // },
        { title: 'Arquivo', field: 'arquivo', width: 100, defaultFilter: props.filter.arquivo },
        { title: 'Tema', field: 'tema', width: 100, initialEditValue: '', defaultFilter: props.filter.tema },
        { 
            title: 'Possíveis perguntas', 
            field: 'perguntas', 
            cellStyle: { width: '20%' },
            defaultFilter: props.filter.perguntas,
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
            defaultFilter: props.filter.respostas,
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
        { title: 'Validação do conteúdo', field: 'validacaoConteudo', width: 50, type: 'boolean', defaultFilter: props.filter.validacaoConteudo },
        { title: 'Possível validar no BOT', field: 'possivelValidarBOT', width: 50, type: 'boolean', defaultFilter: props.filter.possivelValidarBOT },
        { title: 'Validação BOT', field: 'validacaoBOT', width: 50, type: 'boolean', defaultFilter: props.filter.validacaoBOT },
        { title: 'Responsável', field: 'responsavel', defaultFilter: props.filter.responsavel, customFilterAndSearch: (term, { responsavel }) => term === '!' ? !responsavel : responsavel && responsavel.toLowerCase().includes(term.toLowerCase()) },
        {
            title: 'Última atualização', field: 'updatedAt', type: 'date', editable: 'never', defaultFilter: props.filter.updatedAt,
            customFilterAndSearch: (term, rowData) => {
                const filterDate = moment(term);
                const rowDate = moment(rowData.updatedAt);
                return filterDate.isSame(rowDate, 'day');
            },
            render: props => <React.Fragment>{moment(props?.updatedAt).format("DD/MM/YYYY")}</React.Fragment>
        },
    ];

    return (
        <>
            <Editor id={itemSelecionado} open={editModalOpen} setOpen={setEditModalOpen} />
            <MaterialTable
                className={classes.table}
                title="Curadoria"
                columns={columns}
                data={props.curadorias.filter(e => e.bot === props.botName)}
                isLoading={props.loading}
                options={{
                    paging: true,
                    pageSizeOptions: [5, 20, 50, 100],
                    pageSize: props.pageSize,
                    searchFieldAlignment: 'left',
                    toolbarButtonAlignment: 'left',
                    exportButton: true,
                    exportAllData: true,
                    addRowPosition: 'first',
                    rowStyle: {
                        verticalAlign: 'initial'
                    },
                    filtering: true,
                    selection: true
                }}
                onFilterChange={columns => {
                    const newFilter = columns.reduce((acc, current) => { return { ...acc, [current.column.field]: current.value } }, {});
                    props.onFilterChange(newFilter);
                    return columns;
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
                    toolbar: {
                        nRowsSelected: '{0} linha(s) selecionada(s)'
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
                actions={[
                    {
                        tooltip: 'Remover todas as linhas selecionadas',
                        icon: 'delete',
                        onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
                    }
                ]}
                onRowClick={(event, rowData, togglePanel) => {
                    setItemSelecionado(rowData._id);
                    setEditModalOpen(true);
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
                    // onRowUpdate: async (newData, oldData) => {
                    //     if(oldData) {
                    //         const alteredFields = [];
                    //         props.setCuradorias((prevState) => {
                    //             const data = prevState;
                    //             for (let key in newData) {
                    //                 if (data[data.indexOf(oldData)][key] !== newData[key]) {
                    //                     alteredFields.push(key);
                    //                 }
                    //                 data[data.indexOf(oldData)][key] = newData[key];
                    //             }
                    //             data[data.indexOf(oldData)].updatedAt = new Date();
                    //             return [...data];
                    //         });
                    //         await api.put('/curadoria', { newData, alteredFields: alteredFields.filter(c => c !== "updatedAt") });
                    //     }
                    // },
                    // onRowDelete: async (oldData) => {
                    //     props.setCuradorias((prevState) => {
                    //         const data = prevState;
                    //         data.splice(data.indexOf(oldData), 1);
                    //         return [...data];
                    //     });
                    //     console.log(oldData);

                    //     await api.delete('/curadoria', { params: { _id: oldData._id, bot: oldData.bot } });
                    // }
                }}
            />
        </>
    );
}
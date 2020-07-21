import React, { useState } from 'react';
import MaterialTable from 'material-table';
import ImageIcon from '@material-ui/icons/Image';
import VideoIcon from '@material-ui/icons/Videocam';
import Editor from './Editor';
import * as parse from 'html-react-parser';
import * as moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

import api from '../../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Curadoria(props) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const columns = [
        {
            title: 'Mídias',
            sorting: false,
            editable: 'never',
            readonly: true,
            defaultFilter: props.filter.videoLink,
            render: fields =>
                <React.Fragment>
                    {fields?.hasImage && <ImageIcon />}
                    {fields?.hasVideo && <VideoIcon />}
                </React.Fragment>
        },
        { title: 'Arquivo', field: 'arquivo', width: 100, defaultFilter: props.filter.arquivo },
        { title: 'Tema', field: 'tema', width: 100, initialEditValue: '', defaultFilter: props.filter.tema },
        {
            title: 'Possíveis perguntas',
            field: 'perguntas',
            cellStyle: { width: '20%' },
            defaultFilter: props.filter.perguntas,
            render: props => {
                const perguntas = props?.perguntas?.replace(/\n/g, '<br/>');
                return <React.Fragment>{perguntas && parse(`${perguntas.substr(0, 200)}${perguntas?.length > 200 ? '...' : ''}`)}</React.Fragment>
            },
        },
        {
            title: 'Possíveis respostas',
            field: 'respostas',
            cellStyle: { width: '20%' },
            defaultFilter: props.filter.respostas,
            render: props => {
                const respostas = props?.respostas?.replace(/\n/g, '<br/>');
                return <React.Fragment>{respostas && parse(`${respostas?.substr(0, 250)}${respostas?.length > 250 ? '...' : ''}`)}</React.Fragment>
            },
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

    const handleDelete = _ => {
        selectedRows.forEach(async row => {
            props.setCuradorias((prevState) => {
                const data = prevState;
                data.splice(data.indexOf(data.find(e => e._id === row._id)), 1);
                return [...data];
            });
    
            await api.delete('/curadoria', { params: { _id: row._id, bot: row.bot } });
        })
        setOpenDeleteDialog(false);
        setSelectedRows([]);
    }

    return (
        <>
            <Editor bot={props.botName} id={itemSelecionado} setIitemSelecionado={setItemSelecionado} open={editModalOpen} setOpen={setEditModalOpen} setCuradorias={props.setCuradorias} />
            <Dialog name="deleteDialog"
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Você confirma a exclusão?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Essa ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            <MaterialTable
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
                        height: '10%',
                        overflow: 'hidden',
                        verticalAlign: 'initial',
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
                        nRowsSelected: '{0} linha(s) selecionada(s)',
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
                        onClick: (evt, data) => {
                            setSelectedRows(data);
                            setOpenDeleteDialog(true);
                        }
                    }, {
                        tooltip: 'Adicionar linha',
                        icon: 'add',
                        onClick: (evt, data) => {
                            setItemSelecionado('');
                            setEditModalOpen(true);
                        },
                        disabled: false,
                        hidden: false,
                        position: 'toolbar'
                    }
                ]}
                onRowClick={(event, rowData, togglePanel) => {
                    setItemSelecionado(rowData._id);
                    setEditModalOpen(true);
                }}
            />
        </>
        
    );
}
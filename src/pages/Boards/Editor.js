import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import api from '../../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
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
    form: {
        display: 'flex',
        // justifyContent: 'space-between'
    },
    phases: {
        maxWidth: '35%',
        margin: '0 5%'
    },
    fields: {
        maxWidth: '35%',
        margin: '0 5%'
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
    },
    name: {
        marginLeft: '5%'
    }
}));

export default function Editor(props) {
    const classes = useStyles();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const { editorState } = props;

    const handleChange = (event) => {
        const { name, value } = event.target;
        props.setEditorState(oldState => {
            return {
                ...oldState,
                [name]: value
            }
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if(props.novo) {
            await api.post('/board', { data: editorState });
            props.setBoards((prevState) => {
                const data = prevState;
                return [...data, editorState];
            });
        }else{
            await api.put('/board', { newData: editorState });
            props.setBoards((prevState) => {
                const data = prevState;
                const index = data.findIndex(e => e._id === editorState._id);
                for (let key in editorState) {
                    data[index][key] = editorState[key];
                }
                return [...data];
            });
        }
        props.setEditorState({});
        props.setOpen(false);
        props.setNovo(false);
    };

    const handleDelete = async e => {
        props.setBoards((prevState) => {
            const data = prevState;
            data.splice(data.indexOf(data.find(e => e._id === editorState._id)), 1);
            return [...data];
        });

        await api.delete('/board', { params: { id: editorState._id } });
        props.setOpen(false);
        props.setNovo(false);
        setOpenDeleteDialog(false);
    }
        
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={props.open}>
                <Paper className={classes.editor} >
                    <form onSubmit={handleSubmit} component="fieldset" className={classes.formControl}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className={classes.editorHeader} >
                                <Button className={classes.editBackButton} onClick={() => { props.setOpen(false); props.setNovo(false); }} ><ArrowBackIcon /></Button>
                                {!props.novo && <Button variant="contained" color="secondary" onClick={() => setOpenDeleteDialog(true)} >
                                    Excluir
                                </Button>}
                                <Dialog
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
                            </Grid>
                            <Grid item xs={12} >
                                <TextField disabled={!props.novo} id="id" label="Identificador do board" variant="outlined" value={editorState._id} name="_id" onChange={handleChange} required />
                                <TextField id="name" label="Nome do board" variant="outlined" value={editorState.name} name="name" onChange={handleChange} required className={classes.name} />
                                <Grid container spacing={3}>
                                    <br /><br /> Fases
                                    <Grid item xs={12} className={classes.form} >
                                        <TextField id="readyToContactPhaseId" label="Pronto para entrar em contato" variant="outlined" value={editorState.readyToContactPhaseId} className={classes.phases} name="readyToContactPhaseId" onChange={handleChange} required />
                                        <TextField id="inProgressPhaseId" label="Em atendimento" variant="outlined" value={editorState.inProgressPhaseId} className={classes.phases} name="inProgressPhaseId" onChange={handleChange} required />
                                        <TextField id="scheduleConnectionPhaseId" label="Conexão agendada" variant="outlined" value={editorState.scheduleConnectionPhaseId} className={classes.phases} name="scheduleConnectionPhaseId" onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={12} className={classes.form} >
                                        <TextField id="completedConnectionPhaseId" label="Conexão realizada" variant="outlined" value={editorState.completedConnectionPhaseId} className={classes.phases} name="completedConnectionPhaseId" onChange={handleChange} required />
                                        <TextField id="satisfactionSurveyAnsweredPhaseId" label="Pesquisa de satisfação respondida" variant="outlined" value={editorState.satisfactionSurveyAnsweredPhaseId} className={classes.phases} name="satisfactionSurveyAnsweredPhaseId" onChange={handleChange} required />
                                        <TextField id="notConnectedPhaseId" label="Não conectado/cancelado" variant="outlined" value={editorState.notConnectedPhaseId} className={classes.phases} name="notConnectedPhaseId" onChange={handleChange} required />
                                    </Grid>
                                    <br /><br /> Campos
                                    <Grid item xs={12} className={classes.form} >
                                        <TextField id="nameFieldId" label="Nome" variant="outlined" value={editorState.nameFieldId} className={classes.fields} name="nameFieldId" onChange={handleChange} required />
                                        <TextField id="phoneFieldId" label="Telefone" variant="outlined" value={editorState.phoneFieldId} className={classes.fields} name="phoneFieldId" onChange={handleChange} required />
                                        <TextField id="emailFieldId" label="Email" variant="outlined" value={editorState.emailFieldId} className={classes.fields} name="emailFieldId" onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={12} className={classes.form} >
                                        <TextField id="linkedinFieldId" label="LinkedIn" variant="outlined" value={editorState.linkedinFieldId} className={classes.fields} name="linkedinFieldId" onChange={handleChange} required />
                                        <TextField id="bioFieldId" label="Minibio" variant="outlined" value={editorState.bioFieldId} className={classes.fields} name="bioFieldId" onChange={handleChange} required />
                                        <TextField id="desafiosFieldId" label="Desafios" variant="outlined" value={editorState.desafiosFieldId} className={classes.fields} name="desafiosFieldId" onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={12} className={classes.form} >
                                        <TextField id="cidadeFieldId" label="Cidade" variant="outlined" value={editorState.cidadeFieldId} className={classes.fields} name="cidadeFieldId" onChange={handleChange} required />
                                        <TextField id="descricaoFieldId" label="Descrição do desafio" variant="outlined" value={editorState.descricaoFieldId} className={classes.fields} name="descricaoFieldId" onChange={handleChange} required />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.editorSubmitButton} >
                                <Button variant="contained" type="submit" >Salvar</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Fade>
        </Modal>
    )
}
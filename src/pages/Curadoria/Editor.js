import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import RichText from '../../components/RichText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

export default function Editor(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editorState, setEditorState] = useState({});
    const [alteredFields, setAlteredFields] = useState([]);
    
    useEffect(() => {
        if(!props.id) return;

        setLoading(true);
        api.get(`/curadoria/${props.id}`).then(response => {
            setEditorState(response.data);
            setLoading(false);
        })
    }, [props]);

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        setEditorState(oldState => {
            return {
                ...oldState,
                [name]: checked || value
            }
        });
        setAlteredFields(oldValue => new Set(...oldValue, name));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        props.setCuradorias((prevState) => {
            const data = prevState;
            const index = data.findIndex(e => e._id === editorState._id);
            for (let key in editorState) {
                if(key === 'respostas') {
                    data[index][key] = editorState[key].replace(/<img.*img>/g, '');  // remove base64 das imagens
                }else if(key === 'validacaoConteudo' || key === 'possivelValidarBOT' || key === 'validacaoBOT') {
                    data[index][key] = !!editorState[key];
                    editorState[key] = !!editorState[key];
                } else {
                    data[index][key] = editorState[key];
                }
            }
            api.put('/curadoria', { newData: editorState, alteredFields });
            data[index].updatedAt = new Date();
            return [...data];
        });
        setEditorState({});
        props.setOpen(false);
    };

    const handleDelete = async e => {
        props.setCuradorias((prevState) => {
            const data = prevState;
            data.splice(data.indexOf(data.find(e => e._id === editorState._id)), 1);
            return [...data];
        });

        await api.delete('/curadoria', { params: { _id: editorState._id, bot: editorState.bot } });
        props.setOpen(false);
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
                { loading ? 
                    (<CircularProgress size={25} />) 
                    : 
                    <Paper className={classes.editor} >
                        <form onSubmit={handleSubmit} component="fieldset" className={classes.formControl}>
                            <Grid container spacing={6}>
                                <Grid item xs={12} className={classes.editorHeader} >
                                    <Button className={classes.editBackButton} onClick={() => { props.setOpen(false); }} ><ArrowBackIcon /></Button>
                                    <Button variant="contained" color="secondary" onClick={() => setOpenDeleteDialog(true)} >
                                        Excluir
                                    </Button>
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
                                <Grid item xs={12} className={classes.formTop} >
                                    <TextField id="arquivo" label="Arquivo" variant="outlined" defaultValue={editorState.arquivo} className={classes.arquivoTema} name="arquivo" onChange={handleChange} />
                                    <TextField id="tema" label="Tema" variant="outlined" defaultValue={editorState.tema} className={classes.arquivoTema} name="tema" onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} className={classes.perguntas} >
                                    Perguntas
                                    <TextareaAutosize id="perguntas" label="Perguntas" variant="outlined" defaultValue={editorState.perguntas} className={classes.perguntas} name="perguntas" onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} className={classes.respostas} >
                                    Respostas
                                    <RichText 
                                        value={editorState.respostas} 
                                        setValue={text => handleChange({
                                            target: {
                                                name: 'respostas',
                                                value: text
                                            }
                                        })} 
                                    />
                                </Grid>
                                <Grid item xs={5} >
                                    <TextField id="responsavel" label="Responsável" variant="outlined" defaultValue={editorState.responsavel} className={classes.arquivoTema} name="responsavel" onChange={handleChange} /> <br />
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                color="primary" 
                                                checked={Boolean(editorState.validacaoConteudo)}
                                                name="validacaoConteudo"
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Validação do Conteúdo"
                                    />  <br />
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                color="primary" 
                                                checked={Boolean(editorState.possivelValidarBOT)}
                                                name="possivelValidarBOT"
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Possível Validar no BOT"
                                    />  <br />
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                color="primary" 
                                                checked={Boolean(editorState.validacaoBOT)}
                                                name="validacaoBOT"
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Validação BOT"
                                    />
                                </Grid>
                                <Grid item xs={7} >
                                    {editorState.image && <React.Fragment>
                                        <img alt={editorState.arquivo} style={{width: '50%', cursor: 'pointer'}} src={editorState.image} onClick={() => { setImageOpen(true); }} />
                                        <br />
                                        <Button 
                                            onClick={() => {
                                                props.setCuradorias((prevState) => {
                                                    const data = prevState;
                                                    data.find(e => e._id === editorState._id).image = null;
                                                    api.put('/curadoria', {newData: data.find(e => e._id === editorState._id), alteredFields: ['imagem']});
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
                                            }}
                                            closeAfterTransition
                                            BackdropComponent={Backdrop}
                                            BackdropProps={{
                                            timeout: 500,
                                            }}
                                        >
                                            <Fade in={imageOpen}>
                                            <div className={classes.paper}>
                                                <img alt={editorState?.arquivo} src={editorState?.image} />
                                            </div>
                                            </Fade>
                                        </Modal>
                                    </React.Fragment>}
                                </Grid>
                                <Grid item xs={12} className={classes.editorSubmitButton} >
                                    <Button variant="contained" type="submit" >Salvar</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                }
            </Fade>
        </Modal>
    )
}
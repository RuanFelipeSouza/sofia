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

export default function Editor(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [editorState, setEditorState] = useState({});
    
    useEffect(() => {
        setLoading(true);
        api.get(`/curadoria/${props.id}`).then(response => {
            setEditorState(response.data);
            setLoading(false);
        })
    }, [props]);

    const handleChange = (event) => {
        setEditorState(oldState => {
            console.log(oldState);
            console.log(event.target);
            return {
                ...oldState,
                [event.target.name]: event.target.value
            }
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log('submit');
    };
        
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            // onClose={() => {
            //     setEditModalOpen(false);
            // }}
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
                        {/* {console.log(rowToEdit)} */}
                        <form onSubmit={handleSubmit} component="fieldset" className={classes.formControl}>
                            <Grid container spacing={6}>
                                <Grid item xs={12} className={classes.editorHeader} >
                                    <Button className={classes.editBackButton} onClick={() => { props.setOpen(false); }} ><ArrowBackIcon /></Button>
                                    <Button variant="contained" color="secondary">
                                        Excluir
                                    </Button>
                                </Grid>
                                <Grid item xs={12} className={classes.formTop} >
                                    <TextField id="arquivo" label="Arquivo" variant="outlined" defaultValue={editorState.arquivo} className={classes.arquivoTema} name="arquivo" onChange={handleChange} />
                                    <TextField id="tema" label="Tema" variant="outlined" defaultValue={editorState.tema} className={classes.arquivoTema} name="tema" onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} className={classes.perguntas} >
                                    Perguntas
                                    <TextareaAutosize id="perguntas" label="Perguntas" variant="outlined" defaultValue={editorState.perguntas} className={classes.perguntas} name="perguntas" />
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
                                <Grid item xs={12} >
                                    <FormControlLabel
                                        name="validacaoConteudo"
                                        control={<Checkbox color="primary" />}
                                        label="Validação do Conteúdo"
                                        checked={editorState.validacaoConteudo}
                                        labelPlacement="end"
                                    />  <br />
                                    <FormControlLabel
                                        name="possivelValidarBOT"
                                        control={<Checkbox color="primary" />}
                                        label="Possível Validar no BOT"
                                        checked={editorState.possivelValidarBOT}
                                        labelPlacement="end"
                                    />  <br />
                                    <FormControlLabel
                                        name="validacaoBOT"
                                        control={<Checkbox color="primary" />}
                                        label="Validação BOT"
                                        checked={editorState.validacaoBOT}
                                        labelPlacement="end"
                                    />
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
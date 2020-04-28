import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import DatePicker from './../../components/Datepicker';
import Select from './../../components/Select';
import Chart from './../../components/Chart';
import Table from './../../components/Table';
import Logo from './../../assets/logointellilogs.png';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';

import api from './../../services/api'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    width: '100%'
  },
}));

export default function Intellilogs() {
    const classes = useStyles();

    const columns = [
        { title: 'Arquivo', field: 'arquivo' },
        { title: 'Tema', field: 'tema', initialEditValue: '' },
        { title: 'Possíveis perguntas', field: 'perguntas' },
        { title: 'Possíveis respostas', field: 'respostas' },
        { title: 'Validação do conteúdo', field: 'validacaoConteudo', type: 'boolean' },
        { title: 'Possível validar no BOT', field: 'possivelValidarBOT', type: 'boolean' },
        { title: 'Validação BOT', field: 'validacaoBOT', type: 'boolean' },
        { title: 'Responsável', field: 'responsavel' },
    ]
    const data = [
        { 
            arquivo: 'Tela do fornecedor no SRM', 
            tema: 'Manual completo', 
            perguntas: `Como consigo baixar o manual
            Quero fazer download do manual de fornecedor
            Preciso acessar o manual no site
            Quero o manual
            Acesso ao manual`, 
            respostas: `Na plataforma temos o manual nos idiomas português e inglês e você pode realizar o download diretamente na área logada por meio do caminho: 

            Menu a esquerda ou Tela principal em seguida clique em Informações e manuais e selecione o arquivo no quadro de anexos.
            
            Além disso, no Quadro de avisos há alguns passos resumidos sobre orientações p/ cotar sua proposta.`,
            validacaoConteudo: true,
            possivelValidarBOT: false,
            validacaoBOT: true,
            responsavel: 'Ruan'
        },
        { 
            arquivo: 'Tela do fornecedor no SRM', 
            tema: 'Manual completo', 
            perguntas: `Como consigo baixar o manual
            Quero fazer download do manual de fornecedor
            Preciso acessar o manual no site
            Quero o manual
            Acesso ao manual`, 
            respostas: `Na plataforma temos o manual nos idiomas português e inglês e você pode realizar o download diretamente na área logada por meio do caminho: 

            Menu a esquerda ou Tela principal em seguida clique em Informações e manuais e selecione o arquivo no quadro de anexos.
            
            Além disso, no Quadro de avisos há alguns passos resumidos sobre orientações p/ cotar sua proposta.`,
            validacaoConteudo: true,
            possivelValidarBOT: false,
            validacaoBOT: true,
            responsavel: 'Breno'
        },
    ]
    

//   useEffect(_ => {
//     api.get('/atendimentos', {
//       params: {
//         dataInicio, 
//         dataFim,
//         projeto: project
//       }
//     }).then(response => {
//       setAtendimentos(response.data);
//     })
// }, [dataInicio, dataFim, project]);

  return (
    <div className={classes.root}>
        <Sidebar />
        <CssBaseline />
        <main className={classes.main}>
            <MaterialTable
                title="Curadoria"
                columns={columns}
                data={data}
                options={{
                    paging: false
                }}
                editable={{
                onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                        {
                        data.push(newData);
                        this.setState({ data }, () => resolve());
                        }
                        resolve()
                    }, 1000)
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                        {
                        const index = data.indexOf(oldData);
                        data[index] = newData;
                        this.setState({ data }, () => resolve());
                        }
                        resolve()
                    }, 1000)
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                        {
                        const index = data.indexOf(oldData);
                        data.splice(index, 1);
                        this.setState({ data }, () => resolve());
                        }
                        resolve()
                    }, 1000)
                    }),
                }}
            />
            <Box pt={4}>
                <Copyright />
            </Box>
        </main>
    </div>
  );
}
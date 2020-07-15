import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';

import ReactWordcloud from 'react-wordcloud';
import { select } from 'd3-selection';
const options = {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    enableTooltip: true,
    deterministic: true,
    fontFamily: 'impact',
    fontSizes: [10, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
};

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        width: '100%',
        height: '90%'
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'row',
    },
    form: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%'
    },
    wordCloud: {
        height: '100%'
    }
}));

function Table(props) {
    const columns = [
        { title: 'Nome', field: 'from' },
        { title: 'Sugestão', field: 'text' },
    ]
  
    return (
      <MaterialTable
        title={props.selectedWord}
        columns={columns}
        data={props.messages}
        isLoading={props.isLoading}
        options={{
            pageSizeOptions: [5, 20],
        }}
        localization={{
            pagination: {
                labelDisplayedRows: '{from}-{to} de {count}'
            },
            header: {
                actions: 'Ações'
            },
            body: {
                emptyDataSourceMessage: 'Nenhum registro a ser exibido',
                filterRow: {
                    filterTooltip: 'Filtro'
                },
            },
            toolbar: {
                exportTitle: 'Exportar',
                exportAriaLabel: 'Exportar',
                exportName: 'Exportar como CSV',
                searchTooltip: 'Buscar',
                searchPlaceholder: 'Buscar'
            }
        }}
      />
    );
}

export default function Sugestoes({ atendimentos }) {
    const classes = useStyles();
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [words, setWords] = useState([]);
    const [selectedWord, setSelectedWord] = useState('');
    const [messagesMathSelectedWord, setMessagesMathSelectedWord] = useState([]);

    useEffect(() => {
        let messages = [];
        atendimentos.forEach(atendimento => atendimento.observation && messages.push(atendimento.observation));
        setFilteredMessages(messages);
    }, [atendimentos]);

    useEffect(() => {
        let wordMap = [];
        filteredMessages.forEach(message => {
            return message.text.replace(/[,.?!]/g, '').split(' ').forEach(word => {
                if(word.length <= 2) return;
                let element = wordMap.find(e => e.text === word);
                if(element) {
                    element.value++;
                }else{
                    wordMap.push({
                        text: word,
                        value: 1
                    })
                }
            })
        })
        setWords(wordMap);
    }, [filteredMessages]);

    useEffect(() => {
        const messages = filteredMessages.filter(message => message.text.includes(selectedWord));
        setMessagesMathSelectedWord(messages);
    }, [selectedWord, filteredMessages]);

    function getWordcloudCallback(callback) {
        return function(word, event) {
            const isActive = callback !== 'onWordMouseOut';
            const element = event.target;
            const text = select(element);
            text
                .on('click', () => {
                    if (isActive) {
                        setSelectedWord(word.text);
                    }
                })
                // .transition()
                .attr('background', 'white')
                // .attr('font-size', '100%')
                .attr('text-decoration', isActive ? 'underline' : 'none');
        };
    }
    
    const callbacks = {
        getWordTooltip: word => `A palavra "${word.text}" aparece ${word.value} vezes.`,
        onWordClick: getWordcloudCallback('onWordClick'),
        onWordMouseOut: getWordcloudCallback('onWordMouseOut'),
        onWordMouseOver: getWordcloudCallback('onWordMouseOver'),
    };

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.form}>
                <Grid container spacing={1}>
                    <Grid item xs={7} >
                        <Paper className={classes.wordCloud}>
                            <ReactWordcloud callbacks={callbacks} options={options} words={words} />
                        </Paper>
                    </Grid>
                    <Grid item xs={5} >
                        <Table messages={messagesMathSelectedWord} selectedWord={selectedWord} />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
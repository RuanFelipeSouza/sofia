import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import groupBy from '../../utils/groupBy';
import * as moment from 'moment';

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
    title: {
        display: 'flex',
        width: '100%',
        fontSize: 15,
        backgroundColor: '#000',
        color: '#FFF',
        justifyContent: 'center'
    },
    description: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        fontSize: 40,
        margin: '3% 0',
        padding: '3% 0'
    },
}));

function GenericBarChart(props) {
    return (
        <ResponsiveContainer width='100%' aspect={2}>
            <BarChart 
                width={500} 
                height={300} 
                data={props.data} 
                layout="vertical" 
                margin={{
                    top: 5, 
                    right: 30, 
                    left: 20, 
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <YAxis type="category" dataKey="name" />
                <XAxis type="number" />
                <Tooltip />
                <Bar dataKey="Quantidade" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

const renderPieLabel = entry => {
    return (<text textAnchor={entry.textAnchor} x={entry.x} y={entry.y} fill={entry.fill} >{entry.value} ({(entry.percent * 100).toFixed(2)}%)</text>);
}

export default function Sugestoes({ surveys, connections, users }) {
    const classes = useStyles();
    const [locais, setLocais] = useState([]);
    const [groupedSurveys, setGroupedSurveys] = useState([]);
    const [conexoesPorDia, setConexoesPorDia] = useState([]);
    const [conexoesPorDesafio, setConexoesPorDesafio] = useState([]);
    
    const COLORS = ['#9FC439', '#FEC134'];

    useEffect(() => {
        let grouped = [];
        groupBy(connections, e => e.tipo).forEach((value, key) => {
            grouped.push({ name: key, Quantidade: value.length });
        })
        setLocais(grouped);

        grouped = [];
        groupBy(surveys, e => typeof e.nota !== 'undefined' ).forEach((value, key) => {
            grouped.push({ name: key ? 'Respondidas' : 'Não Respondidas', Quantidade: value.length });
        })
        setGroupedSurveys(grouped);

        grouped = [];
        groupBy(connections, e => moment(e.createdAt).format('DD/MM/YYYY')).forEach((value, key) => {
            grouped.push({ date: key, Quantidade: value.length });
        })
        setConexoesPorDia(grouped);

        grouped = [];
        groupBy(connections, e => e.desafio).forEach((value, key) => {
            grouped.push({ name: key, Quantidade: value.length });
        })
        setConexoesPorDesafio(grouped);
        
    }, [connections, surveys]);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item xs={2} >
                        <Paper  >
                            <Paper className={classes.title} >
                                Pessoas Cadastradas
                            </Paper>
                            <Paper className={classes.description} >
                                {users.length}
                            </Paper>
                            <Paper className={classes.title} >
                                Número de conexões
                            </Paper>
                            <Paper className={classes.description} >
                                {connections.length}
                            </Paper>
                            <Paper className={classes.title} >
                                Nota média da pesquisa
                            </Paper>
                            <Paper className={classes.description} >
                                {surveys.length && surveys.filter(s => s.nota).reduce((a, b) => a + b.nota, 0)/surveys.filter(s => s.nota).length}
                            </Paper>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} >
                        <Paper >
                            {locais.length &&
                                <GenericBarChart data={locais} />
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={4} >
                        <Paper >
                            <ResponsiveContainer width='100%' aspect={1.5}>
                                <PieChart width={'100%'} >
                                    <Pie
                                        label={renderPieLabel}
                                        data={groupedSurveys}
                                        cx={170}
                                        cy={120}
                                        innerRadius={50}
                                        outerRadius={90}
                                        dataKey="Quantidade"
                                    >
                                        {
                                            groupedSurveys.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)
                                        }
                                    </Pie>
                                    <Legend layout="vertical" verticalAlign="top" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={7} >
                        <Paper>
                            <ResponsiveContainer width="100%" aspect={2}>
                                <LineChart
                                    width={700}
                                    height={300}
                                    data={conexoesPorDia}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis label={{ value: 'Número de conexões', angle: -90, position: 'insideBottomLeft' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="Quantidade" stroke="#82ca9d" isAnimationActive={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={5} >
                        <Paper >
                            {conexoesPorDesafio.length &&
                                <GenericBarChart data={conexoesPorDesafio} labelText={"Desafios"} />
                            }
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
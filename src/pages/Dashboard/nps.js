import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { PieChart, Pie, Legend, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import groupBy from './../../utils/ groupBy';
import * as moment from 'moment';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        width: '100%'
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
        width: '100%'
    },
    linechart: {
        padding: '5%',
        height: '100%',
        margin: '15px 3% 0 0',
    },
    piechart: {
        // padding: '5%',
        margin: '3% 0 3% 3%',
        height: '90%'
    },
    promotorPaper: {
        backgroundColor: corPromotor,
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        padding: '3% 5% 3% 10%',
        margin: '10% 0'
    },
    neutroPaper: {
        backgroundColor: corNeutro,
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        padding: '3% 5% 3% 10%',
        margin: '10% 0'
    },
    detratorPaper: {
        backgroundColor: corDetrator,
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        padding: '3% 5% 3% 10%',
        margin: '10% 0'
    },
    npsSumary: {
        padding: '5%',
        height: '100%',
        margin: '15px 0 0 3%'
    },
    npsValue: {
        marginRight: '0',
        margin: 'auto',
        float: 'right'
    },
    npsSumaryPercentage: {
        padding: '5%',
        height: '90%',
        margin: '3% 0.5% 0 0'
    },
    npsSumaryClassification: {
        padding: '5%',
        height: '90%',
        margin: '3% 5.5% 0 0'
    },
    title: {
        display: 'flex',
        width: '100%',
        fontSize: 20,
        backgroundColor: '#000',
        color: '#FFF',
        justifyContent: 'center'
    },
    notaNPSValue: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        fontSize: 40,
        margin: '3% 0',
        padding: '3% 0'
    },
    classificationValue: {
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        fontSize: 25,
        padding: '10% 0'
    }
}));

const corPromotor = '#9FC439';
const corNeutro = '#FEC134';
const corDetrator = '#E5423A';

const COLORS = [corPromotor, corNeutro, corDetrator];

export default function NPS({ surveys }) {
    const classes = useStyles();
    const [NPS, setNPS] = useState([]);
    const [notaNPS, setNotaNPS] = useState(0);
    const [zonaNPS, setZonaNPS] = useState('');
    const [pesquisasPorDia, setPesquisasPorDia] = useState([]);

    useEffect(() => {
        setNPS([
            { name: 'Promotor', value: surveys.filter(e => e.nota >= 9).length, percent: surveys.filter(e => e.nota >= 9).length / surveys.length },
            { name: 'Neutro', value: surveys.filter(e => e.nota < 9 && e.nota >= 7).length, percent: surveys.filter(e => e.nota < 9 && e.nota >= 7).length / surveys.length },
            { name: 'Detrator', value: surveys.filter(e => e.nota < 7).length, percent: surveys.filter(e => e.nota < 7).length / surveys.length }
        ]);
        let grouped = [];
        groupBy(surveys, e => moment(e.createdAt).format('DD/MM/YYYY')).forEach((value, key) => {
            grouped.push({ date: key, quantidade: value.length });
        })
        setPesquisasPorDia(grouped);
    }, [surveys]);

    useEffect(() => {
        setNotaNPS(NPS.find(e => e.name === 'Promotor')?.percent*100-NPS.find(e => e.name === 'Detrator')?.percent*100);
    }, [NPS]);

    useEffect(() => {
        if(notaNPS >= 75)
            setZonaNPS('Zona de Excelência');
        else if(notaNPS >= 50)
            setZonaNPS('Zona de Qualidade');
        else if(notaNPS >= 0)
            setZonaNPS('Zona de Aperfeiçoamento');
        else
            setZonaNPS('Zona Crítica');
    }, [notaNPS]);

    const renderPieLabel = entry => {
        return (<text textAnchor={entry.textAnchor} x={entry.x} y={entry.y} fill={entry.fill} >{entry.value} ({(entry.percent * 100).toFixed(2)}%)</text>);
    }

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <Paper className={classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} >
                                <Paper className={classes.npsSumary}>
                                    {NPS.length &&
                                        <>
                                            <Paper className={classes.promotorPaper}>
                                                Promotor <text className={classes.npsValue}>{NPS.find(e => e.name === 'Promotor').value}</text>
                                            </Paper>
                                            <Paper className={classes.neutroPaper}>
                                                Neutro <text className={classes.npsValue}>{NPS.find(e => e.name === 'Neutro').value}</text>
                                            </Paper>
                                            <Paper className={classes.detratorPaper}>
                                                Detrator <text className={classes.npsValue}>{NPS.find(e => e.name === 'Detrator').value}</text>
                                            </Paper>
                                        </>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={8} >
                                <Paper className={classes.linechart}>
                                    <ResponsiveContainer width="100%" aspect={2}>
                                        <LineChart
                                            width={700}
                                            height={300}
                                            data={pesquisasPorDia}
                                            margin={{
                                                top: 5, right: 30, left: 20, bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis label={{ value: 'Número de avaliações', angle: -90, position: 'insideBottomLeft' }} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="quantidade" stroke="#82ca9d" isAnimationActive={true} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                            <Grid item xs={4} >
                                <Paper className={classes.piechart}>
                                    <ResponsiveContainer width='100%' aspect={1}>
                                        <PieChart width={'100%'} height={"100%"}>
                                            <Pie
                                                label={renderPieLabel}
                                                data={NPS}
                                                cx={170}
                                                cy={170}
                                                innerRadius={80}
                                                outerRadius={130}
                                                fill="#8884d8"
                                                dataKey="value"
                                                style={{ width: '100%', height: '100%' }}
                                            >
                                                {
                                                    NPS.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)
                                                }
                                            </Pie>
                                            <Legend layout="vertical" verticalAlign="top" align="right" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                            <Grid item xs={4} >
                                <Paper className={classes.npsSumaryPercentage}>
                                    {NPS.length &&
                                        <>
                                            <Paper className={classes.promotorPaper}>
                                                Promotor <text className={classes.npsValue}>{(NPS.find(e => e.name === 'Promotor').percent * 100).toFixed(2)}%</text>
                                            </Paper>
                                            <Paper className={classes.neutroPaper}>
                                                Neutro <text className={classes.npsValue}>{(NPS.find(e => e.name === 'Neutro').percent * 100).toFixed(2)}%</text>
                                            </Paper>
                                            <Paper className={classes.detratorPaper}>
                                                Detrator <text className={classes.npsValue}>{(NPS.find(e => e.name === 'Detrator').percent * 100).toFixed(2)}%</text>
                                            </Paper>
                                        </>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={4} >
                                <Paper className={classes.npsSumaryClassification}>
                                    {NPS.length &&
                                        <Grid container spacing={2}>
                                            <Grid item style={{height: '40%'}} xs={12} >
                                                <Paper className={classes.title}>
                                                    <text>Nota de NPS</text>
                                                </Paper>
                                                <Paper className={classes.notaNPSValue}>
                                                    <text>{notaNPS.toFixed(2)}</text>
                                                </Paper>
                                            </Grid>
                                            <Grid item style={{height: '60%'}} xs={12} >
                                                <Paper className={classes.title}>
                                                    <text>Classificação</text>
                                                </Paper>
                                                <Paper className={classes.classificationValue}>
                                                    <text style={{ margin: 'auto 0' }} >{zonaNPS}</text>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} >

                </Grid>
            </Grid>
        </Container>
    );
}
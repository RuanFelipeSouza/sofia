import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Legend,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import groupBy from '../../utils/groupBy';
import * as moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: '100%',
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
  },
  linechart: {
    padding: '5%',
    height: '100%',
    margin: '15px 3% 0 0',
  },
  piechart: {
    // padding: '5%',
    margin: '3% 0 3% 3%',
    height: '90%',
  },
  promotorPaper: {
    backgroundColor: corPromotor,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    padding: '3% 5% 3% 10%',
    margin: '10% 0',
  },
  neutroPaper: {
    backgroundColor: corNeutro,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    padding: '3% 5% 3% 10%',
    margin: '10% 0',
  },
  detratorPaper: {
    backgroundColor: corDetrator,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    padding: '3% 5% 3% 10%',
    margin: '10% 0',
  },
  npsSumary: {
    padding: '5%',
    height: '100%',
    margin: '15px 0 0 3%',
  },
  npsValue: {
    marginRight: '0',
    margin: 'auto',
    float: 'right',
  },
  npsSumaryPercentage: {
    padding: '5%',
    height: '90%',
    margin: '3% 0.5% 0 0',
  },
  npsSumaryClassification: {
    padding: '5%',
    height: '90%',
    margin: '3% 5.5% 0 0',
  },
  title: {
    display: 'flex',
    width: '100%',
    fontSize: 20,
    backgroundColor: '#000',
    color: '#FFF',
    justifyContent: 'center',
  },
  notaNPSValue: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    fontSize: 40,
    margin: '3% 0',
    padding: '3% 0',
  },
  classificationValue: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    fontSize: 25,
    padding: '10% 0',
  },
}));

const corPromotor = '#9FC439';
const corNeutro = '#FEC134';
const corDetrator = '#E5423A';

const COLORS = [corPromotor, corNeutro, corDetrator];

function Table(props) {
  const columns = [
    { 
      title: 'Sugestão', 
      field: 'observation'
    },
    { 
      title: 'Data', 
      field: 'createdAt',
      width: 200
    },
    { 
      title: 'Conversa', 
      field: '_id',
      render: props2 => 
        <Link 
          id={props2._id} 
          to={`/conversation/${props2._id}`}
        > 
          Visualizar conversa <ArrowForwardOutlined size={16} />
        </Link>, 
      export: false,
      filtering: false,
      width: 200
    },
  ]

  return (
    <MaterialTable
      title='Pesquisas'
      columns={columns}
      data={props.messages}
      isLoading={props.isLoading}
      options={{
        pageSizeOptions: [5, 20]
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

export default function NPS({ atendimentos }) {
  const classes = useStyles();
  const [NPS, setNPS] = useState([]);
  const [pesquisasPorDia, setPesquisasPorDia] = useState([]);
  const [messages, setMessages] = useState([]);
  console.log(atendimentos);

  const nonRated = React.useMemo(() => {
    const nonRatedAmount = atendimentos?.filter(e => e.rating === undefined)?.length;
    return {
      amount: nonRatedAmount,
      percentage: (nonRatedAmount / atendimentos.length * 100).toFixed(2)
    };
  }, [atendimentos]);

  useEffect(() => {
    const ratedAtendimentos = atendimentos.filter(e => (e.rating === 6 && !e.ignoreRating) || [10, 8].includes(e.rating));
    setNPS([
      {
        name: 'Promotor',
        value: ratedAtendimentos.filter((e) => e.rating >= 9).length,
        percent: ratedAtendimentos.filter((e) => e.rating >= 9).length / ratedAtendimentos.length,
      },
      {
        name: 'Neutro',
        value: ratedAtendimentos.filter((e) => e.rating < 9 && e.rating >= 7).length,
        percent:
          ratedAtendimentos.filter((e) => e.rating < 9 && e.rating >= 7).length /
          ratedAtendimentos.length,
      },
      {
        name: 'Detrator',
        value: ratedAtendimentos.filter((e) => e.rating < 7).length,
        percent: ratedAtendimentos.filter((e) => e.rating < 7).length / ratedAtendimentos.length,
      },
    ]);
    let grouped = [];
    groupBy(ratedAtendimentos, (e) => moment(e.createdAt, 'DD/MM/YYYY').format('DD/MM/YYYY')).forEach(
      (value, key) => {
        grouped.push({ date: key, quantidade: value.length });
      }
    );
    setPesquisasPorDia(grouped);
    
    setMessages(atendimentos.filter(e => e.observation));
  }, [atendimentos]);

  const renderPieLabel = (entry) => {
    return (
      <text
        textAnchor={entry.textAnchor}
        x={entry.x}
        y={entry.y}
        fill={entry.fill}>
        {entry.value} ({(entry.percent * 100).toFixed(2)}%)
      </text>
    );
  };

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper className={classes.npsSumary}>
                  {NPS.length && (
                    <>
                      <Paper className={classes.promotorPaper}>
                        Promotor{' '}
                        <text className={classes.npsValue}>
                          {NPS.find((e) => e.name === 'Promotor').value}
                        </text>
                      </Paper>
                      <Paper className={classes.neutroPaper}>
                        Neutro{' '}
                        <text className={classes.npsValue}>
                          {NPS.find((e) => e.name === 'Neutro').value}
                        </text>
                      </Paper>
                      <Paper className={classes.detratorPaper}>
                        Detrator{' '}
                        <text className={classes.npsValue}>
                          {NPS.find((e) => e.name === 'Detrator').value}
                        </text>
                      </Paper>
                    </>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={8}>
                <Paper className={classes.linechart}>
                  <ResponsiveContainer width='100%' aspect={2}>
                    <LineChart
                      width={700}
                      height={300}
                      data={pesquisasPorDia}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='date' />
                      <YAxis
                        label={{
                          value: 'Número de avaliações',
                          angle: -90,
                          position: 'insideBottomLeft',
                        }}
                      />
                      <Tooltip />
                      <Line
                        type='monotone'
                        dataKey='quantidade'
                        stroke='#82ca9d'
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.piechart}>
                  <ResponsiveContainer width='100%' aspect={1}>
                    <PieChart>
                      <Pie
                        label={renderPieLabel}
                        data={NPS}
                        cx={170}
                        cy={170}
                        innerRadius={80}
                        outerRadius={130}
                        fill='#8884d8'
                        dataKey='value'
                        style={{ width: '100%', height: '100%' }}>
                        {NPS.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        layout='vertical'
                        verticalAlign='top'
                        align='right'
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.npsSumaryPercentage}>
                  {NPS.length && (
                    <>
                      <Paper className={classes.promotorPaper}>
                        Promotor{' '}
                        <text className={classes.npsValue}>
                          {(
                            NPS.find((e) => e.name === 'Promotor').percent * 100
                          ).toFixed(2)}
                          %
                        </text>
                      </Paper>
                      <Paper className={classes.neutroPaper}>
                        Neutro{' '}
                        <text className={classes.npsValue}>
                          {(
                            NPS.find((e) => e.name === 'Neutro').percent * 100
                          ).toFixed(2)}
                          %
                        </text>
                      </Paper>
                      <Paper className={classes.detratorPaper}>
                        Detrator{' '}
                        <text className={classes.npsValue}>
                          {(
                            NPS.find((e) => e.name === 'Detrator').percent * 100
                          ).toFixed(2)}
                          %
                        </text>
                      </Paper>
                    </>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.npsSumaryClassification}>
                  {NPS.length && (
                    <Grid container spacing={2}>
                      <Grid item style={{ height: '40%' }} xs={12}>
                        <Paper className={classes.title}>
                          <text>Pesquisas Não Respondidas</text>
                        </Paper>
                        <Paper className={classes.notaNPSValue}>
                          <text>{nonRated.amount} ({nonRated.percentage}%)</text>
                        </Paper>
                      </Grid>
                      <Grid item style={{ height: '40%' }} xs={12}>
                        <Paper className={classes.title}>
                          <text>Total de pesquisas respondidas</text>
                        </Paper>
                        <Paper className={classes.notaNPSValue}>
                          <text>{pesquisasPorDia.reduce((t, n) => t + n.quantidade, 0)}</text>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Table messages={messages} />
        </Grid>
      </Grid>
    </Container>
  );
}

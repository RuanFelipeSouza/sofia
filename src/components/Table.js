import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ArrowForwardOutlined } from '@material-ui/icons';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function SimpleTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Nome do Aluno</b></TableCell>
            <TableCell ><b>Nome do Professor</b></TableCell>
            <TableCell ><b>Detalhes</b></TableCell>
            <TableCell ><b>Data</b></TableCell>
            <TableCell ><b></b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.atendimentos.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.studentName}
              </TableCell>
              <TableCell >{row.teacherName}</TableCell>
              <TableCell >{row._id}</TableCell>
              <TableCell >{row.createdAt}</TableCell>
              <TableCell >
                <Link className="linkToConversation" to={`/conversation/${row._id}`}>
                  Visualizar conversa
                  <ArrowForwardOutlined size={16} color="#E02041"/>
                </Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

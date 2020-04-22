import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';
import * as moment from 'moment';

export default function Table(props) {

  const columns = [
    { title: 'Aluno', field: 'studentName' },
    { title: 'Professor', field: 'teacherName' },
    { title: 'ID', field: '_id' },
    { title: 'Data', field: 'createdAt', render: props => <React.Fragment>{ moment(props.value).format("DD/MM/YYYY") }</React.Fragment> },
    { title: 'Detalhes', field: '_id', render: props => <Link to={`/conversation/${props._id}`}> Visualizar conversa <ArrowForwardOutlined size={16} /></Link> }
  ]

  return (
    <MaterialTable
      title="Atendimentos"
      columns={columns}
      data={props.atendimentos}
      options={{
        exportButton: true
      }}
      // isLoading={true}
      // editable={{
      //   onRowAdd: (newData) =>
      //     new Promise((resolve) => {
      //       setTimeout(() => {
      //         resolve();
      //         setState((prevState) => {
      //           const data = [...prevState.data];
      //           data.push(newData);
      //           return { ...prevState, data };
      //         });
      //       }, 600);
      //     }),
      //   onRowUpdate: (newData, oldData) =>
      //     new Promise((resolve) => {
      //       setTimeout(() => {
      //         resolve();
      //         if (oldData) {
      //           setState((prevState) => {
      //             const data = [...prevState.data];
      //             data[data.indexOf(oldData)] = newData;
      //             return { ...prevState, data };
      //           });
      //         }
      //       }, 600);
      //     }),
      //   onRowDelete: (oldData) =>
      //     new Promise((resolve) => {
      //       setTimeout(() => {
      //         resolve();
      //         setState((prevState) => {
      //           const data = [...prevState.data];
      //           data.splice(data.indexOf(oldData), 1);
      //           return { ...prevState, data };
      //         });
      //       }, 600);
      //     }),
      // }}
    />
  );
}

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import { ArrowForwardOutlined } from '@material-ui/icons';
// import * as moment from 'moment';

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

// export default function SimpleTable(props) {
//   const classes = useStyles();

//   return (
//     <TableContainer component={Paper}>
//       <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell><b>Nome do Aluno</b></TableCell>
//             <TableCell ><b>Nome do Professor</b></TableCell>
//             <TableCell ><b>Detalhes</b></TableCell>
//             <TableCell ><b>Data</b></TableCell>
//             <TableCell ><b></b></TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {props.atendimentos.map((row) => (
//             <TableRow key={row._id}>
//               <TableCell component="th" scope="row">
//                 {row.studentName}
//               </TableCell>
//               <TableCell >{row.teacherName}</TableCell>
//               <TableCell >{row._id}</TableCell>
//               <TableCell >{moment(row.createdAt).format("DD/MM/YYYY")}</TableCell>
//               <TableCell >
//                 <Link className="linkToConversation" to={`/conversation/${row._id}`}>
//                   Visualizar conversa
//                   <ArrowForwardOutlined size={16} />
//                 </Link></TableCell>
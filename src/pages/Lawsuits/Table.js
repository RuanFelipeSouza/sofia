import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import api from "../../services/api";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
  },
  table: {
    // minWidth: '100%'
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    boxShadow: theme.shadows[5],
  },
}));

export default function Table(props) {
  const classes = useStyles();

  const columns = [
    { title: "Número do processo", field: "_id" },
    { title: "Descrição", field: "description", initialEditValue: "" },
    {
      title: "Advogado",
      field: "lawyerId",
      initialEditValue: "",
      render: (rowData) => props.lawyers.find((e) => e._id === rowData.lawyerId)?.name,
      editComponent: e => {
        return (
          <Select
            value={e.value || ''}
            onChange={(event) => e.onRowDataChange({ ...e.rowData, lawyerId: event.target.value })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Nenhum</em>
            </MenuItem>
            {props.lawyers?.map(lawyer => <MenuItem value={lawyer._id} key={lawyer._id}>{lawyer.name}</MenuItem>)}
          </Select>
        );
      },
    },
    {
      title: "Cliente",
      field: "clientId",
      initialEditValue: "",
      render: (rowData) => props.clients.find((e) => e._id === rowData.clientId)?.name,
      editComponent: e => {
        return (
          <Select
            value={e.value || ''}
            onChange={(event) => e.onRowDataChange({ ...e.rowData, clientId: event.target.value })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Nenhum</em>
            </MenuItem>
            {props.clients?.map(client => <MenuItem value={client._id} key={client._id}>{client.name}</MenuItem>)}
          </Select>
        );
      },
    },
  ];

  return (
    <MaterialTable
      className={classes.table}
      title="Central de Processos"
      columns={columns}
      data={props.lawsuits}
      isLoading={props.isLoading}
      options={{
        paging: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30, 40, 50],
        searchFieldAlignment: "left",
        toolbarButtonAlignment: "left",
        exportButton: true,
        exportAllData: true,
        rowStyle: {
          verticalAlign: "initial",
        },
        addRowPosition: "first",
      }}
      localization={{
        pagination: {
          labelDisplayedRows: "{from}-{to} de {count}",
          labelRowsSelect: "por página",
        },
        toolbar: {
          nRowsSelected: "{0} linha(s) selected",
        },
        header: {
          actions: "Ações",
        },
        body: {
          emptyDataSourceMessage: "Nenhum registro para ser exibido",
          filterRow: {
            filterTooltip: "Filter",
          },
        },
      }}
      editable={{
        onRowAdd: async (newData) => {
          props.setLawsuits((prevState) => {
            newData.updatedAt = new Date();
            newData.bot = props.botName;
            return [...prevState, newData];
          });
          await api.post("/addLawsuit", { ...newData });
        },
        onRowUpdate: async (newData, oldData) => {
          if (oldData) {
            await api.post("/addLawsuit", { ...newData });
            props.setLawsuits((prevState) => {
              const data = prevState;
              for (let key in newData) {
                data[data.indexOf(oldData)][key] = newData[key];
              }
              data[data.indexOf(oldData)].updatedAt = new Date();
              return [...data];
            });
          }
        },
        onRowDelete: async (oldData) => {
          try {
            await api.delete("/removeLawsuit/" + oldData._id);
            props.setLawsuits((prevState) => {
              const data = prevState;
              data.splice(data.indexOf(oldData), 1);
              return [...data];
            });
          } catch (e) {
            alert("erro");
          }
        },
      }}
    />
  );
}

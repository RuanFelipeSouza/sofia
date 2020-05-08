import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import api from "../../services/api";

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
    { title: "Nome", field: "name" },
    { title: "Email", field: "email", initialEditValue: "" },
    { title: "Endereço", field: "address", initialEditValue: "" },
    { title: "Telefone", field: "phone", initialEditValue: "" },
  ];

  return (
    <MaterialTable
      className={classes.table}
      title="Central de Advogados"
      columns={columns}
      data={props.lawyers}
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
          props.setLawyers((prevState) => {
            newData.updatedAt = new Date();
            return [...prevState, newData];
          });
          await api.post("/addLawyer", { lawyer: newData });
        },
        onRowUpdate: async (newData, oldData) => {
          if (oldData) {
            await api.post("/addLawyer", { lawyer: newData });
            props.setLawyers((prevState) => {
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
            await api.delete("/removeLawyer/" + oldData._id);
            props.setLawyers((prevState) => {
              const data = prevState;
              data.splice(data.indexOf(oldData), 1);
              return [...data];
            });
          } catch (e) {
            alert('O advogado possui processos ativos, por isso não é possível deletá-lo. Os processos são:\n' + e.response.data.join('\n'));
          }
        },
      }}
    />
  );
}

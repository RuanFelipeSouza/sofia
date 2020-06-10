import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "./Table";
import Copyright from "../../components/Copyright";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "row",
  },
  dataPickers: {
    display: "flex",
    flexDirection: "row",
    overflow: "auto",
    padding: "0 15%",
    justifyContent: "space-between",
  },
  form: {
    display: "flex",
    padding: "0 15%",
    justifyContent: "space-between",
  },
  sendButton: {
    marginBottom: "15px",
  },
  logo: {
    display: "table",
    margin: "-10px auto",
    width: "40%",
    padding: "0 10px",
  },
  chart: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
  },
  main: {
    width: "100%",
  },
  table: {
    width: "100%",
    padding: "1%",
  },
}));

export default function Client() {
  const classes = useStyles();
  const [clients, setClients] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect((_) => {
    setLoading(true);
    api.get("/getClients").then((response) => {
      setClients(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <Header title="Central de Clientes" />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.table}>
                <Table
                  clients={clients}
                  isLoading={isLoading}
                  setClients={setClients}
                />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

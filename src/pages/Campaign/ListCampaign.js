import React, { useEffect, useState } from 'react';
import { CssBaseline, makeStyles, Button } from '@material-ui/core';
import { Col, Row } from 'antd';
import Table from '../../components/Table';
import Sidebar from '../../components/Sidebar';
import { listCampaings } from '../../services/Intelliboard';
import localStorageStateHook from './../../utils/useLocalStorageState';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    width: '100%',
  },
  uploadDiv: {
    marginLeft: '20px',
    display: 'flex',
  },
  tableDiv: {
    maxWidth: 'calc(100vw - 240px - 30px)', // 240 is sidebar size
    marginTop: 20,
    padding: 20,
  },
  button: {
    height: '58px',

    background: theme.palette.primary.light,
    opacity: 1,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      opacity: 0.9,
      background: theme.palette.primary.light,
    },
  },
}));
export default function ListCampaign() {
  const { keys, useLocalStorageState } = localStorageStateHook;
  const [page, setPage] = useLocalStorageState(
    keys.INTELLILOGS_PAGINA_ATUAL,
    0,
    useState
  );
  const [pageSize, setPageSize] = useLocalStorageState(
    keys.INTELLILOGS_TAMANHO_PAGINA,
    5,
    useState
  );
  const classes = useStyles();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [listedCampaings] = useState(false);
  useEffect(() => {
    listCampaings()
      .then(({ campaings }) => {
        if (campaings && campaings.length > 0) {
          setColumns(
            Object.keys(campaings[0]).map((e) => {
              return { title: e, field: e };
            })
          );
        }
        setRows(campaings);
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  }, [listedCampaings]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <Row gutter={16}>
          <Col
            span={8}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5%',
            }}
          ></Col>
          <Col
            span={8}
            align="right"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          ></Col>
          <div className={classes.uploadDiv}>
            {rows.length > 0 && (
              <Button
                className={classes.button}
                size="large"
                type="secondary"
                style={{ marginBottom: 16, marginLeft: 10 }}
                // onClick={sendFile}
              >
                Submit Data
              </Button>
            )}
          </div>
          <div className={classes.tableDiv}>
            <p>{errorMessage}</p>
            {rows.length > 0 && (
              <Table
                title=""
                data={rows}
                columns={columns}
                onChangePage={setPage}
                pageSize={pageSize}
                onChangeRowsPerPage={setPageSize}
              />
            )}
          </div>
        </Row>
      </main>
    </div>
  );
}

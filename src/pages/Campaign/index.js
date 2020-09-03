import React, { useState } from 'react';
import { CssBaseline, makeStyles, Button } from '@material-ui/core';
import { ExcelRenderer } from 'react-excel-renderer';
import { Upload, Col, Row } from 'antd';
import Table from '../../components/Table';
import localStorageStateHook from '../../utils/useLocalStorageState';
import Sidebar from '../../components/Sidebar';
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
export default function Campaing(props) {
  const classes = useStyles();
  const { keys, useLocalStorageState } = localStorageStateHook;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [page, setPage] = useLocalStorageState(
    keys.CAMPAIGN_PAGINA_ATUAL,
    0,
    useState
  );
  const [pageSize, setPageSize] = useLocalStorageState(
    keys.CAMPAIGN_TAMANHO_PAGINA,
    5,
    useState
  );
  function checkFile(file) {
    if (!file) {
      return;
    }
    const isExcel =
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      return 'You can only upload Excel file!';
    }
    return;
  }

  function fileHandler(file) {
    const errorMessage = checkFile(file);
    console.log(errorMessage);
    if (errorMessage) return setErrorMessage(errorMessage);
    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const columns = resp?.rows && resp.rows[0];
        const newRows = resp.rows.slice(1).map((row) => {
          if (row && row !== 'undefined') {
            return row.reduce((acul, curr, index) => {
              acul[columns[index]] = curr;
              return acul;
            }, {});
          }
        });
        if (newRows.length === 0) {
          setErrorMessage('No data found in file!');
          return false;
        } else {
          setColumns(
            columns.map((e) => {
              return { title: e, field: e };
            })
          );
          setRows(newRows);
          setErrorMessage(null);
          setUploaded(true);
        }
      }
    });
    return false;
  }
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
            <Upload
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              name="file"
              beforeUpload={fileHandler}
              progress={{
                type: 'circle',
              }}
              onRemove={() => {
                setColumns([]);
                setRows([]);
              }}
              multiple={false}
            >
              <Button
                className={classes.button}
                size="large"
                type="primary"
                style={{ marginBottom: 16, marginLeft: 10 }}
              >
                Arraste Aqui o Excel
                {/* <AttachFile /> Arraste Aqui o Excel */}
              </Button>
            </Upload>

            {rows.length > 0 && (
              <Button
                className={classes.button}
                size="large"
                type="secondary"
                style={{ marginBottom: 16, marginLeft: 10 }}
              >
                Submit Data
              </Button>
            )}
          </div>
          <div className={classes.tableDiv}>
            onChange
            <Table
              title="Campanha Teste"
              data={rows.slice(0, 3)}
              columns={columns}
              initialPage={page}
              onChangePage={setPage}
              pageSize={pageSize}
              onChangeRowsPerPage={setPageSize}
            />
          </div>
        </Row>
      </main>
    </div>
  );
}

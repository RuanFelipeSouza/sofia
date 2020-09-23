import React, { useState } from 'react';
import { CssBaseline, makeStyles, Button } from '@material-ui/core';
import { ExcelRenderer } from 'react-excel-renderer';
import { Upload, Col, Row } from 'antd';
import Table from '../../components/Table';
import Sidebar from '../../components/Sidebar';
import { saveCampaign, sendCampaign } from '../../services/Intelliboard';
import { useHistory } from 'react-router';
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
export default function UploadCampaign() {
  const classes = useStyles();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
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
  async function sendFile() {
    try {
      const { _id: id } = await saveCampaign(rows);
      // in the next version, i will render this page to list campaigns
      // and in list of campaigns create buttons to send campaign
      await sendCampaign(id);
      history.push('/intellilogs');
    } catch (e) {
      console.log(e);
      setErrorMessage('Erro ao inserir campanha', e);
    }
  }

  function fileHandler(file) {
    const errorMessage = checkFile(file);
    if (errorMessage) return setErrorMessage(errorMessage);
    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const columns = resp?.rows && resp.rows[0];
        const newRows = resp.rows.slice(1).map((row) => {
          return row.reduce((acul, curr, index) => {
            acul[columns[index]] = curr;
            return acul;
          }, {});
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
          console.log(newRows);
          setRows(newRows);
          setErrorMessage(null);
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
                onClick={sendFile}
              >
                Submit Data
              </Button>
            )}
          </div>
          <div className={classes.tableDiv}>
            <p>{errorMessage}</p>
            <Table title="" data={rows.slice(0, 4)} columns={columns} />
          </div>
        </Row>
      </main>
    </div>
  );
}

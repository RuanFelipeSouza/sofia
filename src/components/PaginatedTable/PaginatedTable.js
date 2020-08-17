/* eslint-disable react/display-name */
import React from 'react';
import Popover from '../Popover/Popover';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { StyledTableContainer } from './styles.js';

const PaginatedTable = (props) => {
  const { rows } = props;
  const keys = Object.keys(rows[0]).map(key => {
    let render;
    let customFilterAndSearch;
    let filtering = true;
    let sorting = true;

    if (typeof rows[0][key] === 'object') { // case field is an object
      sorting = false;
      render = (rowData) => {
        return <Popover title="Detalhes">
          {Object.keys(rowData[key]).map((e) => (
            <p key={e}>
              <b>{e}</b>: <span dangerouslySetInnerHTML={{ __html: rowData[key][e] }}></span>
            </p>
          ))}
        </Popover>;
      };

      customFilterAndSearch = (term, rowData) => {
        for (const [, v] of Object.entries(rowData[key])) {
          if (String(v)?.toUpperCase()?.includes(term?.toUpperCase())) return true;
        }
        return false;
      };
    } else {
      if (String(rows[0][key])?.includes('>Anexo<')) {
        filtering = false;
        sorting = false;
        render = (rowData) => {
          const link = rowData[key].match(/href="(.*)"/)[1]; // regex to extract the href from the <a> tag
          return (
            <a href={link} target="_blank" rel="noopener noreferrer">
              <AttachFileRoundedIcon />
            </a>
          );
        };
      } else {
        render = (rowData) => (
          <span dangerouslySetInnerHTML={{ __html: rowData[key] }}></span>
        );
      }
    }

    return ({ title: key, field: key, render, customFilterAndSearch, filtering, sorting });
  });

  return (
    <StyledTableContainer component={Paper}>
      <MaterialTable
        columns={keys}
        data={rows}
        options={{
          toolbar: false,
          draggable: false,
          showFirstLastPageButtons: false,
          filtering: true,
          padding: 'dense',
          filterCellStyle: {
            margin: 0,
            padding: 12,
            paddingTop: 4,
            paddingBottom: 6,
          },
          headerStyle: {
            paddingTop: 6,
            paddingBottom: 6,
            paddingRight: 12,
            paddingLeft: 12,
            backgroundColor: 'rgba(0,0,0,0.05)',
          }
        }}
        localization={{
          pagination: {
            firstTooltip: 'Primeiro',
            lastTooltip: 'Último',
            nextTooltip: 'Próximo',
            previousTooltip: 'Anterior',
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsSelect: 'por página',
          }
        }}
        icons={{
          Filter: React.forwardRef((props, ref) => <SearchRoundedIcon fontSize='inherit' style={{ fontSize: 14 }} ref={ref} />)
        }}
      />
    </StyledTableContainer>
  );
};
PaginatedTable.propTypes = {
  rows: Array
};
export default PaginatedTable;

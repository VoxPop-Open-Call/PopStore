import React, {useEffect, useState} from "react";
import  {TableContainer, Table, TableBody, TableHead, TableCell, TableRow, Select, MenuItem }from "@mui/material";
import styles from "./Sheets.module.css"

const EditableDataTable = ({ sheet }) => {
    const [columns, setColumns] = useState([]);
    const [dbColumns] = useState(['Select Column', 'Name', 'Reference ID', 'Price', 'Ignore']);
    useEffect(async () => {
        setColumns(sheet[0].cells);
    }, []);
  return (
      <>
      <TableContainer>
          <Table>
              <TableHead>
                  <TableRow>
                      {columns?.map((column, index) => (
                          <TableCell key={index}>
                              <Select
                                  id={`${column}-${index}`}
                                  label="Select Column"
                                  value='Select Column'
                              >
                                  <MenuItem value='Select Column' selected={true}>Select Column</MenuItem>
                                  {dbColumns.map((dbColumn, i) => (
                                    <MenuItem value={`${index}-${dbColumn}`}>{dbColumn}</MenuItem>
                                  ))}
                              </Select>
                          </TableCell>
                      ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                  { sheet?.map((row, rowIndex) => {
                          return (
                              <TableRow key={`row-${rowIndex}`}>
                                  { row.cells.map((cell, cellIndex) => (
                                      <TableCell
                                          key={`cell-${rowIndex}-${cellIndex}`}
                                          className={styles['cell']}>
                                          {cell}
                                      </TableCell>
                                  ))}
                              </TableRow>
                          )
                  })}
              </TableBody>
          </Table>
      </TableContainer>
      </>
  );
};

export default EditableDataTable;

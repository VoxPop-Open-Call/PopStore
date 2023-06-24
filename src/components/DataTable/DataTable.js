import React from "react";
import  {TableContainer, Table, TableBody, TableCell, TableRow }from "@mui/material";
import styles from "./Sheets.module.css"

const DataTable = ({ sheet }) => {
  return (
      <TableContainer>
          <Table>
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
  );
};

export default DataTable;

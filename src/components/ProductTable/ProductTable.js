import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

const ProductTable = ({ tableData }) => {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    var rows = [];
    tableData.forEach((element) => {
      rows.push({
        name: element.storeName,
        link: "Formulário de pedido",
        edit: "Editar",
        orders: "Pedidos",
        customers: "Clientes",
        packaging: "Preparação"
      });
    });
    setProductList(rows);
  }, [tableData]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {productList.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" style={{fontWeight: "bold"}}>
                {row.name}
              </TableCell>
              <TableCell align="right">
                <Link to={`/store/${tableData[i].ownerID}/${tableData[i].storeID}`}>
                  {row.link}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={`/popstore/edit/${tableData[i].storeID}`}
                >
                  {row.edit}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={`/popstore/orders/${tableData[i].storeID}`}
                >
                  {row.orders}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={`/popstore/customers/${tableData[i].storeID}`}
                >
                  {row.customers}
                </Link>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={`/popstore/packaging/${tableData[i].storeID}`}
                >
                  {row.packaging}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;

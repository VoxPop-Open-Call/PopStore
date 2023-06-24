import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import firebase, {
  db,
  doc,
  setDoc,
  collection,
  serverTimestamp
} from "../../service/firebase";
import {
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import styles from "../../components/DataTable/Sheets.module.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import textToPriceParser from '../../functions/textToPriceParser'

const NewPopstore = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [storeName, setStoreName] = useState('');
  const [storeOwner, setStoreOwner] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCurrency, setStoreCurrency] = useState('EUR');
  const [sheetData, setSheetData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dbColumns] = useState(['Selecionar Coluna', 'Nome', 'Ref', 'Preço', 'Ignorar']);
  const [col, setCol] = useState({});

  const MySwal = withReactContent(Swal)
  const eurocurrencies = {
    'EUR': 'Euro',
    'SEK': 'Swedish Krona',
    'GBP': 'Pound Sterling'
  }
  const [currencies] = useState(eurocurrencies);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setStoreOwner(user.email);
      } else {
        navigate("/");
      }
      if (localStorage.getItem('sheetData') !== null) {
        let data = JSON.parse(localStorage.getItem('sheetData'));
        setSheetData(data);
        setColumns(data[0].cells);
      } else {
        navigate("/");
      }
      localStorage.setItem('columns', JSON.stringify({
        'Nome': -1, 'Ref': -1, 'Preço': -1, 'Ignorar': 9
      }));
      setCol({
        'Nome': -1, 'Ref': -1, 'Preço': -1, 'Ignorar': 9
      });

    });
  }, [navigate]);

  const saveStore = async (e) => {
    e.preventDefault();
    let columns = JSON.parse(localStorage.getItem('columns'));
    let referenceIdColumn = columns['Ref'];
    let priceColumn = columns['Preço'];
    let nameColumn = columns['Nome'];
    let descriptionColumn = columns['Descrição'];

    if (nameColumn === -1) {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, selecione uma coluna para o Nome dos produtos',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if (priceColumn === -1) {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, selecione uma coluna para o Preço dos produtos',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if (storeName.trim() === '') {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, selecione um nome para PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if (storeOwner.trim() === '') {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, adicione detalhes de contato para o Proprietário da Loja',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if (storeDescription.trim() === '') {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, adicione uma descrição para a PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    let productsPrices = [];

    let products = [];

    if (referenceIdColumn === -1) {
      for (let i = 0; i < sheetData.length; i++) {
        if (sheetData[i].cells[nameColumn] === undefined || sheetData[i].cells[priceColumn] === undefined) {
          continue;
        }
        products.push([
          i,
          sheetData[i].cells[nameColumn],
          sheetData[i].cells[priceColumn],
          sheetData[i].cells[descriptionColumn] ? sheetData[i].cells[descriptionColumn] : ''
        ]);
        productsPrices.push(textToPriceParser(sheetData[i].cells[priceColumn]));
      }
    } else {
      for (let i = 0; i < sheetData.length; i++) {
        if (sheetData[i].cells[nameColumn] === undefined || sheetData[i].cells[priceColumn] === undefined || sheetData[i].cells[referenceIdColumn] === undefined) {
          continue;
        }
        products.push([
          sheetData[i].cells[referenceIdColumn],
          sheetData[i].cells[nameColumn],
          sheetData[i].cells[priceColumn],
          sheetData[i].cells[descriptionColumn] ? sheetData[i].cells[descriptionColumn] : ''
        ]);
        productsPrices.push(textToPriceParser(sheetData[i].cells[priceColumn]));
      }
    }

    // Reset the column name to 0
    productsPrices[0] = 0;
    if (productsPrices.some(price => !textToPriceParser(price))) {
      await MySwal.fire({
        title: 'Erro!',
        text: 'O preço deve estar no formato 1234 ou 1234,56',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    const storesRef = doc(collection(db, "StoreOwners"), user.uid);
    const storeRef = doc(collection(storesRef, "allStores"));

    let store = {
      storeName: storeName,
      storeOwner: storeOwner,
      description: storeDescription,
      currency: storeCurrency,
      ownerID: user.uid,
      storeID: storeRef.id,
      createAt: serverTimestamp(),
      columnsList: JSON.stringify(products),
      link: `/store/${user.uid}/${storeRef.id}`,
      columns: columns,
      locked: false,
    }

    await setDoc(storeRef, store);

    await MySwal.fire({
      title: 'Sucesso!',
      text: 'PopStore criado com sucesso',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    localStorage.removeItem('columns');
    localStorage.removeItem('sheetData');
    navigate('/popstore/all');
  };

  const cancelStore = async (e) => {
    e.preventDefault();
    localStorage.removeItem('sheetData');
    localStorage.removeItem('columns');
    navigate('/');
  };
  const updateCurrencyValue = (e) => {
    setStoreCurrency(e.target.value);
  }
  const updateSelectedColumn = async (e, column, index, c) => {
    let cols = localStorage.getItem('columns');
    cols = JSON.parse(cols);
    cols[column] = index;
    let tempValues = Object.values(cols);
    if (tempValues.includes(index)) {
      let key = Object.keys(cols).find(key => cols[key] === index && key !== column);
      if (key !== undefined) {
        cols[key] = -1;
      }
    }

    // Check price column for numeric values
    let productsPrices = [];
    for (let i = 0; i < sheetData.length; i++) {
      if ((sheetData[i].cells[cols['Preço']] === undefined && cols['Preço'] !== -1) || (sheetData[i].cells[cols['Nome']] === undefined && cols['Nome'] !== -1)) {
        continue;
      }
      productsPrices.push(textToPriceParser(sheetData[i].cells[cols['Price']]));
    }

    productsPrices[0] = 0;
    if (productsPrices.some(price => !textToPriceParser(price))) {
      await MySwal.fire({
        title: 'Erro!',
        text: 'O preço deve estar no formato 1234 ou 1234,56',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      document.getElementById(`${c}-${index}`).textContent = 'Selecionar Coluna';
      return;
    }
    // Same column information
    setCol(cols);
    if (document.getElementById(`${c}-${index}`)) {
      document.getElementById(`${c}-${index}`).textContent = column;
    }
    localStorage.setItem('columns', JSON.stringify(cols));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs>
          <h1>Informar e validar</h1>
        </Grid>
      </Grid>
      <form onSubmit={saveStore}>
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Nome da Loja"
              helperText=""
              variant="outlined"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Nome da Loja"
              helperText=""
              type="email"
              variant="outlined"
              value={storeOwner}
              onChange={(e) => setStoreOwner(e.target.value)}
            />
          </Grid>
          <Grid item xs={4} md={4} alignContent="end">
            <LogoutButton user={user?.photoURL} />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Descrição da Loja"
              helperText=""
              variant="outlined"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <Select
              fullWidth={true}
              label="Selecione a Coluna"
              value={storeCurrency}
              onChange={updateCurrencyValue}
              id="currency"
            >
              {Object.keys(currencies).map((currencyCode, i) => (
                <MenuItem
                  key={`${i}`}
                  value={currencyCode}
                >
                  {currencyCode} - {currencies[currencyCode]}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={12}>
            <p><small>Ref é opcional. Ref é gerado automaticamente se não for selecionado.</small></p>
          </Grid>
        </Grid>
      </form>
      <div className="create-table-wrapper">
        <TableContainer>
          <Table style={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {columns?.map((column, index) => (
                  <TableCell key={index}>
                    <Select
                      fullWidth={true}
                      id={`${column}-${index}`}
                      label="Selecione a Coluna"
                    >
                      {dbColumns.map((dbColumn, i) => (
                        <MenuItem
                          disabled={col[dbColumn] !== -1 && dbColumn !== 'Ignorar' && col[dbColumn] !== index}
                          onClick={(e => updateSelectedColumn(e, dbColumn, index, column))}
                          key={`${index}-${dbColumn}`}
                        >
                          {dbColumn}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sheetData?.map((row, rowIndex) => {
                return (
                  <TableRow key={`row-${rowIndex}`}>
                    {row.cells.map((cell, cellIndex) => (
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
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
        <Grid item xs={6} md={6} alignContent='end'>
          <Link
            href="#"
            onClick={cancelStore}>
            Cancelar
          </Link>
          &nbsp;
          <Button
            style={{ marginLeft: '1rem' }}
            color="primary"
            variant="contained"
            onClick={saveStore}>
            Criar PopStore
          </Button>
        </Grid>
        <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
      </Grid>
    </Container>
  );
};

export default NewPopstore;

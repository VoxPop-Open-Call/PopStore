import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {useNavigate, useParams} from "react-router-dom";
import firebase, {
  db,
  doc,
  updateDoc,
  collection,
  getDoc
} from "../../service/firebase";
import {
  Grid,
  Switch,
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
import Loading from "../../components/Loading";
import isEmail from 'validator/lib/isEmail';
import textToPriceParser from '../../functions/textToPriceParser'

const EditPopstore = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [user, setUser] = useState();
  const [store, setStore] = useState();
  const [dbColumns] = useState(['Reference ID', 'Name', 'Price']);
  const [loading, setLoading] = useState(true);

  const MySwal = withReactContent(Swal)

  useEffect( () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const storesRef = await collection(db, `/StoreOwners/${user.uid}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if (store.exists()) {
          let data = store.data();
          data.columnsList = JSON.parse(data.columnsList);
          setStore(data);
          setLoading(false);
        }

      } else {
        navigate("/");
      }

      localStorage.setItem('columns', JSON.stringify({
        'Name': -1, 'Reference ID': -1, 'Price': -1, 'Ignore': 9
      }));

    });
  }, [navigate, storeId]);

  const updateStore = async (e) => {
    e.preventDefault();

    if ( store.storeName.trim() === '') {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, selecione um nome para PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( !isEmail(store.storeOwner) || store.storeOwner.trim() === '') {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, adicione detalhes de contato para o Proprietário da Loja',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( store.description.trim() === '') {
      await MySwal.fire({
        title: 'Erro!',
        text: 'Por favor, adicione uma descrição para a PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    let updatedStore = {
      storeName: store.storeName,
      storeOwner: store.storeOwner,
      description: store.description,
      locked: store.locked,
    }

    const storesRef = await collection(db, `/StoreOwners/${user.uid}/allStores`);
    const storeRef = await (doc(storesRef, storeId));

    await updateDoc(storeRef, updatedStore);

    await MySwal.fire({
      title: 'Sucesso!',
      text: 'PopStore atualizado com sucesso',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    localStorage.removeItem('columns');
    navigate('/popstore/all');
  };

  const cancelStore = async (e) => {
    e.preventDefault();
    localStorage.removeItem('columns');
    navigate('/popstore/all');
  };

  if (loading) return <Loading />;
  return (
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs>
            <h1>Edite o seu PopStore</h1>
          </Grid>
        </Grid>
        <form onSubmit={updateStore}>
          <Grid container spacing={2}>
            <Grid item xs={4} md={4}>
              <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Nome da Loja"
                  helperText=""
                  variant="outlined"
                  value={store.storeName}
                  onChange={(e) => setStore({...store, storeName: e.target.value})}
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Proprietário da Loja"
                  helperText=""
                  type="email"
                  variant="outlined"
                  value={store.storeOwner}
                  onChange={(e) => setStore({...store, storeOwner: e.target.value})}
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
                  value={store.description}
                  onChange={(e) => setStore({...store, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={4} md={4} alignSelf="center">
            Loja Bloqueada:
              <Switch
                  checked={store.locked}
                  onChange={(e) => setStore({...store, locked: e.target.checked})}
              />
            </Grid>
          </Grid>
        </form>
        <div className="create-table-wrapper">
          <TableContainer>
            <Table style={{ tableLayout: 'fixed'}}>
              <TableHead>
                <TableRow>
                  {dbColumns?.map((column, index) => (
                      <TableCell key={index}>
                        {column}
                      </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                { store.columnsList?.map((row, rowIndex) => {
                  return (
                      <TableRow key={`row-${rowIndex}`}>
                        { row.map((cell, cellIndex) => (
                            cellIndex !== 3 ? (
                            <TableCell
                                key={`cell-${rowIndex}-${cellIndex}`}
                                className={styles['cell']}>
                              {cellIndex === 2 ? textToPriceParser(cell) + ' ' + store?.currency : cell}
                            </TableCell>
                            ) : ('')
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
          <Grid item xs={6} md={2} alignContent='end'>
            <Link
                href="#"
                onClick={cancelStore}>
              Cancelar
            </Link>
          </Grid>
          <Grid item xs={6} md={10} alignContent='end'>
            <Button
                style={{marginLeft: '1rem'}}
                color="primary"
                variant="contained"
                onClick={updateStore}>
              Atualizar PopStore
            </Button>
          </Grid>
          <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
        </Grid>
      </Container>
  );
};

export default EditPopstore;

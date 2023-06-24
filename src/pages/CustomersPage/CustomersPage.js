import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Grid from "@mui/material/Grid";
import firebase, {doc, getDoc} from "../../service/firebase";
import { db, collection, getDocs, where, query } from "../../service/firebase";
import { useNavigate, Link, useParams } from "react-router-dom";
import {MenuItem, Select} from "@mui/material";
import textToPriceParser from '../../functions/textToPriceParser'

const CustomersPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { storeId } = useParams();
  const [store, setStore] = useState({});
  const [customer, setCustomer] = useState({});
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        let temp = [];
        const allStores = collection(
            db,
            `/StoreOwners/${user.uid}/allStores`
        );
        const querySnapshot = await getDocs(allStores);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          temp.push(doc.data());
        });
        const storesRef = await collection(db, `/StoreOwners/${user.uid}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if(store.exists()){
          let data = store.data();
          data.columnsList = JSON.parse(data.columnsList);
          setStore(data);
        }
        const customersRef = collection(db, `/StoreOwners/${user.uid}/allStores/${storeId}/customers`);
        const Customers = await getDocs(customersRef);
        temp = [];
        Customers.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          temp.push(doc.data());
        });
        setCustomers(temp);
      } else {
        navigate("/");
      }
    });
  }, [navigate, storeId]);

  const getCustomerOrders = async (c) => {
    setCustomer(c);
    const ordersRef = collection(db, `/StoreOwners/${user.uid}/allStores/${storeId}/Orders`);
    const q = query(ordersRef, where("email", "==", c.email));
    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      let d = doc.data();
      d.order = JSON.parse(d.order);
      temp.push(d);
    });
    let orders = [];
    temp.forEach((o) => {
      o.order.forEach((p) => {
        if(p !== null){
          // check if order already exists
          let index = orders.findIndex((e) => e.id === p.id);
          if(index === -1){
            orders.push(p);
          } else {
            orders[index].quantity += p.quantity;
          }
        }
      });
    });
    return orders;
  };

  return (
      <Container maxWidth="lg">
        <div className="popstore-wrapper">
          <Grid className="pop-header-wrapper" container spacing={2}>
            <Grid item xs={6} md={4}>
              <Typography style={{ marginBottom: "20px" }} variant="h4">
              Lista de Clientes
              </Typography>
            </Grid>
            <Grid item xs={2} md={4} alignSelf="center">
              <Link to='/popstore/all'>
                Fechar
              </Link>
            </Grid>
            <Grid item xs={4} md={4}>
              <div className="logout-button">
                <LogoutButton user={user?.photoURL} />
              </div>
            </Grid>
          </Grid>
          <Grid className="pop-header-wrapper" container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography style={{ marginBottom: "1rem" }} variant="h6">
                {store?.storeName}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <div style={{paddingBottom: '1rem'}}>
                <Select
                    fullWidth={true}
                    id="customer"
                    label="Select Column"
                >
                  {customers?.map((customer, i) => (
                      <MenuItem
                          onClick={(e => {
                            getCustomerOrders(customer).then((o) => { setOrders(o);document.getElementById("customer").textContent = customer.email;});
                          })}
                          key={`${i}`}
                      >
                        {customer.email}
                      </MenuItem>
                  ))}
                </Select>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{backgroundColor: "#fff", padding: '1rem'}}>
            {Object.keys(customer).length === 0 ?
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <h4>Selecione um cliente do menu para ver seus pedidos</h4>
                  </Grid>
                </Grid>
             :
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={2} md={4}>
                      <h4>{customer?.name || "N/A"}</h4>
                    </Grid>
                    <Grid item xs={5} md={4}>
                      <h4>{customer?.email}</h4>
                    </Grid>
                    <Grid item xs={5} md={4}>
                      <h4>{customer?.phone}</h4>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3} md={5}>
                      <h5>Product</h5>
                    </Grid>
                    <Grid item xs={3} md={2}>
                      <h5>Price</h5>
                    </Grid>
                    <Grid item xs={3} md={3}>
                      <h5>Quantity</h5>
                    </Grid>
                    <Grid item xs={3} md={2}>
                      <h5>Total</h5>
                    </Grid>
                  </Grid>
                  {orders?.map((order, index) => {
                    return (
                    <Grid container spacing={2} key={index}>
                      <Grid item xs={3} md={5}>
                        <p>{store.columnsList[order.id][1]}</p>
                      </Grid>
                      <Grid item xs={3} md={2}>
                        <p>{textToPriceParser(store.columnsList[order.id][2])} {store?.currency}</p>
                      </Grid>
                      <Grid item xs={3} md={3}>
                        <p>{order.quantity}</p>
                      </Grid>
                      <Grid item xs={3} md={2}>
                        <p>{(textToPriceParser(store.columnsList[order.id][2]) * parseFloat(order.quantity)).toFixed(2)} {store?.currency}</p>
                      </Grid>
                    </Grid>
                    )
                  })}
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={7}>
                      <p>&nbsp;</p>
                    </Grid>
                    <Grid item xs={3} md={3}>
                      <h4>Grand Total</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                      <h4>
                        {(orders.reduce((prev, next) => {
                          return prev + textToPriceParser(store.columnsList[next.id][2]) * parseFloat(next.quantity)
                        }, 0)).toFixed(2)} {store?.currency}
                      </h4>
                    </Grid>
                  </Grid>
                </>
            }
        </div>
      </Container>
  );
};

export default CustomersPage;

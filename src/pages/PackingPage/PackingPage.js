import React, {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Grid from "@mui/material/Grid";
import firebase, {doc, getDoc} from "../../service/firebase";
import {db, collection, getDocs} from "../../service/firebase";
import {useNavigate, Link, useParams} from "react-router-dom";
import {MenuItem, Select} from "@mui/material";

const PackingPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const {storeId} = useParams();
    const [store, setStore] = useState({});
    const [product, setProduct] = useState({});
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customerProducts, setCustomerProducts] = useState([]);
    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const storesRef = await collection(db, `/StoreOwners/${user.uid}/allStores`);
                const store = await getDoc(doc(storesRef, storeId));
                if (store.exists()) {
                    let data = store.data();
                    data.columnsList = JSON.parse(data.columnsList);
                    setStore(data);
                }
                const customersRef = collection(db, `/StoreOwners/${user.uid}/allStores/${storeId}/customers`);
                const Customers = await getDocs(customersRef);
                let tempCustomers = [];
                Customers.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    tempCustomers.push(doc.data());
                });
                const ordersRef = collection(db, `/StoreOwners/${user.uid}/allStores/${storeId}/Orders`);
                const querySnapshot = await getDocs(ordersRef);
                let tempOrders = [];
                querySnapshot.forEach((doc, i) => {
                    let d = doc.data();
                    tempOrders.push(d);
                });
                let orders = [];
                tempOrders.forEach((o) => {
                    JSON.parse(o.order).forEach((p) => {
                        if (p !== null) {
                            // check if order already exists
                            let index = orders.findIndex((e) => e.id === p.id);
                            if (index === -1) {
                                orders.push(p);
                            } else {
                                orders[index].quantity += p.quantity;
                            }
                        }
                    });
                });
                setOrders(orders);
                // Loop through customers and make an array of customers along with their product ids
                let tempCustomerProducts = [];
                tempCustomers.forEach((c) => {
                    let customer = {
                        email: c.email,
                        name: c.name,
                        products: [],
                    };
                    tempOrders.forEach((o) => {
                        if (o.email === c.email) {
                            JSON.parse(o.order).forEach((p) => {
                                if (p !== null) {
                                    // check if product already exists and update quantity
                                    let index = customer.products.findIndex((e) => e.id === p.id);
                                    if (index === -1) {
                                        customer.products.push({id: p.id, quantity: p.quantity});
                                    } else {
                                        customer.products[index].quantity += p.quantity;
                                    }
                                }
                            });
                        }
                    });
                    tempCustomerProducts.push(customer);
                });
                setCustomerProducts(tempCustomerProducts);
            } else {
                navigate("/");
            }
        });
    }, [navigate, storeId]);

    const getProductOrders = (p) => {
        // get all customers information from customerProducts based on the id of product
        let temp = [];
        customerProducts.forEach((c) => {
            let index = c.products.findIndex((e) => e.id === p.id);
            if (index !== -1) {
                temp.push({
                    user: c.email,
                    name: c.name,
                    quantity: c.products[index].quantity,
                });
            }
        });
        setCustomers(temp);
        setProduct(p);
        document.getElementById("product").textContent = store.columnsList[p.id][1] + " Ordered " + p.quantity;
    };

    return (
        <Container maxWidth="lg">
            <div className="popstore-wrapper">
                <Grid className="pop-header-wrapper" container spacing={2}>
                    <Grid item xs={4} md={4}>
                        <Typography style={{marginBottom: "20px"}} variant="h4">
                        Preparação
                        </Typography>
                    </Grid>
                    <Grid item xs={4} md={4} alignSelf="center">
                        <Link to='/popstore/all'>
                        Fechar
                        </Link>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <div className="logout-button">
                            <LogoutButton user={user?.photoURL}/>
                        </div>
                    </Grid>
                </Grid>
                <Grid className="pop-header-wrapper" container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography style={{marginBottom: "1rem"}} variant="h6">
                            {store?.storeName}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <div style={{backgroundColor: "#fff", padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={8} md={5}>
                        <h5>Produto</h5>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <h5>Quantidade</h5>
                    </Grid>
                </Grid>
                {orders?.map((order, index) => {
                    return (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={8} md={5}>
                                <p>{store.columnsList[order.id][1]}</p>
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <p>{order.quantity}</p>
                            </Grid>
                        </Grid>
                    )
                })}
            </div>
            <Grid container spacing={2}>
                <Grid item xs={5} md={5}>
                    <div style={{padding: '1rem 0'}}>
                        <Select
                            fullWidth={true}
                            id="product"
                            label="Select Column"
                        >
                            {orders?.map((order, i) => (
                                <MenuItem
                                    onClick={(e => getProductOrders(order))}
                                    key={`${i}`}
                                >
                                    {store.columnsList[order.id][1]} - {order.quantity} Pedido
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </Grid>
            </Grid>
            <div style={{backgroundColor: "#fff", padding: '1rem'}}>
                {product.id !== undefined &&
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={5}>
                            <h5>Pedidos: {store.columnsList[product.id][1]}</h5>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={3}>
                            <h5>Cliente</h5>
                        </Grid>
                        <Grid item xs={4} md={3}>
                            <h5>Quantidade</h5>
                        </Grid>
                    </Grid>
                    {customers?.map((customer, i) => (
                        <Grid container spacing={2} key={i}>
                            <Grid item xs={8} md={3}>
                                <p>{customer.user}</p>
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <p>{customer.quantity}</p>
                            </Grid>
                        </Grid>
                    ))}
                </div>
                }
            </div>
            <p>&nbsp;</p>
        </Container>
    );
};

export default PackingPage;

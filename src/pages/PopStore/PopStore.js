import React, {useEffect, useState} from "react";
import Loading from "../../components/Loading";
import {
    Grid,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {collection, db, getDoc, doc, serverTimestamp, setDoc} from "../../service/firebase";
import { useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import sendMail from "../../service/email";
import textToPriceParser from '../../functions/textToPriceParser'

const PopStore = () => {
    const [store, setStore] = useState();
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const {ownerId, storeId } = useParams();
    const [order, setOrder] = useState([]);
    const MySwal = withReactContent(Swal)
    const [usercurrency] = React.useState();
    const [storecurrency,setStoreCurrency] = React.useState();
    const [submitting, setSubmitting] = React.useState(false);
    const [storeLink] = React.useState(process.env.REACT_APP_STORE_LINK)

    let total = 0;

    useEffect( () => {
        (async () => {
            const storesRef = await collection(db, `/StoreOwners/${ownerId}/allStores`);
            const store = await getDoc(doc(storesRef, storeId));
            if (store.exists()) {
                let data = store.data();
                data.columnsList = JSON.parse(data.columnsList);
                setStore(data);
                setStoreCurrency(data.currency)
                setLoading(false);
            }
        })();
    }, [ownerId, storeId]);

    const saveOrder = async () => {

        setSubmitting(true);

        if(!isEmail(email) || email.trim() === ""){
            await MySwal.fire({
                title: 'Erro',
                text: 'Por favor, insira seu e-mail',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            setSubmitting(false);
            return;
        }

        if(!isMobilePhone(phone) || phone.trim() === ""){
            await MySwal.fire({
                title: 'Erro',
                text: 'Por favor, insira seu número de telefone.',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            setSubmitting(false);
            return;
        }

        if(order.length === 0){
            await MySwal.fire({
                title: 'Erro',
                text: 'Por favor, adicione alguns produtos ao seu pedido.',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            setSubmitting(false);
            return;
        }

        // Check if a customer with this email already exists
        const customersRef = await collection(db, `/StoreOwners/${ownerId}/allStores/${storeId}/customers`);
        const customer = await getDoc(doc(customersRef, email));
        if(!customer.exists()){
            // Create a new customer
            const newCustomer = {
                uid: null,
                email: email.toLowerCase(),
                phone: phone,
                name: "",
                createdAt: serverTimestamp()
            }
            let newCustomerRef = await doc(customersRef, email);
            await setDoc(newCustomerRef, newCustomer);
        }

        const Order = {
            uid: null,
            email: email.toLowerCase(),
            phone: phone,
            name: "",
            order: JSON.stringify(order),
            storeId: storeId,
            createdAt: serverTimestamp()
        }

        const ordersRef = await collection(db, `/StoreOwners/${ownerId}/allStores/${storeId}/Orders`);
        const orderRef = await doc(ordersRef);
        await setDoc(orderRef, Order);
        await MySwal.fire({
            title: 'Sucesso',
            text: 'Seu pedido foi realizado.',
            icon: 'success',
            confirmButtonText: 'Ok'
        })

        let orderConfirmationEmail = `
            <!doctype html>
            <html lang="en">
            <head>
            <style>
               body{
                    font-family: 'Arial', Helvetica, Arial, Lucida, sans-serif;
               }
            </style>
            <title>Pedido no PopStore</title>
            </head>
            <body>
            <h1>Confirmação de Pedido</h1>
            <p>Obrigado pelo seu pedido. Seu pedido de <b>${store.storeName}</b> foi realizado com sucesso. Você pode visualizar seu pedido visitando o seguinte link:</p>
            <p><a href="${storeLink}/order/${ownerId}/${storeId}/${orderRef.id}">View Order</a></p>
            <p>&nbsp;</p>
            <p>Atenciosamente,</p>
            <p>PopStore</p>
            </body>
            </html>
            `;
        sendMail(email, "Confirmação de Pedido PopStore", orderConfirmationEmail);
        setOrder([]);
        setEmail("");
        setPhone("");
        setSubmitting(false);

        let newOrderEmail = `
            <!doctype html>
            <html lang="en">
            <head>
            <style>
               body{
                    font-family: 'Arial', Helvetica, Arial, Lucida, sans-serif;
               }
            </style>
            <title>Novo Pedido no PopStore</title>
            </head>
            <body>
            <h1>Pedido</h1>
            <p>Um novo pedido foi feito em <b>${store.storeName}</b>. Você pode visualizar o seu pedido visitando o seguinte link:</p>
            <p><a href="${storeLink}/order/${ownerId}/${storeId}/${orderRef.id}">View Order</a></p>
            <p>&nbsp;</p>
            <p>Atenciosamente,</p>
            <p>PopStore</p>
            </body>
            </html>
            `;
        if (isEmail(store.storeOwner)) {
            sendMail(store.storeOwner, "Novo Pedido no PopStore", newOrderEmail);
        }
    }

  if (loading) return <Loading />;
  console.log("storeLink" + process.env.REACT_APP_STORE_LINK)
  return (
    <div>
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <h2>{store.storeName}</h2>
                    <p>{store.description}</p>
                </Grid>
            </Grid>
            <div style={{backgroundColor: "#fff", padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={3} md={6}>
                        <h4>Produtos</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Preço</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Quantidade</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Valor</h4>
                    </Grid>
                </Grid>
                <div>
                    {store.columnsList?.map((column, index) => {
                        return <Grid container spacing={2} key={index} style={{marginBottom: "1rem"}}>
                            <Grid item xs={3} md={6}>
                                <p>{column[1]}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{Number(textToPriceParser(column[2]))} {store.currency}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <TextField
                                    id="outlined-basic"
                                    label="Quantidade"
                                    helperText=""
                                    type="number"
                                    variant="outlined"
                                    value={order[index]?.quantity}
                                    defaultValue={0}
                                    disabled={store.locked}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        if(!e.target.value || Number(e.target.value) < 0){
                                            e.target.value = (0).toString();
                                            // set default value and value of TextField to 0
                                            order[index] = {
                                                ...order[index],
                                                quantity: 0,
                                                id: index
                                            }

                                        } else {
                                            let newOrder = [...order];
                                            newOrder[index] = {
                                                ...newOrder[index],
                                                quantity: Number(e.target.value) < 0 ? 0 : parseInt(e.target.value),
                                                id: index
                                            };
                                            setOrder(newOrder);
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{Number(Number(textToPriceParser(column[2])) * Number(Number(order[index]?.quantity) ? order[index]?.quantity : 0)).toFixed(2)} {store.currency}</p>
                            </Grid>
                        </Grid>
                    })}
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={8} textAlign="right">
                            <p>&nbsp;</p>
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <h4>Total</h4>
                        </Grid>
                        <Grid item xs={3} md={2}>
                            <h4>
                                {order?.forEach((item, index) => {
                                        if(item){
                                            total += (Number(item.quantity) * Number(textToPriceParser(store?.columnsList[item.id][2])));
                                        }
                                })} {Number(total).toFixed(2)} {store.currency}
                            </h4>
                        </Grid>
                    </Grid>
                </div>
            </div>
            { !store.locked && <div style={{padding: '1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={4} md={1} alignSelf="center">
                        <label>E-mail:</label>
                    </Grid>
                    <Grid item xs={8} md={3} alignSelf="center">
                        <TextField
                            id="outlined-basic"
                            label="E-mail"
                            helperText=""
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} md={1} alignSelf="center">
                        <label>Telefone:</label>
                    </Grid>
                    <Grid item xs={8} md={3} alignSelf="center">
                        <TextField
                            id="outlined-basic"
                            label="Telefone"
                            helperText=""
                            type="phone"
                            variant="outlined"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} alignSelf="center" textAlign="right">
                        <Button
                            style={{marginLeft: '1rem'}}
                            color="primary"
                            variant="contained"
                            disabled={submitting}
                            onClick={saveOrder}
                            >
                            Encomendar
                        </Button>
                    </Grid>
                </Grid>
            </div> }
        </Container>
    </div>
  );
};

export default PopStore;

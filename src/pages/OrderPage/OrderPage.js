import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {doc, getDoc} from "../../service/firebase";
import { db, collection } from "../../service/firebase";
import { useNavigate, useParams } from "react-router-dom";
import textToPriceParser from '../../functions/textToPriceParser'

const OrderPage = () => {
    const navigate = useNavigate();
    const { ownerId, storeId, orderId } = useParams();
    const [store, setStore] = useState({});
    const [order, setOrder] = useState({});
    useEffect( () => {
        (async () => {
            const storesRef = await collection(db, `/StoreOwners/${ownerId}/allStores`);
            const store = await getDoc(doc(storesRef, storeId));
            if (store.exists()) {
                let data = store.data();
                data.columnsList = JSON.parse(data.columnsList);
                setStore(data);
            }
            const orderRef = await collection(db, `/StoreOwners/${ownerId}/allStores/${storeId}/Orders`);
            const order = await getDoc(doc(orderRef, orderId));
            if (order.exists()) {
                let orderData = order.data();
                orderData.order = JSON.parse(orderData.order);
                let temp = [];
                orderData.order.forEach((p) => {
                    if(p !== null){
                        if(p.quantity !== 0) {
                            temp.push(p);
                        }
                    }
                });
                orderData.order = temp;
                setOrder(orderData);
            }
        })();
    }, [navigate, ownerId, storeId, orderId]);

    return (
        <Container maxWidth="lg">
            <div className="popstore-wrapper">
                <Grid className="pop-header-wrapper" container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography style={{ marginBottom: "20px" }} variant="h3">
                            {store?.storeName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography style={{ marginBottom: "20px" }} variant="h4">
                        Informação do Pedido  <small varient="small">({order?.email})</small>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
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
                    {order?.order?.map((product, index) => {
                        return <Grid container spacing={2} key={index} style={{marginBottom: "1rem"}}>
                            <Grid item xs={3} md={6}>
                                <p>{store?.columnsList[product.id][1]}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{Number(textToPriceParser(store?.columnsList[product.id][2]))} {store?.currency}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{product.quantity}</p>
                            </Grid>
                            <Grid item xs={3} md={2}>
                                <p>{Number(textToPriceParser((store?.columnsList[product.id][2]).replace(/,/, '')) * parseFloat(product?.quantity ? product?.quantity : 0)).toFixed(2)} {store?.currency}</p>
                            </Grid>
                        </Grid>
                    })}
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={8} textAlign="right">
                        <p>&nbsp;</p>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>Total</h4>
                    </Grid>
                    <Grid item xs={3} md={2}>
                        <h4>
                            {(order?.order?.reduce((prev, next) => {
                                return prev + textToPriceParser(store?.columnsList[next.id][2].replace(/,/, '')) * parseFloat(next.quantity)
                            }, 0))?.toFixed(2)} {store?.currency}
                        </h4>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default OrderPage;

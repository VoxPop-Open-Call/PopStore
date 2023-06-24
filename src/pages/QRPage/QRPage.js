import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {doc, getDoc} from "../../service/firebase";
import { db, collection } from "../../service/firebase";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const QRPage = () => {
    const navigate = useNavigate();
    const [qr, setQr] = useState({});
    const { qrCode } = useParams();
    useEffect( () => {
        (async () => {
            const qrRef = await collection(db, `/QR`);
            const qr = await getDoc(doc(qrRef, qrCode));
            if (qr.exists()) {
                let data = qr.data();
                setQr(data);
                setTimeout(() => {
                    window.location.assign(data.link);
                }, 1500);
            } else {
                const MySwal = withReactContent(Swal)
                await MySwal.fire({
                    title: 'Error',
                    text: 'Invalid QR Code',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
                navigate("/");
            }
        })();
    }, [navigate, qrCode]);

    return (
        <Container maxWidth="lg">
            <div className="popstore-wrapper">
                <Grid className="pop-header-wrapper" container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Box
                            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <CircularProgress />
                            { !qr && <Typography ml={1}>Verifying QR Code...</Typography>}
                            { qr && <Typography ml={1}>Redirecting To {qr?.title}...</Typography>}
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default QRPage;

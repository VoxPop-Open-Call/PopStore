import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./styles.css";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Grid from "@mui/material/Grid";
import ProductTable from "../../components/ProductTable/ProductTable";
import Button from "@mui/material/Button";
import firebase from "../../service/firebase";
import { db, collection, getDocs, query, orderBy } from "../../service/firebase";
import { useNavigate, Link } from "react-router-dom";

const MyPopstore = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        let temp = [];
        const allStores = query(collection(
            db,
            `/StoreOwners/${user.uid}/allStores`
        ), orderBy('createAt', 'desc'));
        const querySnapshot = await getDocs(allStores);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          temp.push(doc.data());
        });
        setTableData(temp);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <div className="popstore-wrapper">
        <Grid className="pop-header-wrapper" container spacing={2}>
          <Grid item xs={10}>
            <Typography style={{ marginBottom: "20px" }} variant="h6">
            Minha PopStore
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <div className="logout-button">
              <LogoutButton user={user?.photoURL} />
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="new-popstore-button">
        <Button component={Link} to="/" variant="contained">
        Nova PopStore 
        </Button>
      </div>
      <ProductTable tableData={tableData} />
    </Container>
  );
};

export default MyPopstore;

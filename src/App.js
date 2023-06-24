import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material/";
import { Toaster } from "react-hot-toast";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import MyPopstore from "./pages/MyPopstore/MyPopstore";
import NewPopstore from "./pages/NewPopstore/NewPopstore";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import OrderPage from "./pages/OrderPage/OrderPage";
import QRPage from "./pages/QRPage/QRPage";
import CustomersPage from "./pages/CustomersPage/CustomersPage";
import PackagingPage from "./pages/PackingPage/PackingPage";
import PopStore from "./pages/PopStore/PopStore";
import NotFound from "./pages/NotFound/NotFound";

import theme from "./config/theme";
import EditPopstore from "./pages/EditPopstore/EditPopstore";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <h1><a href="/">PopStore</a></h1>
          </Grid></Grid>
      </Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route exact path="/popstore/all" element={<MyPopstore />} />
          <Route path="/popstore/create" element={<NewPopstore />} />
          <Route path="/store/:ownerId/:storeId" element={<PopStore />} />
          <Route path="/order/:ownerId/:storeId/:orderId" element={<OrderPage />} />
          <Route path="/QR/:qrCode" element={<QRPage />} />
          <Route path="/popstore/edit/:storeId" element={<EditPopstore />} />
          <Route path="/popstore/customers/:storeId" element={<CustomersPage />} />
          <Route path="/popstore/orders/:storeId" element={<OrdersPage />} />
          <Route path="/popstore/packaging/:storeId" element={<PackagingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;

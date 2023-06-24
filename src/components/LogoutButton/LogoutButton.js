import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import firebase from "../../service/firebase";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.clear();
        window.location.assign('/');
      });
  };
    const goToProfile = () => {
        navigate("/popstore/all");
    };
  return (
    <div style={{display: 'flex', justifyContent: "center"}}>
      <div style={{cursor: "pointer"}}>
        <Avatar onClick={goToProfile} alt="" src={user} sx={{ width: 56, height: 56 }} />
        <Typography onClick={handleLogout} variant="p" style={{color: "#fc5603", paddingTop: "1rem", display: "block"}}>Sair</Typography>
      </div>
    </div>
  );
};

export default LogoutButton;

import {useNavigate} from "react-router-dom";
import {BANK_DASHBOARD, VIEW, WALLET} from "../../routes/routeNames.ts";
import Container from "@mui/material/Container";
import {sessionKeys} from "../../routes/storageKeys.ts";
import {UserRole} from "../shared/user/UserModel.ts";
import {useEffect} from "react";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    switch (sessionStorage.getItem(sessionKeys.USER_ROLE)) {
      case UserRole.BANK:
        navigate(BANK_DASHBOARD);
        break;
      case UserRole.CORP:
        navigate(VIEW);
        break;
      case UserRole.INVESTOR:
        navigate(WALLET);
        break;
    }
  });


return <Container maxWidth="xl">HOME</Container>;
}

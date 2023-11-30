import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

import {RouteItem} from "../types/types";
import * as RoutePaths from "./routeNames";
import CorpDashboard from "../components/Dashboard/CorpDashboard.tsx";
import Login from "../components/Login/Login";
import Home from "../components/Home/Home.tsx";
import BankDashboard from "../components/Dashboard/BankDashboard.tsx";
import {UserRole} from "../components/shared/user/UserModel.ts";
import ViewPlacements from "../components/ViewPlacements/ViewPlacements.tsx";
import {
  AddCircleRounded,
  PageviewRounded,
  StoreRounded,
  Wallet as WalletIcon
} from "@mui/icons-material";
import SelectAssetType from "../components/Create/SelectAssetType.tsx";
import CreateForm from "../components/Create/CreateForm.tsx";
import Market from "../components/Market/Market.tsx";
import MarketDetails from "../components/MarketDetails/MarketDetails.tsx";
import Wallet from "../components/Wallet/Wallet.tsx";

export const routeMapping: RouteItem[] = [
  {
    name: "Home",
    path: RoutePaths.HOME,
    element: <Home />,
    displayInMenu: false,
    guarded: true,
    roles: [],
  },
  {
    name: "Dashboard",
    path: RoutePaths.CORP_DASHBOARD,
    element: <CorpDashboard />,
    icon: <DashboardRoundedIcon />,
    displayInMenu: false,
    guarded: true,
    roles: [UserRole.CORP],
  },
  {
    name: "Dashboard",
    path: RoutePaths.BANK_DASHBOARD,
    element: <BankDashboard />,
    icon: <DashboardRoundedIcon />,
    displayInMenu: true,
    guarded: true,
    roles: [UserRole.BANK],
  },
  {
    name: "Login",
    path: RoutePaths.AUTH,
    element: <Login />,
    withoutAppShell: true,
    displayInMenu: false,
    guarded: false,
    roles: [UserRole.CORP, UserRole.BANK],
  },
  {
    name: "View",
    path: RoutePaths.VIEW,
    element: <ViewPlacements />,
    icon: <PageviewRounded />,
    displayInMenu: true,
    guarded: true,
    roles: [UserRole.CORP],
  },
  {
    name: "Create",
    path: RoutePaths.CREATE_SELECT,
    element: <SelectAssetType />,
    icon: <AddCircleRounded />,
    displayInMenu: true,
    guarded: true,
    roles: [UserRole.CORP],
  },
  {
    name: "Create Form",
    path: RoutePaths.CREATE_FORM,
    element: <CreateForm />,
    displayInMenu: false,
    guarded: true,
    roles: [UserRole.CORP],
  },
  {
    name: "Wallet",
    path: RoutePaths.WALLET,
    element: <Wallet />,
    icon: <WalletIcon />,
    displayInMenu: true,
    guarded: true,
    roles: [UserRole.INVESTOR],
  },
  {
    name: "Market",
    path: RoutePaths.MARKET,
    element: <Market />,
    icon: <StoreRounded />,
    displayInMenu: true,
    guarded: true,
    roles: [UserRole.INVESTOR],
  },
  {
    name: "Market Details",
    path: RoutePaths.MARKET_DETAILS,
    element: <MarketDetails />,
    displayInMenu: false,
    guarded: true,
    roles: [UserRole.INVESTOR],
  },
];

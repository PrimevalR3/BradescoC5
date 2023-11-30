import {ReactNode} from "react";
import {UserRole} from "../components/shared/user/UserModel.ts";

export interface RouteItem {
  name: string;
  path: string;
  element: ReactNode;
  children?: RouteItem[];
  withoutAppShell?: boolean;
  icon?: ReactNode;
  displayInMenu: boolean,
  guarded: boolean,
  roles: UserRole[],
}

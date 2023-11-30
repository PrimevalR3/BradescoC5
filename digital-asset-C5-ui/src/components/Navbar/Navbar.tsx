import {AppSideBar, AppSideBarItem, AppSideBarNestedMenu,} from "@r3-ui-test/ui-organism-library";
import {Link, useLocation} from "react-router-dom";

import {routeMapping} from "../../routes/routeMapping";
import {sessionKeys} from "../../routes/storageKeys.ts";

function NavBar() {
  const { pathname } = useLocation();
  const currentRole = sessionStorage.getItem(sessionKeys.USER_ROLE);
  return (
    <AppSideBar closeOnClickAway={false}>
      <AppSideBarNestedMenu multipleActiveItems={true}>
        {routeMapping
            .filter((route) => route.displayInMenu)
            .filter((route) => route.roles.some(role => role.toString() === currentRole))
            .map((route) => (
              <AppSideBarItem
                key={route.name}
                component={Link}
                to={route.path}
                selected={pathname === route.path}
                icon={route.icon}
                text={route.name}
              />
            ))}
      </AppSideBarNestedMenu>
    </AppSideBar>
  );
}

export default NavBar;

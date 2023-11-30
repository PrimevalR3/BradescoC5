import {Route, Routes, useNavigate} from "react-router-dom";

import AppShell from "../AppShell/AppShell";
import * as RoutePaths from "../../routes/routeNames";
import {routeMapping} from "../../routes/routeMapping";
import {sessionKeys} from "../../routes/storageKeys.ts";

function AppRoutes() {
  const navigate = useNavigate();
  const renderRoutes = (useAppShell: boolean) => {
    if (useAppShell) {
      return routeMapping.map((route) => {
        if (!route.withoutAppShell) {
          if (route.children) {
            return (
              <Route path={route.path} element={route.element} key={route.name}>
                {route.children.map((innerRoute) => {
                  return (
                    <Route
                      path={innerRoute.path}
                      element={innerRoute.element}
                      key={innerRoute.name}
                    />
                  );
                })}
              </Route>
            );
          } else {
            if(route.guarded) {
              let role = sessionStorage.getItem(sessionKeys.USER_ROLE);
              if(!role || !route.roles.some(r => r.toString() === role)) {
                !sessionStorage.getItem(sessionKeys.USER_ROLE) && navigate('/auth/login');
              }
            }
            return (
              <Route
                path={route.path}
                element={route.element}
                key={route.name}
              />
            );
          }
        }
      });
    } else {
      return routeMapping.map((route) => {
        if (route.withoutAppShell) {
          return (
            <Route path={route.path} element={route.element} key={route.name} />
          );
        }
      });
    }
  };

  return (
    <Routes>
      <Route path={RoutePaths.HOME} element={<AppShell />}>
        {renderRoutes(true)}
      </Route>
      {renderRoutes(false)}
    </Routes>
  );
}

export default AppRoutes;

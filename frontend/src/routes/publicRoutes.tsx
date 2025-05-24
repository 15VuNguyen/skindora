import type { RouteObject } from "react-router-dom";

import Homepage from "@/pages/Homepage";

const publicRoutes: RouteObject[] = [{ index: true, path: "/", element: <Homepage /> }];
export default publicRoutes;

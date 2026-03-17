import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("info", "routes/info.tsx"),
    route("home", "routes/project.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
] satisfies RouteConfig;

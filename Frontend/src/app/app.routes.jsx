import { createBrowserRouter } from "react-router"
import App from "./App"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Hi this is the starting of the snitch website </h1>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    }
]) 
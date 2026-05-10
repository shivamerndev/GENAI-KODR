import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
import { createBrowserRouter } from 'react-router-dom';
import AuthRoutes from '../middleware/AuthRoutes';
import App from './App';

export const routes = createBrowserRouter([
  {
    element: <App />,
    children: [{
      path: "/",
      element: <AuthRoutes> <Home /> </AuthRoutes>
    }, {
      path: "/c/:chatId",
      element: <AuthRoutes> <Home/> </AuthRoutes>
    },
    {
      path: "*",
      element: <div>404 Not Found</div>
    },
    {
      path: "/login",
      element: <Login />
    }]
  },

]);
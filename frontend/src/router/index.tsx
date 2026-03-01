import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import SignInPage from "../pages/auth/SignInPage.tsx";
import SignUpPage from "../pages/auth/SignUpPage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import Providers from "../Providers.tsx";
import Dashboard from "../pages/dashboard/DashBoard.tsx";
import Wallet from "../pages/dashboard/Wallet.tsx";
import Shopping from "../pages/Shopping/Shopping.tsx";
import ExitSettlement from "../pages/ExitSettlement/ExitSettlement.tsx";
import PairingHub from "../pages/Shopping/PairingHub.tsx";
import LiveShopping from "../pages/Shopping/LiveShopping.tsx";
import QuickExit from "../pages/quick-Exit/QuickExit.tsx";
import SmartReceipt from "../pages/reciept/SmartReceipt.tsx";
import Profile from "../pages/profile/Profile.tsx";

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/shopping",
        element: <Shopping />,
      },
      {
        path: "/live-shopping",
        element: <LiveShopping />,
      },
      {
        path: "/pairing-hub",
        element: <PairingHub />,
      },
      {
        path: "/exit-settlement",
        element: <ExitSettlement />,
      },
      {
        path: "/quick-exit",
        element: <QuickExit />,
      },
      {
        path: "/smart-receipt",
        element: <SmartReceipt />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/auth/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/auth/sign-up",
        element: <SignUpPage />,
      },
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/protected",
            element: <Dashboard />,
          },
          {
            path: "/wallet",
            element: <Wallet />,
          },
          
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;

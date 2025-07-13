import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const StorePage = lazy(() => import("@/features/Store"));
const PublicLayout = lazy(() => import("@/layouts/publicLayout"));
const PaymentReturnPage = lazy(() => import("@/features/PaymentReturnPage"));
const VerifyEmailPage = lazy(() => import("@/features/Auth/pages/VerifyEmail"));

const AuthPage = lazy(() => import("@/features/Auth"));
const Homepage = lazy(() => import("@/features/Homepage"));
const ContactPage = lazy(() => import("@/features/Contact"));
const AboutPage = lazy(() => import("@/features/About"));
const ProductDetailPage = lazy(() => import("@/features/ProductDetail/index"));
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Homepage /> },

      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "products",
        element: <StorePage />,
      },

      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
  { index: true, path: "/", element: <Homepage /> },
  {
    path: "auth",
    element: <AuthPage />,
    children: [
      {
        index: true,
        path: "login",
        element: null,
      },
      {
        path: "register",
        element: null,
      },
      {
        path: "forgot-password",
        element: null
      },
      {
    path: "reset-password",
    element: null
  },
    ],
  },
  
  {
    path: "/payment/return",
    element: <PaymentReturnPage />,
  },
  {
    path: "/auth/verify-email",
    element: <VerifyEmailPage />,
  },
];
export default publicRoutes;

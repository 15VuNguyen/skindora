import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const PublicLayout = lazy(() => import("@/layouts/publicLayout"));

const VerifyEmailPage = lazy(() => import("@/features/Auth/pages/VerifyEmail"));

const AuthPage = lazy(() => import("@/features/Auth"));
const Homepage = lazy(() => import("@/features/Homepage"));
const ContactPage = lazy(() => import("@/features/Contact"));
const AboutPage = lazy(() => import("@/features/About"));
const ProfilePage = lazy(() => import("@/features/Profile"));



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
        path: "profile",
        element: <ProfilePage />,
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
    
    ],
  },
  {
    path: "/auth/verify-email",
    element: <VerifyEmailPage />,
  },
];
export default publicRoutes;

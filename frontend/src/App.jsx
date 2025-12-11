import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import CareerQuest from "./components/CareerQuest";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CreateCompany from "./components/admin/CreateCompany";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJobs from "./components/admin/PostJobs";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SavePost from "./components/SavePost";
import JobSetUp from "./components/admin/JobSetUp";
import About from "./components/About";
import TermsAndConditions from "./components/TermsAndCondition";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ContactUs from "./components/ContactUs";
import TitleManager from "./TitleManager";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import GoogleLogin from "./components/auth/GoogleLogin";

const Layout = ({ children }) => {
  return (
    <>
      <TitleManager />
      {children}
    </>
  );
};

const MainRouter = () => {
  const { user } = useSelector((store) => store.auth);

  const appRouter = createBrowserRouter([
    {
      path: "/login",
      element: (
        <Layout>
          <Login />
        </Layout>
      ),
    },
    {
      path: "/signup",
      element: (
        <Layout>
          <Signup />
        </Layout>
      ),
    },
    {
      path: "/",
      element: user ? (
        <Layout>
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        </Layout>
      ) : (
        <Navigate to="/login" />
      ),
    },
    {
      path: "/jobs",
      element: (
        <Layout>
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/description/:id",
      element: (
        <Layout>
          <ProtectedRoute>
            <JobDescription />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/careerquest",
      element: (
        <Layout>
          <ProtectedRoute>
            <CareerQuest />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/profile",
      element: (
        <Layout>
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/jobs/save",
      element: (
        <Layout>
          <ProtectedRoute>
            <SavePost />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/about-us",
      element: (
        <Layout>
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/terms-conditions",
      element: (
        <Layout>
          <ProtectedRoute>
            <TermsAndConditions />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/privacy-policy",
      element: (
        <Layout>
          <ProtectedRoute>
            <PrivacyPolicy />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/contact-us",
      element: (
        <Layout>
          <ProtectedRoute>
            <ContactUs />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/admin/companies",
      element: (
        <Layout>
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/admin/companies/create",
      element: (
        <Layout>
          <ProtectedRoute>
            <CreateCompany />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/admin/companies/:id",
      element: (
        <Layout>
          <ProtectedRoute>
            <CompanySetup />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/admin/jobs",
      element: (
        <Layout>
          <ProtectedRoute>
            <AdminJobs />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/admin/jobs/create",
      element: (
        <Layout>
          <ProtectedRoute>
            <PostJobs />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/admin/jobs/:id/applicants",
      element: (
        <Layout>
          <ProtectedRoute>
            <Applicants />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/admin/jobs/:id",
      element: (
        <Layout>
          <ProtectedRoute>
            <JobSetUp />
          </ProtectedRoute>
        </Layout>
      ),
    },
  ]);

  return <RouterProvider router={appRouter} />;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="557442000556-5cout4ctdgaji74goq808o57v2bl6o02.apps.googleusercontent.com">
      <MainRouter />
    </GoogleOAuthProvider>
  );
};

export default App;

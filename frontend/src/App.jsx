import { BrowserRouter, Routes, Route } from "react-router-dom";

import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Register from "./pages/Signup";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminItems from "./pages/AdminItems";
import AdminReports from "./pages/AdminReports";

import UserDashboard from "./pages/UserDashboard";
import Landing from "./pages/Landing";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import ItemDetail from "./pages/ItemDetail";
import Profile from "./pages/Profile";

import ReportItem from "./components/user/ItemReport";
import PublicLayout from "./components/layout/PublicLayout";
import RequireAuth from "./components/auth/RequireAuth";
import HowItWorksSection from "./components/landing/HowItWorksSection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/lostitems" element={<LostItems />} />
          <Route
            path="/lostitems/:id"
            element={<ItemDetail type="lost" />}
          />
          <Route
            path="/founditems"
            element={<FoundItems />}
          />
          <Route
            path="/founditems/:id"
            element={<ItemDetail type="found" />}
          />
          <Route
            path="/how-it-works"
            element={<HowItWorksSection />}
          />
        </Route>
        
        {/* Authentication routes */}
        <Route path="/signup" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />

        {/* Protected user routes */}
        <Route
          element={
            <RequireAuth>
              <UserDashboard />
            </RequireAuth>
          }
        >
          <Route path="/userdashboard" />
          <Route
            path="/lost-items/report"
            element={<ReportItem />}
          />
          <Route
            path="/found-items/report"
            element={<ReportItem />}
          />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admindashboard"
          element={<AdminDashboard />}
        />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/items" element={<AdminItems />} />
        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
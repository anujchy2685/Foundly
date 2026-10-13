import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

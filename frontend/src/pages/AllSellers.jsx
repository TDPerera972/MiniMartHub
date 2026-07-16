import React, { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sellers from "../components/Sellers/Sellers";
import Footer from "../components/Footer/Footer";

const AllSellers = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="all-sellers-page">
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <Sellers />
      </div>
      <Footer />
    </div>
  );
};

export default AllSellers;
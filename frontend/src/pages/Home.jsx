import React from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import { Products } from "../components/Products/Products";
import Sellers from "../components/Sellers/Sellers";
import Footer from "../components/Footer/Footer";


const Home = () => {
  return (
    <>

      <Navbar />

      <Hero />

      <Products limit={20} />

      <Sellers limit={4} />

      <Categories />

      <Footer />

    </>
  );
};

export default Home;
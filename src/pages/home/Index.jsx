import React from "react";
import { Layout } from "antd";

import LandingSection from "./landing/Index";
import UserServices from "./content/Index";
import Footer from "./Footer";

export default function Home() {
  return (
    <Layout className="home-layout">
      <LandingSection />
      <UserServices />
      <Footer />
    </Layout>
  );
}

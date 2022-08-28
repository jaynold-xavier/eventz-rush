import React from "react";
import { Layout } from "antd";

import LandingSection from "./LandingSection";
import UserServices from "./UserServices";

export default function Home() {
  return (
    <Layout className="home-layout">
      <LandingSection />
      <UserServices />
    </Layout>
  );
}

import React from "react";
import { Layout } from "antd";

import LandingSection from "./landing/Index";
import Services from "./content/Index";
import Footer from "../../components/page/footer/Index";

export default function Home() {
  return (
    <Layout className="home-layout">
      <LandingSection />

      {/* Shape Divider */}
      <div className="shape-divider">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z"
            className="shape-fill"
          />
        </svg>
      </div>

      <Services />
    </Layout>
  );
}

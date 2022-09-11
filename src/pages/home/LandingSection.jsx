import React from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { Content } from "antd/lib/layout/layout";

import animationData from "../../assets/lotties/landing/data.json";
import { Button } from "antd";

export default function LandingSection() {
  return (
    <Content className="landing-section">
      <motion.div
        className="welcome-section container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Lottie
          width="80%"
          speed={0.8}
          options={{
            loop: true,
            autoplay: true,
            animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          isClickToPauseDisabled
        />

        <br />
        <br />

        <div className="welcome-heading">
          THE BEST PLACE TO MEET YOUR EVENT NEEDS
        </div>
        <div className="welcome-tagline">
          Find Vendors. Manage Events. Settle Payments. Repeat.
        </div>

        <Button
          className="register-btn"
          type="primary"
          size="large"
          shape="round"
        >
          Register Now
        </Button>

        <br />
        <br />
        <br />
      </motion.div>
    </Content>
  );
}

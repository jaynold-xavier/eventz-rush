import React from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { Button } from "antd";
import { Content } from "antd/lib/layout/layout";

import animationData from "../../../assets/lotties/landing/data.json";

export default function LandingSection() {
  return (
    <Content className="landing-section center">
      <motion.div
        className="center container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Lottie
          speed={0.8}
          options={{
            loop: true,
            autoplay: true,
            animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
              progressiveLoad: true,
            },
          }}
          isClickToPauseDisabled
        />

        <br />
        <br />

        <div className="landing-message">
          <div className="welcome-heading">
            THE BEST PLACE TO MEET YOUR EVENT NEEDS
          </div>
          <div className="welcome-tagline">
            Find Vendors • Manage Events • Settle Payments • Repeat
          </div>

          <Button
            className="register-btn"
            type="primary"
            size="large"
            // shape="round"
          >
            Register Now
          </Button>
        </div>

        <br />
        <br />
      </motion.div>
    </Content>
  );
}

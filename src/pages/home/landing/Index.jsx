import React from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { Button, Layout } from "antd";

import animationData from "../../../assets/lotties/landing/data.json";

const { Content } = Layout;

export default function LandingSection() {
  return (
    <Content className="landing-intro center">
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

        <div className="landing-message">
          <div className="welcome-heading">
            Where <span className="highlight">vendors</span> meet{" "}
            <span className="highlight">hosts</span> to organize the perfect
            event
          </div>
          <br />

          <div className="welcome-tagline">
            Build your professional profile as an event vendor or simply reach
            out to registered vendors to speedily organize events of any kind.
          </div>
          <br />
          <br />

          <Button
            className="register-btn"
            type="primary"
            size="large"
            // shape="round"
          >
            Register Now
          </Button>
        </div>
      </motion.div>
    </Content>
  );
}

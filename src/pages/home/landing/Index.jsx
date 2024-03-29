import { ArrowRightOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Button, ConfigProvider, Layout } from "antd";

import animationData from "../../../assets/lotties/landing/data.json";
import { appRoutes } from "../../../constants/routes";
import { buttonActionTheme } from "../../../assets/js/theme";

const { Content } = Layout;

const options = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
    progressiveLoad: true,
  },
};

export default function LandingSection() {
  const navigate = useNavigate();

  return (
    <Content className="landing-intro center">
      <motion.div
        className="center container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Lottie {...options} />

        <div className="landing-message">
          <h4 className="welcome-heading">
            Where <span className="highlight-text">vendors</span> meet{" "}
            <span className="highlight-text">hosts</span> to organize the
            perfect event
          </h4>

          <br />

          <p className="welcome-tagline mt-0 mb-0">
            Build your professional profile as an event vendor or simply reach
            out to registered vendors to speedily organize events of any kind.
          </p>

          <br />
          <br />

          {/* <ConfigProvider
            theme={{
              token: {
                ...buttonActionTheme,
              },
            }}
          >
            <Button
              className="register-btn icon-animated-button"
              type="primary"
              size="large"
              // shape="round"
              onClick={(e) => navigate(appRoutes.register)}
            >
              Get Started
              <ArrowRightOutlined />
            </Button>
          </ConfigProvider> */}
        </div>
      </motion.div>
    </Content>
  );
}

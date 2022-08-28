import React from "react";
import { motion } from "framer-motion";
import { Content } from "antd/lib/layout/layout";

export default function LandingSection() {
  return (
    <Content className="landing-section">
      <motion.div
        className="welcome-section container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="welcome-heading">
          THE BEST PLACE TO MEET YOUR EVENT NEEDS
        </div>
        <div className="welcome-tagline">
          FIND VENDORS. MANAGE EVENTS. SETTLE PAYMENTS. REPEAT
        </div>
      </motion.div>
    </Content>
  );
}

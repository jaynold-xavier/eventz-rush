import React from "react";
import { motion } from "framer-motion";
import { Content } from "antd/lib/layout/layout";

export default function UserServices() {
  return (
    <Content className="info-services-section">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <br />

        <h3 className="title">Our Services</h3>
      </motion.div>
    </Content>
  );
}

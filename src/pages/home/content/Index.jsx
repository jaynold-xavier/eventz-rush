import React from "react";
import { motion } from "framer-motion";
import { Content } from "antd/lib/layout/layout";
import { Image } from "antd";

import Service1 from "../../../assets/images/landing/service (1).svg";
import Service2 from "../../../assets/images/landing/service (2).svg";
import Service3 from "../../../assets/images/landing/service (3).svg";

export default function Services() {
  return (
    <Content className="landing-content">
      <br />
      <br />
      <br />
      <br />

      <motion.div
        className="catch-content container center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Why Eventz Rush?</h1>
        <h3 className="text-center">
          Both hosts and vendors have a place at Eventz Rush - monetize and
          publicize your vendor services or create events all the way from
          defining basic info to payment for your vendor's services.
        </h3>
      </motion.div>

      <br />
      <br />

      <motion.div
        className="container center justify-content-between"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          className="app-logo"
          src={Service1}
          width="25rem"
          preview={false}
        />

        <section>
          <h1>Why Eventz Rush?</h1>
          <h3>
            Both hosts and vendors have a place at Eventz Rush - monetize and
            publicize your vendor services or create events all the way from
            defining basic info to payment for your vendor's services.
          </h3>
        </section>
      </motion.div>

      <br />
      <br />

      <motion.div
        className="container center justify-content-between"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <section>
          <h1>Why Eventz Rush?</h1>
          <h3>
            Both hosts and vendors have a place at Eventz Rush - monetize and
            publicize your vendor services or create events all the way from
            defining basic info to payment for your vendor's services.
          </h3>
        </section>

        <Image
          className="app-logo"
          src={Service2}
          width="25rem"
          preview={false}
        />
      </motion.div>

      <br />
      <br />

      <motion.div
        className="container center justify-content-between"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          className="app-logo"
          src={Service3}
          width="25rem"
          preview={false}
        />

        <section>
          <h1>Why Eventz Rush?</h1>
          <h3>
            Both hosts and vendors have a place at Eventz Rush - monetize and
            publicize your vendor services or create events all the way from
            defining basic info to payment for your vendor's services.
          </h3>
        </section>
      </motion.div>
    </Content>
  );
}

// Collaborate and always stay in touch every step of the event organization.

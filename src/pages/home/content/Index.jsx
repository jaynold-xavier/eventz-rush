import React from "react";
import { motion } from "framer-motion";
import { Content } from "antd/lib/layout/layout";
import { Image } from "antd";

import LoginImg from "../../../assets/images/landing/login.svg";
import ProfileImg from "../../../assets/images/landing/profile.svg";
import ReviewImg from "../../../assets/images/landing/review.svg";

import BlobImg1 from "../../../assets/images/shapes/shape-5.svg";
import BlobImg2 from "../../../assets/images/shapes/shape-4.svg";
// import BlobImg3 from "../../../assets/images/shapes/shape-5.svg";

export default function Services() {
  return (
    <Content className="landing-content">
      <br />
      <br />
      <br />

      <motion.section
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
      </motion.section>

      <br />
      <br />

      <motion.section
        className="service-content container center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          className="login-img"
          src={LoginImg}
          width="30rem"
          preview={false}
          alt="login-img"
        />

        <article>
          <h1>Register as a Host or a Vendor</h1>
          <h3 className="card">
            Whether your a host or vendor, you can benefit from role specific
            services to allow you to carry out your task as part of an event.
            For instance, accept/reject offers to provide services to events as
            a vendor or review vendors as hosts.
          </h3>
        </article>
      </motion.section>

      <br />
      <Image
        className="blob-2"
        rootClassName="blob-img"
        src={BlobImg2}
        alt="blob-2"
        width="30rem"
        preview={false}
      />
      <br />

      <motion.section
        className="service-content container center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <article>
          <h1>Facebook for Event Vendors</h1>
          <h3 className="card">
            Build your reputation in your profession as an event vendor- gain
            influence through profile building and custom content creation.
          </h3>
        </article>

        <Image
          className="profile-img"
          src={ProfileImg}
          width="40rem"
          preview={false}
          alt="profile-img"
        />
      </motion.section>

      <br />
      <Image
        className="blob-1"
        rootClassName="blob-img"
        src={BlobImg1}
        width="30rem"
        preview={false}
        alt="blob-1"
      />
      <br />

      <motion.section
        className="service-content container center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          className="review-img"
          src={ReviewImg}
          width="40rem"
          preview={false}
          alt="review-img"
        />

        <article>
          <h1>Write Reviews</h1>
          <h3 className="card">
            Elaborate and describe the performance of vendors in events. This
            adds to their reputation and assists them in getting more offers.
          </h3>
        </article>
      </motion.section>
    </Content>
  );
}

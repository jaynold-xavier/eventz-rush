import React from "react";
import { motion } from "framer-motion";
import { Image, Space, Layout } from "antd";

import LoginImg from "../../../assets/images/landing/login.svg";
import LoginIcon from "../../../assets/images/landing/login-icon.png";
import ProfileImg from "../../../assets/images/landing/profile.svg";
import ProfileIcon from "../../../assets/images/landing/profile-icon.svg";
import ReviewImg from "../../../assets/images/landing/review.svg";
import ReviewIcon from "../../../assets/images/landing/review-icon.svg";

import BlobImg1 from "../../../assets/images/shapes/shape-2.svg";
import BlobImg2 from "../../../assets/images/shapes/shape-3.svg";
import BlobImg3 from "../../../assets/images/shapes/shape-4.svg";

const { Content } = Layout;

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
        <h3>Why Eventz Rush?</h3>
        <p className="text-center">
          Both hosts and vendors have a place at Eventz Rush - monetize and
          publicize your vendor services or create events all the way from
          defining basic info to payment for your vendor's services.
        </p>
      </motion.section>

      <br />
      <br />

      <motion.section
        className="service-content container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          className="login-img"
          src={LoginImg}
          width="100%"
          preview={false}
          alt="login-img"
        />

        <article>
          <Space className="service-title mb-3" size={15} align="start">
            <Image
              src={LoginIcon}
              width="3.5rem"
              preview={false}
              alt="login-icon"
            />

            <h3>Register as a Host or a Vendor</h3>
          </Space>

          <p>
            Whether your a host or vendor, you can benefit from role specific
            services to allow you to carry out your task as part of an event.
            For instance, accept/reject offers to provide services to events as
            a vendor or review vendors as hosts.
          </p>
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
      <br />

      <motion.section
        className="service-content container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <article>
          <Space className="service-title mb-3" size={15} align="start">
            <h3>Facebook for Event Vendors</h3>

            <Image
              src={ProfileIcon}
              width="2.5rem"
              preview={false}
              alt="profile-icon"
            />
          </Space>

          <p>
            Build your reputation in your profession as an event vendor- gain
            influence through profile building and custom content creation.
          </p>
        </article>

        <Image
          className="profile-img"
          src={ProfileImg}
          width="80%"
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
      <br />

      <motion.section
        className="service-content container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          className="review-img"
          src={ReviewImg}
          width="70%"
          preview={false}
          alt="review-img"
        />

        <article>
          <Space className="service-title mb-3" size={15} align="start">
            <Image
              src={ReviewIcon}
              width="2.5rem"
              preview={false}
              alt="profile-icon"
            />

            <h3>Rate and Review Vendors</h3>
          </Space>

          <p>
            Elaborate and rate the performance of vendors in events through a
            simple form - this adds to their reputation and assists them in
            getting more offers for events.
          </p>
        </article>
      </motion.section>

      <br />
      <Image
        className="blob-3"
        rootClassName="blob-img"
        src={BlobImg3}
        width="30rem"
        preview={false}
        alt="blob-3"
      />
      <br />
    </Content>
  );
}

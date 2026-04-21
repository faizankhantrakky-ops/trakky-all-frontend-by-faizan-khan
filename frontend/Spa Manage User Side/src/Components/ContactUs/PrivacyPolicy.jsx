import React from "react";
import styles from "./Privacy.module.css";
// import Footer from '../Common/Footer/Footer'
import backPng from "../../Assets/images/contactus/backarrow.svg";
function PrivacyPolicy() {
  return (
    <>
      <button className={styles.back_arrow_btn}
        onClick={() => {
          window.history.back();
        }}
      >
        <img src={backPng} alt="back" /> <span>Back</span>
      </button>
      <div className={styles.PrivacyPolicy_main}>
        <h2
          style={{
            fontSize: "24px",
            padding: "0px 0px 10px 0px",
            margin: "0px",
            fontWeight: "bold",
          }}
        >
          Privacy Policy by Trakky
        </h2>
        <p>
          This Privacy Policy ("Policy") outlines the procedures and practices
          concerning the collection, usage, disclosure, and protection of your
          information when you utilize our website, located at{" "}
          <a href="https://trakky.in/" className={styles.PrivacyPolicy_link}>
            www.trakky.in
          </a>{" "}
          , or the Trakky mobile application (together, the "Trakky Platform"),
          operated by Trakky Techno Services Private Limited, a company
          established under the laws of India, with its registered office in
          Vadodara city.
          <br />
          <br />
          The terms "you" and "your" pertain to users of the Trakky Platform.
          The term "Services" refers to any services provided by Trakky, whether
          on the Trakky Platform or otherwise. Please review this Policy before
          using the Trakky Platform or submitting any personal information to
          Trakky. This Policy is an integral part of, and incorporated within,
          the Terms of Use.
        </p>
        <h3>Your Consent</h3>
        <p>
          By accessing the Trakky Platform and utilizing the Services, you
          consent to the collection, transfer, use, storage, disclosure, and
          sharing of your information as described and collected by us in
          accordance with this Policy. If you disagree with the Policy, please
          refrain from accessing or using the Trakky Platform.
        </p>
        <h3>Policy Changes</h3>
        <p>
          We may periodically update this Policy, with such changes being posted
          on this page. In the event of significant changes to this Policy, we
          will strive to provide reasonable notice, such as through prominent
          notices on the Trakky Platform or via email to your registered
          address. Your continued use of our Services following the publication
          or dispatch of a notice regarding changes to this Policy shall signify
          your consent to the updated Policy, to the extent permitted by
          applicable law.
        </p>
        <h3>Information Collection</h3>
        <p>
          We collect and process the following information about you:
          <ol className={styles.PrivacyPolicy_orderlist}>
            <br />
            <li>
              <b>Information You Provide:</b> This includes details provided
              when creating or updating your Trakky account, submitting content
              (such as reviews or orders), engaging with customer support,
              participating in interactive services, or enabling features
              requiring access to your address book or calendar.
            </li>
            <br />
            <li>
              <b>Information Automatically Collected:</b> This encompasses
              demographic and other information gathered during your visits to
              the Trakky Platform, as well as location information, usage and
              preference data, transaction details, and device information.
            </li>
            <br />
            <li>
              <b>Information Received from Other Sources:</b> We may obtain
              information about you from third parties, such as other users,
              partners, or affiliated companies.
            </li>
          </ol>
        </p>
        <h3>Cookie Usage</h3>
        <p>
          Trakky Platform and our partners may utilize cookies, pixel tags, web
          beacons, and similar technologies to collect and store information
          regarding your use of the Services and third-party websites. Cookies
          are employed for purposes including authentication, remembering
          preferences, content popularity assessment, advertising effectiveness
          measurement, traffic analysis, and understanding user behavior and
          interests.
          <br />
          <br />
          You can modify your cookie settings via your browser's settings. By
          using our Services with your browser settings configured to accept
          cookies, you are consenting to our utilization of cookies as described
          herein.
        </p>
        <h3>Uses of Your Information</h3>
        <p>
          We employ the information we collect for purposes including providing,
          personalizing, maintaining, and enhancing our products and services,
          fulfilling contractual obligations, administering and bolstering
          Trakky Platform security, understanding user behavior, improving
          service features and content, providing customer support, conducting
          research and analysis, facilitating interactive features, and
          delivering targeted advertising.
        </p>
        <h3>Disclosure and Distribution of Your Information</h3>
        <p>
          We may share your information with service providers, partner
          salons/merchants, governmental agencies, advertisers, and advertising
          networks as outlined in this Policy.
        </p>
        <h3>Children's Information</h3>
        <p>
          Trakky does not knowingly collect any Personal Identifiable
          Information from children under the age of 13. Parents and guardians
          are encouraged to monitor their children's online activities.
        </p>
        <h3>Opt-Out</h3>
        <p>
          When signing up for an account, you consent to receive emails from
          Trakky. You can manage your email preferences or unsubscribe from
          commercial email messages. Note that certain administrative, service,
          or legal notices from Trakky cannot be opted out of.
          <br />
          <br />
          If you wish to withdraw your consent for the use and disclosure of
          your personal information, please contact us. Please allow up to 30
          business days for processing such requests, after which we will cease
          using your personal data unless required by legal obligations.
        </p>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default PrivacyPolicy;

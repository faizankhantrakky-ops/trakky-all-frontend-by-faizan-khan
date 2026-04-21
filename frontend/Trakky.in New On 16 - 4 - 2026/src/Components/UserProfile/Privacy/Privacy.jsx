import React from 'react';

const Privacy = () => {
  return (
    <div className=" bg-gray-50 py-8 md:px-4 px-2">
      <div className=" rounded-lg shadow-sm  ">
        
        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          
          <h1 className="md:text-3xl  text-2xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <div className="w-20 h-1 bg-[#502DA6]  mb-4"></div>
          <p className="text-gray-600 text-lg">
            Your privacy and data protection are our top priorities
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy ("Policy") outlines the procedures and practices
              concerning the collection, usage, disclosure, and protection of your
              information when you utilize our website, located at{" "}
              <a href="https://trakky.in/" className="text-[#502DA6] hover:text-[#41248C] font-medium underline">
                www.trakky.in
              </a>{" "}
              , or the Trakky mobile application (together, the "Trakky Platform"),
              operated by Trakky Techno Services Private Limited, a company
              established under the laws of India, with its registered office in
              Vadodara city.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              The terms "you" and "your" pertain to users of the Trakky Platform.
              The term "Services" refers to any services provided by Trakky, whether
              on the Trakky Platform or otherwise. Please review this Policy before
              using the Trakky Platform or submitting any personal information to
              Trakky. This Policy is an integral part of, and incorporated within,
              the Terms of Use.
            </p>
          </div>

          {/* Your Consent */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Your Consent
            </h3>
            <p className="text-gray-700 leading-relaxed">
              By accessing the Trakky Platform and utilizing the Services, you
              consent to the collection, transfer, use, storage, disclosure, and
              sharing of your information as described and collected by us in
              accordance with this Policy. If you disagree with the Policy, please
              refrain from accessing or using the Trakky Platform.
            </p>
          </div>

          {/* Policy Changes */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Policy Changes
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We may periodically update this Policy, with such changes being posted
              on this page. In the event of significant changes to this Policy, we
              will strive to provide reasonable notice, such as through prominent
              notices on the Trakky Platform or via email to your registered
              address. Your continued use of our Services following the publication
              or dispatch of a notice regarding changes to this Policy shall signify
              your consent to the updated Policy, to the extent permitted by
              applicable law.
            </p>
          </div>

          {/* Information Collection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Information Collection
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect and process the following information about you:
            </p>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li className="pl-2">
                <span className="font-semibold text-gray-900">Information You Provide:</span>{" "}
                This includes details provided when creating or updating your Trakky account, 
                submitting content (such as reviews or orders), engaging with customer support, 
                participating in interactive services, or enabling features requiring access 
                to your address book or calendar.
              </li>
              <li className="pl-2">
                <span className="font-semibold text-gray-900">Information Automatically Collected:</span>{" "}
                This encompasses demographic and other information gathered during your visits to
                the Trakky Platform, as well as location information, usage and preference data, 
                transaction details, and device information.
              </li>
              <li className="pl-2">
                <span className="font-semibold text-gray-900">Information Received from Other Sources:</span>{" "}
                We may obtain information about you from third parties, such as other users,
                partners, or affiliated companies.
              </li>
            </ol>
          </div>

          {/* Cookie Usage */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Cookie Usage
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Trakky Platform and our partners may utilize cookies, pixel tags, web
              beacons, and similar technologies to collect and store information
              regarding your use of the Services and third-party websites. Cookies
              are employed for purposes including authentication, remembering
              preferences, content popularity assessment, advertising effectiveness
              measurement, traffic analysis, and understanding user behavior and
              interests.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can modify your cookie settings via your browser's settings. By
              using our Services with your browser settings configured to accept
              cookies, you are consenting to our utilization of cookies as described
              herein.
            </p>
          </div>

          {/* Uses of Your Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Uses of Your Information
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We employ the information we collect for purposes including providing,
              personalizing, maintaining, and enhancing our products and services,
              fulfilling contractual obligations, administering and bolstering
              Trakky Platform security, understanding user behavior, improving
              service features and content, providing customer support, conducting
              research and analysis, facilitating interactive features, and
              delivering targeted advertising.
            </p>
          </div>

          {/* Disclosure and Distribution */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Disclosure and Distribution of Your Information
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We may share your information with service providers, partner
              salons/merchants, governmental agencies, advertisers, and advertising
              networks as outlined in this Policy.
            </p>
          </div>

          {/* Children's Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Children's Information
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Trakky does not knowingly collect any Personal Identifiable
              Information from children under the age of 13. Parents and guardians
              are encouraged to monitor their children's online activities.
            </p>
          </div>

          {/* Opt-Out */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#502DA6] rounded-full"></div>
              Opt-Out
            </h3>
            <p className="text-gray-700 leading-relaxed">
              When signing up for an account, you consent to receive emails from
              Trakky. You can manage your email preferences or unsubscribe from
              commercial email messages. Note that certain administrative, service,
              or legal notices from Trakky cannot be opted out of.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you wish to withdraw your consent for the use and disclosure of
              your personal information, please contact us. Please allow up to 30
              business days for processing such requests, after which we will cease
              using your personal data unless required by legal obligations.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
            <p className="text-gray-700 text-sm">
              If you have any questions about this Privacy Policy, please contact us at our registered office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
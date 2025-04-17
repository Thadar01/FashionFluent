"use client";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";

export default function PrivacyPolicy() {
  return (
    <div>
      <NavBar />
      <main className=" py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Privacy Policy
          </h1>
          <section className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              At Fashion Fluent, we value your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, and safeguard your information.
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information (name, email, address, phone number)</li>
              <li>Order and payment details</li>
              <li>Browsing behavior on our website</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800">
              2. How We Use Your Information
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order updates and promotional emails</li>
              <li>Improve user experience and website functionality</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800">
              3. Sharing Your Information
            </h2>
            <p>
              We never sell your data. We only share it with trusted third
              parties like payment processors and delivery services required to
              complete your orders.
            </p>

            <h2 className="text-xl font-semibold text-gray-800">4. Cookies</h2>
            <p>
              We use cookies to improve your browsing experience and analyze
              site traffic. You can choose to accept or decline cookies.
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              5. Your Rights
            </h2>
            <p>
              You have the right to access, modify, or delete your personal data
              at any time. Contact our support team if you'd like to exercise
              these rights.
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy occasionally. Any changes will
              be posted on this page.
            </p>

            <p>
              If you have any questions or concerns, please contact us at{" "}
              <a
                href="mailto:support@yourclothingbrand.com"
                className="text-blue-600 hover:underline"
              >
                fashionfluent@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

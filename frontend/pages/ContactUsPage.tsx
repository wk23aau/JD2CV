import React from 'react';

const ContactUsPage: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto my-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600">
          We're here to help and answer any questions you might have.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Information</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          For support, inquiries, or feedback, please reach out to us:
        </p>
        <ul className="list-none space-y-3 text-gray-700">
          <li>
            <strong>Email Support:</strong> <a href="mailto:support@aicvmaker.com" className="text-blue-600 hover:text-blue-700 hover:underline">support@aicvmaker.com</a>
            <p className="text-sm text-gray-500">We typically respond within 24-48 business hours.</p>
          </li>
          <li>
            <strong>Mailing Address (Placeholder):</strong>
            <p className="text-gray-600">123 AI Avenue, Innovation City, Tech State, 90210</p>
          </li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Feedback & Suggestions</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Your feedback is invaluable to us! If you have any suggestions on how we can improve AI CV Maker, or if you've encountered any issues, please don't hesitate to let us know. We are constantly working to enhance our platform and provide the best possible experience for our users.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Business Inquiries</h2>
        <p className="text-gray-700 leading-relaxed">
          For partnership opportunities, media inquiries, or other business-related matters, please contact us at <a href="mailto:business@aicvmaker.com" className="text-blue-600 hover:text-blue-700 hover:underline">business@aicvmaker.com</a>.
        </p>
      </section>
    </div>
  );
};

export default ContactUsPage;

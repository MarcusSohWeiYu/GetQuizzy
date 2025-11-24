import Link from "next/link";
import { getSEOTags } from "@/libs/helpers/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: November 24, 2025

Thank you for visiting ${config.appName} ("we," "us," or "our"). This Privacy Policy outlines how we collect, use, disclose, and protect your personal data in accordance with the Personal Data Protection Act 2012 (PDPA) of Singapore and other applicable data protection laws.

By accessing or using our services, you agree to the terms of this Privacy Policy. If you do not agree with the practices described in this policy, please do not use our services.

1. Information We Collect

1.1 Personal Data

We collect the following personal information from you:

- Name: To personalize your experience and identify your account
- Email Address: For account creation, authentication, and communication
- Survey Content: Questions, responses, and survey configurations you create
- Response Data: Information collected from survey participants
- Usage Data: Information about how you use our platform

1.2 Non-Personal Data

We collect non-personal information including:
- IP addresses
- Browser type and version
- Device information
- Cookies and similar tracking technologies
- Analytics data about platform usage

1.3 AI-Generated Data

When using our AI features, we process:
- Survey questions and responses to generate AI avatars
- User preferences to personalize AI-generated content
- This data is processed through third-party AI services (OpenAI)

2. Purpose of Data Collection

We collect and use your personal data for the following purposes:

- Account Management: Creating and managing user accounts
- Service Delivery: Enabling survey creation, AI generation, and data collection
- Communication: Sending service updates, notifications, and support responses
- Platform Improvement: Analyzing usage patterns to enhance our services
- Security: Protecting against fraud, abuse, and unauthorized access
- Legal Compliance: Meeting regulatory requirements and responding to legal requests

3. Legal Basis for Processing (PDPA Compliance)

Under Singapore's PDPA, we process your personal data based on:
- Consent: You provide explicit consent when creating an account
- Contractual Necessity: Processing required to deliver our services
- Legitimate Interests: Service improvement and security purposes

4. Data Sharing and Disclosure

We may share your personal data with:

- Service Providers: Third-party services including:
  * Authentication providers (Google OAuth)
  * AI services (OpenAI for avatar generation)
  * Cloud hosting providers
  * Analytics services
- Legal Requirements: When required by law, court order, or government authority
- Business Transfers: In connection with mergers, acquisitions, or asset sales

We do NOT sell your personal data to third parties for marketing purposes.

5. Data Retention

We retain your personal data for as long as:
- Your account remains active
- Necessary to provide services
- Required by law (minimum 3 years for business records in Singapore)

You may request deletion of your account and data at any time.

6. Your Rights Under PDPA

You have the right to:

- Access: Request copies of your personal data
- Correction: Update or correct inaccurate information
- Deletion: Request deletion of your data (subject to legal requirements)
- Withdrawal of Consent: Withdraw consent for data processing (may affect service access)
- Data Portability: Receive your data in a structured format

To exercise these rights, contact us at marcusbusinessmanage@gmail.com.

7. Data Security

We implement appropriate security measures including:
- Encryption of data in transit (SSL/TLS)
- Secure authentication mechanisms
- Regular security assessments
- Access controls and monitoring

However, no method of transmission over the internet is 100% secure.

8. Cross-Border Data Transfers

Your data may be transferred to and processed in countries outside Singapore, including the United States (for cloud services and AI processing). We ensure adequate protection through:
- Standard contractual clauses
- Service provider agreements
- Compliance with PDPA transfer requirements

9. Cookies and Tracking Technologies

We use cookies for:
- Authentication and security
- User preferences
- Analytics and performance monitoring

You can control cookies through your browser settings, but some features may not function properly if cookies are disabled.

10. Children's Privacy

Our services are not intended for children under 13 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately.

11. Third-Party Links

Our platform may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies separately.

12. Updates to This Privacy Policy

We may update this Privacy Policy periodically. Significant changes will be notified via:
- Email notification to registered users
- Prominent notice on our website
- Updated "Last Updated" date

Continued use of our services after changes constitutes acceptance of the updated policy.

13. Data Protection Officer

For privacy-related inquiries or to exercise your rights, contact our Data Protection Officer:

Email: marcusbusinessmanage@gmail.com

14. Complaints

If you believe we have not handled your personal data properly, you may lodge a complaint with:

Personal Data Protection Commission (PDPC) Singapore
Website: https://www.pdpc.gov.sg
Email: info@pdpc.gov.sg

15. Governing Law

This Privacy Policy is governed by the laws of Singapore, including the Personal Data Protection Act 2012.

By using ${config.appName}, you acknowledge that you have read, understood, and agree to this Privacy Policy.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;

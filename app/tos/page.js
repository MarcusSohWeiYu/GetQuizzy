import Link from "next/link";
import { getSEOTags } from "@/libs/helpers/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: November 24, 2025

Welcome to ${config.appName}!

These Terms of Service ("Terms") govern your use of the ${config.appName} website and the services provided by ${config.appName}. By using our Website and services, you agree to these Terms.

1. Description of ${config.appName}

${config.appName} is a platform that allows users to create engaging surveys and quizzes with AI-powered character avatar rewards. Our service helps increase survey completion rates by providing personalized AI-generated avatars to respondents.

2. Service Usage

Our platform is free to use with unlimited surveys, questions, and responses. Users can:
- Create and publish surveys
- Generate AI-powered questions
- Receive AI-generated character avatars for survey completions
- Share surveys and results on social media

3. User Accounts and Data

By creating an account, you agree to provide accurate information. We collect:
- Name and email address
- Survey data created by users
- Response data from survey participants
- Usage analytics and cookies

For details on how we handle your data, please refer to our Privacy Policy at ${config.domainName}/privacy-policy.

4. Content Ownership

You retain all rights to the surveys you create and the responses you collect. ${config.appName} retains the right to use anonymized, aggregated data for service improvement and analytics.

5. AI-Generated Content

AI-generated avatars and questions are provided "as-is." While we strive for quality, we cannot guarantee the appropriateness or accuracy of all AI-generated content. Users are responsible for reviewing and moderating their survey content.

6. Prohibited Uses

You may not use ${config.appName} to:
- Create surveys for illegal purposes
- Collect sensitive personal information without proper consent
- Harass, abuse, or harm others
- Violate any applicable laws or regulations
- Attempt to gain unauthorized access to our systems

7. Service Availability

We strive to maintain service availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue services at any time.

8. Limitation of Liability

${config.appName} is provided "as-is" without warranties of any kind. We are not liable for any damages arising from the use of our service, including but not limited to data loss, service interruptions, or AI-generated content.

9. Governing Law

These Terms are governed by the laws of Singapore.

10. Updates to the Terms

We may update these Terms from time to time. Users will be notified of significant changes via email. Continued use of the service after changes constitutes acceptance of the updated Terms.

11. Termination

We reserve the right to terminate or suspend accounts that violate these Terms or engage in abusive behavior.

For any questions or concerns regarding these Terms of Service, please contact us at marcusbusinessmanage@gmail.com.

Thank you for using ${config.appName}!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;

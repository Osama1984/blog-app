export default function PrivacyPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Last updated: August 10, 2025
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl prose prose-lg prose-gray">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            subscribe to our newsletter, or contact us. This may include your name, email address, 
            and any other information you choose to provide.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Send you newsletters and updates (if you subscribe)</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect and prevent fraud and abuse</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy. We may share information in 
            the following circumstances:
          </p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>In connection with a business transfer</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the internet is 100% secure.
          </p>

          <h2>5. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience on our website. 
            You can control cookie settings through your browser preferences.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Object to processing of your information</li>
            <li>Data portability</li>
          </ul>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect personal 
            information from children under 13. If we become aware that we have collected such 
            information, we will take steps to delete it.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes 
            by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at:{' '}
            <a href="mailto:privacy@blogapp.com" className="text-blue-600 hover:text-blue-500">
              privacy@blogapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Last updated: August 10, 2025
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl prose prose-lg prose-gray">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms 
            and provision of this agreement. These terms apply to all users of the site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on our website 
            for personal, non-commercial transitory viewing only. This is the grant of a license, 
            not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2>3. User Content</h2>
          <p>
            Our service may allow you to post, link, store, share and otherwise make available 
            certain information, text, graphics, videos, or other material. You are responsible 
            for content that you post to the service, including its legality, reliability, and 
            appropriateness.
          </p>

          <h2>4. Prohibited Uses</h2>
          <p>You may not use our service:</p>
          <ul>
            <li>For any unlawful purpose or to solicit others to take unlawful actions</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>

          <h2>5. Disclaimer</h2>
          <p>
            The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent 
            permitted by law, this Company:
          </p>
          <ul>
            <li>Excludes all representations and warranties relating to this website and its contents</li>
            <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
          </ul>

          <h2>6. Accuracy of Materials</h2>
          <p>
            The materials appearing on our website could include technical, typographical, or 
            photographic errors. We do not warrant that any of the materials on its website are 
            accurate, complete, or current.
          </p>

          <h2>7. Links</h2>
          <p>
            We have not reviewed all of the sites linked to our website and are not responsible 
            for the contents of any such linked site. The inclusion of any link does not imply 
            endorsement by us of the site.
          </p>

          <h2>8. Modifications</h2>
          <p>
            We may revise these terms of service for its website at any time without notice. 
            By using this website, you are agreeing to be bound by the then current version 
            of these terms of service.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws 
            and you irrevocably submit to the exclusive jurisdiction of the courts in that state 
            or location.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:legal@blogapp.com" className="text-blue-600 hover:text-blue-500">
              legal@blogapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

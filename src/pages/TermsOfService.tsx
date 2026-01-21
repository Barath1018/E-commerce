export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using Aesthify Studio's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            Aesthify Studio provides digital products, templates, courses, and related services through our online platform. We reserve the right to modify, suspend, or discontinue any aspect of our service at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>You must be at least 18 years old to create an account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Purchases and Payments</h2>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Pricing and Payment</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>All prices are listed in the currency specified on our website</li>
            <li>Payment must be received before digital products are delivered</li>
            <li>We accept various payment methods as displayed during checkout</li>
            <li>All sales are final unless otherwise specified in our refund policy</li>
          </ul>
          
          <h3 className="text-xl font-medium text-gray-800 mb-3">Digital Product Delivery</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Digital products are delivered electronically after payment confirmation</li>
            <li>You will receive download links via email or through your account dashboard</li>
            <li>Download links may have expiration dates for security purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Our Content</h3>
          <p className="text-gray-700 mb-4">
            All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of Aesthify Studio and is protected by copyright and other intellectual property laws.
          </p>
          
          <h3 className="text-xl font-medium text-gray-800 mb-3">Licensed Products</h3>
          <p className="text-gray-700 mb-4">
            When you purchase digital products from us, you receive a license to use the products according to the specific license terms provided with each product. You do not acquire ownership of the intellectual property rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You may not use our service:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Refund Policy</h2>
          <p className="text-gray-700 mb-4">
            Due to the digital nature of our products, all sales are generally final. However, we may provide refunds in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Technical issues preventing product download or use</li>
            <li>Duplicate purchases made in error</li>
            <li>Products that significantly differ from their description</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Refund requests must be submitted within 30 days of purchase and will be reviewed on a case-by-case basis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-gray-700 mb-4">
            Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or completely secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            In no event shall Aesthify Studio be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the effective date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> aesthifystudio@gmail.com</p>
            <p className="text-gray-700"><strong>Address:</strong> 122, Road street, Manampathy</p>
            <p className="text-gray-700"><strong>Phone:</strong> 7010163853</p>
          </div>
        </section>
      </div>
    </div>
  );
}
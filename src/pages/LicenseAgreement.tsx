export default function LicenseAgreement() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">License Agreement</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Grant of License</h2>
          <p className="text-gray-700 mb-4">
            Subject to the terms and conditions of this License Agreement, Aesthify Studio grants you a non-exclusive, non-transferable license to use the digital products you purchase from us in accordance with the specific license type selected at the time of purchase.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. License Types</h2>
          
          <h3 className="text-xl font-medium text-gray-800 mb-3">Standard License</h3>
          <p className="text-gray-700 mb-2">The Standard License allows you to:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Use the product for personal or commercial projects</li>
            <li>Modify and customize the product to suit your needs</li>
            <li>Use the product in unlimited projects for a single client or your own business</li>
            <li>Create derivative works based on the product</li>
          </ul>
          
          <h3 className="text-xl font-medium text-gray-800 mb-3">Extended License</h3>
          <p className="text-gray-700 mb-2">The Extended License includes all Standard License rights plus:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Use the product in projects for multiple clients</li>
            <li>Resell the product as part of a larger template or theme package</li>
            <li>Use the product in products that will be sold to end users</li>
            <li>Create multiple derivative works for commercial distribution</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Permitted Uses</h2>
          <p className="text-gray-700 mb-4">Depending on your license type, you may:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Use the products in websites, applications, and digital projects</li>
            <li>Modify, edit, and customize the products</li>
            <li>Combine products with other elements to create new works</li>
            <li>Use products in both personal and commercial projects (as per license type)</li>
            <li>Create backup copies for your own use</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You may NOT:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Redistribute, resell, or share the original product files</li>
            <li>Claim ownership or authorship of the products</li>
            <li>Use the products in a way that competes directly with Aesthify Studio</li>
            <li>Create derivative works that are substantially similar to the original</li>
            <li>Use the products in illegal, defamatory, or offensive content</li>
            <li>Reverse engineer or attempt to extract source code (where applicable)</li>
            <li>Remove or alter any copyright notices or attribution</li>
            <li>Share your account access or download links with others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Attribution Requirements</h2>
          <p className="text-gray-700 mb-4">
            While not always required, we appreciate attribution when you use our products. When attribution is required, it will be clearly specified in the product documentation. Attribution should include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Credit to Aesthify Studio</li>
            <li>Link to our website (when possible)</li>
            <li>Product name or identifier</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
          <p className="text-gray-700 mb-4">
            All products remain the intellectual property of Aesthify Studio. This license does not transfer ownership rights to you. We retain all rights not expressly granted in this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. License Violations</h2>
          <p className="text-gray-700 mb-4">
            Violation of this license agreement may result in:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Immediate termination of your license</li>
            <li>Legal action to protect our intellectual property rights</li>
            <li>Requirement to cease all use of the products</li>
            <li>Liability for damages caused by the violation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Updates and Modifications</h2>
          <p className="text-gray-700 mb-4">
            We may provide updates or new versions of products. Your license extends to these updates unless otherwise specified. We may modify this license agreement with notice to existing license holders.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
          <p className="text-gray-700 mb-4">
            This license is effective until terminated. Your rights under this license will terminate automatically if you fail to comply with any of its terms. Upon termination, you must cease all use of the products and destroy all copies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Warranty Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            Products are provided "as is" without warranty of any kind. We do not warrant that the products will meet your requirements or that their operation will be uninterrupted or error-free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            Our liability for any claims related to the products shall not exceed the amount you paid for the specific product. We shall not be liable for any indirect, incidental, or consequential damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            This license agreement shall be governed by and construed in accordance with the laws of the jurisdiction where Aesthify Studio is located, without regard to conflict of law principles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this License Agreement or need clarification on usage rights, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> aesthifystudio@gmail.com</p>
            <p className="text-gray-700"><strong>Address:</strong> 122, Road street, Manampathy</p>
            <p className="text-gray-700"><strong>Phone:</strong> 7010163853</p>
          </div>
        </section>

        <section className="mb-8">
          <p className="text-sm text-gray-600 italic">
            By downloading or using any products from Aesthify Studio, you acknowledge that you have read, understood, and agree to be bound by this License Agreement.
          </p>
        </section>
      </div>
    </div>
  );
}
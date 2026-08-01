import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — PriceHatke',
  description: 'Get in touch with the PriceHatke support and partnership team.',
};

export default function ContactUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contact Us</h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        Have questions, feedback, or partnership inquiries? We’d love to hear from you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2 shadow-2xs">
          <h3 className="font-bold text-gray-900 text-sm">Customer Support</h3>
          <p className="text-xs text-gray-500">For help with price alerts or account queries</p>
          <a href="mailto:support@pricehatke.com" className="text-xs font-bold text-orange-600 block">
            support@pricehatke.com
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2 shadow-2xs">
          <h3 className="font-bold text-gray-900 text-sm">Partnerships & Media</h3>
          <p className="text-xs text-gray-500">For merchant integrations and affiliate inquiries</p>
          <a href="mailto:partners@pricehatke.com" className="text-xs font-bold text-orange-600 block">
            partners@pricehatke.com
          </a>
        </div>
      </div>
    </div>
  );
}

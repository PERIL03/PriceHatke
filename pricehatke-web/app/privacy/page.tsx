import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PriceHatke',
  description: 'Learn how PriceHatke protects user privacy and handles data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
      <p className="text-xs text-gray-500">Last updated: August 1, 2026</p>

      <div className="prose prose-sm text-gray-600 space-y-4">
        <p>
          At PriceHatke, we value your privacy. We collect minimal personal information (such as email for alert notifications) and never sell your data to third parties.
        </p>
      </div>
    </div>
  );
}

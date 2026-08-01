import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 text-xs border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">P</span>
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Price<span className="text-orange-500">Hatke</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              India’s favorite price tracking engine and deal discovery platform. Track price history across Amazon, Flipkart, Myntra, Ajio & 100+ stores.
            </p>
            <div className="pt-2">
              <a
                href="#extension"
                className="inline-flex items-center space-x-2 bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-orange-500/20 transition-colors"
              >
                <span>⚡ Install Browser Extension</span>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 tracking-wider uppercase">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/deals" className="hover:text-white transition-colors">
                  Hot Deals
                </Link>
              </li>
              <li>
                <Link href="/price-alert" className="hover:text-white transition-colors">
                  Price Drop Alerts
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-white transition-colors">
                  Gift Cards Catalog
                </Link>
              </li>
              <li>
                <Link href="/spending-calculator" className="hover:text-white transition-colors">
                  Spend Lens
                </Link>
              </li>
              <li>
                <Link href="/product-lens" className="hover:text-white transition-colors">
                  Product Lens AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Price History Tracker Column */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 tracking-wider uppercase">
              Price History Tracker
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/supported-stores" className="hover:text-white transition-colors">
                  Amazon Price History Tracker
                </Link>
              </li>
              <li>
                <Link href="/supported-stores" className="hover:text-white transition-colors">
                  Flipkart Price History Tracker
                </Link>
              </li>
              <li>
                <Link href="/supported-stores" className="hover:text-white transition-colors">
                  Myntra Price History Tracker
                </Link>
              </li>
              <li>
                <Link href="/supported-stores" className="hover:text-white transition-colors">
                  Croma & Tata Cliq Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 tracking-wider uppercase">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/what-we-do" className="hover:text-white transition-colors">
                  What We Do
                </Link>
              </li>
              <li>
                <Link href="/how-we-earn" className="hover:text-white transition-colors">
                  How We Earn
                </Link>
              </li>
            </ul>
          </div>

          {/* Other & Legal Column */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 tracking-wider uppercase">Other</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/supported-stores" className="hover:text-white transition-colors">
                  Supported Stores List
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {currentYear} PriceHatke Internet Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="hover:underline">
              Legal Terms
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/contact-us" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

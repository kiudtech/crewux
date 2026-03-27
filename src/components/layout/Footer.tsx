import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CW</span>
              </div>
              <span className="text-xl font-bold text-white">
                <span className="text-indigo-400"> Crewux</span>
              </span>
            </div>
            <p className="text-sm max-w-md">
              Connecting talent with opportunity. India&apos;s premier event &amp; volunteer workforce
              network — building trust, verification, and structured opportunities at national scale.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <div className="space-y-2">
              <Link href="/events" className="block text-sm hover:text-white transition-colors">Browse Events</Link>
              <Link href="/register" className="block text-sm hover:text-white transition-colors">Register</Link>
              <Link href="/about" className="block text-sm hover:text-white transition-colors">About Us</Link>
              <Link href="/impact" className="block text-sm hover:text-white transition-colors">Impact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For Organizations</h4>
            <div className="space-y-2">
              <Link href="/register?role=organization" className="block text-sm hover:text-white transition-colors">Post Events</Link>
              <Link href="/register?role=organization" className="block text-sm hover:text-white transition-colors">Find Volunteers</Link>
              <Link href="/register?role=college" className="block text-sm hover:text-white transition-colors">College Portal</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">&copy; {new Date().getFullYear()} Crewux. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="text-xs hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

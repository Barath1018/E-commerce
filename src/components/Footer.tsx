import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-gray-950">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-amber-600">
                <Sparkles className="h-3.5 w-3.5 text-gray-950" />
              </div>
              <span className="text-sm font-semibold text-white">Aesthify Studio</span>
            </div>
            <p className="mt-3 text-sm text-white/30 max-w-xs">
              Premium digital resources for creators.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-2.5">
              <Link to="/products" className="block text-white/40 hover:text-white transition">Products</Link>
              <Link to="/privacy" className="block text-white/40 hover:text-white transition">Privacy</Link>
              <Link to="/terms" className="block text-white/40 hover:text-white transition">Terms</Link>
            </div>
            <div className="space-y-2.5">
              <a href="https://www.instagram.com/aesthify.studio/" target="_blank" rel="noopener noreferrer" className="block text-white/40 hover:text-white transition">Instagram</a>
              <a href="mailto:aesthifystudio@gmail.com" className="block text-white/40 hover:text-white transition">Contact</a>
              <Link to="/license" className="block text-white/40 hover:text-white transition">License</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/[0.06] pt-6 text-xs text-white/20">
          &copy; {new Date().getFullYear()} Aesthify Studio
        </div>
      </div>
    </footer>
  );
}

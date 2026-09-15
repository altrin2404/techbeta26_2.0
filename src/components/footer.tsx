export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-slate-800">
          © {new Date().getFullYear()} TechBETA 2026 2.0 Symposium. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

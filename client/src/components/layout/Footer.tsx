"use client";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 bg-app-grid mt-auto w-full no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="text-2xl font-bold tracking-tighter text-brand-purple-600">WiseBill AI</div>
          <p className="text-muted-foreground max-w-sm">
            Helping teams restructure their AI stack to capture maximum value at optimal costs. Built for the Techvruk challenge.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-brand-purple-600 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-purple-600 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-purple-600 transition">Cookie Settings</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-brand-purple-600 transition">Twitter / X</a></li>
            <li><a href="#" className="hover:text-brand-purple-600 transition">GitHub</a></li>
            <li><a href="#" className="hover:text-brand-purple-600 transition">Email Support</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} WiseBill AI by Murugan. All rights reserved.
      </div>
    </footer>
  );
}

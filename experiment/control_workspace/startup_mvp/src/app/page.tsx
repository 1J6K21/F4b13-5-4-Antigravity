import Link from "next/link";
import { ArrowRight, BarChart3, UploadCloud, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white">
        <div className="font-bold text-xl text-blue-600">FeedbackAI</div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
            Turn Customer Feedback into <span className="text-blue-600">Actionable Insights</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Upload your support tickets, app reviews, and survey responses. Our AI instantly categorizes them, extracts feature requests, and measures sentiment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              View features
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 bg-white px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Easy Uploads</h3>
                <p className="text-slate-600">Just export a CSV from Zendesk, Intercom, or App Store and drop it in.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Categorization</h3>
                <p className="text-slate-600">Instantly groups feedback by Feature Requests, Bugs, and UX/UI issues.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sentiment Analysis</h3>
                <p className="text-slate-600">Track how users really feel to predict and prevent customer churn.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center text-slate-500 border-t bg-white">
        <p>&copy; {new Date().getFullYear()} FeedbackAI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Code2, 
  Zap, 
  Shield, 
  TrendingUp, 
  Check,
  ArrowRight,
  Camera,
  Brain,
  Users,
  LineChart
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                QuoteSaaS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <Button variant="outline" className="text-sm">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Google Gemini AI
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight">
              AI-Powered Quote Forms
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                In 3 Lines of Code
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Generate instant quotes with AI photo analysis. No complex integrations. 
              Just embed, collect leads, and convert customers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg hover:shadow-xl transition-shadow">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2">
                <Camera className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            {/* Code Example */}
            <Card className="max-w-2xl mx-auto p-8 bg-gray-900 border-0 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-mono text-gray-400">index.html</span>
              </div>
              <pre className="text-left text-sm">
                <code className="text-emerald-400">
                  {`<script src="https://quotesaas.com/widget.js"
        data-company-id="your-id">
</script>`}
                </code>
              </pre>
              <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
                <span className="text-sm text-gray-400">That's it. You're done.</span>
                <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                  Copy Code
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Everything You Need to Convert
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered features that turn visitors into customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 border-2 hover:border-blue-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Photo Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Customers upload photos. AI analyzes and generates instant quotes with visual previews.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 border-2 hover:border-indigo-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Deployment</h3>
              <p className="text-gray-600 leading-relaxed">
                Copy-paste 3 lines of code. Widget appears on your site. Start collecting leads in minutes.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 border-2 hover:border-purple-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lead Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful dashboard to manage leads, track conversions, and close deals faster.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-8 border-2 hover:border-emerald-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Track views, clicks, conversions. Optimize your widget performance in real-time.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-8 border-2 hover:border-orange-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-level encryption, GDPR compliant, SOC 2 certified. Your data is safe.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-8 border-2 hover:border-pink-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Conversion Optimized</h3>
              <p className="text-gray-600 leading-relaxed">
                A/B tested designs that convert 3x better than traditional forms. Proven to work.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              Pricing
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <Card className="p-8 border-2 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>50 quotes/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>AI photo analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Start Free Trial
              </Button>
            </Card>

            {/* Pro */}
            <Card className="p-8 border-4 border-blue-600 relative hover:shadow-2xl transition-all">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                Most Popular
              </Badge>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>200 quotes/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>A/B testing</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                Start Free Trial
              </Button>
            </Card>

            {/* Enterprise */}
            <Card className="p-8 border-2 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">$299</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited quotes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>White-label options</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to 10x Your Conversions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ companies using AI to collect more leads
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">QuoteSaaS</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © 2025 QuoteSaaS. Powered by Google Gemini AI.
          </div>
        </div>
      </footer>
    </main>
  )
}

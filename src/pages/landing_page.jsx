import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  TrendingUp,
  Shield,
  Users,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { useLocation, Navigate, useSearchParams } from "react-router-dom";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                FinancePro
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <HashLink
                smooth to ="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </HashLink>
              <HashLink
                smooth to="#plans"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Plans
              </HashLink>
              <HashLink
                smooth to="#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </HashLink>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Start earning with smart investments
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight text-balance">
            Grow Your Wealth with
            <span className="text-primary"> Secure Investments</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 text-pretty">
            Join thousands of investors earning daily returns through our secure
            and transparent investment platform. Start with as little as $100.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Start Investing Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <HashLink smooth to="#plans">
              <Button size="lg" variant="outline">
                View Investment Plans
              </Button>
            </HashLink>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">$10M+</p>
              <p className="text-sm text-muted-foreground">Total Invested</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose FinancePro?
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              We provide a comprehensive platform for managing your investments
              with transparency and security.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Bank-Grade Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your investments are protected with enterprise-level security,
                  encryption, and 2FA authentication.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Daily Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Earn competitive daily returns on your investments with our
                  proven investment strategies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Instant Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Request withdrawals anytime and receive your funds within 24
                  hours directly to your bank account.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Referral Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Invite friends and earn bonuses when they invest through your
                  referral link.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track your portfolio performance with detailed charts and
                  reports updated in real-time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Low Minimum Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start investing with just $100. Multiple plans available to
                  suit every budget.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Investment Plans
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Choose the plan that fits your investment goals. All plans include
              daily returns and secure transactions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg text-muted-foreground">
                  Starter
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">1.0%</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">$100 - $999 investment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">30 days duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Capital returned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 support</span>
                  </div>
                </div>
                <Link to="/register">
                  <Button className="w-full bg-transparent" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Popular
                </span>
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg text-muted-foreground">
                  Growth
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">1.5%</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">$1,000 - $9,999 investment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">60 days duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Capital returned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
                <Link to="/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg text-muted-foreground">
                  Premium
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">2.0%</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">$10,000+ investment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">90 days duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Capital returned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dedicated manager</span>
                  </div>
                </div>
                <Link to="/register">
                  <Button className="w-full bg-transparent" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to Start Investing?
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            Join thousands of investors who trust FinancePro with their
            investments. Create your account today and start earning.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 gap-2"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t bg-background">
        <div className="mb-10 pt-6 text-center flex flex-col items-center gap-2">

          <div className="flex items-center gap-3">
            <Link
              to="/terms"
              state={{"from":"landing"}}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              Terms of service
            </Link>

            {/* Vertical Separator */}
            <div className="h-4 w-px bg-border" />

            <Link
              to="/privacy"
              state={{ "from": "landing" }}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
          </div>



          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinancePro. All rights reserved.
          </p>
        </div>
      </footer>



    </div>
  );
}










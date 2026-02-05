import { Link } from "react-router-dom"
import { Card, CardContent } from "../../components/ui/card"

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-muted/30 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Last updated: January 2026
                    </p>
                </div>

                {/* Content Card */}
                <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-8 leading-relaxed text-sm text-foreground">

                        {/* Intro */}
                        <section>
                            <p>
                                At <span className="font-medium">FinancePro</span>, your privacy
                                is important to us. This Privacy Policy explains how we collect,
                                use, disclose, and safeguard your information when you use our
                                platform.
                            </p>
                        </section>

                        {/* Section */}
                        <section id="information-collection" className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                1. Information We Collect
                            </h2>
                            <p>
                                We may collect personal information that you voluntarily provide
                                to us, including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Email address and contact details</li>
                                <li>Account login credentials</li>
                                <li>Usage and device information</li>
                            </ul>
                        </section>

                        {/* Section */}
                        <section id="use-of-information" className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                2. How We Use Your Information
                            </h2>
                            <p>
                                We use the collected information to:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Provide and maintain our services</li>
                                <li>Improve security and prevent fraud</li>
                                <li>Communicate updates and support</li>
                            </ul>
                        </section>

                        {/* Section */}
                        <section id="data-sharing" className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                3. Data Sharing & Disclosure
                            </h2>
                            <p>
                                We do not sell, trade, or rent your personal information to
                                third parties. Data may be shared only when required by law or
                                to protect our legal rights.
                            </p>
                        </section>

                        {/* Section */}
                        <section id="security" className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                4. Data Security
                            </h2>
                            <p>
                                We implement industry-standard security measures to protect
                                your data. However, no electronic transmission is 100% secure.
                            </p>
                        </section>

                        {/* Section */}
                        <section id="your-rights" className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                5. Your Rights
                            </h2>
                            <p>
                                You have the right to access, update, or delete your personal
                                information. You may contact us at any time regarding privacy
                                concerns.
                            </p>
                        </section>

                        {/* Section */}
                        <section id="changes" className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                6. Changes to This Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy periodically. Any changes will
                                be reflected on this page.
                            </p>
                        </section>

                        {/* Contact */}
                        <section id="contact" className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                7. Contact Us
                            </h2>
                            <p>
                                If you have any questions about this Privacy Policy, please
                                contact us at{" "}
                                <a
                                    href="mailto:support@financepro.com"
                                    className="text-primary hover:underline"
                                >
                                    support@financepro.com
                                </a>
                                .
                            </p>
                        </section>

                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <Link to="/" className="hover:underline text-primary">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

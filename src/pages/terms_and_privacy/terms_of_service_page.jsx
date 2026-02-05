import { Navigate, useSearchParams, Link } from "react-router-dom"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../../components/ui/card"

export default function TermsOfServicePage() {
    const [params] = useSearchParams()

    if (params.get("from") !== "landing" && params.get("from") !== "register") {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-muted/30 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Page Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Terms & Conditions
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Intro */}
                <Card className="shadow-sm">
                    <CardContent className="p-6 text-sm leading-relaxed text-muted-foreground">
                        Welcome to{" "}
                        <span className="font-medium text-foreground">
                            FinancePro
                        </span>
                        . By accessing or using our platform, you agree to comply with and be
                        bound by these Terms & Conditions. Please read them carefully before
                        making any investment decisions.
                    </CardContent>
                </Card>

                {/* Sections */}
                <div className="space-y-4">
                    <TermsSection
                        title="1. Eligibility"
                        content="You must be at least 18 years old and legally capable of entering into binding contracts to use our services. By using FinancePro, you confirm that you meet these requirements."
                    />

                    <TermsSection
                        title="2. Investment Risks"
                        content="All investments involve risk. Past performance does not guarantee future returns. FinancePro does not provide any guarantee of profit, capital protection, or fixed returns."
                    />

                    <TermsSection
                        title="3. User Responsibilities"
                        content="You are responsible for maintaining the confidentiality of your account credentials and all activities performed under your account."
                    />

                    <TermsSection
                        title="4. Deposits & Withdrawals"
                        content="Deposits and withdrawals are subject to verification and processing timelines. FinancePro reserves the right to delay or reject transactions in case of suspected fraud."
                    />

                    <TermsSection
                        title="5. Fees & Charges"
                        content="FinancePro may charge service fees, processing fees, or administrative charges. All applicable fees will be clearly communicated before transactions are completed."
                    />

                    <TermsSection
                        title="6. Account Suspension"
                        content="We reserve the right to suspend or terminate accounts found to be involved in fraudulent activities or violations of these terms."
                    />

                    <TermsSection
                        title="7. Limitation of Liability"
                        content="FinancePro shall not be held liable for any direct, indirect, incidental, or consequential losses arising from platform usage."
                    />

                    <TermsSection
                        title="8. Regulatory Compliance"
                        content="Users are responsible for ensuring compliance with applicable laws and regulations in their jurisdictions."
                    />

                    <TermsSection
                        title="9. Changes to Terms"
                        content="FinancePro reserves the right to modify these Terms & Conditions at any time. Continued use constitutes acceptance of the updated terms."
                    />

                    <TermsSection
                        title="10. Contact Information"
                        content={
                            <>
                                If you have questions regarding these Terms, please contact{" "}
                                <span className="font-medium text-foreground">
                                    support@financepro.com
                                </span>
                                .
                            </>
                        }
                    />
                </div>

                {/* Acceptance */}
                <Card className="bg-muted/40 border-dashed">
                    <CardContent className="p-6 text-sm text-muted-foreground leading-relaxed">
                        By continuing to use FinancePro, you acknowledge that you have read,
                        understood, and agreed to these Terms & Conditions.
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm">
                    <Link to="/" className="text-primary hover:underline">
                        ← Back to Home
                    </Link>
                </div>

            </div>
        </div>
    )
}

function TermsSection({ title, content }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {content}
            </CardContent>
        </Card>
    )
}

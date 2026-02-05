import { Navigate, Link ,useLocation} from "react-router-dom"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../../components/ui/accordion"
import { Button } from "../../components/ui/button"

export default function PrivacyPolicyPage() {
 
    const location = useLocation();
    const from = location.state?.from
    
    if (from !== "landing" && from !== "register") {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen">

            {/* Header */}
            <div className="bg-primary p-6 px-10 flex flex-col justify-between h-full">
                <div>
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">FP</span>
                        </div>
                        <span className="text-xl font-bold text-primary-foreground">
                            FinancePro
                        </span>
                    </Link>
                </div>

                <div className="mt-10">
                    <p className="text-xs sm:text-sm uppercase tracking-wide text-primary-foreground/60 mb-1">
                        Legal
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">
                        Privacy Policy
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-8 lg:px-18 pt-5 pb-4 overflow-y-auto scrollArea">
                <Accordion
                    type="multiple"
                    defaultValue={[
                        "information",
                        "usage",
                        "sharing",
                        "cookies",
                        "security",
                        "rights",
                        "retention",
                        "changes",
                        "contact",
                    ]}
                    className="w-full"
                >
                    <AccordionItem value="information">
                        <AccordionTrigger>1. Information We Collect</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            We collect personal information such as name, email address,
                            phone number, and financial details when you register or use
                            FinancePro services.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="usage">
                        <AccordionTrigger>2. How We Use Your Information</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            Your information is used to provide services, process transactions,
                            verify identity, improve platform security, and comply with legal
                            requirements.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sharing">
                        <AccordionTrigger>3. Information Sharing</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            We do not sell your personal data. Information may be shared with
                            trusted partners, regulators, or law enforcement when required by law.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="cookies">
                        <AccordionTrigger>4. Cookies & Tracking</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            FinancePro uses cookies to enhance user experience, analyze traffic,
                            and personalize content. You can control cookie preferences through
                            browser settings.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security">
                        <AccordionTrigger>5. Data Security</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            We implement industry-standard security measures to protect your data.
                            However, no online system can guarantee absolute security.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="rights">
                        <AccordionTrigger>6. Your Rights</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            You have the right to access, update, or request deletion of your
                            personal data, subject to legal and regulatory obligations.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="retention">
                        <AccordionTrigger>7. Data Retention</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            Personal data is retained only as long as necessary to fulfill legal,
                            regulatory, and operational requirements.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="changes">
                        <AccordionTrigger>8. Changes to Privacy Policy</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            FinancePro may update this Privacy Policy periodically. Continued use
                            of the platform signifies acceptance of the updated policy.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="contact">
                        <AccordionTrigger>9. Contact Us</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            For privacy-related concerns, contact us at
                            <span className="font-medium text-foreground"> privacy@financepro.com</span>.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 lg:px-8 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
                <Button variant="outline">
                    <Link to="/"
                    >Decline</Link>
                </Button>
                <Button>
                    <Link to="/login">Accept</Link>
                </Button>
            </div>

        </div>
    )
}

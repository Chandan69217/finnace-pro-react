import { Navigate, useLocation, Link } from "react-router-dom"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from '../../components/ui/accordion'
import { Button } from "../../components/ui/button"

export default function TermsOfServicePage() {
    const location  = useLocation()
    const from = location.state?.from

    if (from !== "landing" && from !== "register") {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen">

            <div className="bg-primary p-6 px-10 flex flex-col justify-between h-full">

                {/* Logo */}
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

                {/* Title */}
                <div className="mt-10">
                    <p className="text-xs sm:text-sm md:text-md  uppercase tracking-wide text-primary-foreground/60 mb-1">
                        Agreement
                    </p>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl  font-bold text-primary-foreground">
                        Terms of Service
                    </h1>
                </div>

            </div>


        <div class=" px-6 sm:px-8 lg:px-18 pt-5 sm:pt-6 pb-4 overflow-y-auto scrollArea">
           
                {/* <Accordion
                    type="single"
                    collapsible
                    defaultValue="eligibility"
                    className="w-full"
                > */}

                <Accordion
                    type="multiple"
                    defaultValue={[
                        "eligibility",
                        "risk",
                        "responsibilities",
                        "transactions",
                        "fees",
                        "suspension",
                        "liability",
                        "changes",
                        "contact",
                    ]}
                    className="w-full"
                >

                    <AccordionItem value="eligibility">
                        <AccordionTrigger>1. Eligibility</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            You must be at least 18 years old and legally capable of entering into
                            binding contracts to use FinancePro. By accessing our platform, you
                            confirm that all information provided is accurate and complete.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="risk">
                        <AccordionTrigger>2. Investment Risks</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            All financial investments involve market risk. Past performance does
                            not guarantee future returns. FinancePro does not assure any fixed
                            profit, capital protection, or guaranteed income.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="responsibilities">
                        <AccordionTrigger>3. User Responsibilities</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account
                            credentials. Any activity performed through your account will be
                            considered authorized by you.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="transactions">
                        <AccordionTrigger>4. Deposits & Withdrawals</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            Deposits and withdrawals are subject to verification and compliance
                            checks. FinancePro reserves the right to delay or reject transactions in
                            case of suspected fraud or regulatory requirements.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="fees">
                        <AccordionTrigger>5. Fees & Charges</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            FinancePro may charge service fees, processing fees, or administrative
                            charges. Applicable fees will always be disclosed before completing any
                            transaction.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="suspension">
                        <AccordionTrigger>6. Account Suspension</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            We reserve the right to suspend or terminate accounts involved in
                            fraudulent activity, policy violations, or unlawful behavior without
                            prior notice.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="liability">
                        <AccordionTrigger>7. Limitation of Liability</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            FinancePro shall not be liable for any direct, indirect, incidental, or
                            consequential losses arising from the use of the platform or financial
                            decisions made by users.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="changes">
                        <AccordionTrigger>8. Changes to Terms</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            FinancePro may update these Terms of Service at any time. Continued use
                            of the platform after changes indicates acceptance of the revised
                            terms.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="contact">
                        <AccordionTrigger>9. Contact Information</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            If you have any questions regarding these Terms, please contact us at
                            <span className="font-medium text-foreground"> support@financepro.com</span>.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

        </div>


            <div className="px-5 sm:px-6 lg:px-8 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
                <Button variant="outline">
                    <Link to="/">Decline</Link>
                </Button>
                <Button>
                    <Link to="/login">Accept</Link>
                </Button>
            </div>


        </div>


    );
}







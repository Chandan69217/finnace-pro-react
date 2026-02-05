import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Loader2, Mail, Lock } from "../../components/icons"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../../components/ui/input-otp"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1) // 1=email, 2=otp, 3=reset
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // 🔹 Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // 🔸 API CALL HERE
        setTimeout(() => {
            setLoading(false)
            setStep(2)
            setSuccess("OTP sent to your email")
        }, 1000)
    }

    // 🔹 Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // 🔸 API CALL HERE
        setTimeout(() => {
            setLoading(false)
            setStep(3)
        }, 1000)
    }

    // 🔹 Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        }

        setLoading(true)

        // 🔸 API CALL HERE
        setTimeout(() => {
            setLoading(false)
            setSuccess("Password reset successful. You can now log in.")
        }, 1000)
    }

    return (
        <div className="min-h-screen flex bg-muted/30">

            <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
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

                {/* Content */}
                <div className="space-y-6 max-w-lg">
                    <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
                        Forgot your password?
                    </h1>

                    <p className="text-lg text-primary-foreground/80 leading-relaxed">
                        Don’t worry — it happens. We’ll help you securely reset your password
                        and get you back to managing your finances in just a few steps.
                    </p>

                    <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3 text-primary-foreground/90">
                            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">1</div>
                            Enter your registered email address
                        </li>
                        <li className="flex items-center gap-3 text-primary-foreground/90">
                            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">2</div>
                            Verify the OTP sent to your email
                        </li>
                        <li className="flex items-center gap-3 text-primary-foreground/90">
                            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">3</div>
                            Create a new secure password
                        </li>
                    </ul>

                </div>

                {/* Footer */}
                <p className="text-sm text-primary-foreground/60">
                    Your account security is our top priority.
                </p>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                      <div className="lg:hidden mb-8 text-center">
                                <Link to="/" className="inline-flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-lg">FP</span>
                                  </div>
                                  <span className="text-xl font-bold text-foreground">FinancePro</span>
                                </Link>
                              </div>

                    <Card className="border-0 shadow-lg">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl font-bold">
                                {step === 1 && "Forgot Password"}
                                {step === 2 && "Verify OTP"}
                                {step === 3 && "Reset Password"}
                            </CardTitle>
                            <CardDescription>
                                {step === 1 && "Enter your registered email to receive an OTP"}
                                {step === 2 && "Enter the OTP sent to your email"}
                                {step === 3 && "Create a new password"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {error && (
                                <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 text-sm text-green-600 bg-green-100 rounded-lg">
                                    {success}
                                </div>
                            )}

                            {/* STEP 1: EMAIL */}
                            {step === 1 && (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending OTP...
                                            </>
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* STEP 2: OTP */}
                            {step === 2 && (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>OTP</Label>

                                        <InputOTP
                                            maxLength={6}
                                            value={otp}
                                            onChange={setOtp}
                                            className="w-full"
                                        >
                                            <InputOTPGroup className="w-full gap-3 overflow-visible">
                                                {[...Array(6)].map((_, i) => (
                                                    <InputOTPSlot
                                                        key={i}
                                                        index={i}
                                                        className=" flex-1 h-14 border border-input text-lg font-medium text-center focus-visible:ring-2 focus-visible:ring-primary"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>

                                        
                                    </div>

                                    <Button className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify OTP"
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* STEP 3: RESET PASSWORD */}
                            {step === 3 && (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="pl-10"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Confirm Password</Label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <Button className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Resetting...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </Button>
                                </form>
                            )}

                            <div className="mt-6 text-center text-sm">
                                <Link to="/login" className="text-primary hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
       
    )
}

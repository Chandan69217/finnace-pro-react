import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login_page";
import RegisterPage from "./pages/register/register_page";
import ForgotPasswordPage from "./pages/forget_password/forgot_password_page";
import TermsOfServicePage from "./pages/terms_and_privacy/terms_of_service_page";
import PrivacyPolicyPage from "./pages/terms_and_privacy/privacy_policy_page";
import LandingPage from "./pages/landing_page";
import AdminDashboard from "./pages/admin/admin_dashboard";
import AdminSettingsPage from "./pages/admin/settings/settings_page";
import AdminUsersPage from "./pages/admin/users/users_page";
import AdminMeetingsPage from "./pages/admin/meetings/meetings_page";
import AdminPackagesPage from "./pages/admin/packages/packages_page";
import AdminTransactionsPage from "./pages/admin/transactions/transations_page";
import AdminWithdrawalsPage from "./pages/admin/withdrawals/withdrawals_page";
import AdminKYCPage from "./pages/admin/kyc/kyc_page";
import AdminAnalyticsPage from "./pages/admin/analytics/analytics_page";
import DashboardPage from "./pages/dashboard/dashboard_page";
import AdminNotificationsPage from "./pages/admin/notifications/notification_page";
import AdminProfilePage from "./pages/admin/profile/profile_page";
import UserProfilePage from "./pages/dashboard/profile/profile_page";
import PackagesPage from "./pages/dashboard/packages/packages_page";
import NotificationsPage from "./pages/dashboard/notifications/notifications_page";
import WalletPage from "./pages/dashboard/wallet/wallet_page";
import UserMeetingsPage from "./pages/dashboard/meetings/meetings_page";
import InvestmentsPage from "./pages/dashboard/investments/investments_page";
import TransactionsPage from "./pages/dashboard/transactions/transactions_page";
import ReferralsPage from "./pages/dashboard/referrals/referrals_page";
import KYCPage from "./pages/dashboard/kyc/kyc_page";
import ReportsPage from "./pages/dashboard/reports/reports_page";



export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

            // adimin routes
            <Route path="/admin" >
                <Route index element={<AdminDashboard />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="meetings" element={<AdminMeetingsPage />} />
                <Route path="packages" element={<AdminPackagesPage />} />
                <Route path="transactions" element={<AdminTransactionsPage />} />
                <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
                <Route path="kyc" element={<AdminKYCPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
            </Route>

            // user dashboard routes
            <Route path="/dashboard">
            <Route index element={<DashboardPage/>}/>
            <Route path="profile" element={<UserProfilePage/>}/>
            <Route path="packages" element={<PackagesPage/>}/>
            <Route path="notifications" element={<NotificationsPage/>}/>
            <Route path="wallet" element={<WalletPage/>}/>
            <Route path="meetings" element={<UserMeetingsPage/>}/>
            <Route path="investments" element={<InvestmentsPage/>}/>
            <Route path="transactions" element={<TransactionsPage/>}/>
            <Route path="referrals" element={<ReferralsPage/>}/>
            <Route path="kyc" element={<KYCPage/>}/>
            <Route path="reports" element={<ReportsPage/>}/>
            </Route>
           
            {/* <ProtectedRoute> */}
                {/* <Route path="/login"/> */}
            {/* </ProtectedRoute> */}
        </Routes>
    );
}

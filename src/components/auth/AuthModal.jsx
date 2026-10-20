import React, { useState } from "react";
import Modal from "../common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Lock, Mail, User, MapPin, CreditCard, ShieldCheck, Store, ShoppingBag } from "lucide-react";

export const AuthModal = ({ isOpen, onClose, initialTab = "signin" }) => {
  const [tab, setTab] = useState(initialTab); // 'signin' or 'signup'
  const { login, signup } = useAuth();
  const { success, error, info } = useToast();
  const [loading, setLoading] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRole, setSignUpRole] = useState("ROLE_USER");
  const [signUpPaymentMethod, setSignUpPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [signUpAddress, setSignUpAddress] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      error("Please fill in email and password");
      return;
    }
    setLoading(true);
    try {
      const user = await login(signInEmail, signInPassword);
      success(`Welcome back, ${user?.name || 'Shopper'}!`);
      onClose();
    } catch (err) {
      error(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpAddress) {
      error("Please fill in all required fields");
      return;
    }
    if (signUpPassword.length < 6) {
      error("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
        paymentMethod: signUpPaymentMethod,
        address: signUpAddress,
      });
      success("Account created successfully! You can now sign in.");
      setTab("signin");
      setSignInEmail(signUpEmail);
      setSignInPassword(signUpPassword);
    } catch (err) {
      error(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setSignInEmail("admin@ecommerce.com");
    setSignInPassword("admin123");
    setTab("signin");
    info("Filled live Admin credentials. Click 'Sign In' to connect.");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === "signin" ? "Sign In to SwiftCart" : "Join SwiftCart Marketplace"}
      subtitle={tab === "signin" ? "Access your orders, cart, and personalized feed" : "Create an account to start buying or selling"}
      maxWidth="max-w-md"
    >
      {/* Live Admin Fast Sign-in Helper */}
      <div className="mb-4 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-indigo-400">Render Cloud Admin:</span>
          <p className="text-[11px] text-slate-400 font-mono">admin@ecommerce.com</p>
        </div>
        <button
          type="button"
          onClick={fillAdminCredentials}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 transition-colors"
        >
          Fill Credentials
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-5">
        <button
          onClick={() => setTab("signin")}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
            tab === "signin" ? "text-indigo-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Sign In
          {tab === "signin" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setTab("signup")}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
            tab === "signup" ? "text-indigo-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Create Account
          {tab === "signup" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>
      </div>

      {tab === "signin" ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="e.g. user@swiftcart.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to SwiftCart"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password (min 6)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Role</label>
              <select
                value={signUpRole}
                onChange={(e) => setSignUpRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-sm bg-slate-900"
              >
                <option value="ROLE_USER">Customer (Buyer)</option>
                <option value="ROLE_SELLER">Merchant (Seller)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Payment Method</label>
              <select
                value={signUpPaymentMethod}
                onChange={(e) => setSignUpPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-sm bg-slate-900"
              >
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <textarea
                required
                rows={2}
                value={signUpAddress}
                onChange={(e) => setSignUpAddress(e.target.value)}
                placeholder="42 Innovation Blvd, Suite 10, Silicon City"
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Create Account & Sign In"}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default AuthModal;

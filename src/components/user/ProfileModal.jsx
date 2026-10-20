import React, { useState } from "react";
import Modal from "../common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { RoleBadge } from "../common/Badge";
import { User, Mail, CreditCard, Trash2, Shield, Save } from "lucide-react";

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState(user?.paymentMethod || "CASH_ON_DELIVERY");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, email, paymentMethod });
      success("Profile updated successfully!");
      onClose();
    } catch (err) {
      error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be reversed.")) {
      return;
    }
    try {
      await deleteAccount();
      success("Account deleted. Good luck!");
      onClose();
    } catch (err) {
      error(err.message || "Failed to delete account");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Account & Preferences"
      subtitle="Manage your identity, role permissions, and default settlement methods"
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h4 className="font-bold text-white text-base">{user.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>
          <RoleBadge role={user.role} />
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Preferred Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
            >
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              <option value="BANK_TRANSFER">Digital Bank Transfer</option>
            </select>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileModal;

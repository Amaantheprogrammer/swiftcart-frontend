import React from "react";

export const OrderStatusBadge = ({ status }) => {
  const normalized = (status || "").toUpperCase();
  let bg = "bg-slate-800 text-slate-300 border-slate-700";

  switch (normalized) {
    case "PENDING":
      bg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      break;
    case "PLACED":
      bg = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      break;
    case "SHIPPED":
      bg = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      break;
    case "DELIVERED":
      bg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      break;
    case "CANCELLED":
      bg = "bg-rose-500/10 text-rose-400 border-rose-500/20";
      break;
    case "RETURNED":
      bg = "bg-purple-500/10 text-purple-400 border-purple-500/20";
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
      {status || "UNKNOWN"}
    </span>
  );
};

export const PaymentStatusBadge = ({ status }) => {
  const normalized = (status || "").toUpperCase();
  let bg = "bg-slate-800 text-slate-300 border-slate-700";

  switch (normalized) {
    case "PAID":
      bg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      break;
    case "PENDING":
      bg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      break;
    case "FAILED":
      bg = "bg-rose-500/10 text-rose-400 border-rose-500/20";
      break;
    case "REFUNDED":
      bg = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
      {status || "UNKNOWN"}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const normalized = (role || "").toUpperCase();
  let label = "Buyer";
  let bg = "bg-blue-500/10 text-blue-400 border-blue-500/20";

  if (normalized === "ROLE_ADMIN") {
    label = "Platform Admin";
    bg = "bg-rose-500/10 text-rose-400 border-rose-500/30";
  } else if (normalized === "ROLE_SELLER") {
    label = "Verified Seller";
    bg = "bg-purple-500/10 text-purple-400 border-purple-500/20";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border tracking-wide uppercase ${bg}`}>
      {label}
    </span>
  );
};

export const StockBadge = ({ stock }) => {
  const qty = Number(stock || 0);

  if (qty <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
        Out of Stock
      </span>
    );
  }
  if (qty <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Only {qty} left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      In Stock
    </span>
  );
};

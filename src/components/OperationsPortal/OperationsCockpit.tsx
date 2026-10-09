import React from "react";
import { useNavigate } from "react-router-dom";
import { PortalLayout } from "../layout/PortalLayout";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DollarSign,
  Eye,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";

export interface TransactionItem {
  id: string;
  client: string;
  type: string;
  amount: string;
  status: string;
  date: string;
  method: string;
}

export interface AlertItem {
  title: string;
  description: string;
  level: "warning" | "danger" | "info";
  time: string;
}

export interface KpiItem {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const transactions: TransactionItem[] = [
  {
    id: "TX-20481",
    client: "Amara Global Ltd.",
    type: "Client payment",
    amount: "KES 185,000",
    status: "Cleared",
    date: "08 Oct, 14:32",
    method: "M-Pesa",
  },
  {
    id: "TX-20480",
    client: "James Mwangi",
    type: "Verifier payout",
    amount: "- KES 32,500",
    status: "Processing",
    date: "08 Oct, 13:18",
    method: "Bank",
  },
  {
    id: "TX-20479",
    client: "Nairobi Holdings",
    type: "Client payment",
    amount: "KES 420,000",
    status: "Cleared",
    date: "08 Oct, 11:47",
    method: "Bank",
  },
  {
    id: "TX-20478",
    client: "Sarah Wanjiku",
    type: "Verifier payout",
    amount: "- KES 18,000",
    status: "Review",
    date: "08 Oct, 10:26",
    method: "M-Pesa",
  },
  {
    id: "TX-20477",
    client: "East Africa Trade Co.",
    type: "Client payment",
    amount: "KES 96,400",
    status: "Cleared",
    date: "08 Oct, 09:15",
    method: "Card",
  },
];

const alerts: AlertItem[] = [
  {
    title: "5 missions exceeding SLA",
    description: "Ground verification turnaround has exceeded target.",
    level: "warning",
    time: "12 min ago",
  },
  {
    title: "Payment requires review",
    description: "KES 18,000 verifier payout is awaiting approval.",
    level: "danger",
    time: "31 min ago",
  },
  {
    title: "New client dispute",
    description: "Nairobi Holdings submitted an appeal.",
    level: "info",
    time: "1 hr ago",
  },
];

const kpis: KpiItem[] = [
  {
    label: "Available balance",
    value: "KES 2.84M",
    change: "+12.8%",
    trend: "up",
    icon: Wallet,
    description: "vs. previous month",
  },
  {
    label: "Money received",
    value: "KES 4.62M",
    change: "+8.4%",
    trend: "up",
    icon: ArrowDownLeft,
    description: "this month",
  },
  {
    label: "Verifier payouts",
    value: "KES 1.18M",
    change: "-3.2%",
    trend: "down",
    icon: ArrowUpRight,
    description: "this month",
  },
  {
    label: "Pending payments",
    value: "KES 286K",
    change: "7 items",
    trend: "neutral",
    icon: Clock3,
    description: "require attention",
  },
];

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Cleared:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Processing:
      "bg-amber-50 text-amber-700 border-amber-200",
    Review:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function MiniBar({ height }: { height: string | number }) {
  return (
    <div
      className="w-full rounded-t-md bg-blue-500/80 transition-all duration-300 hover:bg-blue-600"
      style={{ height }}
    />
  );
}

interface DashboardProps {
  onNavigateTab?: (tab: string) => void;
  activeTab?: string;
  onRefresh?: () => void;
  onNewPayment?: () => void;
  onExport?: () => void;
  embedded?: boolean;
}

export function CockpitContent({
  onNavigateTab,
  onRefresh,
  onNewPayment,
}: {
  onNavigateTab?: (tab: string) => void;
  onRefresh?: () => void;
  onNewPayment?: () => void;
}) {
  return (
    <div>
      {/* PAGE INTRO */}
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Systems operational
          </div>

          <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900">
            Financial & operations cockpit
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Monitor cash movement, verifier payouts, client activity and
            operational exceptions from one place.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            onClick={onNewPayment}
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <DollarSign className="h-4 w-4" />
            New payment
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>

                <MoreHorizontal className="h-5 w-5 text-slate-300" />
              </div>

              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
                {item.label}
              </p>

              <div className="mt-1 flex items-end justify-between gap-3">
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </p>

                <span
                  className={`mb-1 inline-flex items-center gap-1 text-xs font-bold ${
                    item.trend === "up"
                      ? "text-emerald-600"
                      : item.trend === "down"
                      ? "text-red-500"
                      : "text-slate-500"
                  }`}
                >
                  {item.trend === "up" && (
                    <TrendingUp className="h-3.5 w-3.5" />
                  )}

                  {item.trend === "down" && (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}

                  {item.change}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* MAIN GRID */}
      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* CASH FLOW */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h3 className="font-bold text-slate-900">Cash flow</h3>
              <p className="mt-1 text-xs text-slate-400">
                Money received vs. verifier payouts
              </p>
            </div>

            <button className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
              Last 30 days
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-8 flex h-[230px] gap-3">
            {/* Y axis */}
            <div className="flex flex-col justify-between pb-5 text-[10px] text-slate-400">
              <span>500K</span>
              <span>400K</span>
              <span>300K</span>
              <span>200K</span>
              <span>100K</span>
              <span>0</span>
            </div>

            {/* Chart */}
            <div className="relative flex-1">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1, 2, 3, 4, 5, 6].map((x) => (
                  <div
                    key={x}
                    className="border-t border-dashed border-slate-100"
                  />
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-5 top-0 flex items-end justify-around gap-2 px-2">
                {[58, 76, 51, 86, 69, 93, 74, 89, 63, 96, 82, 91].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex h-full w-full max-w-[38px] items-end gap-1"
                    >
                      <div
                        className="w-1/2 rounded-t-md bg-emerald-400/70"
                        style={{ height: `${height}%` }}
                      />

                      <div
                        className="w-1/2 rounded-t-md bg-blue-500/80"
                        style={{ height: `${height * 0.55}%` }}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-around text-[10px] text-slate-400">
                <span>Sep 10</span>
                <span>Sep 15</span>
                <span>Sep 20</span>
                <span>Sep 25</span>
                <span>Sep 30</span>
                <span>Oct 05</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-5 border-t border-slate-100 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-500">Money in</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-500">Payouts</span>
            </div>
          </div>
        </div>

        {/* ATTENTION PANEL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Requires attention</h3>
              <p className="mt-1 text-xs text-slate-400">
                Items that need an operator
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
              8 open
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50"
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      alert.level === "danger"
                        ? "bg-red-100 text-red-600"
                        : alert.level === "warning"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {alert.level === "danger" ? (
                      <XCircle className="h-4 w-4" />
                    ) : alert.level === "warning" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {alert.title}
                      </p>

                      <span className="whitespace-nowrap text-[10px] text-slate-400">
                        {alert.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab?.("requests")}
            className="mt-4 w-full rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            View all attention items
          </button>
        </div>
      </section>

      {/* LOWER GRID */}
      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
        {/* TRANSACTIONS */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-slate-900">Recent transactions</h3>
              <p className="mt-1 text-xs text-slate-400">
                Latest financial activity across the platform
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onNavigateTab?.("payments")}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>

              <button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3 font-bold">Transaction</th>
                  <th className="px-5 py-3 font-bold">Client</th>
                  <th className="px-5 py-3 font-bold">Method</th>
                  <th className="px-5 py-3 font-bold">Amount</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {transaction.type}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400 font-mono">
                          {transaction.id} · {transaction.date}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {transaction.client}
                    </td>

                    <td className="px-5 py-4 text-xs font-medium text-slate-500">
                      {transaction.method}
                    </td>

                    <td
                      className={`px-5 py-4 text-sm font-bold font-mono ${
                        transaction.amount.startsWith("-")
                          ? "text-slate-700"
                          : "text-emerald-600"
                      }`}
                    >
                      {transaction.amount}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={transaction.status} />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => onNavigateTab?.("payments")}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <button
              onClick={() => onNavigateTab?.("payments")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              View all transactions →
            </button>
          </div>
        </div>

        {/* OPERATIONS SUMMARY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div>
            <h3 className="font-bold text-slate-900">Operations health</h3>
            <p className="mt-1 text-xs text-slate-400">
              Current service performance
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <HealthRow
              label="Verification SLA"
              value="92%"
              progress="92%"
              status="Healthy"
            />

            <HealthRow
              label="Payment clearance"
              value="98%"
              progress="98%"
              status="Excellent"
            />

            <HealthRow
              label="Verifier availability"
              value="81%"
              progress="81%"
              status="Good"
            />

            <HealthRow
              label="Dispute resolution"
              value="74%"
              progress="74%"
              status="Watch"
              warning
            />
          </div>

          <div className="mt-7 rounded-xl bg-[#07152f] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Nairobi HQ control status
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  All critical financial controls active
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row">
        <span>© 2026 DiasporaVerify Operations</span>

        <div className="flex gap-5">
          <span>Audit trail active</span>
          <span>Last sync: 21:28 EAT</span>
        </div>
      </footer>
    </div>
  );
}

export default function Dashboard({
  onNavigateTab,
  activeTab = "operations",
  onRefresh,
  onNewPayment,
  onExport,
  embedded = false,
}: DashboardProps = {}) {
  const navigate = useNavigate();
  const handleNav = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      navigate(`/admin?tab=${tab}`);
    }
  };

  if (embedded) {
    return (
      <div className="font-sans">
        <CockpitContent
          onNavigateTab={handleNav}
          onRefresh={onRefresh}
          onNewPayment={onNewPayment}
        />
      </div>
    );
  }

  return (
    <PortalLayout
      title="Operations overview"
      subtitle="Thursday, 8 October 2026 · Nairobi HQ"
      role="admin"
      activeTab={activeTab}
      onNavigateTab={handleNav}
      onRefresh={onRefresh}
      onExport={onExport}
    >
      <CockpitContent
        onNavigateTab={handleNav}
        onRefresh={onRefresh}
        onNewPayment={onNewPayment}
      />
    </PortalLayout>
  );
}

function HealthRow({
  label,
  value,
  progress,
  status,
  warning,
}: {
  label: string;
  value: string;
  progress: string;
  status: string;
  warning?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>

        <span
          className={`text-xs font-bold ${
            warning ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              warning ? "bg-amber-400" : "bg-emerald-500"
            }`}
            style={{ width: progress }}
          />
        </div>

        <span className="w-9 text-right text-xs font-bold text-slate-600">
          {value}
        </span>
      </div>
    </div>
  );
}

export { Dashboard as OperationsCockpit };

import {
  Bell,
  CreditCard,
  Globe,
  Lock,
  Save,
  Shield,
  Store,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: <Store size={16} />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={16} />,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <CreditCard size={16} />,
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield size={16} />,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your store and admin preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside>
          <div className="rounded-xl border border-slate-200 bg-white p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Admin Profile */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                HA
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  Hassan Ali
                </p>

                <p className="truncate text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main>
          {activeTab === "general" && <GeneralSettings />}

          {activeTab === "notifications" && <NotificationSettings />}

          {activeTab === "orders" && <OrderSettings />}

          {activeTab === "security" && <SecuritySettings />}
        </main>
      </div>
    </div>
  );
};

/* -------------------------------- */
/* General Settings                 */
/* -------------------------------- */

const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<Store size={18} />}
          title="Store Information"
          description="Basic information about your ecommerce store."
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Store Name" defaultValue="ShopSphere" />

          <Input
            label="Store Email"
            type="email"
            defaultValue="support@shopsphere.com"
          />

          <Input label="Phone Number" defaultValue="+252 61 000 0000" />

          <Input label="Website" defaultValue="https://shopsphere.com" />

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Store Description
            </label>

            <textarea
              rows="4"
              defaultValue="ShopSphere is a modern ecommerce store offering quality products across electronics, fashion, home, sports and beauty."
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<Globe size={18} />}
          title="Regional Settings"
          description="Configure currency, timezone and language."
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectInput
            label="Currency"
            defaultValue="USD"
            options={[
              ["USD", "USD - US Dollar"],
              ["EUR", "EUR - Euro"],
              ["GBP", "GBP - British Pound"],
            ]}
          />

          <SelectInput
            label="Language"
            defaultValue="English"
            options={[
              ["English", "English"],
              ["Somali", "Somali"],
              ["Arabic", "Arabic"],
            ]}
          />

          <SelectInput
            label="Timezone"
            defaultValue="Africa/Mogadishu"
            options={[
              ["Africa/Mogadishu", "Africa/Mogadishu"],
              ["UTC", "UTC"],
            ]}
          />

          <SelectInput
            label="Date Format"
            defaultValue="DD/MM/YYYY"
            options={[
              ["DD/MM/YYYY", "DD/MM/YYYY"],
              ["MM/DD/YYYY", "MM/DD/YYYY"],
              ["YYYY-MM-DD", "YYYY-MM-DD"],
            ]}
          />
        </div>
      </section>

      <SaveButton />
    </div>
  );
};

/* -------------------------------- */
/* Notification Settings            */
/* -------------------------------- */

const NotificationSettings = () => {
  const notifications = [
    {
      title: "New orders",
      description: "Receive a notification whenever a new order is placed.",
      checked: true,
    },
    {
      title: "New customers",
      description: "Get notified when a new customer registers.",
      checked: true,
    },
    {
      title: "Low stock",
      description: "Receive alerts when products reach low stock.",
      checked: true,
    },
    {
      title: "Order updates",
      description: "Get notified when an order status changes.",
      checked: true,
    },
    {
      title: "Marketing emails",
      description: "Receive product and marketing updates.",
      checked: false,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<Bell size={18} />}
          title="Notifications"
          description="Choose which notifications you want to receive."
        />

        <div className="mt-5 divide-y divide-slate-100">
          {notifications.map((item) => (
            <ToggleRow
              key={item.title}
              title={item.title}
              description={item.description}
              defaultChecked={item.checked}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<Bell size={18} />}
          title="Email Notifications"
          description="Configure where admin notifications are delivered."
        />

        <div className="mt-5">
          <Input
            label="Notification Email"
            type="email"
            defaultValue="admin@shopsphere.com"
          />
        </div>
      </section>

      <SaveButton />
    </div>
  );
};

/* -------------------------------- */
/* Order Settings                   */
/* -------------------------------- */

const OrderSettings = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<CreditCard size={18} />}
          title="Order Settings"
          description="Configure how orders are handled."
        />

        <div className="mt-5 divide-y divide-slate-100">
          <ToggleRow
            title="Automatically confirm orders"
            description="Automatically confirm successfully paid orders."
            defaultChecked
          />

          <ToggleRow
            title="Allow guest checkout"
            description="Customers can place orders without creating an account."
            defaultChecked
          />

          <ToggleRow
            title="Stock reservation"
            description="Reserve product stock when an order is created."
            defaultChecked
          />

          <ToggleRow
            title="Email order confirmation"
            description="Send customers an email after placing an order."
            defaultChecked
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<CreditCard size={18} />}
          title="Payment Settings"
          description="Configure your store's payment options."
        />

        <div className="mt-5 space-y-4">
          <ToggleRow
            title="Cash on delivery"
            description="Allow customers to pay when their order arrives."
            defaultChecked
          />

          <ToggleRow
            title="Online payments"
            description="Allow customers to pay using supported online payment methods."
            defaultChecked
          />
        </div>
      </section>

      <SaveButton />
    </div>
  );
};

/* -------------------------------- */
/* Security Settings                */
/* -------------------------------- */

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<Lock size={18} />}
          title="Admin Security"
          description="Manage your administrator account security."
        />

        <div className="mt-6 space-y-5">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="button"
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Update Password
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <SectionHeader
          icon={<Shield size={18} />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your admin account."
        />

        <div className="mt-5 flex flex-col justify-between gap-4 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Two-factor authentication
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Protect your account with an additional verification step.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Enable
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <Trash2 size={18} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-red-600">
              Danger Zone
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              These actions can permanently affect your admin account.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-4 rounded-lg border border-red-100 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Delete admin account
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Permanently remove this administrator account.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};

/* -------------------------------- */
/* Section Header                   */
/* -------------------------------- */

const SectionHeader = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>

        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
};

/* -------------------------------- */
/* Input                            */
/* -------------------------------- */

const Input = ({ label, type = "text", defaultValue, placeholder }) => {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

/* -------------------------------- */
/* Select                           */
/* -------------------------------- */

const SelectInput = ({ label, defaultValue, options }) => {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <select
        defaultValue={defaultValue}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

/* -------------------------------- */
/* Toggle                           */
/* -------------------------------- */

const ToggleRow = ({ title, description, defaultChecked = false }) => {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-slate-700">{title}</p>

        <p className="mt-1 max-w-xl text-xs text-slate-400">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

/* -------------------------------- */
/* Save Button                      */
/* -------------------------------- */

const SaveButton = () => {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <Save size={16} />
        Save Changes
      </button>
    </div>
  );
};

export default Settings;

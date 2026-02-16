<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SpendWise - Smart Money Manager</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Inter', sans-serif; }
    .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); }
    .dark .glass { background: rgba(30,41,59,0.8); }
    .gradient-primary { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); }
    .gradient-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .gradient-danger { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
    .shadow-soft { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .dark .shadow-soft { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
    .animate-slide-up { animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .progress-ring { transform: rotate(-90deg); }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .dark ::-webkit-scrollbar-thumb { background: #475569; }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useContext, createContext, useMemo, useCallback, useRef } = React;

    // ============ CONTEXT & STATE MANAGEMENT ============
    const AppContext = createContext();

    const defaultCategories = [
      { id: 'food', name: 'Food & Dining', icon: '🍕', color: '#f59e0b', type: 'expense' },
      { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6', type: 'expense' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense' },
      { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#ef4444', type: 'expense' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
      { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#10b981', type: 'expense' },
      { id: 'education', name: 'Education', icon: '📚', color: '#6366f1', type: 'expense' },
      { id: 'travel', name: 'Travel', icon: '✈️', color: '#14b8a6', type: 'expense' },
      { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#84cc16', type: 'expense' },
      { id: 'other', name: 'Other', icon: '📦', color: '#64748b', type: 'expense' },
      { id: 'salary', name: 'Salary', icon: '💰', color: '#10b981', type: 'income' },
      { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3b82f6', type: 'income' },
      { id: 'investments', name: 'Investments', icon: '📈', color: '#8b5cf6', type: 'income' },
      { id: 'gifts', name: 'Gifts', icon: '🎁', color: '#f59e0b', type: 'income' },
    ];

    const paymentMethods = [
      { id: 'cash', name: 'Cash', icon: '💵' },
      { id: 'credit', name: 'Credit Card', icon: '💳' },
      { id: 'debit', name: 'Debit Card', icon: '🏧' },
      { id: 'digital', name: 'Digital Wallet', icon: '📱' },
      { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
    ];

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const sampleTransactions = [
      { id: generateId(), type: 'expense', amount: 45.50, category: 'food', paymentMethod: 'credit', date: Date.now() - 86400000, description: 'Dinner at Italian restaurant', tags: [] },
      { id: generateId(), type: 'expense', amount: 120, category: 'groceries', paymentMethod: 'debit', date: Date.now() - 172800000, description: 'Weekly groceries', tags: [] },
      { id: generateId(), type: 'income', amount: 5000, category: 'salary', paymentMethod: 'bank', date: Date.now() - 259200000, description: 'Monthly salary', tags: [] },
      { id: generateId(), type: 'expense', amount: 35, category: 'transport', paymentMethod: 'digital', date: Date.now() - 345600000, description: 'Uber rides', tags: [] },
      { id: generateId(), type: 'expense', amount: 89.99, category: 'entertainment', paymentMethod: 'credit', date: Date.now() - 432000000, description: 'Concert tickets', tags: [] },
      { id: generateId(), type: 'expense', amount: 150, category: 'bills', paymentMethod: 'bank', date: Date.now() - 518400000, description: 'Electricity bill', tags: [] },
      { id: generateId(), type: 'income', amount: 500, category: 'freelance', paymentMethod: 'digital', date: Date.now() - 604800000, description: 'Logo design project', tags: [] },
      { id: generateId(), type: 'expense', amount: 65, category: 'health', paymentMethod: 'credit', date: Date.now() - 691200000, description: 'Gym membership', tags: [] },
    ];

    const sampleBudgets = [
      { id: generateId(), category: 'food', limit: 500, period: 'monthly', startDate: Date.now(), notifications: true },
      { id: generateId(), category: 'transport', limit: 200, period: 'monthly', startDate: Date.now(), notifications: true },
      { id: generateId(), category: 'entertainment', limit: 150, period: 'monthly', startDate: Date.now(), notifications: true },
      { id: generateId(), category: 'shopping', limit: 300, period: 'monthly', startDate: Date.now(), notifications: false },
    ];

    const sampleGoals = [
      { id: generateId(), name: 'Emergency Fund', targetAmount: 10000, currentAmount: 3500, deadline: Date.now() + 86400000 * 180, priority: 'high' },
      { id: generateId(), name: 'Vacation to Japan', targetAmount: 5000, currentAmount: 1200, deadline: Date.now() + 86400000 * 365, priority: 'medium' },
      { id: generateId(), name: 'New Laptop', targetAmount: 2000, currentAmount: 800, deadline: Date.now() + 86400000 * 90, priority: 'low' },
    ];

    // Storage wrapper
    const storage = {
      get: async (key) => {
        try {
          if (window.storage) {
            const data = await window.storage.get(key);
            return data;
          }
          return null;
        } catch { return null; }
      },
      set: async (key, value) => {
        try {
          if (window.storage) {
            await window.storage.set(key, value);
          }
        } catch {}
      }
    };

    // ============ ICONS ============
    const Icons = {
      Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
      List: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      Budget: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
      Chart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
      Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
      Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      Target: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      TrendUp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      TrendDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
      Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
      Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
      Filter: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
      Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
      Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
      AlertCircle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
      ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
    };

    // ============ UTILITY FUNCTIONS ============
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formatDateShort = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const getMonthStart = (date = new Date()) => {
      const d = new Date(date);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };

    const getMonthEnd = (date = new Date()) => {
      const d = new Date(date);
      d.setMonth(d.getMonth() + 1);
      d.setDate(0);
      d.setHours(23, 59, 59, 999);
      return d.getTime();
    };

    // ============ COMPONENTS ============

    // Modal Component
    const Modal = ({ isOpen, onClose, title, children }) => {
      if (!isOpen) return null;
      return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-full sm:max-w-lg bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <Icons.Close />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </div>
        </div>
      );
    };

    // Transaction Form
    const TransactionForm = ({ transaction, onSave, onCancel }) => {
      const { categories } = useContext(AppContext);
      const [formData, setFormData] = useState(transaction || {
        type: 'expense',
        amount: '',
        category: 'food',
        paymentMethod: 'cash',
        date: new Date().toISOString().split('T')[0],
        description: '',
        tags: []
      });

      const filteredCategories = categories.filter(c => c.type === formData.type);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || parseFloat(formData.amount) <= 0) return;
        onSave({
          ...formData,
          id: transaction?.id || generateId(),
          amount: parseFloat(formData.amount),
          date: new Date(formData.date).getTime()
        });
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
            {['expense', 'income'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type, category: type === 'expense' ? 'food' : 'salary' })}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${formData.type === type
                  ? type === 'expense' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  : 'text-slate-600 dark:text-slate-300'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-2xl font-semibold bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.category === cat.id
                    ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 truncate w-full text-center">{cat.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {paymentMethods.map(pm => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${formData.paymentMethod === pm.id
                    ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                    : 'bg-slate-100 dark:bg-slate-700'}`}
                >
                  <span>{pm.icon}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{pm.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
              placeholder="Add a note..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" className={`flex-1 py-3 rounded-xl font-medium text-white transition-colors ${formData.type === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
              {transaction ? 'Update' : 'Add'} {formData.type === 'expense' ? 'Expense' : 'Income'}
            </button>
          </div>
        </form>
      );
    };

    // Budget Form
    const BudgetForm = ({ budget, onSave, onCancel }) => {
      const { categories } = useContext(AppContext);
      const expenseCategories = categories.filter(c => c.type === 'expense');
      const [formData, setFormData] = useState(budget || {
        category: 'food',
        limit: '',
        period: 'monthly',
        notifications: true
      });

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.limit || parseFloat(formData.limit) <= 0) return;
        onSave({
          ...formData,
          id: budget?.id || generateId(),
          limit: parseFloat(formData.limit),
          startDate: Date.now()
        });
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget Limit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Period</label>
            <div className="flex gap-2">
              {['weekly', 'monthly'].map(period => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setFormData({ ...formData, period })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${formData.period === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Notifications</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
              className={`w-12 h-6 rounded-full transition-colors ${formData.notifications ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${formData.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              {budget ? 'Update' : 'Create'} Budget
            </button>
          </div>
        </form>
      );
    };

    // Goal Form
    const GoalForm = ({ goal, onSave, onCancel }) => {
      const [formData, setFormData] = useState(goal || {
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
        priority: 'medium'
      });

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.targetAmount) return;
        onSave({
          ...formData,
          id: goal?.id || generateId(),
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount) || 0,
          deadline: new Date(formData.deadline).getTime()
        });
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
              placeholder="e.g., Emergency Fund"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Saved So Far</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(priority => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${formData.priority === priority
                    ? priority === 'high' ? 'bg-red-500 text-white' : priority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              {goal ? 'Update' : 'Create'} Goal
            </button>
          </div>
        </form>
      );
    };

    // Dashboard Component
    const Dashboard = () => {
      const { transactions, budgets, goals, categories, setActiveView, setShowTransactionModal } = useContext(AppContext);
      const chartRef = useRef(null);
      const trendChartRef = useRef(null);
      const chartInstanceRef = useRef(null);
      const trendChartInstanceRef = useRef(null);

      const monthStart = getMonthStart();
      const monthEnd = getMonthEnd();

      const monthlyTransactions = transactions.filter(t => t.date >= monthStart && t.date <= monthEnd);
      const totalIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

      const expensesByCategory = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

      const topCategories = Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([catId, amount]) => {
          const cat = categories.find(c => c.id === catId);
          return { ...cat, amount };
        });

      // Chart rendering
      useEffect(() => {
        if (chartRef.current && Object.keys(expensesByCategory).length > 0) {
          if (chartInstanceRef.current) chartInstanceRef.current.destroy();
          
          const labels = Object.keys(expensesByCategory).map(id => categories.find(c => c.id === id)?.name || id);
          const data = Object.values(expensesByCategory);
          const colors = Object.keys(expensesByCategory).map(id => categories.find(c => c.id === id)?.color || '#64748b');

          chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'doughnut',
            data: {
              labels,
              datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: { display: false }
              }
            }
          });
        }
        return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
      }, [expensesByCategory, categories]);

      // Trend chart
      useEffect(() => {
        if (trendChartRef.current) {
          if (trendChartInstanceRef.current) trendChartInstanceRef.current.destroy();

          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            date.setHours(0, 0, 0, 0);
            return date;
          });

          const dailyExpenses = last7Days.map(day => {
            const dayStart = day.getTime();
            const dayEnd = dayStart + 86400000 - 1;
            return transactions
              .filter(t => t.type === 'expense' && t.date >= dayStart && t.date <= dayEnd)
              .reduce((sum, t) => sum + t.amount, 0);
          });

          const isDark = document.documentElement.classList.contains('dark');

          trendChartInstanceRef.current = new Chart(trendChartRef.current, {
            type: 'line',
            data: {
              labels: last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' })),
              datasets: [{
                data: dailyExpenses,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { 
                  grid: { display: false },
                  ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                },
                y: { 
                  beginAtZero: true,
                  grid: { color: isDark ? '#334155' : '#e2e8f0' },
                  ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                }
              }
            }
          });
        }
        return () => { if (trendChartInstanceRef.current) trendChartInstanceRef.current.destroy(); };
      }, [transactions]);

      const budgetAlerts = budgets.map(budget => {
        const spent = monthlyTransactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        const percentage = (spent / budget.limit) * 100;
        const cat = categories.find(c => c.id === budget.category);
        return { ...budget, spent, percentage, category: cat };
      }).filter(b => b.percentage >= 80);

      return (
        <div className="p-4 pb-24 space-y-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!</p>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Your Finances</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Balance Card */}
          <div className="gradient-primary rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm font-medium">Current Balance</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(balance)}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icons.TrendUp />
                </div>
                <div>
                  <p className="text-xs text-blue-100">Income</p>
                  <p className="font-semibold">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icons.TrendDown />
                </div>
                <div>
                  <p className="text-xs text-blue-100">Expenses</p>
                  <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Savings Rate</span>
                <span className="font-semibold">{savingsRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }} />
              </div>
            </div>
          </div>

          {/* Budget Alerts */}
          {budgetAlerts.length > 0 && (
            <div className="space-y-2">
              {budgetAlerts.map(alert => (
                <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-xl ${alert.percentage >= 100 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.percentage >= 100 ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                    <Icons.AlertCircle />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${alert.percentage >= 100 ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                      {alert.category?.name} budget {alert.percentage >= 100 ? 'exceeded!' : 'warning'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatCurrency(alert.spent)} of {formatCurrency(alert.limit)} ({alert.percentage.toFixed(0)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass shadow-soft rounded-2xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Transactions</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{monthlyTransactions.length}</p>
              <p className="text-xs text-slate-400 mt-1">This month</p>
            </div>
            <div className="glass shadow-soft rounded-2xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Budgets</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{budgets.length}</p>
              <p className="text-xs text-slate-400 mt-1">Categories tracked</p>
            </div>
          </div>

          {/* Spending by Category */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Spending by Category</h3>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 relative">
                {Object.keys(expensesByCategory).length > 0 ? (
                  <canvas ref={chartRef} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full">
                    <p className="text-xs text-slate-400">No data</p>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {topCategories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="flex-1 text-sm text-slate-600 dark:text-slate-300 truncate">{cat.name}</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
                {topCategories.length === 0 && (
                  <p className="text-sm text-slate-400">No expenses this month</p>
                )}
              </div>
            </div>
          </div>

          {/* Spending Trend */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">7-Day Spending Trend</h3>
            <div className="h-40">
              <canvas ref={trendChartRef} />
            </div>
          </div>

          {/* Goals Progress */}
          {goals.length > 0 && (
            <div className="glass shadow-soft rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white">Savings Goals</h3>
                <button onClick={() => setActiveView('goals')} className="text-sm text-blue-500 font-medium">See all</button>
              </div>
              <div className="space-y-4">
                {goals.slice(0, 2).map(goal => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{goal.name}</span>
                        <span className="text-sm text-slate-500">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 rounded-full h-2 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Recent Transactions</h3>
              <button onClick={() => setActiveView('transactions')} className="text-sm text-blue-500 font-medium">See all</button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map(t => {
                const cat = categories.find(c => c.id === t.category);
                return (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: cat?.color + '20' }}>
                      {cat?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-white truncate">{t.description || cat?.name}</p>
                      <p className="text-xs text-slate-400">{formatDateShort(t.date)}</p>
                    </div>
                    <span className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                );
              })}
              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No transactions yet</p>
                  <button onClick={() => setShowTransactionModal(true)} className="mt-2 text-blue-500 font-medium">Add your first</button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    // Transactions View
    const Transactions = () => {
      const { transactions, categories, deleteTransaction, setEditingTransaction, setShowTransactionModal } = useContext(AppContext);
      const [filter, setFilter] = useState('all');
      const [search, setSearch] = useState('');
      const [dateRange, setDateRange] = useState('month');

      const getDateRange = () => {
        const now = new Date();
        switch (dateRange) {
          case 'week':
            return now.getTime() - 7 * 86400000;
          case 'month':
            return getMonthStart();
          case '3months':
            return now.getTime() - 90 * 86400000;
          default:
            return 0;
        }
      };

      const filteredTransactions = transactions
        .filter(t => {
          if (filter !== 'all' && t.type !== filter) return false;
          if (t.date < getDateRange()) return false;
          if (search) {
            const cat = categories.find(c => c.id === t.category);
            const searchLower = search.toLowerCase();
            return t.description?.toLowerCase().includes(searchLower) ||
              cat?.name.toLowerCase().includes(searchLower);
          }
          return true;
        })
        .sort((a, b) => b.date - a.date);

      const grouped = filteredTransactions.reduce((acc, t) => {
        const date = formatDate(t.date);
        if (!acc[date]) acc[date] = [];
        acc[date].push(t);
        return acc;
      }, {});

      return (
        <div className="p-4 pb-24 space-y-4 animate-slide-up">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Transactions</h1>

          {/* Search */}
          <div className="relative">
            <Icons.Search />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl border-0 shadow-soft focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'expense', 'income'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-soft'}`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
            {[['week', 'Week'], ['month', 'Month'], ['3months', '3 Months']].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setDateRange(value)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${dateRange === value
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-soft'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {Object.entries(grouped).map(([date, txns]) => (
              <div key={date}>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{date}</p>
                <div className="glass shadow-soft rounded-2xl divide-y divide-slate-100 dark:divide-slate-700">
                  {txns.map(t => {
                    const cat = categories.find(c => c.id === t.category);
                    const pm = paymentMethods.find(p => p.id === t.paymentMethod);
                    return (
                      <div key={t.id} className="flex items-center gap-3 p-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: cat?.color + '20' }}>
                          {cat?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 dark:text-white truncate">{t.description || cat?.name}</p>
                          <p className="text-sm text-slate-400">{pm?.icon} {pm?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                          </p>
                          <div className="flex gap-1 justify-end mt-1">
                            <button
                              onClick={() => { setEditingTransaction(t); setShowTransactionModal(true); }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                            >
                              <Icons.Edit />
                            </button>
                            <button
                              onClick={() => deleteTransaction(t.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400"
                            >
                              <Icons.Trash />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">📭</p>
                <p className="text-slate-500 dark:text-slate-400">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      );
    };

    // Budget View
    const BudgetView = () => {
      const { budgets, transactions, categories, deleteBudget, setEditingBudget, setShowBudgetModal, setShowBudgetModal: openModal } = useContext(AppContext);
      const [showForm, setShowForm] = useState(false);
      const [editing, setEditing] = useState(null);

      const monthStart = getMonthStart();
      const monthEnd = getMonthEnd();

      const budgetsWithProgress = budgets.map(budget => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === budget.category && t.date >= monthStart && t.date <= monthEnd)
          .reduce((sum, t) => sum + t.amount, 0);
        const percentage = (spent / budget.limit) * 100;
        const remaining = budget.limit - spent;
        const cat = categories.find(c => c.id === budget.category);
        return { ...budget, spent, percentage, remaining, category: cat };
      });

      const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
      const totalSpent = budgetsWithProgress.reduce((sum, b) => sum + b.spent, 0);

      return (
        <div className="p-4 pb-24 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Budgets</h1>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2"
            >
              <Icons.Plus /> Add
            </button>
          </div>

          {/* Summary Card */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Budget</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Spent</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${totalSpent / totalBudget > 1 ? 'bg-red-500' : totalSpent / totalBudget > 0.8 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {formatCurrency(Math.max(0, totalBudget - totalSpent))} remaining this month
            </p>
          </div>

          {/* Budget List */}
          <div className="space-y-3">
            {budgetsWithProgress.map(budget => (
              <div key={budget.id} className="glass shadow-soft rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: budget.category?.color + '20' }}>
                    {budget.category?.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-white">{budget.category?.name}</p>
                    <p className="text-sm text-slate-400">{budget.period}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditing(budget); setShowForm(true); }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-300">{formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}</span>
                  <span className={`font-medium ${budget.percentage > 100 ? 'text-red-500' : budget.percentage > 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {budget.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${budget.percentage > 100 ? 'bg-red-500' : budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, budget.percentage)}%` }}
                  />
                </div>
                <p className={`text-sm mt-2 ${budget.remaining < 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                  {budget.remaining < 0 ? `${formatCurrency(Math.abs(budget.remaining))} over budget` : `${formatCurrency(budget.remaining)} left`}
                </p>
              </div>
            ))}
            {budgets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">📊</p>
                <p className="text-slate-500 dark:text-slate-400">No budgets set</p>
                <button onClick={() => setShowForm(true)} className="mt-2 text-blue-500 font-medium">Create your first budget</button>
              </div>
            )}
          </div>

          <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Budget' : 'New Budget'}>
            <BudgetForm
              budget={editing}
              onSave={(data) => {
                if (editing) {
                  // Update existing budget
                  const { budgets, setBudgets } = useContext(AppContext);
                } else {
                  // Add new budget handled by context
                }
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </Modal>
        </div>
      );
    };

    // Reports View
    const Reports = () => {
      const { transactions, categories } = useContext(AppContext);
      const [period, setPeriod] = useState('month');
      const chartRef = useRef(null);
      const comparisonChartRef = useRef(null);
      const chartInstanceRef = useRef(null);
      const comparisonChartInstanceRef = useRef(null);

      const getDateRange = () => {
        const now = new Date();
        switch (period) {
          case 'week':
            return now.getTime() - 7 * 86400000;
          case 'month':
            return getMonthStart();
          case '3months':
            return now.getTime() - 90 * 86400000;
          case 'year':
            return now.getTime() - 365 * 86400000;
          default:
            return 0;
        }
      };

      const filtered = transactions.filter(t => t.date >= getDateRange());
      const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      const expensesByCategory = filtered
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

      const categoryData = Object.entries(expensesByCategory)
        .map(([catId, amount]) => {
          const cat = categories.find(c => c.id === catId);
          return { ...cat, amount, percentage: (amount / expenses) * 100 };
        })
        .sort((a, b) => b.amount - a.amount);

      // Pie chart
      useEffect(() => {
        if (chartRef.current && categoryData.length > 0) {
          if (chartInstanceRef.current) chartInstanceRef.current.destroy();
          
          chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'pie',
            data: {
              labels: categoryData.map(c => c.name),
              datasets: [{
                data: categoryData.map(c => c.amount),
                backgroundColor: categoryData.map(c => c.color),
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              }
            }
          });
        }
        return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
      }, [categoryData]);

      // Comparison chart (last 6 months)
      useEffect(() => {
        if (comparisonChartRef.current) {
          if (comparisonChartInstanceRef.current) comparisonChartInstanceRef.current.destroy();

          const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return d;
          });

          const monthlyData = months.map(month => {
            const start = getMonthStart(month);
            const end = getMonthEnd(month);
            const monthTxns = transactions.filter(t => t.date >= start && t.date <= end);
            return {
              label: month.toLocaleDateString('en-US', { month: 'short' }),
              income: monthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
              expenses: monthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            };
          });

          const isDark = document.documentElement.classList.contains('dark');

          comparisonChartInstanceRef.current = new Chart(comparisonChartRef.current, {
            type: 'bar',
            data: {
              labels: monthlyData.map(m => m.label),
              datasets: [
                {
                  label: 'Income',
                  data: monthlyData.map(m => m.income),
                  backgroundColor: '#10b981',
                  borderRadius: 6
                },
                {
                  label: 'Expenses',
                  data: monthlyData.map(m => m.expenses),
                  backgroundColor: '#ef4444',
                  borderRadius: 6
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: isDark ? '#94a3b8' : '#64748b' }
                }
              },
              scales: {
                x: { 
                  grid: { display: false },
                  ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                },
                y: { 
                  beginAtZero: true,
                  grid: { color: isDark ? '#334155' : '#e2e8f0' },
                  ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                }
              }
            }
          });
        }
        return () => { if (comparisonChartInstanceRef.current) comparisonChartInstanceRef.current.destroy(); };
      }, [transactions]);

      const exportCSV = () => {
        const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Payment Method'];
        const rows = transactions.map(t => {
          const cat = categories.find(c => c.id === t.category);
          const pm = paymentMethods.find(p => p.id === t.paymentMethod);
          return [
            formatDate(t.date),
            t.type,
            cat?.name || t.category,
            t.amount,
            t.description || '',
            pm?.name || t.paymentMethod
          ].join(',');
        });
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spendwise-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      };

      return (
        <div className="p-4 pb-24 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports</h1>
            <button onClick={exportCSV} className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-soft text-slate-600 dark:text-slate-300">
              <Icons.Download />
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[['week', 'Week'], ['month', 'Month'], ['3months', '3 Months'], ['year', 'Year']].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${period === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-soft'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="gradient-success rounded-2xl p-4 text-white">
              <p className="text-sm text-green-100">Total Income</p>
              <p className="text-2xl font-bold">{formatCurrency(income)}</p>
            </div>
            <div className="gradient-danger rounded-2xl p-4 text-white">
              <p className="text-sm text-red-100">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
            </div>
          </div>

          {/* Spending Breakdown */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Spending Breakdown</h3>
            <div className="flex gap-4 items-center">
              <div className="w-40 h-40">
                {categoryData.length > 0 ? (
                  <canvas ref={chartRef} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full">
                    <p className="text-xs text-slate-400">No data</p>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 max-h-40 overflow-y-auto">
                {categoryData.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="flex-1 text-sm text-slate-600 dark:text-slate-300 truncate">{cat.name}</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{cat.percentage.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Details */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Category Details</h3>
            <div className="space-y-3">
              {categoryData.map(cat => (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: cat.color + '20' }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{cat.name}</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                </div>
              ))}
              {categoryData.length === 0 && (
                <p className="text-center text-slate-400 py-4">No expenses in this period</p>
              )}
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">6-Month Comparison</h3>
            <div className="h-48">
              <canvas ref={comparisonChartRef} />
            </div>
          </div>

          {/* Insights */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">💡 Insights</h3>
            <div className="space-y-2">
              {categoryData[0] && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium">{categoryData[0].name}</span> is your biggest expense category at {formatCurrency(categoryData[0].amount)} ({categoryData[0].percentage.toFixed(0)}% of total).
                </p>
              )}
              {income > expenses && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Great job! You saved {formatCurrency(income - expenses)} this period.
                </p>
              )}
              {expenses > income && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Watch out! You spent {formatCurrency(expenses - income)} more than you earned.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    };

    // Goals View
    const Goals = () => {
      const { goals, addGoal, updateGoal, deleteGoal } = useContext(AppContext);
      const [showForm, setShowForm] = useState(false);
      const [editing, setEditing] = useState(null);

      const handleSave = (goalData) => {
        if (editing) {
          updateGoal(goalData);
        } else {
          addGoal(goalData);
        }
        setShowForm(false);
        setEditing(null);
      };

      const handleAddToGoal = (goal, amount) => {
        updateGoal({ ...goal, currentAmount: goal.currentAmount + amount });
      };

      const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
      const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

      return (
        <div className="p-4 pb-24 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Savings Goals</h1>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2"
            >
              <Icons.Plus /> Add
            </button>
          </div>

          {/* Summary */}
          <div className="gradient-primary rounded-2xl p-6 text-white">
            <p className="text-blue-100 text-sm">Total Savings Progress</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalSaved)} <span className="text-lg font-normal text-blue-200">/ {formatCurrency(totalTarget)}</span></p>
            <div className="w-full bg-white/20 rounded-full h-3 mt-4">
              <div className="bg-white rounded-full h-3 transition-all" style={{ width: `${totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0}%` }} />
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil((goal.deadline - Date.now()) / 86400000);
              const monthlyNeeded = daysLeft > 0 ? (goal.targetAmount - goal.currentAmount) / (daysLeft / 30) : 0;

              return (
                <div key={goal.id} className="glass shadow-soft rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 dark:text-white">{goal.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' :
                          goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300' :
                          'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300'
                        }`}>
                          {goal.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                        <Icons.Calendar /> {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditing(goal); setShowForm(true); }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(goal.currentAmount)}</p>
                      <p className="text-sm text-slate-400">of {formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <p className={`text-2xl font-bold ${progress >= 100 ? 'text-green-500' : 'text-blue-500'}`}>
                      {progress.toFixed(0)}%
                    </p>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-3">
                    <div
                      className={`h-3 rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>

                  {progress < 100 && monthlyNeeded > 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      Save {formatCurrency(monthlyNeeded)}/month to reach your goal
                    </p>
                  )}

                  {progress >= 100 ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <Icons.Check />
                      <span className="font-medium">Goal achieved! 🎉</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {[50, 100, 200].map(amount => (
                        <button
                          key={amount}
                          onClick={() => handleAddToGoal(goal, amount)}
                          className="flex-1 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          +${amount}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {goals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">🎯</p>
                <p className="text-slate-500 dark:text-slate-400">No savings goals yet</p>
                <button onClick={() => setShowForm(true)} className="mt-2 text-blue-500 font-medium">Create your first goal</button>
              </div>
            )}
          </div>

          <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Edit Goal' : 'New Goal'}>
            <GoalForm
              goal={editing}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </Modal>
        </div>
      );
    };

    // Settings View
    const Settings = () => {
      const { darkMode, setDarkMode, resetData, categories } = useContext(AppContext);
      const [showResetConfirm, setShowResetConfirm] = useState(false);

      return (
        <div className="p-4 pb-24 space-y-4 animate-slide-up">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>

          <div className="glass shadow-soft rounded-2xl divide-y divide-slate-100 dark:divide-slate-700">
            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {darkMode ? <Icons.Moon /> : <Icons.Sun />}
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-slate-400">Switch between light and dark theme</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Categories */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">📁</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Categories</p>
                  <p className="text-sm text-slate-400">{categories.length} categories available</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 10).map(cat => (
                  <span key={cat.id} className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {cat.icon} {cat.name}
                  </span>
                ))}
                {categories.length > 10 && (
                  <span className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-400">
                    +{categories.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Data Management</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-3 rounded-xl font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>

          {/* About */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">About SpendWise</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              SpendWise is your personal finance companion. Track expenses, manage budgets, and achieve your financial goals with ease.
            </p>
            <p className="text-xs text-slate-400 mt-3">Version 1.0.0</p>
          </div>

          {/* Privacy */}
          <div className="glass shadow-soft rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">🔒 Privacy</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All your data is stored locally on your device. We don't collect, store, or transmit any of your financial information.
            </p>
          </div>

          {/* Reset Confirmation Modal */}
          <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Reset All Data?">
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                This will permanently delete all your transactions, budgets, and goals. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { resetData(); setShowResetConfirm(false); }}
                  className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          </Modal>
        </div>
      );
    };

    // Main App Component
    const App = () => {
      const [activeView, setActiveView] = useState('dashboard');
      const [transactions, setTransactions] = useState([]);
      const [budgets, setBudgets] = useState([]);
      const [goals, setGoals] = useState([]);
      const [categories] = useState(defaultCategories);
      const [darkMode, setDarkMode] = useState(false);
      const [showTransactionModal, setShowTransactionModal] = useState(false);
      const [editingTransaction, setEditingTransaction] = useState(null);
      const [isLoading, setIsLoading] = useState(true);

      // Load data from storage
      useEffect(() => {
        const loadData = async () => {
          try {
            const [storedTransactions, storedBudgets, storedGoals, storedDarkMode] = await Promise.all([
              storage.get('spendwise_transactions'),
              storage.get('spendwise_budgets'),
              storage.get('spendwise_goals'),
              storage.get('spendwise_darkMode')
            ]);

            setTransactions(storedTransactions || sampleTransactions);
            setBudgets(storedBudgets || sampleBudgets);
            setGoals(storedGoals || sampleGoals);
            setDarkMode(storedDarkMode || false);
          } catch (e) {
            setTransactions(sampleTransactions);
            setBudgets(sampleBudgets);
            setGoals(sampleGoals);
          }
          setIsLoading(false);
        };
        loadData();
      }, []);

      // Sync to storage
      useEffect(() => {
        if (!isLoading) {
          storage.set('spendwise_transactions', transactions);
        }
      }, [transactions, isLoading]);

      useEffect(() => {
        if (!isLoading) {
          storage.set('spendwise_budgets', budgets);
        }
      }, [budgets, isLoading]);

      useEffect(() => {
        if (!isLoading) {
          storage.set('spendwise_goals', goals);
        }
      }, [goals, isLoading]);

      useEffect(() => {
        if (!isLoading) {
          storage.set('spendwise_darkMode', darkMode);
        }
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [darkMode, isLoading]);

      // CRUD operations
      const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev]);
      };

      const updateTransaction = (transaction) => {
        setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
      };

      const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
      };

      const addBudget = (budget) => {
        setBudgets(prev => [...prev.filter(b => b.category !== budget.category), budget]);
      };

      const updateBudget = (budget) => {
        setBudgets(prev => prev.map(b => b.id === budget.id ? budget : b));
      };

      const deleteBudget = (id) => {
        setBudgets(prev => prev.filter(b => b.id !== id));
      };

      const addGoal = (goal) => {
        setGoals(prev => [...prev, goal]);
      };

      const updateGoal = (goal) => {
        setGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
      };

      const deleteGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
      };

      const resetData = () => {
        setTransactions([]);
        setBudgets([]);
        setGoals([]);
      };

      const handleSaveTransaction = (transaction) => {
        if (editingTransaction) {
          updateTransaction(transaction);
        } else {
          addTransaction(transaction);
        }
        setShowTransactionModal(false);
        setEditingTransaction(null);
      };

      const contextValue = {
        transactions, budgets, goals, categories, darkMode,
        setDarkMode, setActiveView,
        addTransaction, updateTransaction, deleteTransaction,
        addBudget, updateBudget, deleteBudget,
        addGoal, updateGoal, deleteGoal,
        resetData, setShowTransactionModal, setEditingTransaction
      };

      const navItems = [
        { id: 'dashboard', label: 'Home', Icon: Icons.Home },
        { id: 'transactions', label: 'Transactions', Icon: Icons.List },
        { id: 'budget', label: 'Budget', Icon: Icons.Budget },
        { id: 'reports', label: 'Reports', Icon: Icons.Chart },
        { id: 'goals', label: 'Goals', Icon: Icons.Target },
      ];

      if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 animate-pulse">Loading SpendWise...</p>
            </div>
          </div>
        );
      }

      return (
        <AppContext.Provider value={contextValue}>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-slate-200 dark:border-slate-700 px-4 py-3">
              <div className="flex items-center justify-between max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <span className="text-lg">💰</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">SpendWise</span>
                </div>
                <button
                  onClick={() => setActiveView('settings')}
                  className={`p-2 rounded-xl transition-colors ${activeView === 'settings' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  <Icons.Settings />
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-lg mx-auto">
              {activeView === 'dashboard' && <Dashboard />}
              {activeView === 'transactions' && <Transactions />}
              {activeView === 'budget' && <BudgetView />}
              {activeView === 'reports' && <Reports />}
              {activeView === 'goals' && <Goals />}
              {activeView === 'settings' && <Settings />}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-slate-200 dark:border-slate-700 safe-area-inset-bottom">
              <div className="flex items-center justify-around max-w-lg mx-auto py-2">
                {navItems.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveView(id)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                      activeView === id 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <Icon />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Floating Action Button */}
            <button
              onClick={() => { setEditingTransaction(null); setShowTransactionModal(true); }}
              className="fixed right-4 bottom-24 z-50 w-14 h-14 rounded-full gradient-primary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Icons.Plus />
            </button>

            {/* Transaction Modal */}
            <Modal
              isOpen={showTransactionModal}
              onClose={() => { setShowTransactionModal(false); setEditingTransaction(null); }}
              title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
              <TransactionForm
                transaction={editingTransaction}
                onSave={handleSaveTransaction}
                onCancel={() => { setShowTransactionModal(false); setEditingTransaction(null); }}
              />
            </Modal>
          </div>
        </AppContext.Provider>
      );
    };

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
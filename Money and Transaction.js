document.addEventListener('DOMContentLoaded', () => {
    let balance = 124450.80;
    let currentFilter = 'all';
    let searchQuery = '';

    let transactions = [
        { id: 'TX-9081', recipient: 'Priya Sharma', account: '**** 4821', type: 'debit', category: 'Transfer', amount: 2500.00, date: '2026-09-08', status: 'Completed' },
        { id: 'TX-9080', recipient: 'TechCorp Salary (Rudransh)', account: '**** 1102', type: 'credit', category: 'Income', amount: 85000.00, date: '2026-09-01', status: 'Completed' },
        { id: 'TX-9079', recipient: 'Electricity Board', account: '**** 9012', type: 'debit', category: 'Bills', amount: 1200.50, date: '2026-08-28', status: 'Completed' }
    ];

    const balanceDisplay = document.getElementById('balance-display');
    const totalTxDisplay = document.getElementById('total-tx-display');
    const transactionRows = document.getElementById('transaction-rows');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const alertBox = document.getElementById('alert-box');
    const alertMessage = document.getElementById('alert-message');
    const closeAlertBtn = document.getElementById('close-alert-btn');
    const modal = document.getElementById('transfer-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const transferForm = document.getElementById('transfer-form');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
    }

    function updateUI() {
        balanceDisplay.textContent = formatCurrency(balance);
        totalTxDisplay.textContent = transactions.length;

        const filtered = transactions.filter(tx => {
            const matchesFilter = currentFilter === 'all' || tx.type === currentFilter;
            const query = searchQuery.toLowerCase();
            const matchesSearch = tx.recipient.toLowerCase().includes(query) ||
                tx.category.toLowerCase().includes(query) ||
                tx.id.toLowerCase().includes(query);
            return matchesFilter && matchesSearch;
        });

        transactionRows.innerHTML = '';

        if (filtered.length === 0) {
            transactionRows.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#9ca3af; padding: 1.5rem;">No transactions found.</td></tr>`;
            return;
        }

        filtered.forEach(tx => {
            const row = document.createElement('tr');
            row.innerHTML = `
          <td class="tx-id">${tx.id}</td>
          <td>
            <div class="tx-recipient">${tx.recipient}</div>
            <div class="tx-account">${tx.account}</div>
          </td>
          <td><span class="badge">${tx.category}</span></td>
          <td>${tx.date}</td>
          <td><span class="badge completed">${tx.status}</span></td>
          <td class="amount ${tx.type}">${tx.type === 'debit' ? '-' : '+'}${formatCurrency(tx.amount)}</td>
        `;
            transactionRows.appendChild(row);
        });
    }

    function showAlert(message, type = 'success') {
        alertMessage.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.classList.remove('hidden');
    }

    closeAlertBtn.addEventListener('click', () => alertBox.classList.add('hidden'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            updateUI();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateUI();
    });

    openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    cancelModalBtn.addEventListener('click', () => modal.classList.add('hidden'));

    transferForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('tx-type').value;
        const recipient = document.getElementById('tx-recipient').value.trim();
        const account = document.getElementById('tx-account').value.trim();
        const amount = parseFloat(document.getElementById('tx-amount').value);
        const category = document.getElementById('tx-category').value;

        if (!recipient || !account || isNaN(amount) || amount <= 0) {
            showAlert('Please enter valid payment details and amount.', 'error');
            return;
        }

        if (type === 'debit' && amount > balance) {
            showAlert('Insufficient funds for this transfer.', 'error');
            return;
        }

        const newTx = {
            id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
            recipient,
            account: `**** ${account.slice(-4)}`,
            type,
            category,
            amount,
            date: new Date().toISOString().split('T')[0],
            status: 'Completed'
        };

        transactions.unshift(newTx);
        balance = type === 'debit' ? balance - amount : balance + amount;

        updateUI();
        transferForm.reset();
        modal.classList.add('hidden');
        showAlert(`Transaction of ${formatCurrency(amount)} processed successfully!`, 'success');
    });

    updateUI();
});
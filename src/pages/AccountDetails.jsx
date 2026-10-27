import { useState } from 'react';
import { Copy, Check, Landmark } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { maskAccountNumber, formatDate } from '../utils/format.js';
import './AccountDetails.css';

export default function AccountDetails() {
  const { user } = useAuth();
  const [nomineeName, setNomineeName] = useState(
  localStorage.getItem('fincentral_nominee_name') || ''
);
const [portabilityBranch, setPortabilityBranch] = useState('');
const [portabilityMessage, setPortabilityMessage] = useState('');

const [portabilityRequests, setPortabilityRequests] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('fincentral_portability_requests') || '[]'
    );
  } catch {
    return [];
  }
});
const [investmentType, setInvestmentType] = useState('Mutual Funds');
const [investmentAmount, setInvestmentAmount] = useState('');
const [investmentMessage, setInvestmentMessage] = useState('');

const [investmentRequests, setInvestmentRequests] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('fincentral_wealth_requests') || '[]'
    );
  } catch {
    return [];
  }
});
const [nomineeRelation, setNomineeRelation] = useState(
  localStorage.getItem('fincentral_nominee_relation') || ''
);
const [nomineeMessage, setNomineeMessage] = useState('');
const [lockerType, setLockerType] = useState('Small');
const [lockerMessage, setLockerMessage] = useState('');
const [lockerRequests, setLockerRequests] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('fincentral_locker_requests') || '[]'
    );
  } catch {
    return [];
  }
});
  const [copied, setCopied] = useState(false);
  const [leaves, setLeaves] = useState('25');
const [requests, setRequests] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('fincentral_cheque_requests') || '[]');
  } catch {
    return [];
  }
});
const [requestMessage, setRequestMessage] = useState('');
const [chequeNumber, setChequeNumber] = useState('');
const [stopMessage, setStopMessage] = useState('');
const [searchRequestId, setSearchRequestId] = useState('');
const [chequeStatusResult, setChequeStatusResult] = useState(null);

const [stoppedCheques, setStoppedCheques] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('fincentral_stopped_cheques') || '[]'
    );
  } catch {
    return [];
  }
});

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(user?.accountNumber || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }
 function handleChequeRequest() {
  const request = {
    id: `CHQ${Date.now()}`,
    leaves,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
  };

  const updatedRequests = [request, ...requests];

  localStorage.setItem(
    'fincentral_cheque_requests',
    JSON.stringify(updatedRequests)
  );

  setRequests(updatedRequests);
  setRequestMessage('Cheque book request submitted successfully.');
}


function handleStopCheque(e) {
  e.preventDefault();

  const cheque = chequeNumber.trim();

  if (!cheque) {
    setStopMessage('Please enter a cheque number.');
    return;
  }

  if (stoppedCheques.includes(cheque)) {
    setStopMessage('This cheque already has a stop request.');
    return;
  }

  const updated = [cheque, ...stoppedCheques];

  localStorage.setItem(
    'fincentral_stopped_cheques',
    JSON.stringify(updated)
  );

  setStoppedCheques(updated);
  setStopMessage(`Stop request recorded for cheque ${cheque}.`);
  setChequeNumber('');
}

function handleCheckChequeStatus(e) {
  e.preventDefault();

  const result = requests.find(
    (request) =>
      request.id.toLowerCase() === searchRequestId.trim().toLowerCase()
  );

  setChequeStatusResult(result || { notFound: true });
}


function handleNomineeSave(e) {
  e.preventDefault();

  if (!nomineeName.trim() || !nomineeRelation) {
    setNomineeMessage('Please enter the nominee name and relationship.');
    return;
  }

  localStorage.setItem('fincentral_nominee_name', nomineeName.trim());
  localStorage.setItem('fincentral_nominee_relation', nomineeRelation);

  setNomineeMessage('Nominee details saved successfully in this demo.');

}

function handleLockerRequest(e) {
  e.preventDefault();

  const request = {
    id: `LCK${Date.now()}`,
    lockerType,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
  };

  const updated = [request, ...lockerRequests];

  localStorage.setItem(
    'fincentral_locker_requests',
    JSON.stringify(updated)
  );

  setLockerRequests(updated);
  setLockerMessage('Locker application submitted successfully.');
}
function handleInvestmentRequest(e) {
  e.preventDefault();

  const amount = Number(investmentAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    setInvestmentMessage(
      'Please enter a valid investment amount greater than zero.'
    );
    return;
  }

  const request = {
    id: `INV${Date.now()}`,
    investmentType,
    amount: amount.toFixed(2),
    status: 'Request Submitted',
    date: new Date().toLocaleDateString(),
  };

  const updated = [request, ...investmentRequests];

  localStorage.setItem(
    'fincentral_wealth_requests',
    JSON.stringify(updated)
  );

  setInvestmentRequests(updated);
  setInvestmentMessage(
    'Your investment request has been saved in this demo.'
  );
  setInvestmentAmount('');
}
function handlePortabilityRequest(e) {
  e.preventDefault();

  if (!portabilityBranch.trim()) {
    setPortabilityMessage('Please enter the destination branch.');
    return;
  }

  const request = {
    id: `APR${Date.now()}`,
    branch: portabilityBranch.trim(),
    status: 'Pending',
    date: new Date().toLocaleDateString(),
  };

  const updated = [request, ...portabilityRequests];

  localStorage.setItem(
    'fincentral_portability_requests',
    JSON.stringify(updated)
  );

  setPortabilityRequests(updated);
  setPortabilityMessage('Account portability request submitted successfully.');
  setPortabilityBranch('');
}

  const rows = [
    { label: 'Account Holder Name', value: user?.fullName },
    { label: 'Account Number', value: maskAccountNumber(user?.accountNumber), mono: true },
    { label: 'IFSC Code', value: user?.ifsc, mono: true },
    { label: 'Account Type', value: user?.accountType },
    { label: 'Branch', value: user?.branch },
    { label: 'Account Opening Date', value: formatDate(user?.accountOpened) },
    { label: 'Account Status', value: user?.accountStatus, pill: true },
  ];

  return (
    <AuthenticatedLayout>
      <div className="page-fade account-details">
        <h1 className="account-details__heading">Account Details</h1>
        <p className="account-details__subtitle">
          Your account information, kept secure and partially masked.
        </p>

        {copied && (
          <div className="account-details__alert">
            <Alert type="success" message="Account number copied to clipboard." />
          </div>
        )}

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Primary Savings Account"
            subtitle="FINCENTRAL BANK"
            action={
              <button className="account-details__copy-btn" onClick={handleCopy}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy Account Number'}
              </button>
            }
          >
            <dl className="account-details__list">
              {rows.map(({ label, value, mono, pill }) => (
                <div className="account-details__row" key={label}>
                  <dt>{label}</dt>
                  <dd className={mono ? 'figure' : ''}>
                    {pill ? (
                      <span className="status-pill status-pill--completed">{value}</span>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        
        </div>

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Cheque Book Request"
            subtitle="Request and track your cheque book"
          >
            {requestMessage && (
              <Alert type="success" message={requestMessage} />
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChequeRequest();
              }}
            >
              <label htmlFor="cheque-leaves">Number of cheque leaves</label>
              <select
                id="cheque-leaves"
                value={leaves}
                onChange={(e) => setLeaves(e.target.value)}
              >
                <option value="25">25 leaves</option>
                <option value="50">50 leaves</option>
                <option value="100">100 leaves</option>
              </select>

              <button type="submit">Request Cheque Book</button>
            </form>

            <h3>Request History</h3>

            {requests.length === 0 ? (
              <p>No cheque book requests yet.</p>
            ) : (
              <dl className="account-details__list">
                {requests.map((request) => (
                  <div className="account-details__row" key={request.id}>
                    <dt>
                      {request.leaves} leaves — {request.date}
                      <br />
                      <small>Request ID: {request.id}</small>
                    </dt>
                    <dd>
                      <span className="status-pill status-pill--completed">
                        {request.status}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
                   </Card>
        </div>

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Stop Cheque" 
    subtitle="Submit and track stop-cheque requests"
  >
    <form onSubmit={handleStopCheque}>
      <label htmlFor="stop-cheque-number">Cheque Number</label>
      <input
        id="stop-cheque-number"
        type="text"
        value={chequeNumber}
        onChange={(e) => setChequeNumber(e.target.value)}
        placeholder="Enter cheque number"
        required
      />

      <button type="submit">Request Stop Cheque</button>
    </form>

    {stopMessage && (
  <Alert
    type={stopMessage.includes('recorded') ? 'success' : 'error'}
    message={stopMessage}
  />
)}

    <h3>Stop Cheque History</h3>

    {stoppedCheques.length === 0 ? (
      <p>No stop-cheque requests yet.</p>
    ) : (
      <dl className="account-details__list">
        {stoppedCheques.map((cheque) => (
          <div className="account-details__row" key={cheque}>
            <dt>Cheque Number: {cheque}</dt>
            <dd>
              <span className="status-pill status-pill--completed">
                Requested
              </span>
            </dd>
          </div>
        ))}
      </dl>
    )}
   </Card>
</div>

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Cheque Status"
    subtitle="Track your cheque book request"
  >
    <form onSubmit={handleCheckChequeStatus}>
      <label htmlFor="cheque-request-id">Cheque Book Request ID</label>
      <input
        id="cheque-request-id"
        type="text"
        value={searchRequestId}
        onChange={(e) => {
          setSearchRequestId(e.target.value);
          setChequeStatusResult(null);
        }}
        placeholder="Enter request ID"
        required
      />

      <button type="submit">Check Status</button>
    </form>

    {chequeStatusResult && (
      chequeStatusResult.notFound ? (
        <p>No cheque book request found with this ID.</p>
      ) : (
        <div>
          <p><strong>Request ID:</strong> {chequeStatusResult.id}</p>
          <p><strong>Leaves:</strong> {chequeStatusResult.leaves}</p>
          <p><strong>Date:</strong> {chequeStatusResult.date}</p>
          <p><strong>Status:</strong> {chequeStatusResult.status}</p>
        </div>
      )
    )}
  </Card>
</div>

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Account Balance Certificate"
            subtitle="View and print your account certificate"
          >
            <div className="account-details__list">
              <div className="account-details__row">
                <dt>Account Holder</dt>
                <dd>{user?.fullName || 'N/A'}</dd>
              </div>
              <div className="account-details__row">
                <dt>Account Number</dt>
                <dd>{maskAccountNumber(user?.accountNumber) || 'N/A'}</dd>
              </div>
              <div className="account-details__row">
                <dt>Account Type</dt>
                <dd>{user?.accountType || 'N/A'}</dd>
              </div>
              <div className="account-details__row">
                <dt>Branch</dt>
                <dd>{user?.branch || 'N/A'}</dd>
              </div>
              <div className="account-details__row">
                <dt>Certificate Date</dt>
                <dd>{new Date().toLocaleDateString()}</dd>
              </div>
            </div>

            <button type="button" onClick={() => window.print()}>
              Print Certificate
            </button>
          </Card>
        </div>

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Locker Details"
            subtitle="View locker service information"
          >
            <div className="account-details__list">
              <div className="account-details__row">
                <dt>Locker Availability</dt>
                <dd>Available on request</dd>
              </div>
              <div className="account-details__row">
                <dt>Locker Type</dt>
                <dd>Small, Medium, Large</dd>
              </div>
              <div className="account-details__row">
                <dt>Application Status</dt>
                <dd>
                  <span className="status-pill status-pill--completed">
                    Not Applied
                  </span>
                </dd>
              </div>
            </div>

            <p>
              Visit your branch to confirm availability, applicable charges,
              and locker terms.
            </p>
         
          </Card>
        </div>

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Apply for Locker"
            subtitle="Submit and track your locker application"
          >
            <form onSubmit={handleLockerRequest}>
              <label htmlFor="locker-type">Locker Type</label>
              <select
                id="locker-type"
                value={lockerType}
                onChange={(e) => setLockerType(e.target.value)}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>

              <button type="submit">Submit Application</button>
            </form>

            {lockerMessage && (
              <Alert type="success" message={lockerMessage} />
            )}

            <h3>Locker Application History</h3>

            {lockerRequests.length === 0 ? (
              <p>No locker applications yet.</p>
            ) : (
              <dl className="account-details__list">
                {lockerRequests.map((request) => (
                  <div className="account-details__row" key={request.id}>
                    <dt>
                      {request.lockerType} Locker
                      <br />
                      <small>Request ID: {request.id}</small>
                      <br />
                      <small>Date: {request.date}</small>
                    </dt>
                    <dd>{request.status}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>
        </div>
        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Wealth Management"
            subtitle="Explore investment options and submit a demo request"
          >
            <p>
              Select an investment category and enter an amount.
              This demo does not make real investments or transfer money.
            </p>

            <form onSubmit={handleInvestmentRequest}>
              <label htmlFor="investment-type">Investment Type</label>
              <select
                id="investment-type"
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value)}
              >
                <option value="Mutual Funds">Mutual Funds</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
                <option value="Recurring Deposit">Recurring Deposit</option>
                <option value="Bonds">Bonds</option>
                <option value="Retirement Planning">Retirement Planning</option>
              </select>

              <label htmlFor="investment-amount">
                Investment Amount (₹)
              </label>
              <input
                id="investment-amount"
                type="number"
                min="1"
                step="0.01"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />

              <button type="submit">Submit Investment Request</button>
            </form>

            {investmentMessage && (
              <Alert
                type={
                  investmentMessage.includes('saved') ? 'success' : 'error'
                }
                message={investmentMessage}
              />
            )}

            <h3>Investment Request History</h3>

            {investmentRequests.length === 0 ? (
              <p>No investment requests yet.</p>
            ) : (
              <dl className="account-details__list">
                {investmentRequests.map((request) => (
                  <div className="account-details__row" key={request.id}>
                    <dt>
                      {request.investmentType} — ₹{request.amount}
                      <br />
                      <small>Request ID: {request.id}</small>
                      <br />
                      <small>Date: {request.date}</small>
                    </dt>
                    <dd>{request.status}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>
        </div>
        <div className="account-details__card">
  <Card
    icon={Landmark}
    title="Account Portability"
    subtitle="Request a transfer to another branch"
  >
    <form onSubmit={handlePortabilityRequest}>
      <label htmlFor="portability-branch">
        Destination Branch
      </label>

      <input
        id="portability-branch"
        type="text"
        value={portabilityBranch}
        onChange={(e) => setPortabilityBranch(e.target.value)}
        placeholder="Enter destination branch"
        required
      />

      <button type="submit">Submit Portability Request</button>
    </form>

    {portabilityMessage && (
      <Alert
        type={
          portabilityMessage.includes('successfully') ? 'success' : 'error'
        }
        message={portabilityMessage}
      />
    )}

    <h3>Portability Request History</h3>

    {portabilityRequests.length === 0 ? (
      <p>No portability requests yet.</p>
    ) : (
      <dl className="account-details__list">
        {portabilityRequests.map((request) => (
          <div className="account-details__row" key={request.id}>
            <dt>
              {request.branch}
              <br />
              <small>Request ID: {request.id}</small>
              <br />
              <small>Date: {request.date}</small>
            </dt>
            <dd>{request.status}</dd>
          </div>
        ))}
      </dl>
    )}
  </Card>
</div>

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Nominee Maintenance"
            subtitle="Add or update your account nominee"
          >
            <form onSubmit={handleNomineeSave}>
              <label htmlFor="nominee-name">Nominee Name</label>
              <input
                id="nominee-name"
                type="text"
                value={nomineeName}
                onChange={(e) => {
                  setNomineeName(e.target.value);
                  setNomineeMessage('');
                }}
                placeholder="Enter nominee name"
                required
              />

              <label htmlFor="nominee-relation">Relationship</label>
              <select
                id="nominee-relation"
                value={nomineeRelation}
                onChange={(e) => {
                  setNomineeRelation(e.target.value);
                  setNomineeMessage('');
                }}
                required
              >
                <option value="">Select relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>

              <button type="submit">Save Nominee Details</button>
            </form>

            {nomineeMessage && (
              <Alert
                type={
                  nomineeMessage.includes('successfully')
                    ? 'success'
                    : 'error'
                }
                message={nomineeMessage}
              />
            )}
          </Card>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}


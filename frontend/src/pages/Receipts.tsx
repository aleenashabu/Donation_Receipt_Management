import { useState,useEffect } from "react";

type Receipt = {
  id: number;
  receiptNumber: number;
  donorName: string;
  donationId: number;
  amount: number;
  issuedDate: string;
  status: "ISSUED" | "VOID" | "REPLACED";
  replacedReceiptId: number | null;
  createdById: number;
};

type Donation = {
  id: number;
  donorId: number;
  amount: string;
  currency: string;
  donationDate: string;
  referenceNumber: string;
};

type Donor = {
  id: number;
  firstName: string;
  lastName: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

function Receipts({ user }: { user: User }) {
  
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [year, setYear] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonationId, setSelectedDonationId] = useState("");
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [viewReceipt, setViewReceipt] = useState<Receipt | null>(null);

  
  useEffect(() => {
  Promise.all([
    fetch("http://localhost:3000/donations").then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load donations");
      }
      return res.json();
    }),

    fetch("http://localhost:3000/donors").then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load donors");
      }
      return res.json();
    }),
  ])
    .then(([donationData, donorData]) => {
      setDonations(donationData);
      setDonors(donorData);
    })
    .catch((error) => {
      console.error("Error loading receipt form data:", error);
      alert("Unable to load donations and donors.");
    })
    .finally(() => setLoadingDonations(false));
}, []); 

  useEffect(() => {
  fetch("http://localhost:3000/receipts")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load receipts");
      }
      return res.json();
    })
    .then((data) => {
      setReceipts(data);
    })
    .catch((error) => {
      console.error("Error loading receipts:", error);
    });
}, []);

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.receiptNumber.toString().includes(search) ||
      receipt.donorName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !status || receipt.status === status;
    const matchesYear =
      !year || receipt.issuedDate.startsWith(year);

    return matchesSearch && matchesStatus && matchesYear;
  });

  const issuedCount = receipts.filter(
    (receipt) => receipt.status === "ISSUED"
  ).length;

  const voidedCount = receipts.filter(
    (receipt) => receipt.status === "VOID"
  ).length;

  const replacementCount = receipts.filter(
    (receipt) => receipt.replacedReceiptId !== null
  ).length;

  return (
    <div className="receipts-page">
      <header className="receipts-header">
        <div>
          <p>Donation Management System</p>
          <h1>Receipt Management</h1>
          <span>
            Generate, search, void, and replace donation receipts.
          </span>
        </div>

        <button onClick={() => setShowForm(true)}>
          + Generate Receipt
        </button>
      </header>

      <section className="receipt-summary">
        <div>
          <p>Issued Receipts</p>
          <h2>{issuedCount}</h2>
        </div>
        <div>
          <p>Voided Receipts</p>
          <h2>{voidedCount}</h2>
        </div>
        <div>
          <p>Replacements</p>
          <h2>{replacementCount}</h2>
        </div>
      </section>

      <section className="receipt-panel">
        <h2>Receipts</h2>

        <div className="receipt-filters">
          <input
            type="text"
            placeholder="Search receipt number or donor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="ISSUED">Issued</option>
            <option value="VOID">Void</option>
            <option value="REPLACED">Replaced</option>
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">All years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setStatus("");
              setYear("");
            }}
          >
            Clear
          </button>
        </div>

        <div className="receipt-table-wrapper">
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Donor</th>
                <th>Donation</th>
                <th>Amount</th>
                <th>Issued Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td>{receipt.receiptNumber}</td>
                  <td>{receipt.donorName}</td>
                  <td>#{receipt.donationId}</td>
                  <td>
                    $ {Number(receipt.amount ?? 0).toFixed(2)}
                  </td>
                  <td>{receipt.issuedDate}</td>
                  <td>
                    <span
                      className={`receipt-status ${receipt.status.toLowerCase()}`}
                    >
                      {receipt.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setViewReceipt(receipt)}>
                       View
                    </button>

                    {receipt.status === "ISSUED" && (
                      <button
                        onClick={() =>
                          alert("Void will be connected to the backend later.")
                        }
                      >
                        Void
                      </button>
                    )}

                    {receipt.status === "VOID" && (
                      <button
                        onClick={() =>
                          alert("Replacement will be connected to the backend later.")
                        }
                      >
                        Replace
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredReceipts.length === 0 && (
                <tr>
                  <td colSpan={7}>No receipts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="receipt-modal-overlay">
          <div className="receipt-modal">
            <h2>Generate Receipt</h2>

            <label>Donation</label>

        <select
        value={selectedDonationId}
        onChange={(e) => setSelectedDonationId(e.target.value)}
        disabled={loadingDonations}
        >
        <option value="">
            {loadingDonations ? "Loading donations..." : "Select a donation"}
        </option>

        {donations.map((donation) => {
            const donor = donors.find(
            (item) => item.id === donation.donorId
            );

            return (
            <option key={donation.id} value={donation.id}>
                {donor
                ? `${donor.firstName} ${donor.lastName}`
                : "Unknown donor"}
                {" — "}
                {donation.currency} {Number(donation.amount).toFixed(2)}
                {" — "}
                {donation.donationDate.slice(0, 10)}
                {" — #"}
                {donation.id}
            </option>
            );
        })}
        </select>

            <label>Created By</label>
            <input
              type="text"
              value={user.name}
              readOnly
            />

            <p>
              The receipt number will be generated automatically.
            </p>

            <div className="receipt-modal-actions">
              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
            onClick={async () => {
                if (!selectedDonationId) {
                alert("Please select a donation.");
                return;
                }

                try {
                const response = await fetch("http://localhost:3000/receipts", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    donationId: Number(selectedDonationId),
                    createdById: user.id,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Failed to generate receipt.");
                    return;
                }

                alert(`Receipt #${data.receiptNumber} generated successfully!`);
                setShowForm(false);
                setSelectedDonationId("");

                const refreshResponse = await fetch("http://localhost:3000/receipts");
                if (refreshResponse.ok) {
                  const updatedReceipts = await refreshResponse.json();
                  setReceipts(updatedReceipts);
                }
                } catch (error) {
                console.error("Receipt generation error:", error);
                alert("Unable to connect to the backend.");
                }
            }}
            >
            Generate
            </button>
            </div>
          </div>
        </div>
      )}

      
      {viewReceipt && (
        <div
          className="receipt-modal-overlay"
          onClick={() => setViewReceipt(null)}
        >
          <div
            className="receipt-modal view-receipt-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="view-receipt-close"
              onClick={() => setViewReceipt(null)}
            >
              ×
            </button>

            <h2>Receipt #{viewReceipt.receiptNumber}</h2>
            <p>Donation Receipt Details</p>

            <div className="view-receipt-details">
              <div>
                <strong>Donor</strong>
                <span>{viewReceipt.donorName}</span>
              </div>

              <div>
                <strong>Receipt Number</strong>
                <span>{viewReceipt.receiptNumber}</span>
              </div>

              <div>
                <strong>Donation ID</strong>
                <span>#{viewReceipt.donationId}</span>
              </div>

              <div>
                <strong>Amount</strong>
                <span>
                  CAD {Number(viewReceipt.amount ?? 0).toFixed(2)}
                </span>
              </div>

              <div>
                <strong>Issued Date</strong>
                <span>
                  {new Date(viewReceipt.issuedDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <strong>Status</strong>
                <span>{viewReceipt.status}</span>
              </div>

              <div>
              <strong>Created By</strong>
              <span>
                {viewReceipt.createdById === user.id
                  ? user.name
                  : `User ID: ${viewReceipt.createdById}`}
              </span>
            </div>
            </div>

            <div className="receipt-modal-actions">
              <button onClick={() => setViewReceipt(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Receipts;
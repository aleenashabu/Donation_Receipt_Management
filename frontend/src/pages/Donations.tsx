import { useEffect, useState } from "react";
import DonationViewModal from "./DonationViewModal";

type Donor = {
  id: number;
  firstName: string;
  lastName: string;
};

type Donation = {
  id: number;
  donorId: number;
  fundId: number;
  donationDate: string;
  amount: string;
  paymentMethod: string;
  referenceNumber: string;
  purpose: string;
  notes: string;
};

function Donations() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<number | null>(null);
  const [editingDonationId, setEditingDonationId] = useState<number | null>(null);
  const [donorId, setDonorId] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [filterDonorId, setFilterDonorId] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");


  // Load donors
  useEffect(() => {
    fetch("http://localhost:3000/donors")
      .then((response) => response.json())
      .then((data) => {
        setDonors(data);
      })
      .catch((error) => {
        console.error("Error loading donors:", error);
      });
  }, []);

  // Load donations
  const loadDonations = () => {
  setLoadingDonations(true);

  const params = new URLSearchParams();

  if (filterDonorId) {
    params.append("donorId", filterDonorId);
  }

  if (filterFromDate) {
    params.append("from", filterFromDate);
  }

  if (filterToDate) {
    params.append("to", filterToDate);
  }

  if (filterStatus) {
    params.append("status", filterStatus);
  }

  if (filterPaymentMethod) {
    params.append("paymentMethod", filterPaymentMethod);
  }

  fetch(`http://localhost:3000/donations?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      setDonations(data);
      setLoadingDonations(false);
    })
    .catch((error) => {
      console.error("Error loading donations:", error);
      setLoadingDonations(false);
    });
};

  useEffect(() => {
  loadDonations();
}, [
  filterDonorId,
  filterFromDate,
  filterToDate,
  filterStatus,
  filterPaymentMethod,
]);

  // Save donation
  const handleSubmit = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(donationDate);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    alert("Donation date cannot be a future date");
    return;
  }

    try {
      const url = editingDonationId
  ? `http://localhost:3000/donations/${editingDonationId}`
  : "http://localhost:3000/donations";

const method = editingDonationId ? "PATCH" : "POST";

const response = await fetch(url, {
  method: method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    donorId: Number(donorId),
    fundId: 1,
    donationDate: donationDate,
    amount: amount,
    paymentMethod: paymentMethod,
    referenceNumber: referenceNumber.trim(),
    purpose: purpose.trim(),
    notes: notes.trim(),
  }),
});

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save donation");
        return;
      }

      alert(
        editingDonationId
            ? "Donation updated successfully"
            : "Donation saved successfully"
        );

      console.log(data);

      // Clear form
      setDonorId("");
      setDonationDate("");
      setAmount("");
      setPaymentMethod("");
      setReferenceNumber("");
      setPurpose("");
      setNotes("");

      // Go back to donation list
      setShowForm(false);
      setEditingDonationId(null);

      // Reload donations so the new donation appears
      loadDonations();
    } catch (error) {
      console.error("Error saving donation:", error);
      alert("Unable to connect to the backend");
    }
  };

  // Find donor name using donor ID
  const getDonorName = (donorId: number) => {
    const donor = donors.find((item) => item.id === donorId);

    if (!donor) {
      return "Unknown donor";
    }

    return `${donor.firstName} ${donor.lastName}`;
  };

  // Show donation form
  if (showForm) {
    return (
      <div className="add-donor-page">
        <div className="add-donor-header">
          <div>
            <h1>{editingDonationId ? "Edit Donation" : "Add Donation"}</h1>
            <p>
            {editingDonationId
                ? "Update donation details"
                : "Record a new donation"}
            </p>
          </div>
        </div>

        <div className="donor-form-box">

          {/* Donor */}
          <div className="full-width">
            <div className="form-group">
              <label>Donor</label>

              <select
                value={donorId}
                onChange={(event) => setDonorId(event.target.value)}
              >
                <option value="">Select a donor</option>

                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.firstName} {donor.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Amount */}
          <div className="form-row">

            <div className="form-group">
              <label>Donation Date</label>

              <input
              type="date"
              value={donationDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDonationDate(e.target.value)}
            />
            </div>

            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>

          </div>

          {/* Payment Method and Reference */}
          <div className="form-row">

            <div className="form-group">
              <label>Payment Method</label>

              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              >
                <option value="">Select a payment method</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="BANK_TRANSFER">
                  Bank Transfer
                </option>
                <option value="ONLINE">Online</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reference Number</label>

              <input
                type="text"
                placeholder="Enter reference number"
                value={referenceNumber}
                onChange={(event) =>
                  setReferenceNumber(event.target.value)
                }
              />
            </div>

          </div>

          {/* Purpose */}
          <div className="full-width">
            <div className="form-group">
              <label>Purpose</label>

              <input
                type="text"
                placeholder="Enter donation purpose"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="full-width">
            <div className="form-group">
              <label>Notes</label>

              <textarea
                placeholder="Enter notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons">

            <button
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
            className="save-donor-button"
            onClick={handleSubmit}
            >
            {editingDonationId ? "Update Donation" : "Save Donation"}
            </button>

          </div>

        </div>
      </div>
    );
  }

  // Donation list
  return (
    <div className="donations-page">

      <div className="donations-header">
        <div>
          <h1>Donations</h1>
          <p>Manage your donations</p>
        </div>

        <button
          className="add-donor-button"
          onClick={() => setShowForm(true)}
        >
          + Add Donation
        </button>
      </div>

      <div className="donations-box">

        <h2>Recent Donations</h2>

        <div className="donation-filters">

        {/* Donor Filter */}
        <select
          value={filterDonorId}
          onChange={(e) => setFilterDonorId(e.target.value)}
        >
          <option value="">All donors</option>

          {donors.map((donor) => (
            <option key={donor.id} value={donor.id}>
              {donor.firstName} {donor.lastName}
            </option>
          ))}
        </select>


        {/* From Date */}
        <input
          type="date"
          value={filterFromDate}
          onChange={(e) => setFilterFromDate(e.target.value)}
        />


        {/* To Date */}
        <input
          type="date"
          value={filterToDate}
          onChange={(e) => setFilterToDate(e.target.value)}
        />


        {/* Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="RECEIVED">Received</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>


        {/* Payment Method */}
        <select
          value={filterPaymentMethod}
          onChange={(e) => setFilterPaymentMethod(e.target.value)}
        >
          <option value="">All payment methods</option>
          <option value="CASH">Cash</option>
          <option value="CHEQUE">Cheque</option>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="ONLINE">Online</option>
          <option value="OTHER">Other</option>
        </select>

      </div>

        <div className="donation-list-header">
          <span>DONOR</span>
          <span>DATE</span>
          <span>AMOUNT</span>
          <span>PAYMENT</span>
          <span>REFERENCE</span>
          <span>ACTIONS</span>
        </div>

        {loadingDonations ? (
          <p className="donation-message">
            Loading donations...
          </p>
        ) : donations.length === 0 ? (
          <p className="donation-message">
            No donations yet.
          </p>
        ) : (
          donations.map((donation) => (
            <div className="donation-list-row" key={donation.id}>
  <span>{getDonorName(donation.donorId)}</span>

  <span>{donation.donationDate}</span>

  <span>${donation.amount}</span>

  <span>{donation.paymentMethod}</span>

  <span>{donation.referenceNumber}</span>

  <div className="donation-actions">
    <button
      className="view-donor-button"
      onClick={() => setSelectedDonationId(donation.id)}
    >
      View
    </button>

    <button
  className="edit-donor-button"
  onClick={() => {
    setEditingDonationId(donation.id);
    setDonorId(String(donation.donorId));
    setDonationDate(donation.donationDate);
    setAmount(donation.amount);
    setPaymentMethod(donation.paymentMethod);
    setReferenceNumber(donation.referenceNumber);
    setPurpose(donation.purpose);
    setNotes(donation.notes);
    setShowForm(true);
  }}
>
  Edit
</button>
  </div>
</div>
          ))
        )}

      </div>

         {/* Donation View Modal */}
    {selectedDonationId !== null && (
      <DonationViewModal
        donationId={selectedDonationId}
        onClose={() => setSelectedDonationId(null)}
      />
    )}

    </div>
  );
}

export default Donations;
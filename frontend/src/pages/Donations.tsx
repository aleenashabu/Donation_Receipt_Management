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
  const [donorId, setDonorId] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

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

    fetch("http://localhost:3000/donations")
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
  }, []);

  // Save donation
  const handleSubmit = async () => {
    if (
      !donorId ||
      !donationDate ||
      !amount ||
      !paymentMethod ||
      !referenceNumber.trim() ||
      !purpose.trim() ||
      !notes.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/donations", {
        method: "POST",
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

      alert("Donation saved successfully");

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
            <h1>Add Donation</h1>
            <p>Record a new donation</p>
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
                onChange={(event) =>
                  setDonationDate(event.target.value)
                }
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
              Save Donation
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

  <span>₹{donation.amount}</span>

  <span>{donation.paymentMethod}</span>

  <span>{donation.referenceNumber}</span>

  <div className="donation-actions">
    <button
      className="view-donor-button"
      onClick={() => setSelectedDonationId(donation.id)}
    >
      View
    </button>

    <button className="edit-donor-button">
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
import { useEffect, useState } from "react";

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

type Donor = {
  id: number;
  firstName: string;
  lastName: string;
};

function DonationViewModal({
  donationId,
  onClose,
}: {
  donationId: number;
  onClose: () => void;
}) {
  const [donation, setDonation] = useState<Donation | null>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/donations/${donationId}`)
      .then((response) => response.json())
      .then((data) => {
        setDonation(data.donation);
        setDonor(data.donor);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading donation:", error);
        setLoading(false);
      });
  }, [donationId]);

  if (loading) {
    return (
      <div className="donor-modal-overlay">
        <div className="donor-modal">
          <p>Loading donation...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="donor-modal-overlay" onClick={onClose}>
        <div
          className="donor-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <p>Donation not found.</p>

          <button
            className="cancel-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="donor-modal-overlay"
      onClick={onClose}
    >
      <div
        className="donor-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="donor-modal-header">
          <div>
            <h2>Donation Details</h2>

            <p>
              Reference: {donation.referenceNumber}
            </p>
          </div>

          <button
            className="donor-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Donation information */}
        <div className="donor-info-box">

          <h3>Donation Information</h3>

          <div className="donation-detail-row">
            <strong>Donor</strong>
            <span>
              {donor
                ? `${donor.firstName} ${donor.lastName}`
                : "Unknown donor"}
            </span>
          </div>

          <div className="donation-detail-row">
            <strong>Date</strong>
            <span>{donation.donationDate.slice(0, 10)}</span>
          </div>

          <div className="donation-detail-row">
            <strong>Amount</strong>
            <span>
              ${Number(donation.amount).toFixed(2)}
            </span>
          </div>

          <div className="donation-detail-row">
            <strong>Payment Method</strong>
            <span>{donation.paymentMethod}</span>
          </div>

          <div className="donation-detail-row">
            <strong>Reference Number</strong>
            <span>{donation.referenceNumber}</span>
          </div>

          <div className="donation-detail-row">
            <strong>Purpose</strong>
            <span>{donation.purpose}</span>
          </div>

          <div className="donation-detail-row">
            <strong>Notes</strong>
            <span>{donation.notes}</span>
          </div>

        </div>

        {/* Close button */}
        <div className="form-buttons">
          <button
            className="cancel-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default DonationViewModal;
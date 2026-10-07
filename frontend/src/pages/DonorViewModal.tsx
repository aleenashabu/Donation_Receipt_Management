import { useEffect, useState } from "react";

type Donor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isActive: boolean;
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
  status?: string;
};

function DonorViewModal({
  donor,
  onClose,
}: {
  donor: Donor;
  onClose: () => void;
}) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/donations")
      .then((response) => response.json())
      .then((data) => {
        const donorDonations = data.filter(
          (donation: Donation) => donation.donorId === donor.id
        );

        setDonations(donorDonations);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading donation history:", error);
        setLoading(false);
      });
  }, [donor.id]);

  const totalReceived = donations.reduce(
    (total, donation) => total + Number(donation.amount),
    0
  );

  const getFundName = (fundId: number) => {
    if (fundId === 1) {
      return "Community Care";
    }

    return `Fund ${fundId}`;
  };

  return (
    <div className="donor-modal-overlay" onClick={onClose}>
      <div
        className="donor-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="donor-modal-header">
          <div>
            <h2>
              {donor.firstName} {donor.lastName}
            </h2>

            <p>
              {donor.email} · {donor.phone}
            </p>
          </div>

          <button
            className="donor-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="donor-info-box">
          <h3>Address</h3>

          <p>
            {donor.address}, {donor.city}, {donor.province}{" "}
            {donor.postalCode}, {donor.country}
          </p>

          <div className="donor-summary">
            <strong>Status:</strong>{" "}
            {donor.isActive ? "Active" : "Inactive"}

            <span> · </span>

            <strong>Received:</strong> ₹{totalReceived.toFixed(2)}
          </div>
        </div>

        <h3 className="donation-history-title">
          Donation history
        </h3>

        {loading ? (
          <p className="donation-history-message">
            Loading donation history...
          </p>
        ) : donations.length === 0 ? (
          <p className="donation-history-message">
            No donations found.
          </p>
        ) : (
          <div className="donation-history-box">
            <div className="donation-history-header">
              <span>DATE</span>
              <span>AMOUNT</span>
              <span>FUND</span>
              <span>STATUS</span>
            </div>

            {donations.map((donation) => (
              <div
                className="donation-history-row"
                key={donation.id}
              >
                <span>{donation.donationDate}</span>

                <span>
                  ₹{Number(donation.amount).toFixed(2)}
                </span>

                <span>{getFundName(donation.fundId)}</span>

                <span>
                  <span className="donation-status">
                    {donation.status || "RECEIVED"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorViewModal;
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

function Donors({
  onAddDonor,
  onEditDonor,
  onDeactivateDonor,
}: {
  onAddDonor: () => void;
  onEditDonor: (donor: Donor) => void;
  onDeactivateDonor: (id: number) => Promise<boolean>;
}) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadDonors = () => {
  fetch("http://localhost:3000/donors")
    .then((response) => response.json())
    .then((data) => {
      setDonors(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error loading donors:", error);
      setLoading(false);
    });
};

useEffect(() => {
  loadDonors();
}, []);

  const filteredDonors = donors.filter((donor) => {
    const name = `${donor.firstName} ${donor.lastName}`.toLowerCase();

    return (
      name.includes(search.toLowerCase()) ||
      donor.email.toLowerCase().includes(search.toLowerCase()) ||
      donor.phone.includes(search)
    );
  });

  return (
    <div className="donors-page">

      {/* Header */}
      <div className="donors-header">
        <div>
          <h1>Donors</h1>
          <p>Manage your donors</p>
        </div>

        <button className="add-donor-button" onClick={onAddDonor}>
           Add Donor
        </button>
      </div>

      {/* Search */}
      <div className="donor-search">
        <input
          type="text"
          placeholder="Search donors..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Donor List */}
      <div className="donors-box">

        <div className="donor-list-header">
          <span>NAME</span>
          <span>EMAIL</span>
          <span>PHONE</span>
          <span>STATUS</span>
        </div>

        {loading ? (
          <p className="donor-message">Loading donors...</p>
        ) : filteredDonors.length === 0 ? (
          <p className="donor-message">No donors found.</p>
        ) : (
          filteredDonors.map((donor) => (
  <div className="donor-list-row" key={donor.id}>
  <span>
    {donor.firstName} {donor.lastName}
  </span>

  <span>{donor.email}</span>

  <span>{donor.phone}</span>

  <span>
    <span
      className={
        donor.isActive
          ? "donor-status active"
          : "donor-status inactive"
      }
    >
      {donor.isActive ? "Active" : "Inactive"}
    </span>
  </span>

  <button
    className="edit-donor-button"
    onClick={() => onEditDonor(donor)}
  >
    Edit
  </button>

  <button
  className="deactivate-donor-button"
  onClick={() => {
    if (
      window.confirm(
        `Are you sure you want to deactivate ${donor.firstName} ${donor.lastName}?`
      )
    ) {
      onDeactivateDonor(donor.id).then((success) => {
  if (success) {
    setDonors((currentDonors) =>
      currentDonors.map((currentDonor) =>
        currentDonor.id === donor.id
          ? { ...currentDonor, isActive: false }
          : currentDonor
      )
    );
  }
});
    }
  }}
>
  Deactivate
</button>

</div>
          ))
        )}

      </div>

    </div>
  );
}

export default Donors;
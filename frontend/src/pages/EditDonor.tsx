import { useState } from "react";

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

function EditDonor({
  donor,
  onCancel,
  onUpdate,
}: {
  donor: Donor;
  onCancel: () => void;
  onUpdate: () => void;
}) {
  const [firstName, setFirstName] = useState(donor.firstName);
  const [lastName, setLastName] = useState(donor.lastName);
  const [email, setEmail] = useState(donor.email);
  const [phone, setPhone] = useState(donor.phone);
  const [address, setAddress] = useState(donor.address);
  const [city, setCity] = useState(donor.city);
  const [province, setProvince] = useState(donor.province);
  const [postalCode, setPostalCode] = useState(donor.postalCode);
  const [country, setCountry] = useState(donor.country);

  const handleSubmit = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !province.trim() ||
      !postalCode.trim() ||
      !country.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/donors/${donor.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),
            province: province.trim(),
            postalCode: postalCode.trim(),
            country: country.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update donor");
        return;
      }

      alert("Donor updated successfully");

      onUpdate();
    } catch (error) {
      console.error("Error updating donor:", error);
      alert("Unable to connect to the backend");
    }
  };

  return (
    <div className="add-donor-page">
      <div className="add-donor-header">
        <div>
          <h1>Edit Donor</h1>
          <p>Update donor information</p>
        </div>
      </div>

      <div className="donor-form-box">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Province</label>
            <input
              type="text"
              value={province}
              onChange={(event) => setProvince(event.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            />
          </div>
        </div>

        <div className="form-buttons">
          <button
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="save-donor-button"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDonor;
import { useState } from "react";

function AddDonor() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

const handleSubmit = async () => {
  // Remove extra spaces
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim();
  const cleanPhone = phone.trim();
  const cleanAddress = address.trim();
  const cleanCity = city.trim();
  const cleanProvince = province.trim();
  const cleanPostalCode = postalCode.trim();
  const cleanCountry = country.trim();

  // Check required fields
  if (
    !cleanFirstName ||
    !cleanLastName ||
    !cleanEmail ||
    !cleanPhone ||
    !cleanAddress ||
    !cleanCity ||
    !cleanProvince ||
    !cleanPostalCode ||
    !cleanCountry
  ) {
    alert("Please fill in all fields");
    return;
  }

  // Email validation
  const emailPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu)$/;

  if (!emailPattern.test(cleanEmail)) {
    alert("Please enter a valid email address");
    return;
  }

  // Phone validation
  const phonePattern = /^\+?[0-9\s()-]{7,20}$/;

  if (!phonePattern.test(cleanPhone)) {
    alert("Please enter a valid phone number");
    return;
  }

  // Count only digits in the phone number
  const phoneDigits = cleanPhone.replace(/\D/g, "");

  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    alert("Phone number must contain 7 to 15 digits");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/donors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddress,
        city: cleanCity,
        province: cleanProvince,
        postalCode: cleanPostalCode,
        country: cleanCountry,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add donor");
      return;
    }

    alert("Donor added successfully");

    console.log(data);
  } catch (error) {
    console.error("Error adding donor:", error);
    alert("Unable to connect to the backend");
  }
};

  return (
    <div className="add-donor-page">

      <div className="add-donor-header">
        <div>
          <h1>Add Donor</h1>
          <p>Add a new donor to the system</p>
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
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Enter last name"
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
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter address"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label>Province</label>
            <input
              type="text"
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              placeholder="Enter province"
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
              placeholder="Enter postal code"
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder="Enter country"
            />
          </div>
        </div>

        <div className="form-buttons">
          <button className="cancel-button">
            Cancel
          </button>

          <button className="save-donor-button" onClick={handleSubmit}>
            Save Donor
          </button>
        </div>

      </div>

    </div>
  );
}

export default AddDonor;
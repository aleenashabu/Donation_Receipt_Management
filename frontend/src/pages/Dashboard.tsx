import { useState } from "react";
import Donors from "./Donors";
import AddDonor from "./AddDonor";
import EditDonor from "./EditDonor";

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

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <div className="sidebar">

        <div className="logo">
          <div className="heart">♥</div>
          <h2>Donation<span>Manager</span></h2>
        </div>

        <div className="menu">

          <div
            className={`menu-item ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => setCurrentPage("dashboard")}
          >
            📊 Dashboard
          </div>

          <div
            className={`menu-item ${currentPage === "donors" ? "active" : ""}`}
            onClick={() => setCurrentPage("donors")}
          >
            👥 Donors
          </div>

          <div className="menu-item">
            💰 Donations
          </div>

          <div className="menu-item">
            🎯 Funds
          </div>

        </div>

        <button className="logout-button" onClick={onLogout}>
          ↪ Log out
        </button>

      </div>


      {/* Main Content */}

      {currentPage === "dashboard" && (
        <div className="dashboard-content">

          <div className="dashboard-header">

            <div>
              <h1>Dashboard</h1>
              <p>Donation management system</p>
            </div>

            <p className="signed-in">
              Signed in as <strong>User</strong>
            </p>

          </div>


          {/* Summary Cards */}
          <div className="summary-cards">

            <div className="summary-card">
              <p>Total received</p>
              <h2>$0.00</h2>
            </div>

            <div className="summary-card">
              <p>Total donations</p>
              <h2>0</h2>
            </div>

            <div className="summary-card">
              <p>Active donors</p>
              <h2>0</h2>
            </div>

            <div className="summary-card">
              <p>Pending</p>
              <h2>0</h2>
            </div>

          </div>


          {/* Bottom Sections */}
          <div className="dashboard-sections">

            <div className="dashboard-box">

              <h2>Donation status</h2>

              <div className="status-row">
                <span className="status received">RECEIVED</span>
                <strong>0</strong>
              </div>

              <div className="status-row">
                <span className="status pending">PENDING</span>
                <strong>0</strong>
              </div>

              <div className="status-row">
                <span className="status cancelled">CANCELLED</span>
                <strong>0</strong>
              </div>

              <div className="status-row">
                <span className="status refunded">REFUNDED</span>
                <strong>0</strong>
              </div>

            </div>


            <div className="dashboard-box">

              <div className="recent-header">
                <h2>Recent donations</h2>
                <button>View all</button>
              </div>

              <div className="donation-header">
                <span>DONOR</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
              </div>

              <p className="no-donations">
                No donations yet
              </p>

            </div>

          </div>

        </div>
      )}


      {/* Donors Page */}

      {currentPage === "donors" && (
  <div className="dashboard-content">
    <Donors
  onAddDonor={() => setCurrentPage("add-donor")}
  onEditDonor={(donor) => {
    setSelectedDonor(donor);
    setCurrentPage("edit-donor");
  }}
  onDeactivateDonor={async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/donors/${id}/deactivate`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to deactivate donor");
        return false;
      }

      alert("Donor deactivated successfully");

      return true;
    } catch (error) {
      console.error("Error deactivating donor:", error);
      alert("Unable to connect to the backend");
      return false;
    }
  }}
/>
  </div>
)}

{currentPage === "add-donor" && (
  <div className="dashboard-content">
    <AddDonor onCancel={() => setCurrentPage("donors")} />
  </div>
)}

{currentPage === "edit-donor" && selectedDonor && (
  <div className="dashboard-content">
    <EditDonor
      donor={selectedDonor}
      onCancel={() => setCurrentPage("donors")}
      onUpdate={() => setCurrentPage("donors")}
    />
  </div>
)}

    </div>
  );
}

export default Dashboard;
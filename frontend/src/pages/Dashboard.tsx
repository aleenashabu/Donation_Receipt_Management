import { useState,useEffect } from "react";
import Donors from "./Donors";
import AddDonor from "./AddDonor";
import EditDonor from "./EditDonor";
import Donations from "./Donations";

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
  const [dashboardData, setDashboardData] = useState({
  totalDonations: "0.00",
  donationCount: 0,
  currentMonthTotal: "0.00",
});

const [loading, setLoading] = useState(true);
const [monthlySummary, setMonthlySummary] = useState<
  {
    month: string;
    donationCount: number;
    totalAmount: string;
  }[]
>([]);

useEffect(() => {
  fetch("http://localhost:3000/dashboard")
    .then((response) => response.json())
    .then((data) => {
      setDashboardData(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    });

  fetch("http://localhost:3000/dashboard/monthly-summary")
    .then((response) => response.json())
    .then((data) => {
      setMonthlySummary(data);
    })
    .catch((error) => {
      console.error("Error loading monthly summary:", error);
    });
}, []);

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

          <div className={`menu-item ${currentPage === "donations" ? "active" : ""}`} onClick={() => setCurrentPage("donations")}>
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
    <h2>
      {loading
        ? "Loading..."
        : `$${dashboardData.totalDonations}`}
    </h2>
  </div>

  <div className="summary-card">
    <p>Total donations</p>
    <h2>
      {loading
        ? "Loading..."
        : dashboardData.donationCount}
    </h2>
  </div>

  <div className="summary-card">
    <p>This month</p>
    <h2>
      {loading
        ? "Loading..."
        : `$${dashboardData.currentMonthTotal}`}
    </h2>
  </div>

  <div className="summary-card">
    <p>Active donors</p>
    <h2>0</h2>
  </div>

</div>


          {/* Bottom Sections */}
{/* Donations by Month */}
<div className="dashboard-box monthly-summary-box">

  <h2>Donations by Month</h2>

  {monthlySummary.length === 0 ? (
    <p className="no-donations">
      No monthly donation data available.
    </p>
  ) : (
    <div className="monthly-table">

      <div className="monthly-table-header">
        <span>MONTH</span>
        <span>DONATION COUNT</span>
        <span>TOTAL AMOUNT</span>
      </div>

      {monthlySummary.map((item) => (
        <div
          className="monthly-table-row"
          key={item.month}
        >
          <span>
            {new Date(`${item.month}-01`).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>{item.donationCount}</span>
          <span>${item.totalAmount}</span>
        </div>
      ))}

    </div>
  )}

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

{currentPage === "donations" && (
  <div className="dashboard-content">
    <Donations />
  </div>
)}

    </div>
  );
}

export default Dashboard;
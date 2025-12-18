import React from "react";
import { useSelector } from "react-redux";
import { useGetPartnerProfileQuery } from "../../Redux/partners.api";
import { useLogoutAssociateMutation } from "../../Redux/user.api";
import { FiLogOut, FiMail, FiPhone, FiMapPin, FiCalendar, FiFileText, FiDownload } from "react-icons/fi";
import { MdBusinessCenter, MdLocationOn, MdAttachMoney } from "react-icons/md";

const PartnerDashboard = () => {
  const auth = useSelector((state) => state.associatePartner.user);
  const partnerId = auth?._id;

  const { data, isLoading, isError, error } = useGetPartnerProfileQuery(
    partnerId,
    { skip: !partnerId }
  );

  const [logoutApi] = useLogoutAssociateMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      alert("Logged out successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <h2 style={{ color: '#555' }}>Loading profile...</h2>
      </div>
    </div>
  );
  
  if (isError) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
      <h2>Error loading profile</h2>
      <p>{error?.data?.message || 'Please try again later'}</p>
    </div>
  );

  const profile = data?.profile;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        paddingBottom: "20px",
        borderBottom: "1px solid #e1e5eb",
        marginBottom: "30px"
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: "#2c3e50",
            fontSize: "28px",
            fontWeight: "600"
          }}>
            Partner Dashboard
          </h1>
          <p style={{ margin: "5px 0 0 0", color: "#7f8c8d", fontSize: "14px" }}>
            Welcome back, {profile?.name}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #ff4d4d 0%, #e74c3c 100%)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(231, 76, 60, 0.2)"
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
        {/* Left Column - Profile Card */}
        <div>
          
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            padding: "25px",
            color: "white",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "15px",
              marginBottom: "20px"
            }}>
              <div style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "bold"
              }}>
                {profile?.name?.charAt(0) || "P"}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px" }}>{profile?.name}</h2>
                <p style={{ 
                  margin: "5px 0 0 0", 
                  opacity: 0.9,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <MdBusinessCenter /> {profile?.role}
                </p>
              </div>
              
            </div>

            <div style={{ marginTop: "25px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <FiMail style={{ opacity: 0.8 }} />
                <span style={{ fontSize: "14px" }}>{profile?.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FiPhone style={{ opacity: 0.8 }} />
                <span style={{ fontSize: "14px" }}>{profile?.mobile}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ 
            marginTop: "20px",
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>Project Overview</h3>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "15px",
              marginBottom: "20px"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  background: "#e8f4fc",
                  borderRadius: "10px",
                  padding: "15px",
                  height: "100%"
                }}>
                  <div style={{ 
                    fontSize: "24px", 
                    fontWeight: "bold",
                    color: "#3498db",
                    marginBottom: "5px"
                  }}>
                    {profile?.capacity?.ac || "N/A"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#7f8c8d", fontWeight: "600" }}>
                    Capacity (AC)
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  background: "#f0f7f0",
                  borderRadius: "10px",
                  padding: "15px",
                  height: "100%"
                }}>
                  <div style={{ 
                    fontSize: "24px", 
                    fontWeight: "bold",
                    color: "#27ae60",
                    marginBottom: "5px"
                  }}>
                    {profile?.distanceFromSubstation || "N/A"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#7f8c8d", fontWeight: "600" }}>
                    Distance (km)
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px"
            }}>
              <MdAttachMoney style={{ color: "#f39c12", fontSize: "20px" }} />
              <div>
                <div style={{ fontSize: "13px", color: "#7f8c8d" }}>Tariff Expected</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#2c3e50" }}>
                  {profile?.tariffExpected || "N/A"}
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "10px"
            }}>
              <FiFileText style={{ color: "#9b59b6", fontSize: "20px" }} />
              <div>
                <div style={{ fontSize: "13px", color: "#7f8c8d" }}>Farm Status</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#2c3e50" }}>
                  {profile?.statusOfFarm || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Project Details Card */}
          <div style={{ 
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: "25px"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h2 style={{ margin: 0, color: "#2c3e50" }}>Project Details</h2>
              <span style={{
                background: "#e8f4fc",
                color: "#3498db",
                padding: "5px 15px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                {profile?.projectName || "No Project Name"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Location Section */}
              <div>
                <h3 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#2c3e50",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <MdLocationOn style={{ color: "#e74c3c" }} /> Location
                </h3>
                <div style={{ 
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "10px",
                  height: "100%"
                }}>
                  <DetailRow label="Address" value={profile?.location?.address} />
                  <DetailRow label="District" value={profile?.location?.district} />
                  <DetailRow label="Taluka" value={profile?.location?.taluka} />
                  <DetailRow 
                    label="Coordinates" 
                    value={profile?.location?.coordinates ? 
                      `${profile.location.coordinates.lat}, ${profile.location.coordinates.lng}` : 
                      "N/A"
                    }
                  />
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#2c3e50",
                  fontSize: "16px"
                }}>
                  Technical Details
                </h3>
                <div style={{ 
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "10px",
                  height: "100%"
                }}>
                  <DetailRow 
                    label="Substation" 
                    value={profile?.substation ? 
                      `${profile.substation.substation} (${profile.substation.category})` : 
                      "N/A"
                    }
                  />
                  <DetailRow label="Land Ownership" value={profile?.landOwnership} />
                  <DetailRow label="Regulatory Status" value={profile?.regulatoryStatus} />
                  <DetailRow label="Loan Status" value={profile?.statusOfLoan} />
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div style={{ marginTop: "25px" }}>
              <h3 style={{ 
                margin: "0 0 15px 0", 
                color: "#2c3e50",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <FiCalendar style={{ color: "#3498db" }} /> Timeline
              </h3>
              <div style={{ 
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "10px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "15px"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>EPC Start</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>
                    {profile?.expectedCommissioningTimeline?.epcWorkStartDate || "N/A"}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>Injection Date</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>
                    {profile?.expectedCommissioningTimeline?.injectionDate || "N/A"}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>Commercial Ops</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>
                    {profile?.expectedCommissioningTimeline?.commercialOperationsDate || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Card */}
          {profile?.landDocument?.fileUrl && (
            <div style={{ 
              background: "#fff",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#2c3e50" }}>Documents</h3>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
                padding: "20px",
                borderRadius: "10px",
                border: "1px dashed #d1c7ba"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    background: "#fff",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    <FiFileText style={{ fontSize: "24px", color: "#e67e22" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "5px" }}>
                      Land Document
                    </div>
                    <div style={{ fontSize: "13px", color: "#7f8c8d" }}>
                      Click to view/download
                    </div>
                  </div>
                </div>
                <a
                  href={profile.landDocument.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "10px 20px",
                    background: "#3498db",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#2980b9";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#3498db";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <FiDownload /> View Document
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 2fr"] {
            grid-template-columns: 1fr !important;
          }
          
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          
          div[style*="grid-template-columns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// Reusable Detail Row Component
const DetailRow = ({ label, value }) => (
  <div style={{ marginBottom: "12px" }}>
    <div style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "4px" }}>
      {label}
    </div>
    <div style={{ 
      fontSize: "14px", 
      fontWeight: "600",
      color: "#2c3e50",
      wordBreak: "break-word"
    }}>
      {value || "Not provided"}
    </div>
  </div>
);

export default PartnerDashboard;
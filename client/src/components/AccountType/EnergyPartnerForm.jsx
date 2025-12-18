import React, { useState, useEffect } from "react";
import LocationPickerModal from "./LocationPickerModal";
import ViewAllLocationsModal from "./ViewAllLocationsModal";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// RTK QUERY API
import {
  useGetMsedclSubstationsQuery,
  useGetMsetclSubstationsQuery,
} from "../../Redux/substations.api";
import { useRegisterPartnerMutation } from "../../Redux/user.api";

const EnergyPartnerForm = () => {
  const navigate = useNavigate();
  const [openPicker, setOpenPicker] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});

  const [companyType, setCompanyType] = useState("");
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [stations, setStations] = useState([]);
  const [rawSubstations, setRawSubstations] = useState([]);

  const [registerPartner] = useRegisterPartnerMutation();

  const { data: msedclData, isSuccess: okMsedcl } =
    useGetMsedclSubstationsQuery(undefined, { skip: companyType !== "MSEDCL" });

  const { data: msetclData, isSuccess: okMsetcl } =
    useGetMsetclSubstationsQuery(undefined, { skip: companyType !== "MSETCL" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    projectName: "",
    location: {
      address: "",
      taluka: "",
      district: "",
      state: "",
      coordinates: { lat: "", lng: "" },
    },
    capacity: { ac: "", dc: "" },
    substation: { district: "", taluka: "", substation: "" },
    distanceFromSubstation: "",
    landOwnership: "",
    landDocument: null,
    statusOfFarm: "",
    statusOfLoan: "",
    regulatoryStatus: "",
    tariffExpected: "",
    expectedCommissioningTimeline: {
      epcWorkStartDate: "",
      injectionDate: "",
      commercialOperationsDate: "",
    },
  });

  /* -----------------------------------------------
      VALIDATION FUNCTIONS
  ----------------------------------------------- */
  const validatephone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateNumber = (value) => {
    if (value === "") return true;
    const numRegex = /^\d*\.?\d*$/;
    return numRegex.test(value);
  };

  const validateDate = (date) => {
    if (!date || date.trim() === "") return true;

    // Check DD/MM/YYYY format
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) return false;

    const parts = date.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Basic validation
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    return true;
  };

  const formatDateInput = (value) => {
    // Remove all non-digits
    let cleaned = value.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }

    // Format as DD/MM/YYYY
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    } else {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(
        4,
        8
      )}`;
    }
  };

  /* -----------------------------------------------
      HANDLE CHANGE WITH VALIDATION
  ----------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    // phone: only allow 10 digits
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "");
      if (phoneValue.length <= 10) {
        processedValue = phoneValue;
      } else {
        return;
      }
    }

    // Capacity fields: only numbers and decimal
    if (
      name === "capacity.ac" ||
      name === "capacity.dc" ||
      name === "distanceFromSubstation" ||
      name === "tariffExpected"
    ) {
      if (!validateNumber(value)) {
        return;
      }
      processedValue = value;
    }

    // Date fields: auto-format
    if (name.includes("expectedCommissioningTimeline")) {
      processedValue = formatDateInput(value);
    }

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Original logic unchanged
    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [p, c] = parts;
        setFormData((prev) => ({ ...prev, [p]: { ...prev[p], [c]: processedValue } }));
      } else if (parts.length === 3) {
        const [p, c, s] = parts;
        setFormData((prev) => ({
          ...prev,
          [p]: { ...prev[p], [c]: { ...prev[p][c], [s]: processedValue } },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: processedValue }));
    }
  };

  /* -----------------------------------------------
      FILE UPLOAD
  ----------------------------------------------- */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((p) => ({ ...p, landDocument: { file } }));
  };

  /* -----------------------------------------------
      SUBSTATION LOGIC
  ----------------------------------------------- */
  const handleCompanySelect = (e) => {
    const comp = e.target.value;
    setCompanyType(comp);

    setDistricts([]);
    setTalukas([]);
    setStations([]);
    setRawSubstations([]);

    setFormData((prev) => ({
      ...prev,
      substation: { district: "", taluka: "", substation: "" },
    }));
  };

  useEffect(() => {
    setTalukas([]);
    setStations([]);

    if (companyType === "MSEDCL" && okMsedcl && Array.isArray(msedclData)) {
      const normalized = msedclData.map((x) => ({
        district: x.district,
        taluka: x.taluka,
        substation: x.substation,
      }));

      setRawSubstations(normalized);
      setDistricts([...new Set(normalized.map((x) => x.district))]);
      return;
    }

    if (companyType === "MSETCL" && okMsetcl && Array.isArray(msetclData)) {
      const normalized = msetclData.map((x) => ({
        district: x.District || "",
        taluka: "",
        substation: x.Substation || "",
      }));

      setRawSubstations(normalized);
      setDistricts([...new Set(normalized.map((x) => x.district))]);
      return;
    }
  }, [companyType, okMsedcl, okMsetcl, msedclData, msetclData]);

  const handleDistrictSelect = (e) => {
    const district = e.target.value;

    setFormData((prev) => ({
      ...prev,
      substation: { district, taluka: "", substation: "" },
    }));

    if (!district) {
      setTalukas([]);
      setStations([]);
      return;
    }

    if (companyType === "MSETCL") {
      const filteredStations = rawSubstations
        .filter((x) => x.district === district)
        .map((x) => x.substation);

      setTalukas([]);
      setStations(filteredStations);
      return;
    }

    const filteredTalukas = [
      ...new Set(
        rawSubstations
          .filter((x) => x.district === district)
          .map((x) => x.taluka)
      ),
    ];

    setTalukas(filteredTalukas);
  };

  const handleTalukaSelect = (e) => {
    const taluka = e.target.value;

    setFormData((prev) => ({
      ...prev,
      substation: { ...prev.substation, taluka, substation: "" },
    }));

    const filteredStations = rawSubstations
      .filter((x) => x.taluka === taluka)
      .map((x) => x.substation);

    setStations(filteredStations);
  };

  const handleStationSelect = (e) => {
    setFormData((prev) => ({
      ...prev,
      substation: { ...prev.substation, substation: e.target.value },
    }));
  };

  /* -----------------------------------------------
      LOCATION HANDLING
  ----------------------------------------------- */
  const handleSaveLocation = (loc) => {
    setLocations((prev) => {
      const next = [...prev, loc];
      if (next.length === 1) mapLocationToForm(next[0]);
      return next;
    });
    setOpenPicker(false);

    // Toast notification for location added
    toast.success("Location added successfully!", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#28b8b4",
        color: "#fff",
      },
    });
  };

  const mapLocationToForm = (loc) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        address: loc.address || "",
        taluka: loc.taluka || "",
        district: loc.district || "",
        state: loc.state || "",
        coordinates: {
          lat: loc.lat ? Number(loc.lat) : "",
          lng: loc.lng ? Number(loc.lng) : "",
        },
      },
    }));
  };

  /* -----------------------------------------------
      FORM VALIDATION
  ----------------------------------------------- */
  const validateIndividualForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    // phone validation
    if (!formData.phone) {
      newErrors.phone = "phone number is required";
    } else if (!validatephone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    // Email validation (if provided)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!formData.capacity.ac) {
      newErrors["capacity.ac"] = "AC capacity is required";
    } else if (!validateNumber(formData.capacity.ac)) {
      newErrors["capacity.ac"] = "Please enter a valid number";
    }

    if (formData.capacity.dc && !validateNumber(formData.capacity.dc)) {
      newErrors["capacity.dc"] = "Please enter a valid number";
    }

    // Distance validation
    if (formData.distanceFromSubstation && !validateNumber(formData.distanceFromSubstation)) {
      newErrors.distanceFromSubstation = "Please enter a valid number";
    }

    // Tariff validation
    if (formData.tariffExpected && !validateNumber(formData.tariffExpected)) {
      newErrors.tariffExpected = "Please enter a valid number";
    }

    // Date validation
    if (
      formData.expectedCommissioningTimeline.epcWorkStartDate &&
      !validateDate(formData.expectedCommissioningTimeline.epcWorkStartDate)
    ) {
      newErrors["expectedCommissioningTimeline.epcWorkStartDate"] =
        "Please enter date in DD/MM/YYYY format";
    }

    if (
      formData.expectedCommissioningTimeline.injectionDate &&
      !validateDate(formData.expectedCommissioningTimeline.injectionDate)
    ) {
      newErrors["expectedCommissioningTimeline.injectionDate"] =
        "Please enter date in DD/MM/YYYY format";
    }

    if (
      formData.expectedCommissioningTimeline.commercialOperationsDate &&
      !validateDate(formData.expectedCommissioningTimeline.commercialOperationsDate)
    ) {
      newErrors["expectedCommissioningTimeline.commercialOperationsDate"] =
        "Please enter date in DD/MM/YYYY format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -----------------------------------------------
      SUBMIT HANDLERS
  ----------------------------------------------- */
  const handleIndividualSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateIndividualForm()) {
      toast.error("Please fix the errors in the form", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ff6b6b",
          color: "#fff",
        },
      });
      return;
    }

    const loadingToast = toast.loading("Submitting your registration...", {
      position: "top-right",
    });

    const fd = new FormData();

    // BASIC - Original logic unchanged
    Object.entries({
      name: formData.name,
      email: formData.email,
      mobile: formData.phone,
      address: formData.address,
      password: formData.password,
      projectName: formData.projectName,
      distanceFromSubstation: formData.distanceFromSubstation,
      landOwnership: formData.landOwnership,
      statusOfFarm: formData.statusOfFarm,
      statusOfLoan: formData.statusOfLoan,
      regulatoryStatus: formData.regulatoryStatus,
      tariffExpected: formData.tariffExpected,
    }).forEach(([k, v]) => fd.append(k, v));

    fd.append("location", JSON.stringify(formData.location));
    fd.append("capacity", JSON.stringify(formData.capacity));

    fd.append(
      "substation",
      JSON.stringify({
        category: companyType,
        district: formData.substation.district,
        taluka: companyType === "MSEDCL" ? formData.substation.taluka : "",
        substation: formData.substation.substation,
      })
    );

    fd.append(
      "expectedCommissioningTimeline",
      JSON.stringify(formData.expectedCommissioningTimeline)
    );

    if (formData.landDocument?.file) {
      fd.append("landDocument", formData.landDocument?.file);
      fd.append("landDocument.fileType", formData.landOwnership);
    }

    try {
      const res = await registerPartner(fd).unwrap();
      console.log("SUCCESS:", res);

      toast.dismiss(loadingToast);
      toast.success("Partner Registered Successfully! 🎉", {
        duration: 5000,
        position: "top-right",
        style: {
          background: "#28b8b4",
          color: "#fff",
        },
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        projectName: "",
        location: {
          address: "",
          taluka: "",
          district: "",
          state: "",
          coordinates: { lat: "", lng: "" },
        },
        capacity: { ac: "", dc: "" },
        substation: { district: "", taluka: "", substation: "" },
        distanceFromSubstation: "",
        landOwnership: "",
        landDocument: null,
        statusOfFarm: "",
        statusOfLoan: "",
        regulatoryStatus: "",
        tariffExpected: "",
        expectedCommissioningTimeline: {
          epcWorkStartDate: "",
          injectionDate: "",
          commercialOperationsDate: "",
        },
      });
      setLocations([]);
      setCompanyType("");
      setErrors({});
    } catch (err) {
      console.log("ERROR:", err);
      toast.dismiss(loadingToast);
      toast.error("Something went wrong! Please try again.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ff6b6b",
          color: "#fff",
        },
      });
    }
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#28b8b4",
            },
          },
          error: {
            style: {
              background: "#ff6b6b",
            },
          },
        }}
      />

      <div
        className="energy-partner-container"
        style={{
          backgroundColor: "#fff8f5",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <div
          className="energy-form-wrapper"
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
    <div
  className="energy-form-header"
  style={{
    background: "linear-gradient(135deg, #2c58a2, #1f3f78)",
    color: "white",
    padding: "28px 25px",
    borderRadius: "10px 10px 0 0",
    textAlign: "center",
    marginBottom: "20px",
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: "28px",
      fontWeight: "600",
      letterSpacing: "0.6px",
    }}
  >
    Energy Partner Registration
  </h1>

  
  {/* LOGIN LINE */}
  <p
    style={{
      marginTop: "14px",
      fontSize: "14px",
      opacity: "0.95",
    }}
  >
    Already have an account?{" "}
<button
  onClick={() =>
    navigate("/Userlogin", {
      state: { loginType: "partner" },
    })
  }
  style={{
    background: "linear-gradient(135deg, #ffd966, #ffcc33)",
    color: "#1f3f78",
    fontWeight: "600",
    fontSize: "14px",
    padding: "10px 22px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(255, 217, 102, 0.4)",
    transition: "all 0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow =
      "0 6px 16px rgba(255, 217, 102, 0.55)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 4px 12px rgba(255, 217, 102, 0.4)";
  }}
>
  Login here →
</button>

  </p>
</div>



          {/* INDIVIDUAL FORM ONLY */}
          <div
            className="energy-form-card"
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 5px 20px rgba(44, 88, 162, 0.1)",
              padding: "30px",
              border: "1px solid #e8e8e8",
            }}
          >
            <form onSubmit={handleIndividualSubmit}>
              {/* BASIC DETAILS */}
              <div
                className="form-section"
                style={{
                  marginBottom: "30px",
                  paddingBottom: "25px",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                <h2
                  style={{
                    color: "#2c58a2",
                    fontSize: "20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#2c58a2",
                      color: "white",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    1
                  </span>
                  Personal Details
                </h2>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -10px" }}>
                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "20px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      className="form-input"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors.name ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.name && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "20px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Email
                    </label>
                    <input
                      className="form-input"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors.email ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.email && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "20px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      phone Number *
                    </label>
                    <input
                      className="form-input"
                      name="phone"
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors.phone ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.phone && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "20px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Address
                    </label>
                    <input
                      className="form-input"
                      name="address"
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "20px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Password *
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors.password ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.password && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 100%", padding: "0 10px", marginBottom: "20px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Project Name (SPV) *
                    </label>
                    <input
                      className="form-input"
                      name="projectName"
                      placeholder="Enter project name"
                      value={formData.projectName}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors.projectName ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.projectName && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors.projectName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div
                className="form-section"
                style={{
                  marginBottom: "30px",
                  paddingBottom: "25px",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{
                      color: "#2c58a2",
                      fontSize: "20px",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#2c58a2",
                        color: "white",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                      }}
                    >
                      2
                    </span>
                    Project Location
                  </h2>
                  <button
                    type="button"
                    className="location-btn"
                    onClick={() => setOpenPicker(true)}
                    style={{
                      backgroundColor: "#28b8b4",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "6px",
                      fontWeight: "500",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  >
                    + Add Location
                  </button>
                </div>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -10px" }}>
                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Address
                    </label>
                    <input
                      className="form-input"
                      name="location.address"
                      placeholder="Project address"
                      value={formData.location.address}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      District
                    </label>
                    <input
                      className="form-input"
                      name="location.district"
                      placeholder="District"
                      value={formData.location.district}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Taluka
                    </label>
                    <input
                      className="form-input"
                      name="location.taluka"
                      placeholder="Taluka"
                      value={formData.location.taluka}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      State
                    </label>
                    <input
                      className="form-input"
                      name="location.state"
                      placeholder="State"
                      value={formData.location.state}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Latitude
                    </label>
                    <input
                      className="form-input"
                      name="location.coordinates.lat"
                      placeholder="e.g., 19.0760"
                      value={formData.location.coordinates.lat}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Longitude
                    </label>
                    <input
                      className="form-input"
                      name="location.coordinates.lng"
                      placeholder="e.g., 72.8777"
                      value={formData.location.coordinates.lng}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CAPACITY */}
              <div
                className="form-section"
                style={{
                  marginBottom: "30px",
                  paddingBottom: "25px",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                <h2
                  style={{
                    color: "#2c58a2",
                    fontSize: "20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#2c58a2",
                      color: "white",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    3
                  </span>
                  Power Capacity
                </h2>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -10px" }}>
                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      AC Capacity (MW) *
                    </label>
                    <input
                      className="form-input"
                      name="capacity.ac"
                      placeholder="AC capacity in MW (numbers only)"
                      value={formData.capacity.ac}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors["capacity.ac"] ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors["capacity.ac"] && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors["capacity.ac"]}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      DC Capacity (MWp)
                    </label>
                    <input
                      className="form-input"
                      name="capacity.dc"
                      placeholder="DC capacity in MWp (numbers only)"
                      value={formData.capacity.dc}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors["capacity.dc"] ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors["capacity.dc"] && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors["capacity.dc"]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SUBSTATION */}
              <div
                className="form-section"
                style={{
                  marginBottom: "30px",
                  paddingBottom: "25px",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                <h2
                  style={{
                    color: "#2c58a2",
                    fontSize: "20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#2c58a2",
                      color: "white",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    4
                  </span>
                  Substation Details
                </h2>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Company Type
                  </label>
                  <select
                    className="form-select"
                    value={companyType}
                    onChange={handleCompanySelect}
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "15px",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">Select Company</option>
                    <option value="MSEDCL">MSEDCL</option>
                    <option value="MSETCL">MSETCL</option>
                  </select>
                </div>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -10px" }}>
                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      District
                    </label>
                    <select
                      className="form-select"
                      value={formData.substation.district}
                      onChange={handleDistrictSelect}
                      disabled={!districts.length}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Select District</option>
                      {districts.map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {companyType === "MSEDCL" && (
                    <div
                      className="form-group"
                      style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                    >
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          color: "#333",
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        Taluka
                      </label>
                      <select
                        className="form-select"
                        value={formData.substation.taluka}
                        onChange={handleTalukaSelect}
                        disabled={!talukas.length}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          fontSize: "15px",
                          transition: "all 0.3s",
                          boxSizing: "border-box",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="">Select Taluka</option>
                        {talukas.map((t, i) => (
                          <option key={i} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div
                    className="form-group"
                    style={{ flex: "1 1 100%", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Substation
                    </label>
                    <select
                      className="form-select"
                      value={formData.substation.substation}
                      onChange={handleStationSelect}
                      disabled={!stations.length}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Select Substation</option>
                      {stations.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* LAND OWNERSHIP */}
              <div
                className="form-section"
                style={{
                  marginBottom: "30px",
                  paddingBottom: "25px",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                <h2
                  style={{
                    color: "#2c58a2",
                    fontSize: "20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#2c58a2",
                      color: "white",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    5
                  </span>
                  Land Details
                </h2>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -10px" }}>
                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Land Ownership
                    </label>
                    <select
                      className="form-select"
                      name="landOwnership"
                      value={formData.landOwnership}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Select</option>
                      <option value="OWN">OWN (7/12)</option>
                      <option value="LEASE">LEASE</option>
                    </select>
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Distance from Substation (km)
                    </label>
                    <input
                      className="form-input"
                      name="distanceFromSubstation"
                      placeholder="Distance in km (numbers only)"
                      value={formData.distanceFromSubstation}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors.distanceFromSubstation
                          ? "1px solid #ff6b6b"
                          : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.distanceFromSubstation && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors.distanceFromSubstation}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 100%", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Land Document
                    </label>
                    <input
                      className="form-input"
                      type="file"
                      onChange={handleFileUpload}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div
                className="form-section"
                style={{
                  marginBottom: "30px",
                  paddingBottom: "25px",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                <h2
                  style={{
                    color: "#2c58a2",
                    fontSize: "20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#2c58a2",
                      color: "white",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    6
                  </span>
                  Project Status
                </h2>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -10px" }}>
                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Farm/Park
                    </label>
                    <select
                      className="form-select"
                      name="statusOfFarm"
                      value={formData.statusOfFarm}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Farm/Park</option>
                      <option value="FARM">FARM</option>
                      <option value="PARK">PARK</option>
                    </select>
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Loan Type
                    </label>
                    <select
                      className="form-select"
                      name="statusOfLoan"
                      value={formData.statusOfLoan}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Loan Type</option>
                      <option value="SELF">Self</option>
                      <option value="BANK">Bank</option>
                    </select>
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Regulatory Status
                    </label>
                    <select
                      className="form-select"
                      name="regulatoryStatus"
                      value={formData.regulatoryStatus}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Regulatory Status</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Tariff Expected (₹/kWh)
                    </label>
                    <input
                      className="form-input"
                      name="tariffExpected"
                      placeholder="Expected tariff (numbers only)"
                      value={formData.tariffExpected}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors.tariffExpected ? "1px solid #ff6b6b" : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.tariffExpected && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors.tariffExpected}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="form-section" style={{ marginBottom: "30px" }}>
                <h2
                  style={{
                    color: "#2c58a2",
                    fontSize: "20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#2c58a2",
                      color: "white",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    7
                  </span>
                  Project Timeline
                </h2>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -10px" }}>
                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      EPC Start Date
                    </label>
                    <input
                      className="form-input"
                      name="expectedCommissioningTimeline.epcWorkStartDate"
                      placeholder="DD/MM/YYYY"
                      value={formData.expectedCommissioningTimeline.epcWorkStartDate}
                      onChange={handleChange}
                      maxLength="10"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors["expectedCommissioningTimeline.epcWorkStartDate"]
                          ? "1px solid #ff6b6b"
                          : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors["expectedCommissioningTimeline.epcWorkStartDate"] && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors["expectedCommissioningTimeline.epcWorkStartDate"]}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Injection Date
                    </label>
                    <input
                      className="form-input"
                      name="expectedCommissioningTimeline.injectionDate"
                      placeholder="DD/MM/YYYY"
                      value={formData.expectedCommissioningTimeline.injectionDate}
                      onChange={handleChange}
                      maxLength="10"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors["expectedCommissioningTimeline.injectionDate"]
                          ? "1px solid #ff6b6b"
                          : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors["expectedCommissioningTimeline.injectionDate"] && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors["expectedCommissioningTimeline.injectionDate"]}
                      </div>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ flex: "1 1 300px", padding: "0 10px", marginBottom: "15px" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Commercial Operations Date
                    </label>
                    <input
                      className="form-input"
                      name="expectedCommissioningTimeline.commercialOperationsDate"
                      placeholder="DD/MM/YYYY"
                      value={formData.expectedCommissioningTimeline.commercialOperationsDate}
                      onChange={handleChange}
                      maxLength="10"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: errors["expectedCommissioningTimeline.commercialOperationsDate"]
                          ? "1px solid #ff6b6b"
                          : "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "15px",
                        transition: "all 0.3s",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors["expectedCommissioningTimeline.commercialOperationsDate"] && (
                      <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "5px" }}>
                        {errors["expectedCommissioningTimeline.commercialOperationsDate"]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="submit-section">
                <button
                  type="submit"
                  className="submit-btn"
                  style={{
                    backgroundColor: "#2c58a2",
                    color: "white",
                    border: "none",
                    padding: "15px 40px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    width: "100%",
                    letterSpacing: "0.5px",
                  }}
                >
                  Register as Individual Partner
                </button>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  * Required fields
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <LocationPickerModal
        open={openPicker}
        onClose={() => setOpenPicker(false)}
        onSave={handleSaveLocation}
        allLocations={locations}
      />

      <ViewAllLocationsModal open={viewAllOpen} onClose={() => setViewAllOpen(false)} locations={locations} />

      {/* Custom CSS - Added error styling */}
      <style>
        {`
          .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #28b8b4 !important;
            box-shadow: 0 0 0 3px rgba(40, 184, 180, 0.1) !important;
          }
          
          .location-btn:hover {
            background-color: #219a96 !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(40, 184, 180, 0.3);
          }
          
          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(44, 88, 162, 0.3);
          }
          
          .form-select:disabled {
            background-color: #f8f9fa !important;
            color: #6c757d !important;
            cursor: not-allowed;
          }
          
          .form-input::placeholder {
            color: #999;
          }
          
          .form-select option {
            padding: 10px;
          }
        `}
      </style>
    </>
  );
};

export default EnergyPartnerForm;
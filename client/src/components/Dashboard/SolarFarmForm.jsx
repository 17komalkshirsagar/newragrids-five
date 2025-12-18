
import {
  useOnboardUserMutation,
  useGetAssociateProfileQuery   // 👈 ADD THIS
} from "../../Redux/associateUpdate.api";


import React, { useEffect, useState } from "react";
import {
  useGetMsedclSubstationsQuery,
  useGetMsetclSubstationsQuery,
} from "../../Redux/substations.api";
import { useLogoutAssociateMutation } from "../../Redux/user.api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Sun,
  Plus,
  Upload,
  Calendar,
  MapPin,
  Zap,
  Building2,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

const SolarFarmForm = () => {
  const navigate = useNavigate();
  const associate = useSelector((state) => state.associatePartner);
  const associateId = associate?.user?._id;

  const [onboardUser, { isLoading }] = useOnboardUserMutation();
  const [logoutAssociate, { isLoading: isLoggingOut }] = useLogoutAssociateMutation();

  const { data: profileData } = useGetAssociateProfileQuery(associateId, {
    skip: !associateId,
  });

  const [farms, setFarms] = useState([
    {
      projectName: "",
      location: { coordinates: { lat: "", lng: "" } },
      capacity: { ac: "", dc: "" },
      substation: {
        category: "",
        district: "",
        taluka: "",
        substation: "",
      },
      distanceFromSubstation: "",
      landOwnership: "",
      landDocument: { file: null, fileUrl: "", fileType: "" },
      statusOfFarm: "",
      statusOfLoan: "",
      regulatoryStatus: "",
      tariffExpected: "",
      expectedCommissioningTimeline: {
        epcWorkStartDate: "",
        injectionDate: "",
        commercialOperationsDate: "",
      },
      districts: [],
      talukas: [],
      stations: [],
      rawData: [],
    },
  ]);

  const msedclResp = useGetMsedclSubstationsQuery();
  const msetclResp = useGetMsetclSubstationsQuery();


  // ✅ Extract number from "10MW"
  const contractCapacityMW = Number(
    (profileData?.profile?.contractCapacity || "0")
      .toString()
      .replace(/[^0-9.]/g, "")
  );

  const usedSolarCapacityMW = Array.isArray(profileData?.profile?.onboard?.solarFarms)
    ? profileData.profile.onboard.solarFarms.reduce((sum, farm) => {
      const ac = Number(farm?.capacity?.ac || 0);
      return sum + ac;
    }, 0)
    : 0;

  const usedConsumerCapacityMW = Array.isArray(profileData?.profile?.onboard?.consumers)
    ? profileData.profile.onboard.consumers.reduce((sum, c) => {
      const load = Number(c?.consumerLoadCapacity || c?.loadCapacity || 0);
      return sum + load;
    }, 0)
    : 0;

  const onboardType = profileData?.profile?.onboardType;

  const usedCapacityMW =
    onboardType === "SOLARFARM"
      ? usedSolarCapacityMW
      : usedConsumerCapacityMW;

  const remainingCapacityMW = Math.max(
    contractCapacityMW - usedCapacityMW,
    0
  );


  const contractCapacity =
    profileData?.profile?.contractCapacity || "N/A";



  useEffect(() => {
    if (!profileData) return;

    let solarFarms = [];

    if (Array.isArray(profileData?.solarFarms)) {
      solarFarms = profileData.solarFarms;
    }
    else if (Array.isArray(profileData?.onboard?.solarFarms)) {
      solarFarms = profileData.onboard.solarFarms;
    }

    if (solarFarms.length > 0) {
      setFarms(
        solarFarms.map((f) => ({
          ...f,

          // 👇 frontend-only fields (form requires these)
          landDocument: {
            file: null,
            fileUrl: f.landDocument?.fileUrl || "",
            fileType: f.landDocument?.fileType || "",
          },

          districts: [],
          talukas: [],
          stations: [],
          rawData: [],
        }))
      );
    }
  }, [profileData]);
  console.log("PROFILE GET:", profileData);

  const handleLogout = async () => {
    try {
      await logoutAssociate().unwrap();
      localStorage.removeItem("AssociatePartnerAuth");
      alert("Logged out successfully!");
      navigate("/choose-account-type");
    } catch (err) {
      console.error("Logout Error:", err);
      alert("Logout failed!");
    }
  };

  const updateFarmField = (index, path, value) => {
    const updated = [...farms];
    let ref = updated[index];
    const parts = path.split(".");
    while (parts.length > 1) ref = ref[parts.shift()];
    ref[parts[0]] = value;
    setFarms(updated);
  };

  const handleCategoryChange = (index, category) => {
    const updated = [...farms];
    const farm = updated[index];
    farm.substation.category = category;
    farm.substation.district = "";
    farm.substation.taluka = "";
    farm.substation.substation = "";
    farm.districts = [];
    farm.talukas = [];
    farm.stations = [];
    farm.rawData = [];

    if (category === "MSEDCL" && msedclResp.isSuccess) {
      const data = msedclResp.data.map((x) => ({
        district: x.district,
        taluka: x.taluka,
        substation: x.substation,
      }));
      farm.rawData = data;
      farm.districts = [...new Set(data.map((d) => d.district))];
    }

    if (category === "MSETCL" && msetclResp.isSuccess) {
      const data = msetclResp.data.map((x) => ({
        district: x.District || "",
        taluka: "",
        substation: x.Substation || "",
      }));
      farm.rawData = data;
      farm.districts = [...new Set(data.map((d) => d.district))];
    }

    setFarms(updated);
  };

  const handleDistrictChange = (index, district) => {
    const updated = [...farms];
    const farm = updated[index];
    farm.substation.district = district;
    farm.substation.taluka = "";
    farm.substation.substation = "";
    farm.talukas = [];
    farm.stations = [];

    if (!district) return setFarms(updated);

    if (farm.substation.category === "MSETCL") {
      farm.stations = farm.rawData
        .filter((x) => x.district === district)
        .map((x) => x.substation);
    }

    if (farm.substation.category === "MSEDCL") {
      farm.talukas = [
        ...new Set(
          farm.rawData
            .filter((x) => x.district === district)
            .map((x) => x.taluka)
        ),
      ];
    }

    setFarms(updated);
  };

  const handleTalukaChange = (index, taluka) => {
    const updated = [...farms];
    const farm = updated[index];
    farm.substation.taluka = taluka;
    farm.substation.substation = "";
    farm.stations = farm.rawData
      .filter((x) => x.taluka === taluka)
      .map((x) => x.substation);
    setFarms(updated);
  };

  // const addFarm = () =>
  //   setFarms([...farms, JSON.parse(JSON.stringify(farms[0]))]);
  const addFarm = () =>
    setFarms([
      ...farms,
      {
        projectName: "",
        location: { coordinates: { lat: "", lng: "" } },
        capacity: { ac: "", dc: "" },
        substation: { category: "", district: "", taluka: "", substation: "" },
        distanceFromSubstation: "",
        landOwnership: "",
        landDocument: { file: null, fileUrl: "", fileType: "" },
        statusOfFarm: "",
        statusOfLoan: "",
        regulatoryStatus: "",
        tariffExpected: "",
        expectedCommissioningTimeline: {
          epcWorkStartDate: "",
          injectionDate: "",
          commercialOperationsDate: "",
        },
        districts: [],
        talukas: [],
        stations: [],
        rawData: [],
      },
    ]);




  const handleSubmit = async () => {
    if (!associateId) {
      alert("Associate ID missing. Please login again.");
      return;
    }

    // FILTER OUT UNFILLED FARMS
    const validFarms = farms.filter(f => f.projectName !== "");

    if (validFarms.length === 0) {
      alert("Please fill at least one farm completely");
      return;
    }

    // VALIDATION ENUM FIELDS
    for (const [i, farm] of validFarms.entries()) {
      if (!farm.landOwnership) {
        alert(`Farm #${i + 1}: Select Land Ownership`);
        return;
      }
      if (!farm.landDocument.fileType) {
        alert(`Farm #${i + 1}: Select Document Type`);
        return;
      }
    }

    try {
      const fd = new FormData();
      fd.append("onboardType", "SOLARFARM");
      fd.append(
        "solarFarms",
        JSON.stringify(
          validFarms.map(f => ({
            ...f,
            landDocument: { fileType: f.landDocument.fileType }
          }))
        )
      );

      validFarms.forEach((farm, i) => {
        if (farm.landDocument.file) {
          fd.append(`landDocument_${i}`, farm.landDocument.file);
        }
      });

      const res = await onboardUser({
        id: associateId,
        payload: fd,
      }).unwrap();

      alert("Submitted Successfully!");
      console.log("RESULT:", res);
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert("Submission Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f7f9] to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                    <Sun className="w-6 h-6 text-white" />
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Solar Farm Management
                  </h1>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Associate:{" "}
                  <span className="font-semibold text-amber-600">
                    {associate?.user?.name || "Associate"}
                  </span>{" "}
                  | Onboard Type:{" "}
                  <span className="font-semibold text-orange-600">SOLARFARM</span>{" "}
                  | Contract Capacity:{" "}
                  <span className="font-semibold text-emerald-600">
                    {contractCapacity}
                  </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-emerald-50 border rounded-xl text-center">
                    <div className="text-sm text-gray-600">Contract Capacity</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {contractCapacityMW} MW
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border rounded-xl text-center">
                    <div className="text-sm text-gray-600">Used Capacity</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {usedCapacityMW} MW
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border rounded-xl text-center">
                    <div className="text-sm text-gray-600">Remaining Capacity</div>
                    <div className="text-2xl font-bold text-amber-600">
                      {remainingCapacityMW} MW
                    </div>
                  </div>
                </div>


              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Add and manage solar farm details efficiently
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 self-start sm:self-center">


            <button
              onClick={() => navigate("/assoceproflle")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>


        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Sun className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Solar Farm Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter solar farm information below
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100">
                <span className="text-sm font-semibold text-amber-600">
                  {farms.length} {farms.length === 1 ? 'Farm' : 'Farms'}
                </span>
              </div>
            </div>
          </div>

          {/* Farms List */}
          <div className="p-6 space-y-6">
            {farms.map((farm, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-5 border border-amber-100 hover:border-amber-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
                      <span className="text-white text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-700">
                      Solar Farm #{index + 1}
                    </h3>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Project Basic Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Project Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Building2 className="w-4 h-4 text-amber-600" />
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={farm.projectName}
                          onChange={(e) =>
                            updateFarmField(index, "projectName", e.target.value)
                          }
                          placeholder="Enter project name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Coordinates */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Location Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={farm.location.coordinates.lat}
                          onChange={(e) =>
                            updateFarmField(index, "location.coordinates.lat", e.target.value)
                          }
                          placeholder="Enter latitude"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={farm.location.coordinates.lng}
                          onChange={(e) =>
                            updateFarmField(index, "location.coordinates.lng", e.target.value)
                          }
                          placeholder="Enter longitude"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      Capacity Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          AC Capacity (MW)
                        </label>
                        <input
                          type="text"
                          value={farm.capacity.ac}
                          onChange={(e) =>
                            updateFarmField(index, "capacity.ac", e.target.value)
                          }
                          placeholder="Enter AC capacity"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          DC Capacity (MW)
                        </label>
                        <input
                          type="text"
                          value={farm.capacity.dc}
                          onChange={(e) =>
                            updateFarmField(index, "capacity.dc", e.target.value)
                          }
                          placeholder="Enter DC capacity"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Substation Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      Substation Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          value={farm.substation.category}
                          onChange={(e) => handleCategoryChange(index, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                        >
                          <option value="">Select Category</option>
                          <option value="MSEDCL">MSEDCL</option>
                          <option value="MSETCL">MSETCL</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          District
                        </label>
                        <select
                          value={farm.substation.district}
                          onChange={(e) => handleDistrictChange(index, e.target.value)}
                          disabled={!farm.districts.length}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select District</option>
                          {farm.districts.map((d, i) => (
                            <option key={i} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      {farm.substation.category === "MSEDCL" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Taluka
                          </label>
                          <select
                            value={farm.substation.taluka}
                            onChange={(e) => handleTalukaChange(index, e.target.value)}
                            disabled={!farm.talukas.length}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Taluka</option>
                            {farm.talukas.map((t, i) => (
                              <option key={i} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Substation
                        </label>
                        <select
                          value={farm.substation.substation}
                          onChange={(e) =>
                            updateFarmField(index, "substation.substation", e.target.value)
                          }
                          disabled={!farm.stations.length}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Substation</option>
                          {farm.stations.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Distance from Substation (km)
                        </label>
                        <input
                          type="text"
                          value={farm.distanceFromSubstation}
                          onChange={(e) =>
                            updateFarmField(index, "distanceFromSubstation", e.target.value)
                          }
                          placeholder="Enter distance"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Land Ownership
                        </label>
                        <select
                          value={farm.landOwnership}
                          onChange={(e) =>
                            updateFarmField(index, "landOwnership", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                        >
                          <option value="">Select Ownership</option>
                          <option value="OWN">OWN</option>
                          <option value="LEASE">LEASE</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-600" />
                      Land Document
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Document Type
                        </label>
                        <select
                          value={farm.landDocument.fileType}
                          onChange={(e) =>
                            updateFarmField(index, "landDocument.fileType", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                        >
                          <option value="">Select Document Type</option>
                          <option value="OWN">OWN</option>
                          <option value="LEASE">LEASE</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Upload Document
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              const updated = [...farms];
                              updated[index].landDocument.file = file;
                              updated[index].landDocument.fileUrl = file
                                ? URL.createObjectURL(file)
                                : "";
                              setFarms(updated);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Timeline */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Status & Timeline
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Farm Status
                        </label>
                        <select
                          value={farm.statusOfFarm}
                          onChange={(e) =>
                            updateFarmField(index, "statusOfFarm", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                        >
                          <option value="">Select Status</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Loan Status
                        </label>
                        <select
                          value={farm.statusOfLoan}
                          onChange={(e) =>
                            updateFarmField(index, "statusOfLoan", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                        >
                          <option value="">Select Loan Status</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Regulatory Status
                        </label>
                        <select
                          value={farm.regulatoryStatus}
                          onChange={(e) =>
                            updateFarmField(index, "regulatoryStatus", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                        >
                          <option value="">Select Regulatory Status</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        Commissioning Timeline
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            EPC Work Start
                          </label>
                          <input
                            type="date"
                            value={farm.expectedCommissioningTimeline.epcWorkStartDate}
                            onChange={(e) =>
                              updateFarmField(
                                index,
                                "expectedCommissioningTimeline.epcWorkStartDate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Injection Date
                          </label>
                          <input
                            type="date"
                            value={farm.expectedCommissioningTimeline.injectionDate}
                            onChange={(e) =>
                              updateFarmField(
                                index,
                                "expectedCommissioningTimeline.injectionDate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Commercial Operations
                          </label>
                          <input
                            type="date"
                            value={
                              farm.expectedCommissioningTimeline.commercialOperationsDate
                            }
                            onChange={(e) =>
                              updateFarmField(
                                index,
                                "expectedCommissioningTimeline.commercialOperationsDate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white text-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Farm Button */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={addFarm}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border-2 border-dashed border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl font-medium transition-all duration-200 hover:border-solid hover:border-amber-500 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Another Solar Farm
            </button>
          </div>
        </div>

        {/* Submit Section */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex flex-col items-center gap-4">
              {/* Validation Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>All solar farm details must be filled before submission</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/30 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    Submit Solar Farms
                  </>
                )}
              </button>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {farms.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Farms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {farms.filter(f => f.projectName && f.capacity.ac).length}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    Newra
                  </div>
                  <div className="text-sm text-gray-500">Grids Network</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Ensure all information is accurate before submission. All data will be added to Newra Grids database.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Submitted solar farms will be visible in your Associate Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolarFarmForm;
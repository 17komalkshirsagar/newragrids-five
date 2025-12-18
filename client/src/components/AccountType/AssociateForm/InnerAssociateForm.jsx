import React, { useState, useEffect } from "react";

// IMPORT QUERY FOR SUBSTATIONS
import {
  useGetMsedclSubstationsQuery,
  useGetMsetclSubstationsQuery,
} from "../../../Redux/substations.api";

const InnerAssociateForm = () => {
  const [onboardType, setOnboardType] = useState("");

  const [consumer, setConsumer] = useState({
    consumerName: "",
    consumerLoadCapacity: "",
  });

  const [solar, setSolar] = useState({
    projectName: "",
    locationAddress: "",
    lat: "",
    lng: "",
    taluka: "",
    district: "",
    state: "",
    ac: "",
    dc: "",
    category: "",
    substation: "",
    subDistrict: "",
    subTaluka: "",
    distanceFromSub: "",
    landOwnership: "",
  });

  // ------------------------------------------
  // 🔥 MSEDCL / MSETCL LOGIC STATES
  // ------------------------------------------
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [stations, setStations] = useState([]);
  const [rawSubstations, setRawSubstations] = useState([]);

  // FETCH QUERIES BASED ON CATEGORY
  const { data: msedclData, isSuccess: okMsedcl } =
    useGetMsedclSubstationsQuery(undefined, { skip: solar.category !== "MSEDCL" });

  const { data: msetclData, isSuccess: okMsetcl } =
    useGetMsetclSubstationsQuery(undefined, { skip: solar.category !== "MSETCL" });

  // ------------------------------------------
  // INPUT CHANGE HANDLERS
  // ------------------------------------------
  const handleConsumerChange = (e) => {
    setConsumer({ ...consumer, [e.target.name]: e.target.value });
  };

  const handleSolarChange = (e) => {
    setSolar({ ...solar, [e.target.name]: e.target.value });
  };

  // ------------------------------------------
  // CATEGORY SELECT → RESET ALL
  // ------------------------------------------
  useEffect(() => {
    setDistricts([]);
    setTalukas([]);
    setStations([]);
    setRawSubstations([]);

    if (solar.category === "MSEDCL" && okMsedcl) {
      const normalized = msedclData.map((x) => ({
        district: x.district,
        taluka: x.taluka,
        substation: x.substation,
      }));
      setRawSubstations(normalized);
      setDistricts([...new Set(normalized.map((x) => x.district))]);
    }

    if (solar.category === "MSETCL" && okMsetcl) {
      const normalized = msetclData.map((x) => ({
        district: x.District,
        taluka: "",
        substation: x.Substation,
      }));
      setRawSubstations(normalized);
      setDistricts([...new Set(normalized.map((x) => x.district))]);
    }
  }, [solar.category, okMsedcl, okMsetcl, msedclData, msetclData]);

  // ------------------------------------------
  // DISTRICT SELECT
  // ------------------------------------------
  const handleDistrictSelect = (e) => {
    const district = e.target.value;
    setSolar({ ...solar, subDistrict: district, subTaluka: "", substation: "" });

    if (!district) {
      setTalukas([]);
      setStations([]);
      return;
    }

    if (solar.category === "MSETCL") {
      const stationsList = rawSubstations
        .filter((x) => x.district === district)
        .map((x) => x.substation);

      setStations(stationsList);
      return;
    }

    const talukaList = [
      ...new Set(
        rawSubstations.filter((x) => x.district === district).map((x) => x.taluka)
      ),
    ];
    setTalukas(talukaList);
  };

  // ------------------------------------------
  // TALUKA SELECT
  // ------------------------------------------
  const handleTalukaSelect = (e) => {
    const taluka = e.target.value;
    setSolar({ ...solar, subTaluka: taluka, substation: "" });

    const stationsList = rawSubstations
      .filter((x) => x.taluka === taluka)
      .map((x) => x.substation);

    setStations(stationsList);
  };

  // ------------------------------------------
  // SUBSTATION SELECT
  // ------------------------------------------
  const handleStationSelect = (e) => {
    setSolar({ ...solar, substation: e.target.value });
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Onboard Details</h2>

      {/* SELECT ONBOARD TYPE */}
      <label className="font-medium">Do you want to onboard as?</label>
      <select
        value={onboardType}
        onChange={(e) => setOnboardType(e.target.value)}
        className="border p-2 w-full rounded mb-5"
      >
        <option value="">-- Select --</option>
        <option value="CONSUMER">Consumer</option>
        <option value="SOLAR_FARM">Solar Farm</option>
      </select>

      {/* CONSUMER FORM */}
      {onboardType === "CONSUMER" && (
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-semibold mb-3">Consumer Details</h3>

          <input
            type="text"
            name="consumerName"
            placeholder="Consumer Name"
            value={consumer.consumerName}
            onChange={handleConsumerChange}
            className="border p-2 rounded w-full mb-3"
          />

          <input
            type="text"
            name="consumerLoadCapacity"
            placeholder="Load Capacity (kW)"
            value={consumer.consumerLoadCapacity}
            onChange={handleConsumerChange}
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      {/* SOLAR FARM FORM */}
      {onboardType === "SOLAR_FARM" && (
        <div className="bg-gray-50 p-4 rounded border space-y-3">
          <h3 className="text-lg font-semibold mb-3">Solar Farm Details</h3>

          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            value={solar.projectName}
            onChange={handleSolarChange}
            className="border p-2 rounded w-full"
          />

          {/* LOCATION */}
          <h4 className="font-semibold mt-3">Location</h4>

          <input
            type="text"
            name="locationAddress"
            placeholder="Location Address"
            value={solar.locationAddress}
            onChange={handleSolarChange}
            className="border p-2 rounded w-full"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="lat"
              placeholder="Latitude"
              value={solar.lat}
              onChange={handleSolarChange}
              className="border p-2 rounded"
            />

            <input
              type="number"
              name="lng"
              placeholder="Longitude"
              value={solar.lng}
              onChange={handleSolarChange}
              className="border p-2 rounded"
            />
          </div>

          {/* TALUKA / DISTRICT / STATE */}
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              name="taluka"
              placeholder="Taluka"
              value={solar.taluka}
              onChange={handleSolarChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={solar.district}
              onChange={handleSolarChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={solar.state}
              onChange={handleSolarChange}
              className="border p-2 rounded"
            />
          </div>

          {/* CAPACITY */}
          <h4 className="font-semibold mt-3">Capacity</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="ac"
              placeholder="AC Capacity"
              value={solar.ac}
              onChange={handleSolarChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="dc"
              placeholder="DC Capacity"
              value={solar.dc}
              onChange={handleSolarChange}
              className="border p-2 rounded"
            />
          </div>

          {/* --------------------------- */}
          {/* SUBSTATION LOGIC INSERTED */}
          {/* --------------------------- */}

          <h4 className="font-semibold mt-3">Substation Info</h4>

          {/* CATEGORY */}
          <select
            name="category"
            value={solar.category}
            onChange={handleSolarChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Category</option>
            <option value="MSEDCL">MSEDCL</option>
            <option value="MSETCL">MSETCL</option>
          </select>

          {/* DISTRICT DROPDOWN */}
          <select
            value={solar.subDistrict}
            onChange={handleDistrictSelect}
            disabled={!districts.length}
            className="border p-2 rounded w-full"
          >
            <option value="">Select District</option>
            {districts.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* TALUKA (only for MSEDCL) */}
          {solar.category === "MSEDCL" && (
            <select
              value={solar.subTaluka}
              onChange={handleTalukaSelect}
              disabled={!talukas.length}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Taluka</option>
              {talukas.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}

          {/* SUBSTATION DROPDOWN */}
          <select
            value={solar.substation}
            onChange={handleStationSelect}
            disabled={!stations.length}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Substation</option>
            {stations.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* DISTANCE */}
          <input
            type="text"
            name="distanceFromSub"
            placeholder="Distance From Substation (km)"
            value={solar.distanceFromSub}
            onChange={handleSolarChange}
            className="border p-2 rounded w-full"
          />

          {/* LAND OWNERSHIP */}
          <h4 className="font-semibold mt-3">Land Ownership</h4>

          <select
            name="landOwnership"
            value={solar.landOwnership}
            onChange={handleSolarChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Ownership</option>
            <option value="OWN">OWN</option>
            <option value="LEASE">LEASE</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default InnerAssociateForm;

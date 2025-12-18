import React from "react";
import { useSelector } from "react-redux";
import ConsumerForm from "./ConsumerForm";
import SolarFarmForm from "./SolarFarmForm";

const AssociateDash = () => {
  const user = useSelector((state) => state.associatePartner?.user);
  const onboardType = user?.onboardType;

  return (
    <div>
   
      {onboardType === "CONSUMER" && <ConsumerForm />}
      {onboardType === "SOLARFARM" && <SolarFarmForm />}
    </div>
  );
};

export default AssociateDash;

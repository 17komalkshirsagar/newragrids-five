import autoTable from "jspdf-autotable";
import React, { useState } from "react";
import {
  useOnboardUserMutation,
  useGetAssociateProfileQuery,
} from "../../Redux/associateUpdate.api";
import { useSelector } from "react-redux";
import { useLogoutAssociateMutation } from "../../Redux/user.api";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Users,
  UserPlus,
  Loader2,
  Building2,
  Zap,
  Trash2,
  User,
  Sun,
  Battery,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "sonner";

const ConsumerForm = () => {
  const navigate = useNavigate();

  /* ---------------- local state ---------------- */
  const [consumers, setConsumers] = useState([
    { consumerName: "", consumerLoadCapacity: "" },
  ]);

  const addConsumer = () => {
    setConsumers([
      ...consumers,
      { consumerName: "", consumerLoadCapacity: "" },
    ]);
  };

  const removeConsumer = (index) => {
    if (consumers.length > 1) {
      setConsumers(consumers.filter((_, i) => i !== index));
    }
  };

  /* ---------------- redux auth ---------------- */
  const associate = useSelector((state) => state.associatePartner?.user);
  const associateId = associate?._id;
  const associateName = associate?.name || "Associate";

  /* ---------------- profile api ---------------- */
  const { data: profileData } = useGetAssociateProfileQuery(associateId, {
    skip: !associateId,
  });

  const onboardConsumers =
    profileData?.profile?.onboard?.consumers || [];

  /* ---------------- MW CALCULATION ONLY ---------------- */

  // "10MW" -> 10
  const contractCapacityMW = Number(
    (associate?.contractCapacity || "0").replace(/[^0-9.]/g, "")
  );

  // sum of consumerLoadCapacity (already MW)
  const usedLoadMW = onboardConsumers.reduce(
    (sum, c) => sum + Number(c.consumerLoadCapacity || 0),
    0
  );

  const remainingCapacityMW =
    contractCapacityMW - usedLoadMW;

  /* ---------------- mutations ---------------- */
  const [onboardUser] = useOnboardUserMutation();
  const [logoutAssociate, { isLoading: isLoggingOut }] =
    useLogoutAssociateMutation();

  const handleLogout = async () => {
    try {
      await logoutAssociate().unwrap();
      localStorage.removeItem("AssociatePartnerAuth");
      navigate("/choose-account-type");
    } catch {
      alert("Logout failed!");
    }
  };

  const handleSubmit = async () => {
    const emptyFields = consumers.some(
      (c) =>
        !c.consumerName.trim() ||
        !c.consumerLoadCapacity.trim()
    );

    if (emptyFields) {
      toast.error("Please fill all consumer details");
      return;
    }

    try {
      await onboardUser({
        id: associateId,
        payload: {
          onboardType: "CONSUMER",
          consumers: JSON.stringify(consumers),
        },
      }).unwrap();

      toast.success("Consumer details submitted!");
      navigate("/assoceproflle");
      setConsumers([{ consumerName: "", consumerLoadCapacity: "" }]);
    } catch (err) {
      toast.error(
        err?.data?.message || "Something went wrong"
      );
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Premium Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-sm opacity-70"></div>
                <div className="relative p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  Consumer Management
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                    <User className="inline w-3 h-3 mr-1" />
                    {associateName}
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                    <Zap className="inline w-3 h-3 mr-1" />
                    CONSUMER
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mt-3 max-w-2xl">
              Add and manage consumer details with load capacity allocation.
              Track your contract utilization in real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/assoceproflle")}
              className="group relative flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group relative flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Capacity Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contract Capacity Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Battery className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Contract Capacity
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {contractCapacityMW} <span className="text-lg text-emerald-600">MW</span>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-50">
                <div className="text-xs text-gray-500">Your total allocated capacity</div>
              </div>
            </div>
          </div>

          {/* Used Capacity Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Utilized
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Used Capacity
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {usedLoadMW} <span className="text-lg text-blue-600">MW</span>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-50">
                <div className="text-xs text-gray-500">Current allocated to consumers</div>
              </div>
            </div>
          </div>

          {/* Remaining Capacity Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Sun className="w-6 h-6 text-amber-600" />
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                  Available
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Remaining Capacity
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {remainingCapacityMW} <span className="text-lg text-amber-600">MW</span>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-50">
                <div className="text-xs text-gray-500">Available for new consumers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Consumer Form Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Consumers
                  </h2>
                  <p className="text-sm text-gray-600">
                    Fill consumer details and load capacity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-600">
                  {consumers.length} Consumer{consumers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Consumer Inputs */}
          <div className="p-6 space-y-4">
            {consumers.map((consumer, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:border-amber-200 transition-colors"
              >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    #{index + 1}
                  </span>
                  {consumers.length > 1 && (
                    <button
                      onClick={() => removeConsumer(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Remove consumer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumer Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Enter consumer name"
                      value={consumer.consumerName}
                      onChange={(e) => {
                        const updated = [...consumers];
                        updated[index].consumerName = e.target.value;
                        setConsumers(updated);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Load Capacity
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-12"
                        placeholder="Enter capacity"
                        value={consumer.consumerLoadCapacity}
                        onChange={(e) => {
                          const updated = [...consumers];
                          updated[index].consumerLoadCapacity = e.target.value;
                          setConsumers(updated);
                        }}
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        MW
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={addConsumer}
                className="group relative flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-2 border-dashed border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Consumer</span>
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setConsumers([{ consumerName: "", consumerLoadCapacity: "" }])}
                  className="px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  className="group relative flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit All Consumers</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Note: Capacity is allocated in Megawatts (MW). 1 MW = 1000 kW
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsumerForm;
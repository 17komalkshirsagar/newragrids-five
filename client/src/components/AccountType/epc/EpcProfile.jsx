import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useLogoutEpcMutation } from "../../../Redux/Epc.api";

import { useGetEpcProfileQuery } from '../../../Redux/epcDashboard.api';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiFileText, FiDownload, FiSun, FiChevronDown,
  FiChevronUp, FiCheckCircle, FiXCircle, FiAlertCircle,
  FiExternalLink, FiGrid, FiList, FiRefreshCw,
  FiLogOut
} from 'react-icons/fi';
import {
  MdBusinessCenter, MdLocationOn, MdAttachMoney,
  MdElectricBolt, MdStorage, MdOutlineSpeed,
  MdDateRange
} from 'react-icons/md';
import { GiSolarPower } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const EpcProfile = () => {
  const reduxCandidate = useSelector((s) =>
    s?.epc?.user ? s.epc.user : s?.auth?.epc ? s.auth.epc : s?.user?.user ? s.user.user : s?.user ? s.user : null
  );

  const epcUserFromState = reduxCandidate?.user || reduxCandidate;
  const epcId = epcUserFromState?._id || null;

  const { data, isLoading: profileLoading, refetch } = useGetEpcProfileQuery(epcId, {
    skip: !epcId,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutEpc] = useLogoutEpcMutation();
  const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await logoutEpc().unwrap();
        toast.success("Logged out successfully!");
        navigate("/");
      } catch (err) {
        toast.error("Logout failed");
      }
    };
  
  const [expandedFarm, setExpandedFarm] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');

  if (profileLoading) return <LoadingSpinner />;
  if (!data?.user) return <ErrorComponent />;

  const profile = data.user;
  const solarFarms = profile.solarFarms || [];

  // Status color mapping function - Yeh component ke andar define karo
const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('approved') || statusLower.includes('clear')) 
    return 'bg-green-100 text-green-800';
  if (statusLower.includes('pending') || statusLower.includes('submitted')) 
    return 'bg-yellow-100 text-yellow-800';
  if (statusLower.includes('rejected') || statusLower.includes('cancelled')) 
    return 'bg-red-100 text-red-800';
  if (statusLower.includes('under')) 
    return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
};

// Status icon mapping function - Yeh bhi component ke andar
const getStatusIcon = (status) => {
  if (!status) return <FiAlertCircle className="w-4 h-4" />;
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('approved') || statusLower.includes('clear')) 
    return <FiCheckCircle className="w-4 h-4" />;
  if (statusLower.includes('pending') || statusLower.includes('submitted')) 
    return <FiAlertCircle className="w-4 h-4" />;
  if (statusLower.includes('rejected') || statusLower.includes('cancelled')) 
    return <FiXCircle className="w-4 h-4" />;
  return <FiAlertCircle className="w-4 h-4" />;
};

  // Filter solar farms
  const filteredFarms = solarFarms.filter(farm => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'approved') 
      return farm.statusOfFarm?.toLowerCase().includes('clear') || 
             farm.regulatoryStatus?.toLowerCase().includes('approved');
    if (activeFilter === 'pending') 
      return farm.statusOfFarm?.toLowerCase().includes('pending') || 
             farm.regulatoryStatus?.toLowerCase().includes('pending');
    return true;
  });

  // Calculate total capacity
  const totalCapacity = solarFarms.reduce((sum, farm) => {
    const ac = parseFloat(farm.capacity?.ac) || 0;
    return sum + ac;
  }, 0);

  // Calculate average tariff
  const averageTariff = solarFarms.reduce((sum, farm) => {
    const tariff = parseFloat(farm.tariffExpected) || 0;
    return sum + tariff;
  }, 0) / solarFarms.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              EPC Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {profile.name} 👋
            </p>
          </div>
          
          <div className="flex items-center gap-3">
  <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiLogOut />
                            <span className="hidden sm:inline">Logout</span>
                          </button>
            
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {profile.name?.charAt(0) || 'E'}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{profile.name}</div>
                <div className="text-xs text-gray-500">EPC Professional</div>
              </div>
            </div>
          </div>
        </div>



{/* logout */}


      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FiLogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout Confirmation</h3>
              <p className="text-gray-600">Are you sure you want to logout?</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{solarFarms.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <GiSolarPower className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalCapacity} MW</div>
                <div className="text-sm text-gray-600">Total Capacity</div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <MdElectricBolt className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{averageTariff.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Avg. Tariff</div>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <MdAttachMoney className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {solarFarms.filter(f => 
                    f.statusOfFarm?.toLowerCase().includes('clear') || 
                    f.regulatoryStatus?.toLowerCase().includes('approved')
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiCheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="text-gray-600" /> Profile Information
            </h2>
            
           
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMail className="text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{profile.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiPhone className="text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Mobile</div>
                  <div className="font-medium text-gray-900">{profile.mobile}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMapPin className="text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="font-medium text-gray-900">{profile.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MdBusinessCenter className="text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Member Since</div>
                  <div className="font-medium text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h2>
            <div className="space-y-3">
              {solarFarms.slice(0, 3).map(farm => (
                <div key={farm._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {farm.projectName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {farm.capacity?.ac || 'N/A'}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(farm.statusOfFarm)} flex items-center gap-1`}>
                    {getStatusIcon(farm.statusOfFarm)}
                    {farm.statusOfFarm?.split(' ')[0] || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Solar Farms */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiSun className="text-amber-600" /> Solar Farms ({filteredFarms.length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and monitor your solar projects
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* View Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                  >
                    <FiGrid className="inline w-4 h-4 mr-1" /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                  >
                    <FiList className="inline w-4 h-4 mr-1" /> List
                  </button>
                </div>

                {/* Filter Buttons */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter('approved')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'approved' ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setActiveFilter('pending')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'}`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>

            {filteredFarms.length === 0 ? (
              <div className="text-center py-12">
                <FiSun className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No projects found</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFarms.map(farm => (
                  <SolarFarmCard 
                    key={farm._id} 
                    farm={farm}
                    isExpanded={expandedFarm === farm._id}
                    onToggle={() => setExpandedFarm(
                      expandedFarm === farm._id ? null : farm._id
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFarms.map(farm => (
                  <SolarFarmCard 
                    key={farm._id} 
                    farm={farm}
                    isExpanded={expandedFarm === farm._id}
                    onToggle={() => setExpandedFarm(
                      expandedFarm === farm._id ? null : farm._id
                    )}
                    viewMode="list"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
    </div>
    <p className="mt-4 text-gray-600">Loading EPC profile...</p>
  </div>
);

// Error Component
const ErrorComponent = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
    <FiAlertCircle className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Unable to load profile</h3>
    <p className="text-gray-600">Please try again later</p>
  </div>
);

// Solar Farm Card Component
const SolarFarmCard = ({ farm, isExpanded, onToggle, viewMode = 'grid' }) => {
  // Yeh functions component ke andar define karo
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('clear')) 
      return 'bg-green-100 text-green-800';
    if (statusLower.includes('pending') || statusLower.includes('submitted')) 
      return 'bg-yellow-100 text-yellow-800';
    if (statusLower.includes('rejected') || statusLower.includes('cancelled')) 
      return 'bg-red-100 text-red-800';
    if (statusLower.includes('under')) 
      return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (!status) return <FiAlertCircle className="w-4 h-4" />;
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('clear')) 
      return <FiCheckCircle className="w-4 h-4" />;
    if (statusLower.includes('pending') || statusLower.includes('submitted')) 
      return <FiAlertCircle className="w-4 h-4" />;
    if (statusLower.includes('rejected') || statusLower.includes('cancelled')) 
      return <FiXCircle className="w-4 h-4" />;
    return <FiAlertCircle className="w-4 h-4" />;
  };

  const hasCoordinates = farm.location?.coordinates?.lat && farm.location?.coordinates?.lng;
  
  return (
    <div className={`${viewMode === 'grid' ? 'bg-gradient-to-br from-blue-50 to-cyan-50' : 'bg-gray-50'} border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div 
        className={`p-4 ${isExpanded ? 'border-b border-gray-200' : ''} cursor-pointer`}
        onClick={onToggle}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GiSolarPower className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{farm.projectName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farm.statusOfFarm)} flex items-center gap-1`}>
                    {getStatusIcon(farm.statusOfFarm)}
                    {farm.statusOfFarm}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MdElectricBolt className="w-4 h-4" />
                    {farm.capacity?.ac || 'N/A'} AC
                  </span>
                  <span className="flex items-center gap-1">
                    <MdLocationOn className="w-4 h-4" />
                    {farm.location?.taluka || farm.substation?.taluka || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdOutlineSpeed className="w-4 h-4" />
                    {farm.distanceFromSubstation || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-gray-400 ml-2">
            {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MdLocationOn className="text-gray-500" /> Location Details
                </h4>
                <div className="space-y-2">
                  <DetailRow label="Taluka" value={farm.location?.taluka || farm.substation?.taluka} />
                  <DetailRow label="District" value={farm.location?.district || farm.substation?.district} />
                  <DetailRow label="Substation" value={farm.substation?.substation} />
                  <DetailRow label="Category" value={farm.substation?.category} />
                  {hasCoordinates && (
                    <DetailRow 
                      label="Coordinates" 
                      value={`${farm.location.coordinates.lat}, ${farm.location.coordinates.lng}`}
                    />
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <GiSolarPower className="text-gray-500" /> Technical Details
                </h4>
                <div className="space-y-2">
                  <DetailRow label="AC Capacity" value={farm.capacity?.ac} />
                  <DetailRow label="DC Capacity" value={farm.capacity?.dc} />
                  <DetailRow label="Land Ownership" value={farm.landOwnership} />
                  <DetailRow label="Distance from Substation" value={farm.distanceFromSubstation} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MdBusinessCenter className="text-gray-500" /> Status & Financial
                </h4>
                <div className="space-y-2">
                  <DetailRow 
                    label="Farm Status" 
                    value={
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farm.statusOfFarm)}`}>
                        {farm.statusOfFarm}
                      </span>
                    }
                  />
                  <DetailRow 
                    label="Loan Status" 
                    value={
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farm.statusOfLoan)}`}>
                        {farm.statusOfLoan}
                      </span>
                    }
                  />
                  <DetailRow 
                    label="Regulatory Status" 
                    value={
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farm.regulatoryStatus)}`}>
                        {farm.regulatoryStatus}
                      </span>
                    }
                  />
                  <DetailRow 
                    label="Tariff Expected" 
                    value={
                      <span className="font-semibold text-green-700">
                        {farm.tariffExpected}
                      </span>
                    }
                  />
                </div>
              </div>

              {/* Timeline */}
              {farm.expectedCommissioningTimeline && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MdDateRange className="text-gray-500" /> Project Timeline
                  </h4>
                  <div className="space-y-2">
                    <TimelineRow 
                      label="EPC Work Start" 
                      date={farm.expectedCommissioningTimeline.epcWorkStartDate} 
                    />
                    <TimelineRow 
                      label="Injection Date" 
                      date={farm.expectedCommissioningTimeline.injectionDate} 
                    />
                    <TimelineRow 
                      label="Commercial Ops" 
                      date={farm.expectedCommissioningTimeline.commercialOperationsDate} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Link */}
          {farm.landDocument?.fileUrl && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Land Document</div>
                    <div className="text-sm text-gray-500">File Type: {farm.landDocument.fileType}</div>
                  </div>
                </div>
                <a
                  href={farm.landDocument.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2 transition-opacity"
                >
                  <FiExternalLink className="w-4 h-4" /> View Document
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Reusable Detail Row Component
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">
      {value || <span className="text-gray-400">N/A</span>}
    </span>
  </div>
);

// Timeline Row Component
const TimelineRow = ({ label, date }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <div className="text-xs text-gray-600">
        {date ? new Date(date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) : 'Not set'}
      </div>
    </div>
  </div>
);

export default EpcProfile;
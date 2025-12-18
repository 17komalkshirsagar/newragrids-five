import React, { useState, useEffect } from "react";
import {
  useGetAllAssociatesQuery,
  useGetAllPartnersQuery,
} from "../../Redux/admindashApi";
import { useGetCustomersQuery } from "../../Redux/userr.api";
import { Toaster, toast } from "react-hot-toast";
import { useSignOutMutation } from "../../Redux/admin.api";
import { 
  FiUser, FiUsers, FiSun, FiFileText, FiDownload, 
  FiExternalLink, FiChevronDown, FiChevronUp, FiGrid,
  FiList, FiSearch, FiFilter, FiLogOut, FiRefreshCw,
  FiCheckCircle, FiXCircle, FiAlertCircle, FiMapPin,
  FiCalendar, FiPhone, FiMail, FiHome, FiDollarSign,
  FiBarChart2, FiTrendingUp, FiImage, FiFile, FiDatabase,
  FiEye, FiX, FiFolder, FiPaperclip, FiEdit, FiInfo,
  FiGlobe, FiHash, FiClock, FiBookmark, FiTag,
  FiCodesandbox, FiLayers, FiPackage, FiArchive
} from 'react-icons/fi';
import { 
  MdBusinessCenter, MdLocationOn, MdAttachMoney,
  MdElectricBolt, MdAccountBalance, MdOutlineSpeed,
  MdDateRange, MdDashboard, MdPerson, MdSolarPower,
  MdCorporateFare, MdBusiness, MdDescription,
  MdReceipt, MdAssignment, MdNote, MdContactPhone,
  MdEmail, MdPhone, MdLocationCity, MdHome,
  MdWork, MdStorage, MdCloudUpload
} from 'react-icons/md';
import { GiSolarPower } from 'react-icons/gi';

const AdminData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState('partners');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showStats, setShowStats] = useState(true);

  
  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'partner', 'associate', 'consumer'

  // Data fetching
  const { 
    data: partnersData, 
    isLoading: partnersLoading, 
    error: partnersError 
  } = useGetAllPartnersQuery();
  
  const { 
    data: associatesData, 
    isLoading: associatesLoading,
    error: associatesError 
  } = useGetAllAssociatesQuery();
  
  const { 
    data: consumersData, 
    isLoading: consumersLoading,
    error: consumersError,
    refetch: refetchConsumers 
  } = useGetCustomersQuery();
  
  const [signOut] = useSignOutMutation();

  // Handle data with proper fallbacks
  const partners = partnersData?.data || partnersData || [];
  const associates = associatesData?.associates || associatesData || [];
  
  // IMPORTANT: Multiple possible structures for consumers data
  let consumers = [];
  if (consumersData) {
    if (Array.isArray(consumersData)) {
      consumers = consumersData;
    } else if (consumersData.result && Array.isArray(consumersData.result)) {
      consumers = consumersData.result;
    } else if (consumersData.data && Array.isArray(consumersData.data)) {
      consumers = consumersData.data;
    } else if (consumersData.users && Array.isArray(consumersData.users)) {
      consumers = consumersData.users;
    } else if (consumersData.message && consumersData.count && consumersData.result) {
      consumers = consumersData.result;
    }
  }

  // Stats calculations
  const totalPartners = partners.length;
  const totalAssociates = associates.length;
  const totalConsumers = consumers.length;
  const totalUsers = totalPartners + totalAssociates + totalConsumers;

  const totalSolarFarms = 
    partners.length +
    associates.flatMap(a => a.onboard?.solarFarms || []).length;

  const totalCapacity = [
    ...partners.map(p => parseFloat(p.capacity?.ac) || 0),
    ...associates.flatMap(a => 
      (a.onboard?.solarFarms || []).map(s => parseFloat(s.capacity?.ac) || 0)
    )
  ].reduce((a, b) => a + b, 0);


  

const DocumentViewer = ({ url, type, onClose }) => {
  const isImage = ["jpg", "jpeg", "png", "webp"].includes(type);
  const isPdf = type === "pdf" || type === "raw"; // 🔥 RAW ला पण PDF treat कर

  return (
    <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center">
      <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded z-10"
        >
          Close
        </button>

        {/* IMAGE */}
        {isImage && (
          <img
            src={url}
            className="w-full h-full object-contain"
            draggable={false}
          />
        )}

        {/* PDF / RAW → GOOGLE VIEWER ONLY */}
        {isPdf && (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              url
            )}&embedded=true`}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};




  // Filter data based on search term
  const getFilteredData = () => {
    let data = [];
    if (currentTab === 'partners') data = partners;
    else if (currentTab === 'associates') data = associates;
    else if (currentTab === 'consumers') data = consumers;

    if (!Array.isArray(data)) {
      console.error(`${currentTab} data is not an array:`, data);
      return [];
    }

    return data.filter(item => {
      if (!item) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const itemName = item.Name || item.name || item.consumerName || '';
      const itemEmail = item.email || item.consumerEmail || '';
      const itemMobile = item.mobile || item.consumerMobile || '';
      const itemCompany = item.companyName || '';
      const itemDistrict = item.district || '';
      const itemProject = item.projectName || '';

      const matchesSearch = 
        itemName.toLowerCase().includes(searchLower) ||
        itemEmail.toLowerCase().includes(searchLower) ||
        itemMobile.toString().includes(searchTerm) ||
        itemCompany.toLowerCase().includes(searchLower) ||
        itemDistrict.toLowerCase().includes(searchLower) ||
        itemProject.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  };

  const filteredData = getFilteredData();

  // Handle user click to open modal
  const handleUserClick = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType('');
  };

  // Handle document view (direct open)
const [docUrl, setDocUrl] = useState(null);
const [docType, setDocType] = useState(null);
const handleDocumentView = (url, type = "raw") => {
  setDocUrl(url);   
  setDocType(type);
};


  // Handle logout
const handleLogout = async () => {
  try {
    setIsLoggingOut(true);

    // 🕒 1.5 seconds intentional delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await signOut().unwrap();
    toast.success("Logged out successfully!");

    setTimeout(() => {
      window.location.href = "/admin-login";
    }, 500);
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Logout failed!");
  } finally {
    setIsLoggingOut(false);
  }
};



  // Handle refresh consumers
  const handleRefreshConsumers = () => {
    refetchConsumers();
    toast.success("Refreshing consumers data...");
  };

  // Loading state
  const isLoading = partnersLoading || associatesLoading || consumersLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      
      {/* User Details Modal */}
      {showModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          type={modalType}
          onClose={closeModal}
          onDocumentView={handleDocumentView}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              <span className="text-blue-600">NewRa</span> Grids Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Partners, Associates & Consumers
            </p>
          </div>
          
         <button
  onClick={handleLogout}
  disabled={isLoggingOut}
  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
>
  {isLoggingOut ? (
    <>
      {/* 🔄 Loader */}
      <svg
        className="animate-spin h-4 w-4 text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      <span className="hidden sm:inline">Logging out...</span>
    </>
  ) : (
    <>
      <FiLogOut />
      <span className="hidden sm:inline">Logout</span>
    </>
  )}
</button>

        </div>

        {/* Stats Overview */}
        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<MdPerson className="w-6 h-6 text-blue-500" />}
              title="Total Users"
              value={totalUsers}
              color="blue"
              subItems={[
                { label: "Partners", value: totalPartners, color: "bg-blue-100 text-blue-800" },
                { label: "Associates", value: totalAssociates, color: "bg-green-100 text-green-800" },
                { label: "Consumers", value: totalConsumers, color: "bg-purple-100 text-purple-800" }
              ]}
            />
            
            <StatCard
              icon={<GiSolarPower className="w-6 h-6 text-amber-500" />}
              title="Solar Farms"
              value={totalSolarFarms}
              color="amber"
            />
            
            <StatCard
              icon={<MdElectricBolt className="w-6 h-6 text-green-500" />}
              title="Total Capacity"
              value={`${totalCapacity.toFixed(1)} MW`}
              color="green"
            />
            
            <StatCard
              icon={<FiTrendingUp className="w-6 h-6 text-purple-500" />}
              title="Active Consumers"
              value={consumers.filter(c => c.files && c.files.length > 0).length}
              color="purple"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs and Controls */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              <TabButton 
                active={currentTab === 'partners'} 
                onClick={() => setCurrentTab('partners')}
                icon={<MdBusinessCenter />}
                badge={partners.length}
              >
                Partners
              </TabButton>
              <TabButton 
                active={currentTab === 'associates'} 
                onClick={() => setCurrentTab('associates')}
                icon={<FiUsers />}
                badge={associates.length}
              >
                Associates
              </TabButton>
              <TabButton 
                active={currentTab === 'consumers'} 
                onClick={() => setCurrentTab('consumers')}
                icon={<FiUser />}
                badge={consumers.length}
              >
                Consumers ({consumers.length})
              </TabButton>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${currentTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

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
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredData.length}</span> of {consumers.length} consumers
              {searchTerm && ` for "${searchTerm}"`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
            </div>
          </div>
        </div>

        {/* Data Display */}
        <div className="p-4 md:p-6">
          {consumersError ? (
            <div className="text-center py-12 bg-red-50 rounded-xl">
              <FiAlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Consumers</h3>
              <p className="text-gray-600 mb-4">
                {consumersError?.data?.message || consumersError?.message || "Failed to load consumers"}
              </p>
              <button
                onClick={handleRefreshConsumers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry Loading
              </button>
            </div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              currentTab={currentTab} 
              searchTerm={searchTerm} 
              consumersCount={consumers.length}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item, index) => (
                <UserCard 
                  key={item._id || `consumer-${index}`}
                  user={item}
                  type={currentTab}
                  onClick={() => handleUserClick(item, currentTab)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((item, index) => (
                <UserCard 
                  key={item._id || `consumer-${index}`}
                  user={item}
                  type={currentTab}
                  viewMode="list"
                  onClick={() => handleUserClick(item, currentTab)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleTimeString('en-IN')}</p>
        <p className="mt-1">Total Consumers in System: {consumers.length}</p>
      </div>
       {docUrl && (
      <DocumentViewer
        url={docUrl}
        type={docType}
        onClose={() => {
          setDocUrl(null);
          setDocType(null);
        }}
      />
    )}
    </div>
  );
};

// ========== COMPONENTS ==========

// User Details Modal Component - UPDATED (NO JSON)
const UserDetailsModal = ({ user, type, onClose, onDocumentView }) => {
  // Get user details based on type
  const getUserName = () => {
    if (type === 'consumers') return user.Name || user.name || 'Unnamed Consumer';
    return user.name || user.Name || 'Unnamed User';
  };

  const getEmail = () => {
    return user.email || 'No email';
  };

  const getMobile = () => {
    return user.mobile ? user.mobile.toString() : 'No phone';
  };

  const getRole = () => {
    if (type === 'consumers') return user.role || 'Consumer';
    return user.role || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getCompany = () => {
    return user.companyName || 'No company';
  };

  const getDistrict = () => {
    return user.district || 'N/A';
  };

  const getFilesCount = () => {
    return user.files?.length || 0;
  };

  const hasFiles = getFilesCount() > 0;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format mobile number
  const formatMobile = (mobile) => {
    if (!mobile) return 'N/A';
    const mobileStr = mobile.toString();
    if (mobileStr.length === 10) {
      return `${mobileStr.slice(0,5)} ${mobileStr.slice(5)}`;
    }
    return mobileStr;
  };

  // Render different sections based on user type
  const renderConsumerDetails = () => (
    <>
      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MdContactPhone /> Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard 
            icon={<FiUser className="text-blue-500" />}
            title="Full Name"
            value={getUserName()}
            bgColor="bg-blue-50"
          />
          <DetailCard 
            icon={<MdEmail className="text-green-500" />}
            title="Email Address"
            value={getEmail()}
            bgColor="bg-green-50"
          />
          <DetailCard 
            icon={<MdPhone className="text-purple-500" />}
            title="Mobile Number"
            value={formatMobile(user.mobile)}
            bgColor="bg-purple-50"
          />
          <DetailCard 
            icon={<MdBusiness className="text-amber-500" />}
            title="Company"
            value={getCompany()}
            bgColor="bg-amber-50"
          />
        </div>
      </div>


    </>
  );

  const renderPartnerDetails = () => (
    <>
      {/* Project Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GiSolarPower /> Project Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard 
            icon={<FiHome className="text-blue-500" />}
            title="Project Name"
            value={user.projectName || 'N/A'}
            bgColor="bg-blue-50"
          />
          <DetailCard 
            icon={<MdElectricBolt className="text-green-500" />}
            title="Capacity"
            value={user.capacity?.ac ? `${user.capacity.ac} MW` : 'N/A'}
            bgColor="bg-green-50"
          />
          <DetailCard 
            icon={<FiCheckCircle className="text-amber-500" />}
            title="Farm Status"
            value={user.statusOfFarm || 'N/A'}
            bgColor="bg-amber-50"
          />
          <DetailCard 
            icon={<MdDescription className="text-purple-500" />}
            title="Regulatory Status"
            value={user.regulatoryStatus || 'N/A'}
            bgColor="bg-purple-50"
          />
        </div>
      </div>

      {/* Location Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MdLocationOn /> Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard 
            icon={<MdLocationCity className="text-red-500" />}
            title="Taluka"
            value={user.location?.taluka || 'N/A'}
            bgColor="bg-red-50"
          />
          <DetailCard 
            icon={<FiGlobe className="text-indigo-500" />}
            title="District"
            value={user.location?.district || 'N/A'}
            bgColor="bg-indigo-50"
          />
        </div>
      </div>
    </>
  );

const RenderAllKeys = ({ data, onDocumentView }) => {
  if (data === null || data === undefined) {
    return <span className="text-gray-400">null</span>;
  }

  if (typeof data !== "object") {
    if (typeof data === "string" && data.startsWith("http")) {

    const getFileTypeFromUrl = (url) => {
  if (url.includes(".pdf")) return "pdf";
  if (url.match(/\.(jpg|jpeg|png|webp)/)) return "jpg";
  return "raw"; // 🔥 raw पण google viewer मध्ये जाईल
};


      return (
        <button
          onClick={() =>
            onDocumentView(data, getFileTypeFromUrl(data))
          }
          className="text-blue-600 underline text-sm"
        >
          View Document
        </button>
      );
    }

    return <span className="text-gray-800">{String(data)}</span>;
  }

  return (
    <div className="ml-4 space-y-1">
      {Object.entries(data).map(([key, value]) => {
        if (key === "password") return null;

        return (
          <div key={key}>
            <span className="font-semibold text-gray-700">{key}:</span>{" "}
            <RenderAllKeys
              data={value}
              onDocumentView={onDocumentView}
            />
          </div>
        );
      })}
    </div>
  );
};



  const renderAssociateDetails = () => {
    const solarFarms = user.onboard?.solarFarms || [];
    const consumers = user.onboard?.consumers || [];
    
    return (
      <>
        {/* Business Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdBusinessCenter /> Business Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailCard 
              icon={<GiSolarPower className="text-green-500" />}
              title="Solar Farms Managed"
              value={solarFarms.length}
              bgColor="bg-green-50"
            />
            <DetailCard 
              icon={<FiUsers className="text-blue-500" />}
              title="Consumers Linked"
              value={consumers.length}
              bgColor="bg-blue-50"
            />
            <DetailCard 
              icon={<MdAccountBalance className="text-purple-500" />}
              title="Bank Name"
              value={user.bankDetails?.bankName || 'N/A'}
              bgColor="bg-purple-50"
            />
            <DetailCard 
              icon={<FiHash className="text-amber-500" />}
              title="Account Number"
              value={user.bankDetails?.accountNumber ? `•••• ${user.bankDetails.accountNumber.slice(-4)}` : 'N/A'}
              bgColor="bg-amber-50"
            />
          </div>
        </div>

        {/* Managed Solar Farms */}
        {solarFarms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GiSolarPower /> Managed Solar Farms ({solarFarms.length})
            </h3>
            <div className="space-y-3">
              {solarFarms.slice(0, 3).map((farm, index) => (
                <div key={farm._id || index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{farm.projectName || `Farm ${index + 1}`}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {farm.capacity?.ac || 'N/A'} MW • {farm.location?.taluka || 'N/A'}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      farm.statusOfFarm?.toLowerCase().includes('approved') ? 'bg-green-100 text-green-800' :
                      farm.statusOfFarm?.toLowerCase().includes('pending') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {farm.statusOfFarm || 'N/A'}
                    </span>
                  </div>
                  {farm.landDocument?.fileUrl && (
                    <button
onClick={() =>
  onDocumentView(
    farm.landDocument.fileUrl,
    farm.landDocument.fileType === "pdf" ? "pdf" : "jpg"
  )
}

                      className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <FiExternalLink className="w-4 h-4" /> View Land Document
                    </button>
                  )}
                </div>
              ))}
              {solarFarms.length > 3 && (
                <div className="text-center text-gray-500 text-sm">
                  + {solarFarms.length - 3} more solar farms
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              type === 'partners' ? 'bg-blue-100' :
              type === 'associates' ? 'bg-green-100' :
              'bg-purple-100'
            }`}>
              {type === 'partners' ? <MdBusinessCenter className="w-6 h-6 text-blue-600" /> :
               type === 'associates' ? <FiUsers className="w-6 h-6 text-green-600" /> :
               <FiUser className="w-6 h-6 text-purple-600" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getUserName()}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  type === 'partners' ? 'bg-blue-100 text-blue-800' :
                  type === 'associates' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {getRole()}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {user._id?.slice(-8) || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Common Information for all types */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiInfo /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard 
                icon={<MdEmail className="text-green-500" />}
                title="Email"
                value={getEmail()}
                bgColor="bg-green-50"
              />
              <DetailCard 
                icon={<MdPhone className="text-blue-500" />}
                title="Mobile"
                value={formatMobile(user.mobile)}
                bgColor="bg-blue-50"
              />
              <DetailCard 
                icon={<FiCalendar className="text-purple-500" />}
                title="Created On"
                value={formatDate(user.createdAt)}
                bgColor="bg-purple-50"
              />
              <DetailCard 
                icon={<FiClock className="text-amber-500" />}
                title="Last Updated"
                value={formatDate(user.updatedAt)}
                bgColor="bg-amber-50"
              />
            </div>
          </div>

          {/* Type-specific details */}
          {type === 'consumers' && renderConsumerDetails()}
{type === 'partners' && (
  <>
    {renderPartnerDetails()}

    {/* 🔥 FULL PARTNER RAW DATA */}
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiDatabase /> Complete Partner Data
      </h3>

      <div className="bg-gray-50 border rounded-xl p-4 text-sm max-h-[400px] overflow-auto">
<RenderAllKeys data={user} onDocumentView={onDocumentView} />
      </div>
    </div>
  </>
)}
          {type === 'associates' && renderAssociateDetails()}

          {/* Files Section (For Consumers) */}
          {type === 'consumers' && hasFiles && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdCloudUpload /> Uploaded Documents ({getFilesCount()})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.files.map((file, index) => (
                  <ModalFileCard 
                    key={file._id || index} 
                    file={file} 
                    index={index}
onView={() => onDocumentView(file.url, file.fileType)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <FiClock className="w-4 h-4" />
            Last updated: {formatDate(user.updatedAt)}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <FiEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail Card Component
const DetailCard = ({ icon, title, value, bgColor = 'bg-gray-50', small = false }) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <div className={`font-medium ${small ? 'text-sm' : 'text-base'} text-gray-700`}>{title}</div>
    </div>
    <div className={`${small ? 'text-sm' : 'text-base'} font-semibold text-gray-900 break-words`}>
      {value || 'N/A'}
    </div>
  </div>
);

// Modal File Card Component (Only View, No Download)
const ModalFileCard = ({ file, index, onView }) => {
  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(type)) {
      return <FiImage className="w-5 h-5 text-blue-500" />;
    } else if (type === 'pdf') {
      return <FiFileText className="w-5 h-5 text-red-500" />;
    } else {
      return <FiFile className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileTypeLabel = () => {
    const type = file.fileType?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(type)) return 'Image';
    if (type === 'pdf') return 'PDF Document';
    return 'Document';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded">
            {getFileIcon(file.fileType)}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {getFileTypeLabel()} {index + 1}
            </div>
            <div className="text-xs text-gray-500">
              Type: .{file.fileType}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        Uploaded: {formatDate(file.uploadedAt)}
      </div>
      
      <button
        onClick={onView}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <FiExternalLink className="w-4 h-4" /> View Document
      </button>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
    </div>
    <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
  </div>
);

// Stat Card Component
const StatCard = ({ icon, title, value, color, subItems }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    amber: 'bg-amber-50 border-amber-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 rounded-xl bg-white shadow-sm">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      {subItems && (
        <div className="flex gap-2 mt-4">
          {subItems.map((item, index) => (
            <span key={index} className={`text-xs px-2 py-1 rounded-full ${item.color}`}>
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, children, badge }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    {children}
  </button>
);

// Empty State Component
const EmptyState = ({ currentTab, searchTerm, consumersCount }) => (
  <div className="text-center py-12">
    {consumersCount === 0 ? (
      <>
        <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Consumers Found</h3>
        <p className="text-gray-600 mb-4">
          There are no consumers in the system yet.
        </p>
      </>
    ) : (
      <>
        <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No {currentTab} found</h3>
        <p className="text-gray-600 mb-4">
          {searchTerm ? `No results for "${searchTerm}"` : `No ${currentTab} available`}
        </p>
        {searchTerm && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Search
          </button>
        )}
      </>
    )}
  </div>
);

// User Card Component (Simplified - Click to open modal)
const UserCard = ({ user, type, viewMode = 'grid', onClick }) => {
  // Get user details
  const getName = () => {
    if (type === 'consumers') return user.Name || user.name || 'Unnamed Consumer';
    return user.name || user.Name || 'Unnamed User';
  };

  const getEmail = () => {
    return user.email || 'No email';
  };

  const getMobile = () => {
    return user.mobile ? user.mobile.toString() : 'No phone';
  };

  const getCompany = () => {
    return user.companyName || 'No company';
  };

  const getFilesCount = () => {
    return user.files?.length || 0;
  };

  const hasFiles = getFilesCount() > 0;

  return (
    <div 
      className={`${viewMode === 'grid' ? 'bg-gradient-to-br from-gray-50 to-blue-50' : 'bg-gray-50'} border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            hasFiles ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            {hasFiles ? (
              <FiFileText className="w-5 h-5 text-purple-600" />
            ) : (
              <FiUser className="w-5 h-5 text-gray-600" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg">{getName()}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === 'partners' ? 'bg-blue-100 text-blue-800' :
                type === 'associates' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              {hasFiles && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {getFilesCount()} files
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{getEmail()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiPhone className="w-4 h-4 flex-shrink-0" />
                <span>{getMobile()}</span>
              </div>
              {type === 'consumers' && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdBusiness className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{getCompany()}</span>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <FiEye className="w-3 h-3" /> Click to view details
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminData;
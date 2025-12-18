import React, { useEffect, useState } from 'react';
import { useGetAssociateProfileQuery } from '../../Redux/associateUpdate.api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiFileText, FiDownload, FiCreditCard, FiUsers,
  FiSun, FiChevronDown, FiChevronUp, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiExternalLink,
  FiZap, FiPower
} from 'react-icons/fi';
import {
  MdBusinessCenter, MdLocationOn, MdAttachMoney,
  MdAccountBalance, MdElectricBolt, MdGridView,
  MdList, MdVerified
} from 'react-icons/md';
import { FaRegBuilding } from 'react-icons/fa';

const AssocProfile = () => {
  const navigate = useNavigate();
  const associate = useSelector((state) => state.associatePartner?.user);
  const associateId = associate?._id;

  const { data, isLoading, isError } = useGetAssociateProfileQuery(
    associateId,
    { skip: !associateId }
  );

  // ✅ STATES (always on top)
  const [expandedFarm, setExpandedFarm] = useState(null);
  const [expandedConsumer, setExpandedConsumer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('grid');

  // ✅ SAFE DATA
  const profile = data?.profile || data || {};
  const bankDetails = profile?.bankDetails;

  // ✅ DETERMINE ONBOARD TYPE (before hooks)
  let onboardType = 'CONSUMER';
  if (profile?.onboardType) {
    onboardType = profile.onboardType;
  } else if (profile?.onboard?.onboardType) {
    onboardType = profile.onboard.onboardType;
  } else if (associate?.onboardType) {
    onboardType = associate.onboardType;
  }

  // ✅ NORMALIZED DATA (single source of truth)
  const onboard = profile?.onboard || {};

  const consumers = Array.isArray(onboard.consumers)
    ? onboard.consumers
    : [];

  const solarFarms = Array.isArray(onboard.solarFarms)
    ? onboard.solarFarms
    : [];

  // ✅ DEFAULT TAB FOR SOLARFARM ONLY IF DATA EXISTS
  useEffect(() => {
    if (onboardType === 'SOLARFARM' && solarFarms.length > 0) {
      setActiveTab('solarFarms');
    } else if (onboardType === 'SOLARFARM' && solarFarms.length === 0) {
      setActiveTab('overview');
    }
  }, [onboardType, solarFarms.length]);

  // ✅ LOADING / ERROR AFTER ALL HOOKS
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorComponent />;

  const contractCapacity =
    profile?.contractCapacity ||
    associate?.contractCapacity ||
    'N/A';

  // ✅ CALCULATIONS
  const totalCapacity = solarFarms.reduce((sum, farm) => {
    const ac =
      parseFloat(farm.capacity?.ac) ||
      parseFloat(farm.acCapacity) ||
      parseFloat(farm.capacityAC) ||
      0;
    return sum + ac;
  }, 0);

  const totalLoadCapacity = consumers.reduce((sum, consumer) => {
    const load =
      parseFloat(consumer.consumerLoadCapacity) ||
      parseFloat(consumer.loadCapacity) ||
      0;
    return sum + load;
  }, 0);

  // ✅ TABS - Only show solarFarms tab if data exists
  const getAvailableTabs = () => {
    const tabs = [
      { id: 'overview', label: 'Overview', icon: <FiUser /> },
      { id: 'bank', label: 'Bank Details', icon: <FiCreditCard /> }
    ];

    if (onboardType === 'CONSUMER') {
      tabs.splice(1, 0, {
        id: 'consumers',
        label: 'Consumers',
        icon: <FiUsers />,
        badge: consumers.length
      });
    }

    // ✅ ONLY SHOW SOLAR FARMS TAB IF DATA EXISTS
    if (onboardType === 'SOLARFARM' && solarFarms.length > 0) {
      tabs.splice(1, 0, {
        id: 'solarFarms',
        label: 'Solar Farms',
        icon: <FiSun />,
        badge: solarFarms.length
      });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Associate Dashboard</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-gray-600">
                  Welcome, <span className="font-bold text-indigo-700">
                    {profile?.name || associate?.name || 'Associate'}
                  </span>
                </span>

                <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-3 md:p-4 rounded-xl shadow-sm">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {(profile?.name || associate?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{profile?.role || 'Associate'}</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${onboardType === 'CONSUMER'
            ? 'lg:grid-cols-5'
            : 'lg:grid-cols-5'
          } gap-4 mb-8`}
      >
        {onboardType === 'CONSUMER' ? (
          <>
            <StatCard
              icon={<FiUsers className="w-6 h-6 text-purple-500" />}
              title="Total Consumers"
              value={consumers.length}
              color="purple"
            />
            <StatCard
              icon={<FiZap className="w-6 h-6 text-blue-500" />}
              title="Total Load"
              value={`${totalLoadCapacity.toFixed(1)} kW`}
              color="blue"
            />
            <StatCard
              icon={<FiPower className="w-6 h-6 text-green-500" />}
              title="Avg Load/Consumer"
              value={consumers.length > 0 ? (totalLoadCapacity / consumers.length).toFixed(1) : 0}
              color="green"
              suffix="kW"
            />
            <StatCard
              icon={<MdAccountBalance className="w-6 h-6 text-indigo-500" />}
              title="Contract Capacity"
              value={contractCapacity}
              color="indigo"
            />
            <StatCard
              icon={<FaRegBuilding className="w-6 h-6 text-indigo-500" />}
              title="Active Since"
              value={new Date(profile?.createdAt || associate?.createdAt || new Date()).toLocaleDateString('en-IN', {
                month: 'short',
                year: 'numeric'
              })}
              color="indigo"
            />
          </>
        ) : (
          <>
            <StatCard
              icon={<FiSun className="w-6 h-6 text-amber-500" />}
              title="Solar Farms"
              value={solarFarms.length}
              color="amber"
            />
            <StatCard
              icon={<MdElectricBolt className="w-6 h-6 text-green-500" />}
              title="Total Capacity"
              value={solarFarms.length > 0 ? `${totalCapacity.toFixed(2)} MW` : '0 MW'}
              color="green"
            />
            <StatCard
              icon={<FaRegBuilding className="w-6 h-6 text-blue-500" />}
              title="Active Projects"
              value={solarFarms.filter(farm =>
                farm.statusOfFarm === 'Clear' ||
                farm.regulatoryStatus === 'APPROVED' ||
                farm.status === 'ACTIVE'
              ).length}
              color="blue"
            />
            <StatCard
              icon={<MdVerified className="w-6 h-6 text-emerald-500" />}
              title="Approval Rate"
              value={solarFarms.length > 0 ?
                `${Math.round((solarFarms.filter(f =>
                  f.statusOfFarm === 'Clear' ||
                  f.regulatoryStatus === 'APPROVED' ||
                  f.status === 'APPROVED'
                ).length / solarFarms.length) * 100)}%` :
                '0%'
              }
              color="emerald"
            />
            <StatCard
              icon={<MdAccountBalance className="w-6 h-6 text-indigo-500" />}
              title="Contract Capacity"
              value={contractCapacity}
              color="indigo"
            />
          </>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableTabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            badge={tab.badge}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-gray-600" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem icon={<FiUser />} label="Name" value={profile?.name || associate?.name} />
                <InfoItem icon={<FiMail />} label="Email" value={profile?.email || associate?.email} />
                <InfoItem icon={<FiPhone />} label="Mobile" value={profile?.mobile || associate?.mobile} />
                <InfoItem icon={<FiMapPin />} label="Address" value={profile?.address || associate?.address} />
                <InfoItem icon={<MdBusinessCenter />} label="Role" value={profile?.role || 'Associate'} />
                <InfoItem
                  icon={<FiCalendar />}
                  label="Joined Date"
                  value={new Date(profile?.createdAt || associate?.createdAt || new Date()).toLocaleDateString()}
                />
              </div>
            </div>

            {/* Recent Data based on onboardType */}
            {onboardType === 'CONSUMER' ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiUsers className="text-gray-600" /> Recent Consumers
                  </h3>
                  {consumers.length > 3 && (
                    <button
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      onClick={() => setActiveTab('consumers')}
                    >
                      View All →
                    </button>
                  )}
                </div>
                {consumers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {consumers.slice(0, 3).map((consumer, index) => (
                      <ConsumerCard
                        key={consumer._id || consumer.id || index}
                        consumer={consumer}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FiUsers className="w-12 h-12 text-gray-300" />}
                    title="No Consumers Added"
                    description="You haven't added any consumers yet."
                    actionText="Add Consumers"
                    onAction={() => navigate('/consumer-form')}
                  />
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiSun className="text-gray-600" /> Recent Solar Farms
                  </h3>
                  {solarFarms.length > 2 && (
                    <button
                      className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                      onClick={() => setActiveTab('solarFarms')}
                    >
                      View All →
                    </button>
                  )}
                </div>
                {solarFarms.length > 0 ? (
                  <div className="space-y-4">
                    {solarFarms.slice(0, 2).map((farm, index) => (
                      <FarmCard
                        key={farm._id || farm.id || index}
                        farm={farm}
                        isExpanded={expandedFarm === (farm._id || farm.id)}
                        onToggle={() => setExpandedFarm(
                          expandedFarm === (farm._id || farm.id) ? null : (farm._id || farm.id)
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FiSun className="w-12 h-12 text-gray-300" />}
                    title="No Solar Farms Added"
                    description="You haven't added any solar farms yet."
                    actionText="Add Solar Farms"
                    onAction={() => navigate('/Associate-Dash')}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'consumers' && onboardType === 'CONSUMER' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-gray-600" /> All Consumers ({consumers.length})
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Total Load: <span className="font-semibold">{totalLoadCapacity.toFixed(1)} kW</span>
                </span>
                <div className="flex gap-2">
                  <button
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-400'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <MdGridView className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-400'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <MdList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consumers.map((consumer, index) => (
                  <ConsumerCard
                    key={consumer._id || consumer.id || index}
                    consumer={consumer}
                    index={index}
                    isExpanded={expandedConsumer === (consumer._id || consumer.id)}
                    onToggle={() => setExpandedConsumer(
                      expandedConsumer === (consumer._id || consumer.id) ? null : (consumer._id || consumer.id)
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumer Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load Capacity</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consumers.map((consumer, index) => (
                      <tr key={consumer._id || consumer.id || index} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {consumer.consumerName || consumer.name || `Consumer ${index + 1}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {(consumer._id || consumer.id || 'N/A').toString().slice(-6)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {(consumer.consumerLoadCapacity || consumer.loadCapacity || '0')} kW
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {consumer.createdAt ? new Date(consumer.createdAt).toLocaleDateString() :
                            consumer.createdDate ? new Date(consumer.createdDate).toLocaleDateString() :
                              'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-sm text-purple-600 hover:text-purple-900 font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {consumers.length === 0 && (
              <EmptyState
                icon={<FiUsers className="w-16 h-16 text-gray-300" />}
                title="No Consumers Found"
                description="Start adding consumers to see them here."
                actionText="Add First Consumer"
                onAction={() => navigate('/consumer-form')}
              />
            )}
          </div>
        )}

        {/* SOLAR FARMS TAB - ONLY SHOWN IF DATA EXISTS */}
        {activeTab === 'solarFarms' && onboardType === 'SOLARFARM' && solarFarms.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiSun /> All Solar Farms ({solarFarms.length})
            </h3>

            {solarFarms.length > 0 ? (
              solarFarms.map((farm, index) => (
                <FarmCard
                  key={farm._id || index}
                  farm={farm}
                  index={index}
                  isExpanded={expandedFarm === (farm._id || index)}
                  onToggle={() =>
                    setExpandedFarm(
                      expandedFarm === (farm._id || index)
                        ? null
                        : (farm._id || index)
                    )
                  }
                />
              ))
            ) : (
              <EmptyState
                icon={<FiSun className="w-12 h-12 text-gray-300" />}
                title="No Solar Farms Added"
                description="You haven't added any solar farms yet."
                actionText="Add Solar Farm"
                onAction={() => navigate('/Associate-Dash')}
              />
            )}
          </div>
        )}

        {activeTab === 'bank' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiCreditCard className="text-gray-600" /> Bank Details
            </h3>

            {bankDetails ? (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <MdAccountBalance className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{bankDetails.bankName || 'Bank Details'}</h4>
                    <p className="text-sm text-gray-600">{bankDetails.branch || ''}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Holder</p>
                    <p className="font-semibold text-gray-900">{bankDetails.holderName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Number</p>
                    <p className="font-semibold text-gray-900">
                      {bankDetails.accountNumber ?
                        `•••• ${bankDetails.accountNumber.toString().slice(-4)}` :
                        'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">IFSC Code</p>
                    <p className="font-semibold text-gray-900">{bankDetails.ifsc || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                    <FiFileText /> View Statement
                  </button>
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2">
                    <FiDownload /> Download Details
                  </button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<FiCreditCard className="w-16 h-16 text-gray-300" />}
                title="No Bank Details Available"
                description="Please contact our support team to add or update your banking details."
                onAction={() => navigate('/support')}
              />

            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading profile...</p>
  </div>
);

const ErrorComponent = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
    <FiAlertCircle className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Error Loading Profile</h3>
    <p className="text-gray-600">Please try again later</p>
  </div>
);

const EmptyState = ({ icon, title, description, actionText, onAction }) => (
  <div className="text-center py-12">
    {icon}
    <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{title}</h4>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700"
      >
        {actionText}
      </button>
    )}
  </div>
);

const StatCard = ({ icon, title, value, color, suffix }) => {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-100',
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    amber: 'bg-amber-50 border-amber-100',
    indigo: 'bg-indigo-50 border-indigo-100',
    emerald: 'bg-emerald-50 border-emerald-100'
  };

  const iconBgClasses = {
    purple: 'bg-purple-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    amber: 'bg-amber-100',
    indigo: 'bg-indigo-100',
    emerald: 'bg-emerald-100'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-4 md:p-5`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {value}
            {suffix && <span className="text-sm ml-1">{suffix}</span>}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, children, badge }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${active
      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
      : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    {icon}
    {children}
    {badge !== undefined && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-gray-200 text-gray-700'
        }`}>
        {badge}
      </span>
    )}
  </button>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="text-gray-500 mt-1">{icon}</div>
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value || 'N/A'}</div>
    </div>
  </div>
);

const ConsumerCard = ({ consumer, index, isExpanded, onToggle }) => {
  const hasDetails = onToggle; // Check if expandable

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-4 border border-gray-200 hover:border-purple-200 transition-colors ${hasDetails ? 'cursor-pointer hover:bg-gray-100/50' : ''
      }`} onClick={hasDetails ? onToggle : undefined}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-lg flex items-center justify-center font-semibold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {consumer.consumerName || consumer.name || `Consumer ${index + 1}`}
            </h4>
            <div className="text-sm text-gray-500">
              ID: {(consumer._id || consumer.id || 'N/A').toString().slice(-6)}
            </div>
          </div>
        </div>
        {hasDetails && (
          <div className="text-gray-400">
            {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-600">Load Capacity:</span>
          <span className="font-medium text-gray-900 ml-2">
            {(consumer.consumerLoadCapacity || consumer.loadCapacity || 'N/A')} kW
          </span>
        </div>
        {!hasDetails && (
          <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
            View →
          </button>
        )}
      </div>

      {isExpanded && hasDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Consumer ID:</span>
              <span className="font-medium text-gray-900 text-sm">{consumer._id || consumer.id || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Added On:</span>
              <span className="font-medium text-gray-900 text-sm">
                {consumer.createdAt ? new Date(consumer.createdAt).toLocaleDateString() :
                  consumer.createdDate ? new Date(consumer.createdDate).toLocaleDateString() :
                    'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Load Capacity:</span>
              <span className="font-medium text-gray-900 text-sm">
                {(consumer.consumerLoadCapacity || consumer.loadCapacity || '0')} kW
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// FarmCard component with improved data handling
const FarmCard = ({ farm, index, isExpanded, onToggle, viewMode = 'list' }) => {
  const getStatusIcon = (status) => {
    if (!status) return null;

    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'CLEAR':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <FiAlertCircle className="w-4 h-4" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const statusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'CLEAR':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Safely get farm data
  const farmName = farm.projectName || farm.name || `Solar Farm ${index + 1}`;
  const capacityAC = farm.capacity?.ac || farm.acCapacity || farm.capacityAC || 'N/A';
  const taluka = farm.location?.taluka || farm.taluka || 'N/A';
  const district = farm.location?.district || farm.district || 'N/A';
  const landOwnership = farm.landOwnership || 'N/A';
  const status = farm.statusOfFarm || farm.regulatoryStatus || farm.status || 'N/A';
  const coordinates = farm.location?.coordinates || farm.coordinates;

  return (
    <div className={`${viewMode === 'grid' ? 'bg-gradient-to-br from-gray-50 to-amber-50' : 'bg-gray-50'} rounded-xl border border-gray-200 overflow-hidden`}>
      <div
        className={`p-4 ${isExpanded ? 'border-b border-gray-200' : ''} cursor-pointer hover:bg-gray-100/50`}
        onClick={onToggle}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {index !== undefined && (
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-semibold">
                {index + 1}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">{farmName}</h4>
                {status && status !== 'N/A' && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusColor(status)}`}>
                    {getStatusIcon(status)}
                    {status}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {capacityAC && capacityAC !== 'N/A' && (
                  <span className="flex items-center gap-1">
                    <MdElectricBolt className="w-4 h-4" /> {capacityAC} MW
                  </span>
                )}
                {taluka && taluka !== 'N/A' && (
                  <span className="flex items-center gap-1">
                    <MdLocationOn className="w-4 h-4" /> {taluka}
                  </span>
                )}
                {landOwnership && landOwnership !== 'N/A' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {landOwnership}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-gray-400">
            {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Location Details */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MdLocationOn className="text-gray-500" /> Location
              </h5>
              <div className="space-y-2">
                <InfoRow label="Taluka" value={taluka} />
                <InfoRow label="District" value={district} />
                <InfoRow
                  label="Coordinates"
                  value={coordinates?.lat && coordinates?.lng
                    ? `${coordinates.lat}, ${coordinates.lng}`
                    : 'N/A'
                  }
                />
                <InfoRow label="Distance from Substation" value={farm.distanceFromSubstation || 'N/A'} />
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Technical Details</h5>
              <div className="space-y-2">
                <InfoRow label="AC Capacity" value={capacityAC} />
                <InfoRow label="DC Capacity" value={farm.capacity?.dc || farm.dcCapacity || farm.capacityDC || 'N/A'} />
                <InfoRow
                  label="Substation"
                  value={farm.substation?.substation ?
                    `${farm.substation.substation} (${farm.substation.category || ''})` :
                    'N/A'
                  }
                />
                <InfoRow label="Land Ownership" value={landOwnership} />
              </div>
            </div>

            {/* Status & Financial */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Status & Financial</h5>
              <div className="space-y-2">
                {farm.regulatoryStatus && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Regulatory:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(farm.regulatoryStatus)} flex items-center gap-1`}>
                      {getStatusIcon(farm.regulatoryStatus)}
                      {farm.regulatoryStatus}
                    </span>
                  </div>
                )}
                {farm.statusOfLoan && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Loan:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(farm.statusOfLoan)} flex items-center gap-1`}>
                      {getStatusIcon(farm.statusOfLoan)}
                      {farm.statusOfLoan}
                    </span>
                  </div>
                )}
                {farm.tariffExpected && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tariff Expected:</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <MdAttachMoney /> {farm.tariffExpected}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          {farm.expectedCommissioningTimeline && (
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">Project Timeline</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TimelineItem
                  label="EPC Work Start"
                  date={farm.expectedCommissioningTimeline.epcWorkStartDate}
                />
                <TimelineItem
                  label="Injection Date"
                  date={farm.expectedCommissioningTimeline.injectionDate}
                />
                <TimelineItem
                  label="Commercial Operations"
                  date={farm.expectedCommissioningTimeline.commercialOperationsDate}
                />
              </div>
            </div>
          )}

          {/* Documents */}
          {farm.landDocument?.fileUrl && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Land Document</div>
                    <div className="text-sm text-gray-500">Click to view/download</div>
                  </div>
                </div>
                <a
                  href={farm.landDocument.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
                >
                  <FiExternalLink /> View Document
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value || 'N/A'}</span>
  </div>
);

const TimelineItem = ({ label, date }) => (
  <div className="flex items-start gap-3">
    <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-2"></div>
    <div>
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <div className="text-sm text-gray-600">
        {date ? new Date(date).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  </div>
);

export default AssocProfile;
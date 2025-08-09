import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, DollarSign, Activity, Filter, Search } from 'lucide-react';

const GeographicDistribution = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [viewMode, setViewMode] = useState('regions'); // regions, countries, cities
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeographicData();
  }, [viewMode]);

  const loadGeographicData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData = [
      {
        id: 'asia-pacific',
        name: 'Asia Pacific',
        coordinates: { lat: 35.6762, lng: 139.6503 },
        disasters: 42,
        totalFunds: 2450000,
        beneficiaries: 18500,
        activeVendors: 125,
        avgResponseTime: 4.2,
        countries: [
          { name: 'Japan', disasters: 8, funds: 680000, beneficiaries: 4200 },
          { name: 'Philippines', disasters: 12, funds: 580000, beneficiaries: 5100 },
          { name: 'Indonesia', disasters: 15, funds: 720000, beneficiaries: 6800 },
          { name: 'India', disasters: 7, funds: 470000, beneficiaries: 2400 }
        ]
      },
      {
        id: 'americas',
        name: 'Americas',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        disasters: 38,
        totalFunds: 2100000,
        beneficiaries: 15200,
        activeVendors: 98,
        avgResponseTime: 5.8,
        countries: [
          { name: 'United States', disasters: 18, funds: 980000, beneficiaries: 7200 },
          { name: 'Mexico', disasters: 8, funds: 420000, beneficiaries: 3100 },
          { name: 'Brazil', disasters: 7, funds: 380000, beneficiaries: 2800 },
          { name: 'Colombia', disasters: 5, funds: 320000, beneficiaries: 2100 }
        ]
      },
      {
        id: 'europe',
        name: 'Europe',
        coordinates: { lat: 50.1109, lng: 8.6821 },
        disasters: 28,
        totalFunds: 1650000,
        beneficiaries: 9800,
        activeVendors: 76,
        avgResponseTime: 3.5,
        countries: [
          { name: 'Turkey', disasters: 12, funds: 720000, beneficiaries: 4500 },
          { name: 'Italy', disasters: 6, funds: 380000, beneficiaries: 2100 },
          { name: 'Greece', disasters: 5, funds: 290000, beneficiaries: 1800 },
          { name: 'Spain', disasters: 5, funds: 260000, beneficiaries: 1400 }
        ]
      },
      {
        id: 'africa',
        name: 'Africa',
        coordinates: { lat: -1.2921, lng: 36.8219 },
        disasters: 22,
        totalFunds: 980000,
        beneficiaries: 12400,
        activeVendors: 58,
        avgResponseTime: 8.2,
        countries: [
          { name: 'Kenya', disasters: 6, funds: 280000, beneficiaries: 3200 },
          { name: 'Nigeria', disasters: 8, funds: 320000, beneficiaries: 4100 },
          { name: 'South Africa', disasters: 4, funds: 190000, beneficiaries: 2400 },
          { name: 'Ethiopia', disasters: 4, funds: 190000, beneficiaries: 2700 }
        ]
      }
    ];
    
    setRegions(mockData);
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getRegionColor = (disasters) => {
    if (disasters >= 35) return 'bg-red-500';
    if (disasters >= 25) return 'bg-orange-500';
    if (disasters >= 15) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRegionSize = (funds) => {
    const maxFunds = Math.max(...regions.map(r => r.totalFunds));
    const minSize = 60;
    const maxSize = 120;
    const size = minSize + ((funds / maxFunds) * (maxSize - minSize));
    return `${size}px`;
  };

  const RegionCard = ({ region, isSelected, onClick }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-avalanche-500 bg-avalanche-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } p-6 shadow-lg hover:shadow-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 ${getRegionColor(region.disasters)}`}></div>
          <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
        </div>
        <div className="text-sm text-gray-500">{region.disasters} disasters</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Total Funds</div>
          <div className="font-bold text-gray-900">{formatCurrency(region.totalFunds)}</div>
        </div>
        <div>
          <div className="text-gray-600">Beneficiaries</div>
          <div className="font-bold text-gray-900">{region.beneficiaries.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-600">Active Vendors</div>
          <div className="font-bold text-gray-900">{region.activeVendors}</div>
        </div>
        <div>
          <div className="text-gray-600">Response Time</div>
          <div className="font-bold text-gray-900">{region.avgResponseTime}h</div>
        </div>
      </div>
    </motion.div>
  );

  const CountryBreakdown = ({ region }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{region.name} - Country Breakdown</h3>
        <button
          onClick={() => setSelectedRegion(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        {region.countries.map((country, index) => (
          <div key={country.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-avalanche-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{country.name}</h4>
                <p className="text-sm text-gray-600">{country.disasters} active disasters</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-gray-900">{formatCurrency(country.funds)}</div>
              <div className="text-sm text-gray-600">{country.beneficiaries.toLocaleString()} people</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Geographic Distribution</h2>
          <p className="text-gray-600">Global relief operations and fund distribution</p>
        </div>
      </div>

      {/* World Map Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Activity Map</h3>
        
        {/* Simplified World Map */}
        <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-avalanche-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Interactive World Map</h4>
              <p className="text-gray-600 max-w-md">
                Visual representation of disaster relief operations worldwide. 
                Each region shows active disasters, funding levels, and impact metrics.
              </p>
            </div>
          </div>
          
          {/* Region Markers */}
          {regions.map((region, index) => (
            <div
              key={region.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${25 + (index * 20)}%`,
                top: `${30 + (index % 2 * 40)}%`
              }}
              onClick={() => setSelectedRegion(region)}
            >
              <div
                className={`rounded-full ${getRegionColor(region.disasters)} opacity-80 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white font-bold text-sm`}
                style={{
                  width: getRegionSize(region.totalFunds),
                  height: getRegionSize(region.totalFunds)
                }}
              >
                {region.disasters}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {region.name}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>High Activity (35+ disasters)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span>Medium Activity (25-34)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Moderate Activity (15-24)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Low Activity (0-14)</span>
          </div>
        </div>
      </motion.div>

      {/* Regional Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {regions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            isSelected={selectedRegion?.id === region.id}
            onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
          />
        ))}
      </div>

      {/* Country Breakdown */}
      {selectedRegion && <CountryBreakdown region={selectedRegion} />}

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {regions.reduce((sum, r) => sum + r.disasters, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Disasters</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(regions.reduce((sum, r) => sum + r.totalFunds, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Funds</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {regions.reduce((sum, r) => sum + r.beneficiaries, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Beneficiaries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {regions.reduce((sum, r) => sum + r.activeVendors, 0)}
            </div>
            <div className="text-sm text-gray-600">Active Vendors</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GeographicDistribution;

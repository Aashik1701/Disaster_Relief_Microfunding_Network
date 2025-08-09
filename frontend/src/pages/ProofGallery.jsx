import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Image, 
  FileText, 
  MapPin,
  Clock,
  CheckCircle,
  X,
  Filter,
  Eye
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ProofGallery = () => {
  const [proofItems, setProofItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock data for demonstration
  const mockProofData = [
    {
      id: '1',
      title: 'Food Distribution - Central Relief Camp',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
      description: 'Food packages distributed to 150 families in Central Relief Camp',
      location: 'Central Relief Camp, District A',
      timestamp: '2024-01-15T10:30:00Z',
      verificationStatus: 'verified',
      disasterId: 'FLOOD-2024-001',
      uploadedBy: '0x742d35Cc6634C0532925a3b8D',
      beneficiaries: 150,
      ipfsHash: 'QmXoYoY8xgU9QzYV7k8LHZjKvN2M1aP4Qr5TtUwV',
      tags: ['food', 'distribution', 'relief']
    },
    {
      id: '2',
      title: 'Medical Supplies Delivery',
      type: 'document',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500',
      description: 'Emergency medical supplies delivered to field hospital',
      location: 'Field Hospital, Sector B',
      timestamp: '2024-01-14T15:45:00Z',
      verificationStatus: 'pending',
      disasterId: 'FLOOD-2024-001',
      uploadedBy: '0x8fa3bF96E654Ab26f8e9A2B7C',
      beneficiaries: 75,
      ipfsHash: 'QmYzWx9vUr8QtZA6b5LMjPv3N2B8cR',
      tags: ['medical', 'supplies', 'healthcare']
    },
    {
      id: '3',
      title: 'Shelter Construction Progress',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
      description: 'Temporary shelters being constructed for displaced families',
      location: 'Relocation Site C',
      timestamp: '2024-01-13T08:20:00Z',
      verificationStatus: 'verified',
      disasterId: 'EARTHQUAKE-2024-002',
      uploadedBy: '0x9ab4eF78D123Cd45E6F7A890B',
      beneficiaries: 200,
      ipfsHash: 'QmZaB1cD2eF3gH4iJ5kL6mN7oP',
      tags: ['shelter', 'construction', 'housing']
    },
    {
      id: '4',
      title: 'Water Purification System Setup',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500',
      description: 'Installing water purification systems in affected areas',
      location: 'Village D Water Point',
      timestamp: '2024-01-12T12:10:00Z',
      verificationStatus: 'verified',
      disasterId: 'FLOOD-2024-001',
      uploadedBy: '0xbc5fG890H234Ij56K7L8M901N',
      beneficiaries: 500,
      ipfsHash: 'QmAbC2dE3fG4hI5jK6lM7nO8pQ',
      tags: ['water', 'purification', 'infrastructure']
    },
    {
      id: '5',
      title: 'Education Kit Distribution',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=500',
      description: 'School supplies and educational materials for children',
      location: 'Temporary School, Zone E',
      timestamp: '2024-01-11T14:30:00Z',
      verificationStatus: 'rejected',
      disasterId: 'CYCLONE-2024-003',
      uploadedBy: '0xdef7G123H456I789J012K345L',
      beneficiaries: 120,
      ipfsHash: 'QmDeFg3Hi4Jk5Lm6Nn7Oo8Pp9Q',
      tags: ['education', 'children', 'supplies']
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setProofItems(mockProofData);
    setFilteredItems(mockProofData);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = proofItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.verificationStatus === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, filterType, filterStatus, proofItems]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'video': return <Eye className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ProofCard = ({ proof, onClick }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(proof)}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="relative">
          <img
            src={proof.url}
            alt={proof.title}
            className="object-cover w-full h-48"
          />
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proof.verificationStatus)}`}>
              {proof.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
              {proof.verificationStatus.charAt(0).toUpperCase() + proof.verificationStatus.slice(1)}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white rounded-full bg-opacity-90">
              {getTypeIcon(proof.type)}
              <span className="ml-1 capitalize">{proof.type}</span>
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
            {proof.title}
          </h3>
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">
            {proof.description}
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{proof.location}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTimestamp(proof.timestamp)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-medium text-blue-600">
              {proof.beneficiaries} beneficiaries
            </span>
            <div className="flex flex-wrap gap-1">
              {proof.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const ProofModal = ({ proof, onClose }) => (
    <Modal isOpen={!!proof} onClose={onClose} size="max">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{proof?.title}</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <img
              src={proof?.url}
              alt={proof?.title}
              className="object-cover w-full h-64 rounded-lg lg:h-96"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600">{proof?.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Location</h4>
                <p className="text-gray-600">{proof?.location}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Timestamp</h4>
                <p className="text-gray-600">{formatTimestamp(proof?.timestamp)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Beneficiaries</h4>
                <p className="text-gray-600">{proof?.beneficiaries} people</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Status</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proof?.verificationStatus)}`}>
                  {proof?.verificationStatus?.charAt(0).toUpperCase() + proof?.verificationStatus?.slice(1)}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="mb-2 font-medium text-gray-900">IPFS Details</h4>
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="font-mono text-sm text-gray-600 break-all">
                  {proof?.ipfsHash}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {proof?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="primary" className="w-full">
                View on IPFS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Proof of Aid Gallery
          </h1>
          <p className="text-gray-600">
            Browse and verify aid distribution evidence stored on IPFS
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex items-center flex-1 space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search proofs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredItems.length} of {proofItems.length} proof items
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredItems.map((proof) => (
                <ProofCard
                  key={proof.id}
                  proof={proof}
                  onClick={setSelectedProof}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No proof items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>

      {/* Proof Modal */}
      <ProofModal
        proof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />
    </div>
  );
};

export default ProofGallery;

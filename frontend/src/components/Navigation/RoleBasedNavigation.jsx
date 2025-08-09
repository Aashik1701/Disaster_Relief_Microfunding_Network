import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Shield, 
  Banknote, 
  Database, 
  Store, 
  Heart, 
  Users, 
  Eye,
  FileText,
  BarChart3,
  Settings,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RoleGuard from '../Auth/RoleGuard';

const RoleBasedNavigation = ({ isMobile = false }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Home',
        href: '/',
        icon: Home,
        description: 'Main dashboard',
        roles: [],
        permissions: []
      },
      {
        name: 'Transparency Portal',
        href: '/transparency',
        icon: Eye,
        description: 'Public transparency information',
        roles: [],
        permissions: []
      },
      {
        name: 'Proof Gallery',
        href: '/proof-gallery',
        icon: FileText,
        description: 'Aid distribution proof',
        roles: [],
        permissions: []
      }
    ];

    const roleSpecificItems = [
      // Admin specific navigation
      {
        name: 'Admin Dashboard',
        href: '/admin',
        icon: Shield,
        description: 'System administration',
        roles: ['admin'],
        permissions: ['manage:all']
      },
      
      // Government specific navigation
      {
        name: 'Government Portal',
        href: '/government',
        icon: Building,
        description: 'Government oversight',
        roles: ['government'],
        permissions: ['disaster:create']
      },
      
      // Treasury specific navigation
      {
        name: 'Treasury Management',
        href: '/treasury',
        icon: Banknote,
        description: 'Financial management',
        roles: ['treasury'],
        permissions: ['treasury:allocate']
      },
      
      // Oracle specific navigation
      {
        name: 'Oracle Dashboard',
        href: '/oracle',
        icon: Database,
        description: 'Data verification',
        roles: ['oracle'],
        permissions: ['data:verify']
      },
      
      // Vendor specific navigation
      {
        name: 'Vendor Portal',
        href: '/vendor',
        icon: Store,
        description: 'Vendor management',
        roles: ['vendor'],
        permissions: ['voucher:redeem']
      },
      
      // Victim specific navigation
      {
        name: 'Victim Portal',
        href: '/victim',
        icon: Users,
        description: 'Aid requests',
        roles: ['victim'],
        permissions: ['voucher:claim']
      },
      
      // Donor specific navigation
      {
        name: 'Donation Dashboard',
        href: '/donate',
        icon: Heart,
        description: 'Make donations',
        roles: ['donor'],
        permissions: ['donation:make']
      }
    ];

    // Admin and Government get access to additional management tools
    const managementItems = [
      {
        name: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        description: 'System analytics',
        roles: ['admin', 'government', 'treasury'],
        permissions: ['analytics:view']
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        description: 'System configuration',
        roles: ['admin'],
        permissions: ['system:configure']
      }
    ];

    return [...baseItems, ...roleSpecificItems, ...managementItems];
  };

  const navigationItems = getNavigationItems();

  const isCurrentPath = (href) => {
    return location.pathname === href;
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = isCurrentPath(item.href);
    
    return (
      <RoleGuard
        roles={item.roles}
        permissions={item.permissions}
        fallback={null}
      >
        <Link
          to={item.href}
          className={`
            flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
            ${isActive 
              ? 'bg-avalanche-100 text-avalanche-700 border-r-2 border-avalanche-500' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
            ${isMobile ? 'justify-start' : 'justify-center lg:justify-start'}
          `}
        >
          <Icon className={`${isMobile ? 'w-5 h-5 mr-3' : 'w-5 h-5 lg:mr-3'}`} />
          <span className={`${isMobile ? 'block' : 'hidden lg:block'}`}>
            {item.name}
          </span>
          {isActive && !isMobile && (
            <div className="ml-auto w-2 h-2 bg-avalanche-500 rounded-full hidden lg:block" />
          )}
        </Link>
      </RoleGuard>
    );
  };

  return (
    <nav className="space-y-1">
      {/* User Role Badge */}
      {isAuthenticated && user && (
        <div className={`mb-6 ${isMobile ? 'px-4' : 'px-2'}`}>
          <div className="bg-gradient-to-r from-avalanche-500 to-avalanche-600 rounded-lg p-3 text-white">
            <div className={`flex items-center ${isMobile ? 'justify-start' : 'justify-center lg:justify-start'}`}>
              <Shield className={`${isMobile ? 'w-5 h-5 mr-2' : 'w-5 h-5 lg:mr-2'}`} />
              <div className={`${isMobile ? 'block' : 'hidden lg:block'}`}>
                <p className="text-sm font-medium capitalize">{user.role} Access</p>
                <p className="text-xs text-avalanche-100">
                  {user.authMethod === 'wallet' ? 'Web3 Connected' : 'Traditional Auth'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      {navigationItems.map((item) => (
        <NavItem key={item.href} item={item} />
      ))}

      {/* Quick Actions for authenticated users */}
      {isAuthenticated && (
        <>
          <div className={`pt-6 mt-6 border-t border-gray-200 ${isMobile ? 'px-4' : 'px-2'}`}>
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${isMobile ? 'block' : 'hidden lg:block'}`}>
              Quick Actions
            </h3>
          </div>
          
          <RoleGuard roles={['admin', 'government']} fallback={null}>
            <Link
              to="/disasters/new"
              className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Shield className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 lg:mr-2'}`} />
              <span className={`${isMobile ? 'block' : 'hidden lg:block'}`}>
                Declare Emergency
              </span>
            </Link>
          </RoleGuard>

          <RoleGuard roles={['treasury']} fallback={null}>
            <Link
              to="/treasury/emergency-release"
              className="flex items-center px-4 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Banknote className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 lg:mr-2'}`} />
              <span className={`${isMobile ? 'block' : 'hidden lg:block'}`}>
                Emergency Release
              </span>
            </Link>
          </RoleGuard>

          <RoleGuard roles={['donor']} fallback={null}>
            <Link
              to="/donate/quick"
              className="flex items-center px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Heart className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 lg:mr-2'}`} />
              <span className={`${isMobile ? 'block' : 'hidden lg:block'}`}>
                Quick Donate
              </span>
            </Link>
          </RoleGuard>

          <RoleGuard roles={['victim']} fallback={null}>
            <Link
              to="/victim/request-aid"
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4 lg:mr-2'}`} />
              <span className={`${isMobile ? 'block' : 'hidden lg:block'}`}>
                Request Aid
              </span>
            </Link>
          </RoleGuard>
        </>
      )}
    </nav>
  );
};

export default RoleBasedNavigation;

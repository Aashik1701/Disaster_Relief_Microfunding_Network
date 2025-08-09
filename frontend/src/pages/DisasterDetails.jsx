import React from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Calendar, TrendingUp } from 'lucide-react'

const DisasterDetails = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-avalanche-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Disaster Details
          </h1>
          <p className="text-gray-600 mb-8">
            Detailed information for disaster relief operation #{id}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Timeline
              </h3>
              <p className="text-gray-600">
                Disaster timeline and key milestones
              </p>
            </div>
            
            <div className="card text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Progress
              </h3>
              <p className="text-gray-600">
                Funding progress and distribution status
              </p>
            </div>
            
            <div className="card text-center">
              <MapPin className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Impact Map
              </h3>
              <p className="text-gray-600">
                Geographic distribution of aid and support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisasterDetails

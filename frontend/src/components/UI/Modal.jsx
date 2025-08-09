import React from 'react'
import { motion } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }

  const typeConfig = {
    default: {
      iconColor: 'text-gray-400',
      borderColor: 'border-gray-200'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-success-500',
      borderColor: 'border-success-200'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-warning-500', 
      borderColor: 'border-warning-200'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      borderColor: 'border-red-200'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200'
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`
            relative w-full ${sizeClasses[size]} 
            bg-white rounded-xl shadow-xl 
            border ${config.borderColor}
            max-h-[90vh] overflow-hidden
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                {Icon && (
                  <Icon className={`h-6 w-6 ${config.iconColor} mr-3`} />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              </div>
              
              {showCloseButton && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Modal

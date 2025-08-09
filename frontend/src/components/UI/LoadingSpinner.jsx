import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'avalanche', 
  className = '',
  text = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    avalanche: 'border-avalanche-500',
    white: 'border-white',
    gray: 'border-gray-500',
    success: 'border-success-500',
    warning: 'border-warning-500'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`
          ${sizeClasses[size]} 
          border-4 
          ${colorClasses[color]} 
          border-t-transparent 
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-3 text-sm ${
            color === 'white' ? 'text-white' : 'text-gray-600'
          }`}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner

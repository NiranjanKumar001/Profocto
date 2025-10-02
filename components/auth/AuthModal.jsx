'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaTimes } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

const AuthModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = async (provider) => {
    setLoading(true);
    await signIn(provider, {
      callbackUrl: '/builder',
      redirect: true
    });
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
         <div className="bg-zinc-900 rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-200">
                  Sign In to Continue
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-zinc-600 transition-colors"
                  disabled={loading}
                >
                  <FaTimes size={14} className="text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Welcome Text */}
              <div className="text-center mb-6">
                <p className="text-zinc-300 text-sm">
                  Continue with Google to create and manage your professional resume.
                </p>
              </div>

              {/* Sign-in options */}
              <div className="space-y-4">
                <button
                  onClick={() => handleMethodSelect('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-zinc-300 rounded-full hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-[#4285F4] rounded-full animate-spin"></div>
                  ) : (
                    <FaGoogle className="text-black-500" />
                  )}
                  <span className="text-zinc-700">Continue with Google</span>
                </button>


              </div>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <p className="text-xs text-zinc-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
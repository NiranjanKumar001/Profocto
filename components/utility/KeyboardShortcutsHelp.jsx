"use client";

import { useState, useEffect } from 'react';
import { FaKeyboard, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Keyboard shortcuts help modal for better user experience
 * Shows available keyboard shortcuts in the application
 */
const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["Ctrl", "B"], mac: ["⌘", "B"], description: "Toggle sidebar" },
        { keys: ["Ctrl", "S"], mac: ["⌘", "S"], description: "Force save resume" },
        { keys: ["Ctrl", "P"], mac: ["⌘", "P"], description: "Print/Export resume" },
        { keys: ["F11"], mac: ["F11"], description: "Toggle fullscreen" }
      ]
    },
    {
      category: "Editing",
      items: [
        { keys: ["Tab"], mac: ["Tab"], description: "Move to next field" },
        { keys: ["Shift", "Tab"], mac: ["⇧", "Tab"], description: "Move to previous field" },
        { keys: ["Ctrl", "Z"], mac: ["⌘", "Z"], description: "Undo changes" },
        { keys: ["Ctrl", "Y"], mac: ["⌘", "Y"], description: "Redo changes" }
      ]
    },
    {
      category: "Templates",
      items: [
        { keys: ["1"], mac: ["1"], description: "Switch to Classic template" },
        { keys: ["2"], mac: ["2"], description: "Switch to Modern template" },
        { keys: ["3"], mac: ["3"], description: "Switch to Elegant template" }
      ]
    },
    {
      category: "Accessibility",
      items: [
        { keys: ["?"], mac: ["?"], description: "Show this help" },
        { keys: ["Esc"], mac: ["Esc"], description: "Close modals/dialogs" },
        { keys: ["Space"], mac: ["Space"], description: "Activate focused button" },
        { keys: ["Enter"], mac: ["Enter"], description: "Submit forms/activate" }
      ]
    }
  ];

  // Detect if user is on Mac
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const KeyCombination = ({ keys, macKeys }) => {
    const keysToShow = isMac && macKeys ? macKeys : keys;
    
    return (
      <div className="flex items-center gap-1">
        {keysToShow.map((key, index) => (
          <span key={index} className="flex items-center">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
              {key}
            </kbd>
            {index < keysToShow.length - 1 && (
              <span className="mx-1 text-gray-400">+</span>
            )}
          </span>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaKeyboard className="text-2xl text-blue-600" />
              <h2 id="shortcuts-title" className="text-2xl font-bold text-gray-900">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close shortcuts help"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid md:grid-cols-2 gap-8">
              {shortcuts.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-gray-700 flex-1 pr-4">
                          {shortcut.description}
                        </span>
                        <KeyCombination 
                          keys={shortcut.keys} 
                          macKeys={shortcut.mac}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer tip */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Pro tip:</strong> Press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">?</kbd> 
                {" "}anytime to quickly access this help dialog.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Hook to manage keyboard shortcuts help dialog
 */
export const useKeyboardShortcuts = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show help on '?' key (without modifiers)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't trigger if user is typing in an input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsHelpOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isHelpOpen,
    openHelp: () => setIsHelpOpen(true),
    closeHelp: () => setIsHelpOpen(false),
    KeyboardShortcutsModal: (props) => (
      <KeyboardShortcutsHelp
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        {...props}
      />
    )
  };
};

export default KeyboardShortcutsHelp;
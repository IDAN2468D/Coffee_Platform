'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt as ReceiptIcon } from 'lucide-react';
import { ThermalReceiptAnimation } from './ThermalReceiptAnimation';
import { ReceiptData } from './Receipt';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData?: Partial<ReceiptData>;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptData,
}) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
          {/* Backdrop blur & dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-lg liquid-glass border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 my-auto overflow-hidden"
          >
            {/* Close button & header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <ReceiptIcon className="w-4 h-4" />
                <span>קבלה תרמית דיגיטלית מאומתת</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center border border-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Receipt Animation Content */}
            <div className="py-2 flex justify-center">
              <ThermalReceiptAnimation
                receiptData={receiptData}
                autoPlay={true}
                showControls={true}
                title=""
                subtitle=""
              />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  ExternalLink,
  Loader2,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { UserOrderRecord, useOrderStore } from '@/lib/store/useOrderStore';
import { syncOrderToGoogleDriveAction } from '@/app/actions/driveActions';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface GoogleDriveSyncButtonProps {
  order: UserOrderRecord;
  variant?: 'inline' | 'button' | 'badge';
  onSyncComplete?: (driveUrl: string) => void;
}

export const GoogleDriveSyncButton: React.FC<GoogleDriveSyncButtonProps> = ({
  order,
  variant = 'button',
  onSyncComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(Boolean(order.driveReceiptUrl));
  const [currentUrl, setCurrentUrl] = useState<string | null>(order.driveReceiptUrl || null);
  const { updateOrderDriveSync } = useOrderStore();

  const handleSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    coffeeSound.playBaristaClick();

    try {
      const receiptData = {
        orderNumber: order.orderNumber,
        fullName: order.fullName,
        email: order.email,
        phone: order.phone,
        deliveryAddress: order.deliveryAddress,
        items: order.items.map((i) => ({
          itemName: i.itemName,
          quantity: i.quantity,
          pricePerUnit: i.pricePerUnit,
          shots: i.shots,
          milkType: i.milkType,
          origin: i.origin,
        })),
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        status: order.status,
      };

      const result = await syncOrderToGoogleDriveAction(receiptData);

      if (result.success && result.webViewLink) {
        setSuccess(true);
        setCurrentUrl(result.webViewLink);
        updateOrderDriveSync(order.orderNumber, result.fileId || '', result.webViewLink);
        if (onSyncComplete) {
          onSyncComplete(result.webViewLink);
        }
      } else {
        alert(result.error || 'שגיאה בסנכרון הקבלה ל-Google Drive');
      }
    } catch (err: any) {
      console.error('Drive sync failed:', err);
      alert('אירעה שגיאה בלתי צפויה בסנכרון ל-Google Drive');
    } finally {
      setLoading(false);
    }
  };

  // Already synced: Show green badge with link
  if (currentUrl) {
    if (variant === 'badge' || variant === 'inline') {
      return (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 text-[11px] font-bold transition-all shadow-sm group"
          title="צפה בקבלה שנשמרה ב-Google Drive"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>שמור ב-Drive</span>
          <ExternalLink className="w-3 h-3 text-emerald-400/70 opacity-70 group-hover:opacity-100" />
        </a>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500 hover:text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md group active:scale-95"
          title="פתח קבלה ב-Google Drive"
        >
          <FileCheck className="w-4 h-4 text-emerald-400 group-hover:text-black transition-colors" />
          <span>צפה בקבלה ב-Drive</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Not yet synced: Show action button
  if (variant === 'inline' || variant === 'badge') {
    return (
      <button
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/80 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 text-[11px] font-bold transition-all shadow-sm disabled:opacity-60"
        title="שמור קבלה זו ל-Google Drive"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
        ) : (
          <Cloud className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>{loading ? 'מסנכרן...' : 'שמור ל-Drive'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
      ) : (
        <Cloud className="w-4 h-4 text-amber-400" />
      )}
      <span>{loading ? 'מסנכרן ל-Drive...' : 'שמור ל-Google Drive'}</span>
      {!loading && <Sparkles className="w-3 h-3 opacity-60" />}
    </button>
  );
};

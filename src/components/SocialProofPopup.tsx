"use client";
import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import {
  HEALTH_TIPS,
  shuffleTips,
  type HealthTip,
} from "@/constants/healthTips";
import { useLocale } from "@/context/LocaleContext";

interface SocialProofPopupProps {
  initialDelay?: number;
  displayDuration?: number;
  gapDuration?: number;
}

export default function SocialProofPopup({
  initialDelay = 20000,
  displayDuration = 6000,
  gapDuration = 15000,
}: SocialProofPopupProps) {
  const { isEn } = useLocale();
  const [currentTip, setCurrentTip] = useState<HealthTip | null>(null);
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const dismissTip = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      setCurrentTip(null);
    }, 300);
  }, []);

  const showTip = useCallback(() => {
    const tip = shuffleTips(HEALTH_TIPS)[0];
    setCurrentTip(tip);
    setVisible(true);
    setIsExiting(false);
    const exitTimer = setTimeout(() => dismissTip(), displayDuration);
    return () => clearTimeout(exitTimer);
  }, [displayDuration, dismissTip]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      const cleanup = showTip();
      const interval = setInterval(
        () => showTip(),
        gapDuration + displayDuration,
      );
      return () => {
        cleanup?.();
        clearInterval(interval);
      };
    }, initialDelay);
    return () => clearTimeout(initialTimer);
  }, [initialDelay, displayDuration, gapDuration, showTip]);

  if (!currentTip || !visible) return null;

  const tipText = isEn ? currentTip.tipEn : currentTip.tipAr;

  return (
    <div
      className={`fixed bottom-6 z-50 transition-all duration-500 ease-out ${
        isEn ? "left-3 sm:left-4" : "right-3 sm:right-4"
      } ${
        isExiting
          ? "opacity-0 translate-y-4 scale-95"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-70 sm:max-w-[320px]">
        <div className="flex items-center gap-2 px-3 py-2">
          <div
            className={`w-6 h-6 rounded-full ${currentTip.bgColor} flex items-center justify-center shrink-0`}
          >
            <span className={currentTip.iconColor}>{currentTip.icon}</span>
          </div>
          <p className="text-[11px] text-gray-700 leading-tight flex-1">
            {tipText}
          </p>
          <button
            onClick={dismissTip}
            className="p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';
import dynamic from 'next/dynamic';

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });
const SocialProofPopup = dynamic(() => import('@/components/SocialProofPopup'), { ssr: false });

export default function FloatingWrapper() {
  return (
    <>
      <WhatsAppButton />
      <SocialProofPopup initialDelay={15000} displayDuration={6000} gapDuration={15000} />
    </>
  );
}
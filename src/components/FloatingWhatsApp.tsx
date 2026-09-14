import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND_DATA } from '../data/shorashimData';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent('שלום שורשים, אשמח לפרטים ולבדיקת זמינות');
    window.open(`https://wa.me/${BRAND_DATA.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
      {/* Small floating helper bubble */}
      {showTooltip && (
        <div className="bg-white text-[#2C2926] shadow-lg rounded-2xl py-2 px-3.5 border border-[#E5DDD2] text-xs max-w-[200px] relative animate-bounce-short">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute top-1 right-1 text-[#8C8375] hover:text-[#2C2926] p-0.5"
            aria-label="סגור הודעה"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-medium text-[#8B6B48]">רוצים לשאול משהו?</p>
          <p className="text-[11px] text-[#554D41]">אנחנו זמינים ב-WhatsApp לכל שאלה והתאמה</p>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={handleWhatsAppClick}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BE5C] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="צרו קשר ישיר ב-WhatsApp"
        title="צרו קשר ב-WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Pulse ring animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-75" />
      </button>
    </div>
  );
}

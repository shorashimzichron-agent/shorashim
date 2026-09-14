import { useState, useId } from 'react';
import { Calendar, Users, Phone, MessageCircle, Sparkles, Check, Info } from 'lucide-react';
import { BRAND_DATA } from '../data/shorashimData';

interface BookingSectionProps {
  initialStayType?: 'couple' | 'bride_day' | 'bride_night_day' | 'wedding_night';
}

export default function BookingSection({ initialStayType = 'couple' }: BookingSectionProps) {
  const stayTypeInputId = useId();
  const checkInInputId = useId();
  const checkOutInputId = useId();
  const fullNameInputId = useId();
  const phoneInputId = useId();
  const notesInputId = useId();

  // Tomorrow as default checkin
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 2);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 2);

    const format = (d: Date) => d.toISOString().split('T')[0];
    return {
      checkIn: format(tomorrow),
      checkOut: format(dayAfter),
    };
  };

  const defaultDates = getDefaultDates();

  const [stayType, setStayType] = useState<'couple' | 'bride_day' | 'bride_night_day' | 'wedding_night'>(
    initialStayType
  );
  const [checkIn, setCheckIn] = useState<string>(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState<string>(defaultDates.checkOut);
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Calculate nights
  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = getNights();

  // Price estimate calculation
  const calculateEstimate = () => {
    if (stayType === 'bride_day') {
      return { total: BRAND_DATA.brideDayPrice, isCustom: true, label: 'מסלול יום כלה' };
    }
    if (stayType === 'bride_night_day') {
      return { total: BRAND_DATA.brideNightDayPrice, isCustom: true, label: 'לילה לפני + יום כלה' };
    }
    if (stayType === 'wedding_night') {
      return { total: BRAND_DATA.weddingNightPrice, isCustom: true, label: 'ליל כלולות זוגי' };
    }

    // Regular Couple Stay
    const basePerNight = BRAND_DATA.basePricePerNight;
    const thirdGuestFee = adultsCount === 3 ? BRAND_DATA.thirdGuestSurcharge * nights : 0;
    const total = basePerNight * nights + thirdGuestFee;
    return { total, isCustom: false, label: `${nights} לילות לאירוח זוגי` };
  };

  const estimate = calculateEstimate();

  const getStayTypeName = () => {
    switch (stayType) {
      case 'bride_day':
        return 'חוויית כלה: יום כלה (התארגנות ביום החתונה)';
      case 'bride_night_day':
        return 'חוויית כלה: לילה לפני + יום כלה';
      case 'wedding_night':
        return 'ליל כלולות לאחר החתונה';
      case 'couple':
      default:
        return 'אירוח זוגי בוטיק';
    }
  };

  // Generate WhatsApp link with prefilled details
  const handleWhatsAppBooking = () => {
    const messageLines = [
      `שלום שורשים, אשמח לבדוק זמינות ולהזמין:`,
      `• סוג האירוח: ${getStayTypeName()}`,
      `• תאריך הגעה: ${checkIn}`,
      stayType === 'bride_day' ? `• יום התארגנות מרוכז` : `• תאריך עזיבה: ${checkOut} (${nights} לילות)`,
      `• מספר אורחים (מבוגרים): ${adultsCount}`,
      fullName ? `• שם: ${fullName}` : '',
      phone ? `• טלפון: ${phone}` : '',
      notes ? `• הערות/בקשות מיוחדות: ${notes}` : '',
    ].filter(Boolean);

    const message = encodeURIComponent(messageLines.join('\n'));
    window.open(`https://wa.me/${BRAND_DATA.whatsappNumber}?text=${message}`, '_blank');
    setIsSubmitted(true);
  };

  return (
    <section id="booking" className="py-24 bg-[#FAF7F2] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider text-[#A07044] uppercase block mb-2">
            07 | הזמנה ובדיקת זמינות
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#241E1A] font-normal tracking-tight mb-4">
            באים לשורשים?
          </h2>
          <p className="text-base sm:text-lg text-[#6D6457]">
            בחרו תאריכים ובדקו זמינות. אנו זמינים תמיד גם ב-WhatsApp ובטלפון להתאמה מדויקת.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Booking Engine Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DCD0] shadow-sm">
            <h3 className="font-serif text-xl sm:text-2xl text-[#241E1A] font-medium mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8B6B48]" />
              <span>בחירת פרטי שהות</span>
            </h3>

            {/* Stay Category Selector */}
            <div className="mb-6">
              <label htmlFor={stayTypeInputId} className="block text-xs font-semibold text-[#736B5E] mb-2">
                סוג האירוח
              </label>
              <div id={stayTypeInputId} className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStayType('couple')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                    stayType === 'couple'
                      ? 'bg-[#8B6B48] text-white border-[#8B6B48] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#453E33] border-[#E8E0D5] hover:bg-[#F3ECE0]'
                  }`}
                >
                  אירוח זוגי
                </button>
                <button
                  type="button"
                  onClick={() => setStayType('bride_day')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                    stayType === 'bride_day'
                      ? 'bg-[#8B6B48] text-white border-[#8B6B48] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#453E33] border-[#E8E0D5] hover:bg-[#F3ECE0]'
                  }`}
                >
                  יום כלה (התארגנות)
                </button>
                <button
                  type="button"
                  onClick={() => setStayType('bride_night_day')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                    stayType === 'bride_night_day'
                      ? 'bg-[#8B6B48] text-white border-[#8B6B48] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#453E33] border-[#E8E0D5] hover:bg-[#F3ECE0]'
                  }`}
                >
                  לילה לפני + יום כלה
                </button>
                <button
                  type="button"
                  onClick={() => setStayType('wedding_night')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                    stayType === 'wedding_night'
                      ? 'bg-[#8B6B48] text-white border-[#8B6B48] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#453E33] border-[#E8E0D5] hover:bg-[#F3ECE0]'
                  }`}
                >
                  ליל כלולות זוגי
                </button>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor={checkInInputId} className="block text-xs font-semibold text-[#736B5E] mb-1.5">
                  תאריך הגעה (צ'ק-אין 15:00)
                </label>
                <input
                  id={checkInInputId}
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CFBF] bg-[#FAF8F5] text-[#2C2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6B48]/30"
                />
              </div>

              <div>
                <label htmlFor={checkOutInputId} className="block text-xs font-semibold text-[#736B5E] mb-1.5">
                  תאריך עזיבה (צ'ק-אאוט 11:00)
                </label>
                <input
                  id={checkOutInputId}
                  type="date"
                  value={checkOut}
                  disabled={stayType === 'bride_day'}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border border-[#D9CFBF] text-[#2C2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6B48]/30 ${
                    stayType === 'bride_day' ? 'bg-[#EAE4D9] cursor-not-allowed text-[#8C8375]' : 'bg-[#FAF8F5]'
                  }`}
                />
              </div>
            </div>

            {/* Adults Guests Counter */}
            <div className="mb-6 p-4 rounded-2xl bg-[#F8F4ED] border border-[#E8E0D4]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8B6B48]" />
                    <span className="text-sm font-semibold text-[#2C2926]">מספר אורחים מבוגרים</span>
                  </div>
                  <span className="text-xs text-[#7A7163]">
                    למבוגרים בלבד • עד 3 מבוגרים (אורח שלישי על ספה נפתחת)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAdultsCount(num)}
                      className={`w-9 h-9 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                        adultsCount === num
                          ? 'bg-[#8B6B48] text-white shadow-xs'
                          : 'bg-white border border-[#D9CFBF] text-[#423A30] hover:bg-[#F0EAE1]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={fullNameInputId} className="block text-xs font-semibold text-[#736B5E] mb-1.5">
                  שם מלא
                </label>
                <input
                  id={fullNameInputId}
                  type="text"
                  placeholder="ישראל ישראלי"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CFBF] bg-[#FAF8F5] text-[#2C2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6B48]/30"
                />
              </div>

              <div>
                <label htmlFor={phoneInputId} className="block text-xs font-semibold text-[#736B5E] mb-1.5">
                  טלפון לחזרה
                </label>
                <input
                  id={phoneInputId}
                  type="tel"
                  placeholder="050-0000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CFBF] bg-[#FAF8F5] text-[#2C2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6B48]/30"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor={notesInputId} className="block text-xs font-semibold text-[#736B5E] mb-1.5">
                הערות או בקשות מיוחדות (שעות הגעה, צוות איפור, צילומים וכו')
              </label>
              <textarea
                id={notesInputId}
                rows={2}
                placeholder="ספרו לנו קצת על השהות המתוכננת שלכם..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9CFBF] bg-[#FAF8F5] text-[#2C2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6B48]/30"
              />
            </div>

            {/* Action Button */}
            <button
              type="button"
              id="submit-booking-whatsapp"
              onClick={handleWhatsAppBooking}
              className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>שליחת בקשת זמינות ישירה ב-WhatsApp</span>
            </button>

            {isSubmitted && (
              <div className="mt-4 p-3 bg-[#E8F8EE] border border-[#A7E8BD] text-[#1E6B37] rounded-xl text-xs text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>פנייתכם נפתחה ב-WhatsApp! שרי ויואב יחזרו אליכם בהקדם האפשרי.</span>
              </div>
            )}
          </div>

          {/* Booking Summary & Direct Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Price Estimation Box */}
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E5DCD0]">
              <h4 className="font-serif text-lg sm:text-xl text-[#241E1A] font-medium mb-4">
                סיכום משוער
              </h4>

              <div className="space-y-3 text-sm text-[#4E473D] mb-6">
                <div className="flex justify-between pb-2 border-b border-[#EAE3D7]">
                  <span>סוג שהות:</span>
                  <span className="font-medium text-[#241E1A]">{getStayTypeName()}</span>
                </div>
                {stayType !== 'bride_day' && (
                  <div className="flex justify-between pb-2 border-b border-[#EAE3D7]">
                    <span>משך השהות:</span>
                    <span className="font-medium text-[#241E1A]">{nights} לילות</span>
                  </div>
                )}
                <div className="flex justify-between pb-2 border-b border-[#EAE3D7]">
                  <span>אורחים מבוגרים:</span>
                  <span className="font-medium text-[#241E1A]">{adultsCount} מבוגרים</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold text-[#241E1A]">
                  <span>הערכת מחיר:</span>
                  <span className="text-[#8B6B48] font-serif text-xl">
                    ₪{estimate.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-[#7A7163] bg-white p-3 rounded-xl border border-[#E8E0D4] mb-4">
                <Info className="w-4 h-4 text-[#8B6B48] shrink-0 mt-0.5" />
                <span>
                  המחיר המוצג הינו הערכה בהתאם לתעריפי תקופת ההרצה. מחיר סופי ומדויק יימסר בהתאמה אישית עם קבלת הפנייה.
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#61594D]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B6B48]" />
                  <span>בתקופת ההרצה: ללא מינימום לילות</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B6B48]" />
                  <span>חניה פרטית צמודה כלולה</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B6B48]" />
                  <span>קפה איכותי, מוצרי רחצה וחלוקים כלולים</span>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DCD0] shadow-xs text-center">
              <h4 className="font-serif text-lg sm:text-xl text-[#241E1A] font-medium mb-2">
                מעדיפים לדבר איתנו ישירות?
              </h4>
              <p className="text-xs sm:text-sm text-[#6E6557] mb-6">
                שרי ויואב פויזנר זמינים לכל שאלה, תיאום שעות או בקשה מיוחדת
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${BRAND_DATA.phone}`}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#8B6B48] text-[#8B6B48] hover:bg-[#F7F2EA] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">{BRAND_DATA.phoneFormatted}</span>
                </a>

                <a
                  href={`https://wa.me/${BRAND_DATA.whatsappNumber}?text=${encodeURIComponent('היי שורשים, אשמח לפרטים על אירוח אצלכם')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp ישיר</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

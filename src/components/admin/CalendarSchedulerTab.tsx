import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MessageCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { BookingStatus, BOOKING_STATUSES } from '../../types/index.ts';

export const CalendarSchedulerTab: React.FC = () => {
  const { bookings, addBooking, updateBookingStatus, deleteBooking, sendWhatsAppMessage } = useBusiness();

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states for new booking
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookDate, setBookDate] = useState('2026-10-25');
  const [bookTime, setBookTime] = useState('11:00');
  const [bookService, setBookService] = useState('Executive Strategy Session');
  const [duration, setDuration] = useState(45);

  const bookingLink = 'https://backforbrand.com/book?consultant=ghazi';

  const handleCopyBookingLink = () => {
    try {
      navigator.clipboard.writeText(bookingLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !bookDate || !bookTime) return;

    const meetSlug = clientName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    addBooking({
      name: clientName.trim(),
      email: clientEmail.trim(),
      phone: clientPhone.trim(),
      date: bookDate,
      time: bookTime,
      service: bookService,
      durationMinutes: duration,
      meetingLink: `https://meet.google.com/bfb-${meetSlug}`,
      st: 'Confirmed',
      notes: 'Scheduled via Calendar Control Agent',
      reminderSent: true,
    });

    setShowAddModal(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
  };

  const handleSendReminder = (bk: typeof bookings[0]) => {
    const meetUrl = bk.meetingLink || 'https://meet.google.com/bfb-growth';
    sendWhatsAppMessage({
      clientName: bk.name,
      phone: bk.phone || '923001234567',
      direction: 'outbound',
      text: `Salam ${bk.name}, friendly reminder regarding our upcoming session scheduled on ${bk.date} at ${bk.time}. Here is your Google Meet room: ${meetUrl}`,
      status: 'sent',
    });
  };

  // Calendar month rendering logic (October 2026)
  const daysInOctober = 31;
  const days = Array.from({ length: daysInOctober }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls & Booking Link Bar */}
      <div className="bg-[var(--card)] border border-[var(--bd)] p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--ink)] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>Interactive Client Booking &amp; Calendar Engine</span>
          </h2>
          <p className="text-xs text-[var(--mu)] mt-0.5">
            Automated Google Meet generation, 24h WhatsApp dispatch, and zero no-show architecture.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Shareable Booking Link */}
          <div className="flex items-center gap-1.5 bg-[var(--soft)] px-3 py-1.5 rounded-xl border border-[var(--bd)] text-xs">
            <span className="text-[var(--mu)] font-mono truncate max-w-[200px]">{bookingLink}</span>
            <button
              onClick={handleCopyBookingLink}
              className="text-[#2b59ff] hover:text-blue-700 font-bold flex items-center gap-1 ml-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Booking Form Modal / Drawer */}
      {showAddModal && (
        <div className="bg-[var(--card)] border-2 border-blue-500 rounded-3xl p-6 shadow-2xl space-y-4 animate-slideDown">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)]">
            <b className="text-sm font-black text-[var(--ink)]">Schedule New Client Strategy Call</b>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs text-[var(--mu)] hover:text-[var(--ink)]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateBooking} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Corp"
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@corp.com"
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">WhatsApp / Phone</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+92 300..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Service Type</label>
              <select
                value={bookService}
                onChange={(e) => setBookService(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              >
                <option>Executive Strategy Session</option>
                <option>Funnel Architecture Review</option>
                <option>AI Chatbot Prototype Demo</option>
                <option>Client Kickoff &amp; Onboarding</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Date</label>
              <input
                type="date"
                required
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Time</label>
              <input
                type="time"
                required
                value={bookTime}
                onChange={(e) => setBookTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--mu)] mb-1">Duration (minutes)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)]"
              >
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#2b59ff] hover:bg-[#1a3fd1] text-white py-2 px-4 rounded-xl font-bold transition-colors shadow-sm"
              >
                Save &amp; Generate Meet Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Calendar Grid & Scheduled List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month View (7 cols) */}
        <div className="lg:col-span-7 bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--bd)]">
            <b className="text-base font-black text-[var(--ink)]">October 2026</b>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--mu)] font-semibold">Florida Time (EDT)</span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[var(--mu)] mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* Empty offset for October 2026 starting Thursday (4 blanks) */}
            <div className="h-14 p-1 rounded-xl bg-transparent" />
            <div className="h-14 p-1 rounded-xl bg-transparent" />
            <div className="h-14 p-1 rounded-xl bg-transparent" />
            <div className="h-14 p-1 rounded-xl bg-transparent" />

            {days.map((day) => {
              const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
              const hasBookings = bookings.filter((b) => b.date === dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = day === 19;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-14 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/70 ring-2 ring-blue-500/20'
                      : isToday
                      ? 'border-orange-400 bg-orange-50/50 dark:bg-orange-950/40'
                      : 'border-[var(--bd)] bg-[var(--bg)] hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isToday ? 'text-orange-600' : 'text-[var(--ink)]'}`}>
                      {day}
                    </span>
                    {isToday && <span className="text-[9px] font-black text-orange-600">TODAY</span>}
                  </div>

                  {hasBookings.length > 0 && (
                    <div className="flex items-center gap-1 mt-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 truncate">
                        {hasBookings[0].name.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scheduled Appointments (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--card)] border border-[var(--bd)] rounded-3xl p-6 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--bd)] mb-3">
            <div>
              <b className="text-sm font-black text-[var(--ink)] block">Scheduled Sessions ({bookings.length})</b>
              <span className="text-[11px] text-[var(--mu)]">Automated Meet links &amp; reminders</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {bookings.map((bk) => (
              <div
                key={bk.id}
                className="p-4 rounded-2xl bg-[var(--soft)]/50 border border-[var(--bd)] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="text-sm font-bold text-[var(--ink)] block">{bk.name}</strong>
                    <span className="text-[11px] text-[var(--mu)] block mt-0.5">{bk.service}</span>
                  </div>
                  <select
                    value={bk.st}
                    onChange={(e) => updateBookingStatus(bk.id, e.target.value as BookingStatus)}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg border border-[var(--bd)] bg-[var(--bg)]"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--ink)] font-medium">
                  <div className="flex items-center gap-1 text-[var(--mu)]">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{bk.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--mu)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{bk.time} ({bk.durationMinutes || 45}m)</span>
                  </div>
                </div>

                {/* Google Meet & Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--bd)]">
                  {bk.meetingLink ? (
                    <a
                      href={bk.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold text-[11px]"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-[var(--mu)]">In-person</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSendReminder(bk)}
                      title="Send WhatsApp Reminder"
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Remind</span>
                    </button>
                    <button
                      onClick={() => deleteBooking(bk.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete booking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

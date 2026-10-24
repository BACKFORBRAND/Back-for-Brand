import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { BOOKING_STATUSES, BookingStatus } from '../../types/index.ts';
import { Calendar, Plus, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const BookingsTab: React.FC = () => {
  const { bookings, addBooking, updateBookingStatus, deleteBooking } = useBusiness();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-10-25');
  const [time, setTime] = useState('14:00');
  const [service, setService] = useState('Strategy Session');

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !time) return;

    addBooking({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date,
      time,
      service,
      st: 'Pending',
    });

    setName('');
    setEmail('');
    setPhone('');
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    return (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time);
  });

  const confirmedCount = bookings.filter((b) => b.st === 'Confirmed').length;
  const pendingCount = bookings.filter((b) => b.st === 'Pending').length;
  const doneCount = bookings.filter((b) => b.st === 'Done').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI mini row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Total Bookings</span>
          <b className="text-2xl font-black text-[var(--ink)] block mt-1">{bookings.length}</b>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Confirmed</span>
          <b className="text-2xl font-black text-emerald-600 block mt-1">{confirmedCount}</b>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Pending</span>
          <b className="text-2xl font-black text-amber-500 block mt-1">{pendingCount}</b>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bd)] p-4 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-wider block">Completed</span>
          <b className="text-2xl font-black text-blue-600 block mt-1">{doneCount}</b>
        </div>
      </div>

      {/* Add Booking Bar */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-sm text-[var(--ink)] mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Schedule New Client Call or Session</span>
        </h3>
        <form onSubmit={handleAddBooking} className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Client Name *"
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Client Email"
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          />
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-blue-500"
          >
            <option>Strategy Session</option>
            <option>Funnel Architecture Review</option>
            <option>AI Chatbot Demo</option>
            <option>Executive Kickoff</option>
          </select>
          <button
            type="submit"
            className="bg-[#2b59ff] hover:bg-[#1a3fd1] text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Booking</span>
          </button>
        </form>
      </div>

      {/* Bookings List */}
      <div className="bg-[var(--card)] border border-[var(--bd)] rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-sm text-[var(--ink)] mb-4">Upcoming Client Appointments</h3>

        {sortedBookings.length === 0 ? (
          <div className="text-center py-10 text-[var(--mu)] text-xs">
            No bookings scheduled. Add a new booking above.
          </div>
        ) : (
          <div className="divide-y divide-[var(--bd)]/80">
            {sortedBookings.map((bk) => (
              <div
                key={bk.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="font-bold text-[var(--ink)] block text-sm">
                      {bk.name}
                    </strong>
                    <div className="text-xs text-[var(--mu)] flex items-center gap-2 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{bk.date} at {bk.time}</span>
                      {bk.service && <span className="text-[var(--ink)] font-medium">· {bk.service}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <select
                    value={bk.st}
                    onChange={(e) => updateBookingStatus(bk.id, e.target.value as BookingStatus)}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[var(--bd)] ${
                      bk.st === 'Confirmed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                        : bk.st === 'Done'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300'
                        : bk.st === 'No-show'
                        ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300'
                    }`}
                  >
                    {BOOKING_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => deleteBooking(bk.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

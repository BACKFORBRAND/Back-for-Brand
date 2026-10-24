import React, { useState, useRef, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Bot, X, Send, Sparkles, CheckCircle2, ChevronDown, User, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types/index.ts';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init',
    sender: 'assistant',
    text: "Hello! I'm the Back for Brand AI Concierge. I can evaluate your current sales funnel, explain our AI chatbots & automation, compare our pricing plans, or connect you with founder Ghazi Wazir. How can I help your business today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const QUICK_PROMPTS = [
  'Which funnel fits my business?',
  'How do your AI chatbots work?',
  'What is included in the Growth plan?',
  'I want to book a free strategy call',
];

export const AiConciergeModal: React.FC = () => {
  const { addLead, addBooking } = useBusiness();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Call backend /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || "I'd be happy to assist with that. Could you share your email or business name so we can follow up with a tailored proposal?";
        
        // Check if lead was captured server-side
        if (data.leadCaptured) {
          addLead({
            name: data.leadCaptured.name || 'Chat Lead',
            email: data.leadCaptured.email,
            phone: data.leadCaptured.phone,
            src: 'WhatsApp', // or AI Chat
            stage: 'New',
            val: 1000,
            need: data.leadCaptured.need || 'AI Concierge Inquiry',
            message: `Lead captured via AI Chat: ${text}`,
          });
        }

        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-' + Date.now(),
            sender: 'assistant',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setLoading(false);
        return;
      }
    } catch {
      // Backend fallback
    }

    // Smart client fallback
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      // Check if user provided an email or phone number in text
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

      if (emailMatch || phoneMatch) {
        const capturedEmail = emailMatch ? emailMatch[0] : '';
        const capturedPhone = phoneMatch ? phoneMatch[0] : '';
        addLead({
          name: capturedEmail ? capturedEmail.split('@')[0] : 'Chat Qualified Prospect',
          email: capturedEmail,
          phone: capturedPhone,
          src: 'WhatsApp',
          stage: 'New',
          val: 1500,
          need: 'AI Concierge Qualified Lead',
          message: `Prospect provided contact in chat: ${text}`,
        });

        reply = `Thank you! I've registered your contact into our Business Machine CRM. Founder Ghazi Wazir and our engineering team will review your requirements and reach out with your complimentary strategy plan. Would you like to schedule a 15-minute kickoff call?`;
      } else if (lower.includes('which funnel') || lower.includes('fits') || lower.includes('recommend')) {
        reply = `For service providers & consultants, our **Lead Generation Funnel** with automated WhatsApp qualification works best. For e-commerce, our **High-AOV Checkout Funnel** with one-click upsells delivers immediate ROAS. For clinics & professionals, the **Automated Booking Funnel** eliminates no-shows. What kind of business do you run?`;
      } else if (lower.includes('chat') || lower.includes('bot') || lower.includes('agent')) {
        reply = `Our AI Chatbots operate 24/7 across your website and WhatsApp. They don't just give canned answers — they qualify lead budgets, check appointment availability, and push data directly into your CRM. Would you like to test a live prototype for your brand?`;
      } else if (lower.includes('growth plan') || lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
        reply = `Our **Growth Plan** is our most popular package: it includes a full conversion website, 24/7 AI chatbot, connected CRM pipeline, automated follow-ups, and active SEO/ad campaign management. We provide transparent, fixed-scope proposals tailored to your target volume. If you share your email, I can send over our detailed breakdown!`;
      } else if (lower.includes('book') || lower.includes('call') || lower.includes('schedule') || lower.includes('meeting')) {
        reply = `You can easily book a strategy session with founder Ghazi Wazir! Simply share your preferred day/time and email, or head over to the Bookings section in our platform. We look forward to analyzing your funnel!`;
      } else {
        reply = `That sounds like a great project. Back for Brand specializes in connecting high-speed websites, AI chatbots, and automated CRM pipelines into one unified system. If you share your email or phone number, I can have our team generate a custom growth plan for you today.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button with Brand 3 Colors */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Concierge Chat"
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,196,140,0.4)] flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#cca34c] rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold text-sm">
            Chat with AI Concierge
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[410px] h-[580px] max-h-[90vh] bg-[var(--bg)] border border-[#cca34c]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header in Brand Navy */}
          <div className="bg-[#070e24] text-white px-5 py-4 flex items-center justify-between border-b border-[#cca34c]/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0c183a] text-[#00c48c] border border-[#cca34c]/30 flex items-center justify-center font-bold relative shadow-md">
                <Bot className="w-6 h-6 text-[#00c48c]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00c48c] rounded-full border-2 border-[#070e24]" />
              </div>
              <div>
                <b className="block text-sm font-black tracking-tight flex items-center gap-1">
                  <span>Back for</span>
                  <span className="text-[#cca34c]">Brand</span>
                  <span className="text-[#00c48c]">AI</span>
                </b>
                <span className="text-[11px] text-emerald-100/70 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#cca34c]" />
                  <span>Executive Growth Concierge</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[var(--soft)]/30 text-xs sm:text-sm">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-[#070e24] text-[#00c48c] border border-[#cca34c]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-[#00c48c]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl ${
                      isAssistant
                        ? 'bg-[var(--bg)] text-[var(--ink)] border border-[var(--bd)] rounded-tl-sm shadow-sm'
                        : 'bg-gradient-to-r from-[#00c48c] to-[#009b6e] text-white rounded-tr-sm shadow-md'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    <span
                      className={`block text-[10px] mt-1.5 text-right opacity-70 ${
                        isAssistant ? 'text-[var(--mu)]' : 'text-emerald-100'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[var(--mu)] pl-9">
                <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-ping" />
                <span>AI Concierge is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-[var(--bg)] border-t border-[var(--bd)] overflow-x-auto flex gap-2 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-[var(--soft)] border border-[var(--bd)] text-[var(--ink)] hover:border-[#00c48c] hover:text-[#00c48c] whitespace-nowrap transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[var(--bg)] border-t border-[var(--bd)] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or share your goals..."
              disabled={loading}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[var(--bd)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[#00c48c] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00c48c] to-[#009b6e] hover:from-[#00b07d] hover:to-[#00875e] disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

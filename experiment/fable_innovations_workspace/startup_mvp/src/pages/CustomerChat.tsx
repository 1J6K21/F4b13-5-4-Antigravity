import { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { Send, Bot, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerChat() {
  const { user, tickets, createTicket, addMessageToTicket, logout } = useAppStore();
  const navigate = useNavigate();
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  // Automatically select the active ticket or create a new one
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const userTickets = tickets.filter(t => t.customerEmail === user.email);
    const openTicket = userTickets.find(t => t.status === 'open');
    if (openTicket) {
      setActiveTicketId(openTicket.id);
    }
  }, [tickets, user, navigate]);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleSend = () => {
    if (!input.trim() || !user) return;

    if (!activeTicket) {
      // First message, create ticket
      createTicket(user.email, 'Support Request', input);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        const latestOpen = useAppStore.getState().tickets.find(t => t.status === 'open' && t.customerEmail === user.email);
        if (latestOpen) {
           useAppStore.getState().addMessageToTicket(latestOpen.id, 'agent', "I'm the ResolvAI agent. I'm looking into your request right now. Let me check the knowledge base...");
           // Simulate resolution if "refund" is mentioned
           setTimeout(() => {
             if (input.toLowerCase().includes('refund')) {
               useAppStore.getState().addMessageToTicket(latestOpen.id, 'agent', "I've processed a refund for you via our mocked Stripe integration. Is there anything else you need?");
               useAppStore.getState().resolveTicket(latestOpen.id);
             } else {
               useAppStore.getState().addMessageToTicket(latestOpen.id, 'agent', "I couldn't find an automatic resolution for this, so I have escalated this to a human agent.");
             }
           }, 1500);
        }
      }, 1000);
    } else {
      // Add to existing ticket
      addMessageToTicket(activeTicket.id, 'customer', input);
      setInput('');
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="text-indigo-600 h-6 w-6" />
          <h1 className="text-xl font-bold text-gray-900">ResolvAI Support</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button onClick={() => { logout(); navigate('/'); }} className="text-gray-500 hover:text-gray-700">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 flex flex-col">
        {!activeTicket ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Bot className="h-16 w-16 text-indigo-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">How can we help you today?</h2>
            <p className="text-gray-500 mt-2 max-w-md">Our autonomous agent will resolve your request instantly without waiting for a human.</p>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">{activeTicket.title}</h3>
                <p className="text-xs text-gray-500">Status: {activeTicket.status}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTicket.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 ${msg.sender === 'customer' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="flex-1 rounded-lg border-gray-300 border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

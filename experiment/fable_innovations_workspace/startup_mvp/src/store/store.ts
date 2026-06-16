import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'customer';
};

export type Message = {
  id: string;
  sender: 'customer' | 'agent';
  content: string;
  timestamp: string;
};

export type Ticket = {
  id: string;
  customerEmail: string;
  title: string;
  status: 'open' | 'resolved' | 'escalated';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

interface AppState {
  user: User | null;
  tickets: Ticket[];
  knowledgeBase: string;
  login: (email: string, role: 'admin' | 'customer') => void;
  logout: () => void;
  createTicket: (customerEmail: string, title: string, initialMessage: string) => void;
  addMessageToTicket: (ticketId: string, sender: 'customer' | 'agent', content: string) => void;
  resolveTicket: (ticketId: string) => void;
  updateKnowledgeBase: (content: string) => void;
}

const mockInitialTickets: Ticket[] = [
  {
    id: 't-1001',
    customerEmail: 'alice@example.com',
    title: 'Refund for recent order',
    status: 'resolved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      { id: 'm-1', sender: 'customer', content: 'I need a refund for order #999', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 'm-2', sender: 'agent', content: 'I have processed a full refund for order #999. It should appear in your account within 3-5 days. Is there anything else?', timestamp: new Date(Date.now() - 86000000).toISOString() },
      { id: 'm-3', sender: 'customer', content: 'No that is all, thanks!', timestamp: new Date(Date.now() - 85000000).toISOString() },
    ]
  },
  {
    id: 't-1002',
    customerEmail: 'bob@example.com',
    title: 'Where is my package?',
    status: 'escalated',
    createdAt: new Date(Date.now() - 40000000).toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      { id: 'm-1', sender: 'customer', content: 'My tracking says delivered but I dont see it.', timestamp: new Date(Date.now() - 40000000).toISOString() },
      { id: 'm-2', sender: 'agent', content: 'I am sorry to hear that. I will escalate this to a human specialist to investigate with the carrier.', timestamp: new Date(Date.now() - 39000000).toISOString() },
    ]
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      tickets: mockInitialTickets,
      knowledgeBase: "1. Refunds are allowed within 30 days.\n2. For missing packages, apologize and escalate to a human.",
      
      login: (email, role) => set({ user: { id: Date.now().toString(), email, role } }),
      logout: () => set({ user: null }),
      
      createTicket: (customerEmail, title, initialMessage) => set((state) => {
        const newTicket: Ticket = {
          id: `t-${Date.now()}`,
          customerEmail,
          title,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [{
            id: `m-${Date.now()}`,
            sender: 'customer',
            content: initialMessage,
            timestamp: new Date().toISOString()
          }]
        };
        return { tickets: [...state.tickets, newTicket] };
      }),

      addMessageToTicket: (ticketId, sender, content) => set((state) => {
        const newTickets = state.tickets.map(t => {
          if (t.id === ticketId) {
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: [
                ...t.messages, 
                { id: `m-${Date.now()}`, sender, content, timestamp: new Date().toISOString() }
              ]
            };
          }
          return t;
        });
        return { tickets: newTickets };
      }),

      resolveTicket: (ticketId) => set((state) => ({
        tickets: state.tickets.map(t => t.id === ticketId ? { ...t, status: 'resolved', updatedAt: new Date().toISOString() } : t)
      })),

      updateKnowledgeBase: (content) => set({ knowledgeBase: content })
    }),
    {
      name: 'resolv-ai-storage',
    }
  )
);

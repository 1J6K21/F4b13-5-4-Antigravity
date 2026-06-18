import React, { useState, useEffect } from 'react';
import type { Request, Response } from 'express';

// ==========================================
// Types & Interfaces
// ==========================================
export interface Ticket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
  department: 'billing' | 'technical' | 'sales' | 'general';
  confidence: number;
  createdAt: string;
}

// ==========================================
// Frontend: React Component
// ==========================================
export function TicketRouterDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New ticket form state
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tickets');
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, email, subject, body }),
      });
      if (!res.ok) throw new Error('Failed to create ticket');
      const newTicket = await res.json();
      setTickets((prev) => [newTicket, ...prev]);
      setCustomerName('');
      setEmail('');
      setSubject('');
      setBody('');
    } catch (err: any) {
      alert(err.message || 'Error creating ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AI Customer Ticket Router</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '24px' }}>
        {/* Ticket Submission Form */}
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', background: '#f9f9f9' }}>
          <h2>Submit New Support Ticket</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={5}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Routing...' : 'Route Ticket'}
            </button>
          </form>
        </div>

        {/* Routed Tickets List */}
        <div>
          <h2>Routed Tickets Queue</h2>
          {loading ? (
            <p>Loading tickets...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>Error: {error}</p>
          ) : tickets.length === 0 ? (
            <p>No tickets available</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>{ticket.subject}</h3>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor:
                          ticket.priority === 'high'
                            ? '#ffebee'
                            : ticket.priority === 'medium'
                            ? '#fff3e0'
                            : '#e8f5e9',
                        color:
                          ticket.priority === 'high'
                            ? '#c62828'
                            : ticket.priority === 'medium'
                            ? '#ef6c00'
                            : '#2e7d32',
                      }}
                    >
                      {ticket.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#555' }}>
                    <strong>From:</strong> {ticket.customerName} ({ticket.email})
                  </p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' }}>
                    {ticket.body}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '13px',
                      color: '#666',
                      borderTop: '1px solid #eee',
                      paddingTop: '8px',
                    }}
                  >
                    <span>
                      <strong>Routed to:</strong> {ticket.department.toUpperCase()}
                    </span>
                    <span>
                      <strong>AI Confidence:</strong> {(ticket.confidence * 100).toFixed(0)}%
                    </span>
                    <span>
                      <strong>Date:</strong> {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Backend: Express Controller
// ==========================================

const ticketDatabase: Ticket[] = [];

function routeTicketWithAI(subject: string, body: string): {
  department: Ticket['department'];
  priority: Ticket['priority'];
  confidence: number;
} {
  const content = (subject + ' ' + body).toLowerCase();
  
  let department: Ticket['department'] = 'general';
  let priority: Ticket['priority'] = 'low';
  let confidence = 0.85;

  if (content.includes('billing') || content.includes('invoice') || content.includes('payment') || content.includes('charge')) {
    department = 'billing';
    if (content.includes('unauthorized') || content.includes('double charge')) {
      priority = 'high';
      confidence = 0.95;
    } else {
      priority = 'medium';
    }
  } else if (content.includes('down') || content.includes('crash') || content.includes('bug') || content.includes('error') || content.includes('broken')) {
    department = 'technical';
    priority = content.includes('production') || content.includes('critical') ? 'high' : 'medium';
    confidence = 0.92;
  } else if (content.includes('price') || content.includes('demo') || content.includes('quote') || content.includes('enterprise')) {
    department = 'sales';
    priority = 'medium';
    confidence = 0.88;
  }

  return { department, priority, confidence };
}

export const TicketController = {
  async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const sortedTickets = [...ticketDatabase].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.status(200).json(sortedTickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve tickets' });
    }
  },

  async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const { customerName, email, subject, body } = req.body;

      if (!customerName || !email || !subject || !body) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const aiResult = routeTicketWithAI(subject, body);

      const newTicket: Ticket = {
        id: Math.random().toString(36).substring(2, 9),
        customerName,
        email,
        subject,
        body,
        department: aiResult.department,
        priority: aiResult.priority,
        confidence: aiResult.confidence,
        createdAt: new Date().toISOString(),
      };

      ticketDatabase.push(newTicket);

      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to route ticket' });
    }
  },
};

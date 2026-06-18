import React, { useState, useEffect } from 'react';
import { Request, Response } from 'express';

// ==========================================
// 1. FRONTEND: React Component (ScribeDashboard)
// ==========================================

interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

interface MeetingDetail {
  id: string;
  title: string;
  status: string;
  summary: string;
  transcript: string;
  action_items: ActionItem[];
}

export function ScribeDashboard({ meetingId }: { meetingId: string }) {
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMeetingData() {
      try {
        const response = await fetch(`/api/meetings/${meetingId}`);
        if (!response.ok) {
          throw new Error('Failed to load meeting details.');
        }
        const data = await response.json();
        setMeeting(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchMeetingData();
  }, [meetingId]);

  const toggleActionItem = async (itemId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      const response = await fetch(`/api/action-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update action item.');
      }
      setMeeting((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          action_items: prev.action_items.map((item) =>
            item.id === itemId ? { ...item, status: nextStatus as any } : item
          ),
        };
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading meeting details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!meeting) return <div>No meeting found.</div>;

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{meeting.title}</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e2e8f0', fontSize: '14px' }}>
          Status: {meeting.status}
        </span>
      </div>

      <section style={{ marginBottom: '24px' }}>
        <h2>AI Summary</h2>
        <p style={{ lineHeight: '1.6', color: '#2d3748' }}>{meeting.summary}</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2>Action Items</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {meeting.action_items.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                marginBottom: '8px',
                backgroundColor: item.status === 'completed' ? '#f7fafc' : '#ffffff',
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={item.status === 'completed'}
                  onChange={() => toggleActionItem(item.id, item.status)}
                  style={{ marginRight: '12px' }}
                />
                <span style={{ textDecoration: item.status === 'completed' ? 'line-through' : 'none' }}>
                  {item.description}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#718096' }}>
                Assigned to: {item.assignee} | Due: {new Date(item.dueDate).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Transcript</h2>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', whiteSpace: 'pre-wrap', color: '#4a5568' }}>
          {meeting.transcript}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 2. BACKEND: Express Controller
// ==========================================

export class MeetingController {
  /**
   * Retrieves full meeting metadata, transcript, summary, and action items.
   */
  static async getMeetingDetails(req: Request, res: Response) {
    const { id } = req.params;

    try {
      // Dummy Database queries mimicking PostgreSQL lookups
      const meetingResult = {
        id,
        title: 'Q3 Product Roadmap Sync',
        status: 'completed',
        summary: 'The team aligned on the main priorities for Q3, including the user auth system. John will complete user auth integration by Friday, June 25.',
      };

      const transcriptResult = {
        full_text: 'Sarah: Hello. John: Hi. Let us get user auth shipped by Friday, June 25. Sarah: Sounds good.',
      };

      const actionItemsResult = [
        {
          id: 'action-1',
          description: 'Launch user auth flow',
          assignee: 'John Doe',
          dueDate: '2026-06-25T23:59:59Z',
          status: 'pending',
        },
      ];

      return res.status(200).json({
        id: meetingResult.id,
        title: meetingResult.title,
        status: meetingResult.status,
        summary: meetingResult.summary,
        transcript: transcriptResult.full_text,
        action_items: actionItemsResult,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Updates status of an action item.
   */
  static async updateActionItem(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value.',
      });
    }

    try {
      // In production, update database row here
      return res.status(200).json({
        success: true,
        action_item: {
          id,
          status,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }
}

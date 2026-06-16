import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analytics } from '@/lib/utils';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Document = {
  id: string;
  name: string;
  content: string;
  uploadedAt: string;
};

export type QA = {
  id: string;
  question: string;
  answer: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type Questionnaire = {
  id: string;
  name: string;
  createdAt: string;
  qas: QA[];
};

interface AppState {
  user: User | null;
  documents: Document[];
  questionnaires: Questionnaire[];
  login: (email: string, name: string) => void;
  logout: () => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  addQuestionnaire: (q: Questionnaire) => void;
  updateQAStatus: (qId: string, qaId: string, status: QA['status'], newAnswer?: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      documents: [],
      questionnaires: [],
      login: (email, name) => {
        const user = { id: Math.random().toString(36).substr(2, 9), name, email };
        analytics.identify(user.id, { name, email });
        analytics.track('User Login');
        set({ user });
      },
      logout: () => {
        analytics.track('User Logout');
        set({ user: null });
      },
      addDocument: (doc) => {
        analytics.track('Document Uploaded', { docName: doc.name });
        set((state) => ({ documents: [...state.documents, doc] }));
      },
      removeDocument: (id) => set((state) => ({
        documents: state.documents.filter((d) => d.id !== id)
      })),
      addQuestionnaire: (q) => {
        analytics.track('Questionnaire Created', { qName: q.name, questionsCount: q.qas.length });
        set((state) => ({ questionnaires: [...state.questionnaires, q] }));
      },
      updateQAStatus: (qId, qaId, status, newAnswer) => set((state) => ({
        questionnaires: state.questionnaires.map((q) => {
          if (q.id === qId) {
            return {
              ...q,
              qas: q.qas.map((qa) => {
                if (qa.id === qaId) {
                  return { ...qa, status, answer: newAnswer !== undefined ? newAnswer : qa.answer };
                }
                return qa;
              })
            };
          }
          return q;
        })
      }))
    }),
    {
      name: 'trustsync-storage',
    }
  )
);

import { Router, Request, Response } from 'express';

interface User {
  id: string;
  email: string;
  name: string;
}

const router = Router();

const users: User[] = [
  { id: '1', email: 'john@example.com', name: 'John Doe' },
  { id: '2', email: 'jane@example.com', name: 'Jane Smith' }
];

router.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

export default router;

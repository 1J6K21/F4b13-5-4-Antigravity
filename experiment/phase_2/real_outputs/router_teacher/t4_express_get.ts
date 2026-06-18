import { Request, Response, Router } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
}

const router = Router();

const mockUsers: User[] = [
  { id: '1', email: 'alice@example.com', name: 'Alice' },
  { id: '2', email: 'bob@example.com', name: 'Bob' },
];

router.get('/users', (req: Request, res: Response) => {
  res.json(mockUsers);
});

export default router;

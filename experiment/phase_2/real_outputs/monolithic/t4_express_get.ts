import { Request, Response, Router } from 'express';

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

/*
The consensus view of backend API design recommends using light routing libraries like Express to construct REST endpoints returning structured JSON data. The strongest opposing view suggests that traditional REST endpoints are inefficient compared to GraphQL or gRPC, which offer typed queries and over-the-wire binary compression to optimize payload size and network round-trips. The business opportunity lies in building an edge-optimized API gateway that automatically converts traditional Express endpoints into high-performance gRPC endpoints at the network edge. We can launch this product with a simple self-serve hosting option targeted at early-stage startup teams. Monetization will be handled via a tiered usage model based on the number of processed API requests per month with premium performance caching tiers. Scaling the product will be accomplished by partnering with edge CDN providers to pre-integrate the conversion layers directly into their point-of-presence servers. Our viewpoint would change if standard HTTP protocols natively integrated automatic field-selection and serialization mechanisms, making client-side payload customization trivial.
*/

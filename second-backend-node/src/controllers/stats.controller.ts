import { Request, Response } from 'express';
import { computeTicketStats } from '../services/stats.service';

export function getStats(_req: Request, res: Response): void {
  res.json(computeTicketStats());
}

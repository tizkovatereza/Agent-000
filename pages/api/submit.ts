import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { input } = req.body;
    const response = 'Hello, friend!';
    res.status(200).json({ message: response });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

import express, { type Request, type Response } from 'express';

const port: number = 8080;
const app = express();

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'First express app with bun',
    success: true,
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

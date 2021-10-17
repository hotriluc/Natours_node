import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
const port = 3000;
const tours = JSON.parse(fs.readFileSync('dev-data/data/tours.json').toString());

app.get('/api/v1/tours', (req: Request, res: Response) => {
  res.status(200).json({ message: 'success', data: { tours: tours } });
});

app.listen(port, () => {
  console.log('This server is running on port ' + port);
});

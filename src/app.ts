import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
const port = 3000;
const tours = JSON.parse(fs.readFileSync('dev-data/data/tours-simple.json').toString());

app
  .get('/api/v1/tours', (req: Request, res: Response) => {
    res.status(200).json({ message: 'success', data: { tours: tours } });
  })
  .post('/api/v1/tours', (req: Request, res: Response) => {
    let tourId = tours[tours.length - 1].id + 1;
    let tour = Object.assign({ id: tourId }, req.body);
    tours.push(tour);
    fs.writeFile('dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
      res.send('ok');
    });
  });

app.listen(port, () => {
  console.log('This server is running on port ' + port);
});

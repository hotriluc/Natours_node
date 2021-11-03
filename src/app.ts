import e, { NextFunction } from 'express';
import express, { Request, Response } from 'express';
import fs from 'fs';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(
  (req: Request, res: Response, next: NextFunction) => {
    console.log('hello from middleware');
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    req['requestDate'] = new Date().toString();
    next();
  },
);

const port = 3000;
const tours = JSON.parse(
  fs
    .readFileSync('dev-data/data/tours-simple.json')
    .toString(),
);

const getAllTours = (req: Request, res: Response) => {
  res.status(200).json({
    date: req['requestDate'],
    message: 'success',
    data: { tours: tours },
  });
};

const getTour = (req: Request, res: Response) => {
  const id = parseInt(req.params['id']);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: { tour: tour },
    });
  }
};

const updateTour = (req: Request, res: Response) => {
  const id = parseInt(req.params['id']);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({
      status: ' fail',
      message: 'Invalid ID',
    });
  } else {
    tour['price'] = 'TOBEUPDATED';
    fs.writeFile(
      'dev-data/data/tours-simple.json',
      JSON.stringify(tours),
      (err) => {
        res.status(200).json({
          status: 'success',
          tour: tour,
        });
      },
    );
  }
};

const deleteTour = (req: Request, res: Response) => {
  const id = parseInt(req.params['id']);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({
      status: ' fail',
      message: 'Invalid ID',
    });
  } else {
    tours.splice(id, id);
    fs.writeFile(
      'dev-data/data/tours-simple.json',
      JSON.stringify(tours),
      (err) => {
        res.status(200).json({
          status: 'success',
          tour: tour,
        });
      },
    );
  }
};

const addTour = (req: Request, res: Response) => {
  let tourId = tours[tours.length - 1].id + 1;
  let tour = Object.assign({ id: tourId }, req.body);
  tours.push(tour);
  fs.writeFile(
    'dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      res.send('ok');
    },
  );
};

app
  .get('/api/v1/tours', getAllTours)
  .post('/api/v1/tours', addTour);
app
  .get('/api/v1/tours/:id', getTour)
  .patch('/api/v1/tours/:id', updateTour)
  .delete('/api/v1/tours/:id', deleteTour);

app.listen(port, () => {
  console.log('This server is running on port ' + port);
});

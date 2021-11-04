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
    req['requestDate'] = new Date().toISOString();
    next();
  },
);

const port = 3000;
const tours = JSON.parse(
  fs
    .readFileSync('dev-data/data/tours-simple.json')
    .toString(),
);

const users = JSON.parse(
  fs.readFileSync('dev-data/data/users.json').toString(),
);

const getAllTours = (req: Request, res: Response) => {
  console.log(users);
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

const createTour = (req: Request, res: Response) => {
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

const getAllUsers = (req: Request, res: Response) => {
  res.status(200).json({
    date: req['requestDate'],
    message: 'success',
    data: { users: users },
  });
};

const getUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'The endpoint is not defined',
  });
};

const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'The endpoint is not defined',
  });
};

const deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'The endpoint is not defined',
  });
};

const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'The endpoint is not defined',
  });
};

//ROUTES
const tourRouter = express.Router();
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const userRouter = express.Router();
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app
  .use('/api/v1/tours', tourRouter)
  .use('/api/v1/users', userRouter);

app.listen(port, () => {
  console.log('This server is running on port ' + port);
});

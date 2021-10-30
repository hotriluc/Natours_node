"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
const tours = JSON.parse(fs_1.default.readFileSync('dev-data/data/tours-simple.json').toString());
app
    .get('/api/v1/tours', (req, res) => {
    res.status(200).json({ message: 'success', data: { tours: tours } });
})
    .post('/api/v1/tours', (req, res) => {
    let tourId = tours[tours.length - 1].id + 1;
    let tour = Object.assign({ id: tourId }, req.body);
    tours.push(tour);
    fs_1.default.writeFile('dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.send('ok');
    });
});
app.listen(port, () => {
    console.log('This server is running on port ' + port);
});
//# sourceMappingURL=app.js.map
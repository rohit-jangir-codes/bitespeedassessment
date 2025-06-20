import express from 'express';
import identifyRoute from './routes/identify'; 
const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use('/', identifyRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

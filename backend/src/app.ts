import * as express from 'express';
import { uniswapRoute, pancakeBunnyRoute } from './routes';

const app: express.Application = express();

app.use('/uniswap', uniswapRoute);
app.use('/pancakeBunny', pancakeBunnyRoute);

export default app;

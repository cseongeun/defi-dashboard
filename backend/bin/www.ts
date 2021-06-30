import app from '../src/app';

const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => console.log(`api server listening at ${port}`)).on('error', (err) => console.error(err));

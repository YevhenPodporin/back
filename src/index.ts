import {app, server} from './app'
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}...`);
});

export default app;

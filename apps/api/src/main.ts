import express from 'express';
import shenwanRoutes from './routes/shenwan.routes';
import { serviceDiscovery } from './services/service-discovery.client';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'healthy', service: 'api' });
});

// Shenwan routes
app.use('/api/shenwan', shenwanRoutes);

app.listen(port, host, async () => {
  console.log(`[ ready ] http://${host}:${port}`);

  // Register with Consul
  await serviceDiscovery.registerService('api', `api-${process.env.HOSTNAME || 'local'}`, port, '/health');
});

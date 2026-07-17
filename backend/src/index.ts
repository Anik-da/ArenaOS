import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/app';
import { logger } from './utilities/logger';
import apiRouter from './routes/api.routes';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { swaggerSpec } from './swagger';
import { utilityService } from './services/utility.service';
import { weatherService } from './services/weather.service';

import { createAdapter } from '@socket.io/redis-adapter';
import { redisClient, isRedisMock } from './config/redis';

const app = express();
const server = http.createServer(app);

// Configure Socket.IO Server with environment CORS settings
const io = new Server(server, {
  cors: {
    origin: config.cors.origin === '*' ? '*' : config.cors.origin.split(','),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Configure Redis adapter for horizontal scaling (over 100k concurrent users across instances)
if (!isRedisMock) {
  try {
    const pubClient = redisClient;
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('Socket.IO Redis adapter initialized for horizontal scaling.');
  } catch (err: any) {
    logger.warn(`Failed to initialize Socket.IO Redis adapter: ${err.message}`);
  }
} else {
  logger.info('Socket.IO running in standalone mode (Redis mock active).');
}

// Middlewares
app.use(helmet());
app.use(cors({ origin: config.cors.origin === '*' ? '*' : config.cors.origin.split(',') }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import auditMiddleware from './middlewares/audit.middleware';
app.use(auditMiddleware);

// Morgan request logging mapped to winston stream
app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));

// Swagger Documentation Route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount REST Router
app.use('/api', apiRouter);

// Base Checkpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Centralized Error handler
app.use(errorHandlerMiddleware);

// ==========================================
// SOCKET.IO EVENT PIPELINES (REAL-TIME TELEMETRY)
// ==========================================
io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);

  // Room Join allocations
  socket.on('join:room', (room: string) => {
    logger.info(`Socket ${socket.id} joined feed channel: ${room}`);
    socket.join(room);
  });

  socket.on('leave:room', (room: string) => {
    logger.info(`Socket ${socket.id} left feed channel: ${room}`);
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

// Periodic simulations pushing live operational updates
setInterval(async () => {
  try {
    const stadiumId = 'stadium_main_1';
    
    // 1. Utilities draw feeds updates
    const energy = await utilityService.trackLiveEnergy(stadiumId);
    const water = await utilityService.trackLiveWater(stadiumId);
    
    io.to('stadium:utilities').emit('telemetry:utilities', {
      energy: energy.totalConsumptionKW,
      solarContribPct: (energy.solarPowerKW / energy.totalConsumptionKW) * 100,
      batteryPct: energy.batteryBackupPct,
      waterLitersSec: water.consumptionLiters,
      leakDetected: water.leakDetected,
      timestamp: new Date(),
    });

    // 2. Crowd density updates
    const densityData = [
      { zoneId: 'zone_a', density: Math.floor(60 + Math.random() * 30) },
      { zoneId: 'zone_b', density: Math.floor(40 + Math.random() * 45) },
      { zoneId: 'zone_c', density: Math.floor(70 + Math.random() * 25) },
    ];
    io.to('stadium:crowd').emit('telemetry:crowd', {
      zones: densityData,
      timestamp: new Date(),
    });

    // 3. Weather feeds update
    const weather = await weatherService.fetchLiveStadiumWeather(stadiumId);
    io.to('stadium:live').emit('telemetry:weather', weather);

  } catch (error: any) {
    logger.error(`Realtime telemetry socket loop error: ${error.message}`);
  }
}, 4000); // Trigger feeds updates every 4 seconds

// Start Server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`===============================================`);
  logger.info(` ARES AI Platform Axes Backend running in [${config.env}]`);
  logger.info(` REST APIs served at http://localhost:${PORT}/api`);
  logger.info(` Swagger Docs available at http://localhost:${PORT}/docs`);
  logger.info(` Socket.IO pipeline active on port ${PORT}`);
  logger.info(`===============================================`);
});

export { app, server, io };

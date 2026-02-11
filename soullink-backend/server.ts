import express, { Request, Response } from 'express'; // ✅ Thêm Request, Response để định nghĩa kiểu
import { createServer } from 'http';
import { Server, Socket } from 'socket.io'; // ✅ Thêm Socket để định nghĩa kiểu
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// --- CẤU HÌNH HỆ THỐNG ---
const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const prisma = new PrismaClient();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// ==========================================
// 🛡️ 1. AUTH & LEGAL
// ==========================================
// ✅ Thêm : Request, res: Response để sửa lỗi TS7006
app.post('/api/auth', async (req: Request, res: Response) => {
  const { username, name, password, isLegalAccepted } = req.body;
  try {
    const user = await prisma.user.upsert({
      where: { username: username.toLowerCase() },
      update: { name, lastLogin: new Date() },
      create: { 
        username: username.toLowerCase(), 
        name, 
        password: password || "123456", 
        role: 'user',
        isLegalAccepted: isLegalAccepted || false 
      }
    });
    res.json(user);
  } catch (e) { 
    console.error(e);
    res.status(500).json({ error: "Portal Connection Failure" }); 
  }
});

// ==========================================
// 🌙 2. SHARD ECONOMY
// ==========================================
app.post('/api/shop/purchase', async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { moonShards: { increment: amount } }
    });
    io.emit('notification', { userId, type: 'shard', message: `+${amount} Shards!` });
    res.json({ success: true, balance: user.moonShards });
  } catch (e) { res.status(400).json({ error: "Economic Policy Violation" }); }
});

// ==========================================
// 🧧 3. COMMUNITY HUB
// ==========================================
app.get('/api/global-chat', async (req: Request, res: Response) => {
  try {
    const messages = await prisma.globalMessage.findMany({
      take: 50, orderBy: { timestamp: 'desc' }, include: { user: true }
    });
    res.json(messages.reverse());
  } catch (e) { res.json([]); }
});

app.post('/api/global-chat', async (req: Request, res: Response) => {
  const { userId, text, type, data } = req.body;
  try {
    const msg = await prisma.globalMessage.create({
      data: { userId, text, type: type || 'text', data: data?.toString() },
      include: { user: true }
    });
    io.emit('new_message', msg);
    res.json(msg);
  } catch (e) { res.status(500).json({ error: "Sync Failed" }); }
});

// ==========================================
// 👑 4. ADMIN NEXUS
// ==========================================
app.get('/api/admin/nexus-stats', async (req: Request, res: Response) => {
  try {
    const [userCount, msgCount, shardSum] = await Promise.all([
      prisma.user.count(),
      prisma.globalMessage.count(),
      prisma.user.aggregate({ _sum: { moonShards: true } })
    ]);
    res.json({
      totalSouls: userCount,
      liveEchoes: msgCount,
      marketCap: shardSum._sum.moonShards || 0,
      uptime: `${process.uptime().toFixed(0)}s`
    });
  } catch (e) { res.status(500).json({ error: "Stats Error" }); }
});

app.delete('/api/admin/prune', async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    await prisma.chatSession.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true, prunedCount: ids.length });
  } catch (e) { res.status(500).json({ error: "Prune Failed" }); }
});

// ==========================================
// 📡 5. REAL-TIME SOCKET
// ==========================================
// ✅ Thêm : Socket và data: any để sửa lỗi TS7006
io.on('connection', (socket: Socket) => {
  socket.on('typing', (data: any) => socket.broadcast.emit('user_typing', data));
});

// ==========================================
// 🚀 LAUNCH ENGINE
// ==========================================
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`
  🌌 SOULLINK AI MASTER BRAIN v6.0 VTD ONLINE 🌌
  -------------------------------------------
  📡 Local: http://localhost:${PORT}
  📱 Mobile: http://192.168.1.7:${PORT}
  💎 Neon DB: Neural Sync Active
  🛡️ Identity: 51+ Components Ready
  -------------------------------------------
  Master Quang Hổ, hệ thống đã sẵn sàng khởi động!
  `);
});
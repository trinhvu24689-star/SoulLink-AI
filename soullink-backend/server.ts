import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// --- CẤU HÌNH HỆ THỐNG ---
const app = express();
const httpServer = createServer(app); // ✅ Đã đặt tên biến chuẩn là httpServer
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Fix lỗi kết nối Prisma 7
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ==========================================
// 🛡️ 1. AUTH & LEGAL
// ==========================================
app.post('/api/auth', async (req, res) => {
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
app.post('/api/shop/purchase', async (req, res) => {
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
app.get('/api/global-chat', async (req, res) => {
  try {
    const messages = await prisma.globalMessage.findMany({
      take: 50, orderBy: { timestamp: 'desc' }, include: { user: true }
    });
    res.json(messages.reverse());
  } catch (e) { res.json([]); }
});

app.post('/api/global-chat', async (req, res) => {
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
app.get('/api/admin/nexus-stats', async (req, res) => {
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

// Neural Pruning
app.delete('/api/admin/prune', async (req, res) => {
  const { ids } = req.body;
  try {
    await prisma.chatSession.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true, prunedCount: ids.length });
  } catch (e) { res.status(500).json({ error: "Prune Failed" }); }
});

// ==========================================
// 📡 5. REAL-TIME SOCKET
// ==========================================
io.on('connection', (socket) => {
  socket.on('typing', (data) => socket.broadcast.emit('user_typing', data));
});

// ==========================================
// 🚀 LAUNCH ENGINE
// ==========================================
const PORT = 3000;

// ✅ KHỚP TÊN BIẾN Ở ĐÂY
httpServer.listen(PORT, () => {
  console.log(`
  🌌 SOULLINK AI MASTER BRAIN v6.0 VTD ONLINE 🌌
  -------------------------------------------
  📡 Local: http://localhost:${PORT}
  📱 Mobile: http://192.168.1.7:${PORT}
  💎 Neon DB: Neural Sync Active
  🛡️  Identity: 51+ Components Ready
  -------------------------------------------
  Master Quang Hổ, hệ thống đã sẵn sàng khởi động!
  `);
});
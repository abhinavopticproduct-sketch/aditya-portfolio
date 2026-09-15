import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Prisma Client
let prisma = null;
if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
  try {
    prisma = new PrismaClient();
  } catch (err) {
    console.warn('[DB] Prisma client failed to initialize, falling back to secure in-memory store:', err.message);
  }
}

// In-memory fallback repository when DATABASE_URL is not yet provided
const fallbackContactStore = [];

// Simple in-memory rate limiting map: ip -> last timestamp
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    databaseConnected: Boolean(prisma && process.env.DATABASE_URL),
  });
});

// Contact endpoint: POST /api/contact
app.post('/api/contact', async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    
    // Rate limiting check
    const now = Date.now();
    const clientHistory = rateLimitMap.get(clientIp) || [];
    const recentRequests = clientHistory.filter(time => now - time < RATE_LIMIT_WINDOW_MS);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        success: false,
        error: 'Too many messages sent. Please wait a moment before trying again.',
      });
    }

    recentRequests.push(now);
    rateLimitMap.set(clientIp, recentRequests);

    const { name, email, subject, message } = req.body || {};

    // Validation
    const errors = {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Please provide a valid full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      errors.subject = 'Please provide a subject line (at least 3 characters).';
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.message = 'Please provide a message with at least 10 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    const cleanedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date(),
    };

    let savedRecord;

    if (prisma && process.env.DATABASE_URL) {
      try {
        savedRecord = await prisma.contact.create({
          data: {
            name: cleanedData.name,
            email: cleanedData.email,
            subject: cleanedData.subject,
            message: cleanedData.message,
          },
        });
      } catch (dbError) {
        console.warn('[DB Error] Neon DB write failed, storing in memory fallback:', dbError.message);
        savedRecord = {
          id: 'mem_' + Date.now(),
          ...cleanedData,
        };
        fallbackContactStore.push(savedRecord);
      }
    } else {
      savedRecord = {
        id: 'mem_' + Date.now(),
        ...cleanedData,
      };
      fallbackContactStore.push(savedRecord);
      console.log('[Contact Submission - Local Store]', savedRecord);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out, Aditya will be in touch shortly!',
      data: {
        id: savedRecord.id,
        name: savedRecord.name,
        email: savedRecord.email,
        createdAt: savedRecord.createdAt,
      },
    });
  } catch (error) {
    console.error('[API Error in /api/contact]:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred. Please try again later.',
    });
  }
});

// For Vercel Serverless Function export or standalone Express server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Aditya Portfolio Server] Express backend running on http://localhost:${PORT}`);
  });
}

export default app;

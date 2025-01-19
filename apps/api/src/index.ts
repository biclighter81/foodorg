import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import { MongoClient } from 'mongodb';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import * as Minio from 'minio';
import { TokenPayload } from './types';
import multer from 'multer';
const upload = multer();

const openai = new OpenAI();

const minio = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

//init mongodb
const client = new MongoClient(process.env.MONGO_URI!);
client.connect().then(() => {
  console.log('Connected to MongoDB');
});

//jwt middleware
const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwks = createRemoteJWKSet(new URL(process.env.JWKS_URI!));
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({
      message: 'No token provided',
    });
    return;
  }
  try {
    const { payload } = await jwtVerify(token, jwks);
    req.auth = payload as TokenPayload;
    next();
  } catch (e) {
    res.status(401).json({
      message: 'Invalid token',
    });
  }
};

app.post('/scan-recipe', upload.single('image'), async (req, res) => {
  const file = req.file;
  console.log('Received recipe image');
  if (!file) {
    res.status(400).json({
      message: 'No file uploaded',
    });
    return;
  }
  const buffer = file.buffer;
  const bucket = 'foodorg';
  const filename = req.headers['x-request-id'] + '_' + file.originalname;
  await minio.putObject(bucket, filename, buffer);
  const aiRes = await scanRecipe(`https://s3.rimraf.de/${bucket}/${filename}`);
  res.json({
    url: `https://s3.rimraf.de/${bucket}/${filename}`,
    recipe: aiRes,
  });
});

app.get('/recipes', jwtMiddleware, async (req, res) => {
  const db = client.db('foodorg');
  const collection = db.collection('recipes');
  const recipes = await collection.find({ uid: req.auth?.sub }).toArray();
  res.json(recipes);
});

app.get('/health', (req, res) => {
  console.log('Health check');
  res.json({
    status: 'ok',
  });
});

app.post('/recipe', jwtMiddleware, async (req, res) => {
  const recipe = req.body;
  const db = client.db('foodorg');
  const collection = db.collection('recipes');
  const result = await collection.insertOne({ recipe, uid: req.auth?.sub });
  res.json(result);
});

async function scanRecipe(imgUrl: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'If you detect a recipe in this image give it me in following json structure: (name: string, ingredients: array of ingridient name and amount in metric units and unit, method: array of steps with a short title and description what to do). Always answer in json format. Always translate any recipe in english with metric units.',
          },
          {
            type: 'image_url',
            image_url: {
              url: imgUrl,
            },
          },
        ],
      },
    ],
  });
  const [{ message }] = response.choices;
  const recipe = JSON.parse(message.content || '{}');
  return recipe;
}

app.listen(3000, () => {
  console.log('Server is running on :3000');
});

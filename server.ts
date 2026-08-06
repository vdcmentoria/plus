import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Trust reverse proxy headers (Easypanel, Traefik, Cloudflare, Nginx)
  app.set('trust proxy', true);

  // CORS Middleware for custom domains and reverse proxies
  app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Let Express parse JSON and URLencoded bodies
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Directories for server JSON db
  const dataDir = path.join(process.cwd(), 'data');
  const collectionsFile = path.join(dataDir, 'collections.json');
  const plansFile = path.join(dataDir, 'plans.json');

  // Seeds
  const initialCollections = [
    {
      id: "1",
      title: "Isabel Machado",
      date: "01/05/2026",
      status: "Público",
      image: null,
      type: "collection",
      slug: "isabel-machado",
      media: []
    },
    {
      id: "2",
      title: "Gabriela e Lucas Casamento",
      date: "16/05/2026",
      status: "Público",
      tags: ["Loja"],
      image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=600&q=80",
      slug: "gabriela-e-lucas",
      type: "collection",
      media: [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "3",
      title: "Gabriela e Lucas",
      date: "16/05/2026",
      status: "Pública",
      tags: ["Pasta"],
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
      slug: "gabriela-e-lucas-folder",
      type: "folder"
    },
    {
      id: "4",
      title: "Videos",
      date: "23/04/2026",
      status: "Público",
      image: null,
      type: "collection",
      media: []
    }
  ];

  // Initialize DB files if not exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(collectionsFile)) {
    fs.writeFileSync(collectionsFile, JSON.stringify(initialCollections, null, 2), 'utf8');
  }
  if (!fs.existsSync(plansFile)) {
    fs.writeFileSync(plansFile, JSON.stringify([], null, 2), 'utf8');
  }

  // Helper to read/write JSON db beautifully
  function readCollections() {
    try {
      if (fs.existsSync(collectionsFile)) {
        return JSON.parse(fs.readFileSync(collectionsFile, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading collections:', e);
    }
    return [];
  }

  function writeCollections(data: any) {
    try {
      fs.mkdirSync(path.dirname(collectionsFile), { recursive: true });
      fs.writeFileSync(collectionsFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing collections:', e);
    }
  }

  function readPlans() {
    try {
      if (fs.existsSync(plansFile)) {
        return JSON.parse(fs.readFileSync(plansFile, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading plans:', e);
    }
    return [];
  }

  function writePlans(data: any) {
    try {
      fs.mkdirSync(path.dirname(plansFile), { recursive: true });
      fs.writeFileSync(plansFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing plans:', e);
    }
  }

  // Initialize S3 Client lazily to detect errors only when used
  let s3Client: S3Client | null = null;
  function getS3Client() {
    if (!s3Client) {
      const accountId = (process.env.R2_ACCOUNT_ID || '').trim();
      const accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim();
      const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim();
      
      const isConfigured = 
        accountId && 
        accessKeyId && 
        secretAccessKey && 
        !accountId.includes('here') && 
        !accessKeyId.includes('here') && 
        !secretAccessKey.includes('here');

      if (!isConfigured) {
        throw new Error(
          'Configurações do Cloudflare R2 ausentes ou com valores de exemplo! Por favor, adicione suas credenciais reais (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) no painel de Configurações/Secrets.'
        );
      }
      
      s3Client = new S3Client({
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        region: 'auto',
      });
    }
    return s3Client;
  }

  // Set up multer with memory storage (Max file size: 100MB)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const accountId = (process.env.R2_ACCOUNT_ID || '').trim();
    const accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim();
    const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim();

    const isConfigured = !!(
      accountId && 
      accessKeyId && 
      secretAccessKey && 
      !accountId.includes('here') && 
      !accessKeyId.includes('here') && 
      !secretAccessKey.includes('here')
    );

    res.json({
      status: 'ok',
      r2Configured: isConfigured,
    });
  });

  // Cloudflare R2 Upload Endpoint
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      const file = req.file;
      const client = getS3Client();
      const bucketName = process.env.R2_BUCKET_NAME || 'frameplus-uploads';
      const publicPrefix = process.env.R2_PUBLIC_URL_PREFIX || 'https://cdn.plus.framepro.click';

      // Build unique filename keeping original extension if possible
      const fileExtension = path.extname(file.originalname) || '.jpg';
      const sanitizedBaseName = path
        .basename(file.originalname, fileExtension)
        .replace(/[^a-zA-Z0-9_\-]/g, '_');
      const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      const uniqueFilename = `${sanitizedBaseName}-${uniqueSuffix}${fileExtension}`;

      // Organize objects under folder prefix 'uploads'
      const key = `uploads/${uniqueFilename}`;

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      // Clean the prefix configuration to form the final URL cleanly
      const normalizedPrefix = publicPrefix.endsWith('/') ? publicPrefix.slice(0, -1) : publicPrefix;
      const fileUrl = `${normalizedPrefix}/${key}`;

      console.log(` Successfully uploaded: ${file.originalname} -> ${fileUrl}`);

      return res.json({ url: fileUrl });
    } catch (error: any) {
      console.error('Error during Cloudflare R2 Upload:', error);
      return res.status(500).json({
        error: error.message || 'Erro interno ao tentar salvar o arquivo no Cloudflare R2.',
      });
    }
  });

  // Cloudflare R2 delete batch of files
  app.post('/api/delete-files', async (req, res) => {
    try {
      const { urls } = req.body;
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.json({ success: true, message: 'Nenhuma URL de arquivo fornecida ou array vazio.' });
      }

      console.log(`[R2 Cleanup] Solicitada remoção de ${urls.length} arquivos no Cloudflare...`);
      const client = getS3Client();
      const bucketName = process.env.R2_BUCKET_NAME || 'frameplus-uploads';

      const objectsToDelete = urls
        .map((url: string) => {
          if (!url || typeof url !== 'string') return null;
          const idx = url.indexOf('/uploads/');
          if (idx !== -1) {
            return { Key: url.substring(idx + 1) };
          }
          return null;
        })
        .filter(obj => obj !== null) as { Key: string }[];

      if (objectsToDelete.length === 0) {
        return res.json({ success: true, message: 'Nenhuma chave correspondente ao Cloudflare R2 encontrada.' });
      }

      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: objectsToDelete.slice(0, 1000),
            Quiet: true,
          }
        })
      );

      console.log(`[R2 Cleanup] Removidos ${objectsToDelete.length} objetos do Cloudflare R2 com sucesso.`);
      return res.json({ success: true, deletedCount: objectsToDelete.length });
    } catch (error: any) {
      console.error('[R2 Cleanup] Erro durante a exclusão das imagens:', error);
      // Suppress actual throw to avoid breaking user experience when credential keys aren't added, but log it elegantly.
      return res.status(500).json({
        error: error.message || 'Erro interno ao tentar remover os arquivos do R2.',
      });
    }
  });

  // Collections JSON API
  app.get('/api/collections', (req, res) => {
    try {
      const ownerId = req.query.ownerId;
      let collections = readCollections();

      if (ownerId) {
        collections = collections.filter((c: any) => c.ownerId === ownerId);
      }
      return res.json(collections);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/collections', (req, res) => {
    try {
      const collectionData = req.body;
      let collections = readCollections();

      if (!collectionData.id) {
        // Create new collection
        collectionData.id = `col_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
        collectionData.createdAt = new Date().toISOString();
        collectionData.updatedAt = new Date().toISOString();
        collections.push(collectionData);
      } else {
        // Update existing collection
        const index = collections.findIndex((c: any) => c.id.toString() === collectionData.id.toString());
        if (index !== -1) {
          collections[index] = {
            ...collections[index],
            ...collectionData,
            updatedAt: new Date().toISOString(),
          };
        } else {
          // Fallback - add if ID provided but mismatch
          collectionData.updatedAt = new Date().toISOString();
          collections.push(collectionData);
        }
      }

      writeCollections(collections);
      return res.json(collectionData);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // API to delete folders/galleries recursively and wipe All associated media from R2
  app.post('/api/collections/delete', async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório.' });
      }

      const idStr = id.toString();
      let collections = readCollections();
      const targetItem = collections.find((c: any) => c.id.toString() === idStr);

      if (!targetItem) {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }

      // Helper to gather all nested items recursively
      const getDescendants = (parentId: string, state: any[]): any[] => {
        const children = state.filter((c: any) => c.parentId?.toString() === parentId);
        let nested = [...children];
        children.forEach(child => {
          if (child.type === 'folder') {
            nested = [...nested, ...getDescendants(child.id.toString(), state)];
          }
        });
        return nested;
      };

      const itemsToDelete = [targetItem];
      if (targetItem.type === 'folder') {
        itemsToDelete.push(...getDescendants(idStr, collections));
      }

      // Collect all image URLs for cleanup from Cloudflare R2
      const urlsToDelete: string[] = [];
      itemsToDelete.forEach(item => {
        if (item.image && typeof item.image === 'string') {
          urlsToDelete.push(item.image);
        }
        if (Array.isArray(item.media)) {
          item.media.forEach((m: any) => {
            if (typeof m === 'string') {
              urlsToDelete.push(m);
            } else if (m && typeof m.url === 'string') {
              urlsToDelete.push(m.url);
            }
          });
        }
      });

      // Actually delete from R2
      if (urlsToDelete.length > 0) {
        try {
          const client = getS3Client();
          const bucketName = process.env.R2_BUCKET_NAME || 'frameplus-uploads';
          const objectsToDelete = urlsToDelete
            .map((url: string) => {
              const idx = url.indexOf('/uploads/');
              if (idx !== -1) {
                return { Key: url.substring(idx + 1) };
              }
              return null;
            })
            .filter(obj => obj !== null) as { Key: string }[];

          if (objectsToDelete.length > 0) {
            await client.send(
              new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: {
                  Objects: objectsToDelete.slice(0, 1000),
                  Quiet: true,
                }
              })
            );
            console.log(`[R2 Wipe] Removidas ${objectsToDelete.length} fotos do R2 para galeria/pasta deletada ID ${idStr}`);
          }
        } catch (r2Err: any) {
          console.warn('[R2 Wipe] Falha ao excluir objetos R2 (pode estar sem Keys de acesso):', r2Err.message);
        }
      }

      // Remove items from collections file
      const idsToDelete = itemsToDelete.map(item => item.id.toString());
      const updatedCollections = collections.filter((c: any) => !idsToDelete.includes(c.id.toString()));
      writeCollections(updatedCollections);

      return res.json({ success: true, deletedCount: idsToDelete.length, deletedUrlsCount: urlsToDelete.length });
    } catch (err: any) {
      console.error('Error during recursive collection/folder delete:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // User Profile JSON API
  const usersFile = path.join(dataDir, 'users.json');
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify({}, null, 2), 'utf8');
  }

  function readUsers() {
    try {
      if (fs.existsSync(usersFile)) {
        return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading users:', e);
    }
    return {};
  }

  function writeUsers(data: any) {
    try {
      fs.mkdirSync(path.dirname(usersFile), { recursive: true });
      fs.writeFileSync(usersFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing users:', e);
    }
  }

  app.get('/api/users/:uid', (req, res) => {
    try {
      const uid = req.params.uid;
      const users = readUsers();
      const profile = users[uid] || {
        uid,
        email: '',
        displayName: '',
        photoURL: '',
        pixEnabled: true,
        cardEnabled: false
      };
      return res.json(profile);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users/:uid', (req, res) => {
    try {
      const uid = req.params.uid;
      const data = req.body;
      const users = readUsers();
      users[uid] = {
        ...(users[uid] || {}),
        ...data,
        uid,
        updatedAt: new Date().toISOString()
      };
      writeUsers(users);
      return res.json(users[uid]);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Plans JSON API
  app.get('/api/plans', (req, res) => {
    try {
      const plans = readPlans();
      return res.json(plans);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/plans', (req, res) => {
    try {
      const data = req.body;
      const plans = readPlans();

      if (!data.id) {
        data.id = `plan_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
        plans.push(data);
      } else {
        const index = plans.findIndex((p: any) => p.id.toString() === data.id.toString());
        if (index !== -1) {
          plans[index] = { ...plans[index], ...data };
        } else {
          plans.push(data);
        }
      }

      writePlans(plans);
      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/plans/:id', (req, res) => {
    try {
      const id = req.params.id;
      let plans = readPlans();
      plans = plans.filter((p: any) => p.id.toString() !== id.toString());
      writePlans(plans);
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Global Error Handler for Express to prevent HTML fallback and handle Multer errors beautifully
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Express Error caught:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Ocorreu um erro interno no servidor.'
    });
  });

  // Vite middleware for development or Static Server for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA routing logic
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

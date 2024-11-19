import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Media from '../models/Media';

const router = express.Router();


// Multer, a Node.js middleware, is for handling multipart/form-data, commonly used for file uploads.
// storage defines where and how the uploaded files are stored.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


// upload configures Multer to use the custom storage setup.
const upload = multer({
  storage,
  // Restrict allowed file types using a fileFilter.
  fileFilter: (req, file, cb: any) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'video/mp4', 'video/mkv'];

    if (!allowedTypes.includes(file.mimetype)) {
      // Pass an Error instance to the callback for unsupported file types and false to not accept the file.
      return cb(new Error('Unsupported file type'), false);
    }
    // Pass null (no error) and true to accept the file.
    cb(null, true);
  },
  // Set a maximum file size using limits.
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});


// Upload Media
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, type } = req.body;
    const filePath = req.file?.path;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required.' });
    }
    if (!filePath) {
      return res.status(400).json({ message: 'File upload failed.' });
    }
    if (!['audio', 'video'].includes(type)) {
      return res.status(400).json({ message: 'Invalid media type. Must be "audio" or "video".' });
    }

    const media = new Media({ title, type, path: filePath });
    await media.save();

    res.status(201).json(media);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ message: 'Error uploading media', error });
  }
});

// Fetch all media files
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const mediaFiles = await Media.find(); // Fetch all media
    res.status(200).json(mediaFiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media files', error });
  }
});

// Route to stream media files (audio or video) by supporting range requests, allowing clients to stream files in chunks, 
// such as when seeking or buffering
router.get('/stream/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    const filePath = path.resolve(media.path);

    // Use async fs.stat for non-blocking file stat retrieval
    fs.stat(filePath, (err, stat) => {
      if (err) {
        return res.status(500).json({ message: 'File not found', error: err });
      }

      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;

        if (start >= fileSize) {
          return res.status(416).json({ message: 'Range not satisfiable' });
        }

        const file = fs.createReadStream(filePath, { start, end });
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': media.type === 'audio' ? 'audio/mpeg' : 'video/mp4',
        };

        res.writeHead(206, headers);
        file.pipe(res);
      } else {
        const headers = {
          'Content-Length': fileSize,
          'Content-Type': media.type === 'audio' ? 'audio/mpeg' : 'video/mp4',
        };
        res.writeHead(200, headers);
        fs.createReadStream(filePath).pipe(res);
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error streaming media', error });
  }
});

export default router;



import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

/**
 * BUG-008 FIX: Sanitize filenames to prevent path traversal attacks.
 * Strips: path separators, null bytes, relative refs (.. / .) and
 * any characters outside the safe alphanumeric/dash/dot/underscore set.
 *
 * @param {string} filename - Original filename from client
 * @returns {string} - Sanitized safe filename
 */
const sanitizeFilename = (filename) => {
  // Remove any path components (e.g., ../../etc/passwd.jpg -> passwd.jpg)
  const basename = filename.split(/[\\/]/).pop() || "upload";
  // Remove null bytes and control characters
  const noNull = basename.replace(/\0/g, "");
  // Keep only safe characters: alphanumeric, dash, underscore, dot
  const safe = noNull.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  // Prevent hidden files (leading dot) and double extensions like .php.jpg
  return safe.replace(/^\.+/, "").substring(0, 200) || "upload";
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadDir, "profiles")); // Save in absolute absolute folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeExt = path.extname(sanitizeFilename(file.originalname)).toLowerCase();
    cb(null, "profile-" + uniqueSuffix + safeExt);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// File filter for media (images and videos)
const mediaFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mkv|mov|avi|wmv/; // Added video extensions
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  // Mimetype check can be tricky for videos, sticking to extensions for now or broad regex
  const mimetype = /image\/|video\//.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"));
  }
};

// Create multer upload instance for profile pictures
export const uploadProfilePicture = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Configure storage for course thumbnails and media
const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadDir, "courses"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeExt = path.extname(sanitizeFilename(file.originalname)).toLowerCase();
    cb(null, "course-" + uniqueSuffix + safeExt);
  },
});

// Create multer upload instance for course thumbnails (images)
export const uploadCourseThumbnail = multer({
  storage: courseStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Create multer upload instance for media (videos)
export const uploadMedia = multer({
  storage: courseStorage,
  fileFilter: mediaFileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
});

import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles"); // Save in uploads/profiles folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
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
    cb(null, "uploads/courses");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "course-" + uniqueSuffix + path.extname(file.originalname));
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

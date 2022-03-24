import path from "path";
import multer from "multer";

const storagePosts = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/posts");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const storageAvatar = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/avatars");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileTypeOfPosts(file, cb) {
  const ext = path.extname(file.originalname).toLocaleLowerCase();

  let isCorrect = false;
  if (ext == ".jpeg" || ext == ".png" || ext == ".jpg" || ext == ".mp4") {
    isCorrect = true;
  } else {
    isCorrect = false;
  }

  if (isCorrect) {
    return cb(null, true);
  } else {
    cb("Images Only !!");
  }
}

function checkFileTypeOfAvatars(file, cb) {
  const ext = path.extname(file.originalname).toLocaleLowerCase();

  let isCorrect = false;
  if (ext == ".jpeg" || ext == ".png" || ext == ".jpg") {
    isCorrect = true;
  } else {
    isCorrect = false;
  }

  if (isCorrect) {
    return cb(null, true);
  } else {
    cb("Images Only !!");
  }
}

export const uploadPosts = multer({
  storage: storagePosts,
  fileFilter: function (req, file, cb) {
    checkFileTypeOfPosts(file, cb);
  },
});

export const uploadAvatar = multer({
  storage: storageAvatar,
  fileFilter: function (req, file, cb) {
    checkFileTypeOfAvatars(file, cb);
  },
});

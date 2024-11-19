import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "coverImage" || file.fieldname === "images") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  } else if (file.fieldname === "guestListFile") {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type for guest list."), false);
    }
  } else {
    cb(new Error("Unknown field."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 20 },
  { name: "guestListFile", maxCount: 1 },
]);

export default uploadFields;

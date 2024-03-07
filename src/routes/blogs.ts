import express from "express";
import { getBlog, deleteBlogById, getBlogById, createBlog, getBlogByTitle, likeBlog, addCommentToBlog } from "../models/blog";
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
import { auth} from "../middleware/auth";
import CustomRequest from "../middleware/auth";
import { isAdmin } from "../middleware/admin";

const storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
    const uploadDir = 'uploads/';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    cb(null, uploadDir); 
  },
  filename: function (req:any, file:any, cb:any) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', auth, isAdmin, upload.fields([
  { name: 'authorImage', maxCount: 1 }, 
  { name: 'blogImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

    const authorImage = files['authorImage'][0].path;
    const blogImage = files['blogImage'][0].path;

    if (!title || !description || !author || !authorImage || !blogImage) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const newBlog = await createBlog({ title, description, author, postedDate: Date.now(), authorImage, blogImage });
    
    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.use(express.json());

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const blogs = await getBlog();
    return res.status(200).json(blogs)
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

router.delete("/:id",auth, isAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedBlog = await deleteBlogById(id);
    return res.json(deletedBlog);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

router.put("/:id", auth, isAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.sendStatus(400);
    }

    const blog = await getBlogById(id);
    blog.title = title;
    blog.description = description;
    
    await blog.save();

    return res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});
router.post("/:id/like", auth, async (req: CustomRequest, res: express.Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 

        await likeBlog(id, userId);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/:id/comment", auth, async (req: CustomRequest, res: express.Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id; 

        await addCommentToBlog(id, userId, content);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_1 = require("../models/blog");
const fs = require("fs");
const router = express_1.default.Router();
const multer = require("multer");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
router.post('/', auth_1.auth, admin_1.isAdmin, upload.fields([
    { name: 'authorImage', maxCount: 1 },
    { name: 'blogImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const files = req.files;
        const authorImage = files['authorImage'][0].path;
        const blogImage = files['blogImage'][0].path;
        if (!title || !description || !author || !authorImage || !blogImage) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        const newBlog = await (0, blog_1.createBlog)({ title, description, author, postedDate: Date.now(), authorImage, blogImage });
        res.status(201).json(newBlog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.use(express_1.default.json());
router.get("/", async (req, res) => {
    try {
        const blogs = await (0, blog_1.getBlog)();
        return res.status(200).json(blogs);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
router.delete("/:id", auth_1.auth, admin_1.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await (0, blog_1.deleteBlogById)(id);
        return res.json(deletedBlog);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
router.put("/:id", auth_1.auth, admin_1.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (!title) {
            return res.sendStatus(400);
        }
        const blog = await (0, blog_1.getBlogById)(id);
        blog.title = title;
        blog.description = description;
        await blog.save();
        return res.status(200).json(blog);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
router.post("/:id/like", auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await (0, blog_1.likeBlog)(id, userId);
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post("/:id/comment", auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        await (0, blog_1.addCommentToBlog)(id, userId, content);
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=blogs.js.map
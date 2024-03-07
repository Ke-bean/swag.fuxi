"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentToBlog = exports.likeBlog = exports.updateBlogById = exports.deleteBlogById = exports.createBlog = exports.getBlogById = exports.getBlogByTitle = exports.getBlog = exports.Blog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BlogSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    authorImage: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [String],
        default: []
    },
    comments: [
        {
            user: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});
exports.Blog = mongoose_1.default.model("Blog", BlogSchema);
const getBlog = () => exports.Blog.find();
exports.getBlog = getBlog;
const getBlogByTitle = (title) => exports.Blog.findOne({ title });
exports.getBlogByTitle = getBlogByTitle;
const getBlogById = (id) => exports.Blog.findById(id);
exports.getBlogById = getBlogById;
const createBlog = (values) => new exports.Blog(values).save().then((Blog) => Blog.toObject());
exports.createBlog = createBlog;
const deleteBlogById = (id) => exports.Blog.findOneAndDelete({ _id: id });
exports.deleteBlogById = deleteBlogById;
const updateBlogById = (id, values) => exports.Blog.findByIdAndUpdate(id, values, { new: true });
exports.updateBlogById = updateBlogById;
const likeBlog = async (blogId, userId) => {
    const blog = await exports.Blog.findById(blogId);
    if (!blog) {
        throw new Error("Blog not found");
    }
    if (blog.likedBy.includes(userId)) {
        throw new Error("You have already liked this post");
    }
    return exports.Blog.findByIdAndUpdate(blogId, {
        $inc: { likes: 1 },
        $push: { likedBy: userId }
    }, { new: true });
};
exports.likeBlog = likeBlog;
const addCommentToBlog = async (blogId, userId, content) => {
    return exports.Blog.findByIdAndUpdate(blogId, {
        $push: {
            comments: {
                user: userId,
                content
            }
        }
    }, { new: true });
};
exports.addCommentToBlog = addCommentToBlog;
//# sourceMappingURL=blog.js.map
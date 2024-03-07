import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
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

export const Blog = mongoose.model("Blog", BlogSchema);

export const getBlog = () => Blog.find();
export const getBlogByTitle = (title: string) => Blog.findOne({ title });
export const getBlogById = (id: string) => Blog.findById(id);
export const createBlog = (values: Record<string, any>) => new Blog(values).save().then((Blog) => Blog.toObject());
export const deleteBlogById = (id: string) => Blog.findOneAndDelete({ _id: id });
export const updateBlogById = (id: string, values: Record<string, any>) =>
    Blog.findByIdAndUpdate(id, values, { new: true });

export const likeBlog = async (blogId: string, userId: string) => {
    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new Error("Blog not found");
    }

    if (blog.likedBy.includes(userId)) {
        throw new Error("You have already liked this post");
    }

    return Blog.findByIdAndUpdate(blogId, {
        $inc: { likes: 1 },
        $push: { likedBy: userId }
    }, { new: true });
};

export const addCommentToBlog = async (blogId: string, userId: string, content: string) => {
    return Blog.findByIdAndUpdate(blogId, {
        $push: {
            comments: {
                user: userId,
                content
            }
        }
    }, { new: true });
};

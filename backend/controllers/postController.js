import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import path from "path";
import fs from "fs";

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
  const newPost = new Post({
    text: req.body.text || null,
    media_url: req.body.media_url || null,
    user: req.user.id,
  });
  const post = await newPost.save();
  post.user = req.user;
  res.json(post);
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getListPost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    let postsToSend = [];
    const posts = await Post.find({ user: req.user.id }).populate("user");
    postsToSend = [...posts];
    for (let i = 0; i < user.following.length; i++) {
      if (user.following[i].isAccepted) {
        const posts = await Post.find({
          user: user.following[i].user,
        }).populate("user");
        postsToSend = [...postsToSend, ...posts];
      }
    }
    postsToSend.sort((a, b) => {
      return b.date - a.date;
    });
    res.json(postsToSend);
  } else {
    res.status(404);
    throw new Error("user not found");
  }
  // const posts = await Post.find().sort({ date: -1 });
});

// @desc    Get all posts
// @route   GET /api/posts/me
// @access  Private
export const getMyListOfPost = asyncHandler(async (req, res) =>
  res.json(await Post.find({ user: mongoose.Types.ObjectId(req.user.id) }))
);

// @desc    Get  posts by Id
// @route   GET /api/posts/:id
// @access  Private
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "user comments.user"
  );
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found !");
  }
});

// @desc    delete  a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (String(post.user) !== String(req.user.id)) {
      res.status(401);
      throw new Error("User not authorized !");
    } else {
      if (post.media_url && post.media_url !== "/images/user.png") {
        const __dirname = path.resolve();
        const filepath = path.join(__dirname, post.media_url);
        fs.unlink(filepath, async (err) => {
          if (err) {
            await post.remove();
            return res.json({ message: "Post removed !" });
          } else {
            await post.remove();
            return res.json({ message: "Post removed !" });
          }
        });
      } else {
        await post.remove();
        res.json({ message: "Post removed !" });
      }
    }
  } else {
    res.status(404);
    throw new Error("Post not found !");
  }
});

// @desc    Like a post
// @route   PUT /api/posts/like/:id
// @access  Private
export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (
      post.likes.filter((like) => String(like.user) === String(req.user.id))
        .length > 0
    ) {
      res.status(400);
      throw new Error("Post already liked");
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json({ likes: post.likes, _id: post.user });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Like a post
// @route   PUT /api/posts/like/:id
// @access  Private
export const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  // Check if the post has already been liked
  if (
    post.likes.filter((like) => String(like.user) === String(req.user.id))
      .length === 0
  ) {
    res.status(400);
    throw new Error("Post has not yet been liked");
  } else {
    const removeIndex = post.likes
      .map((like) => String(like.user))
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  }
});

// @desc    Add comment to post
// @route   POST /api/posts/comment/:id
// @access  Private
export const addCommentToPost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const post = await Post.findById(req.params.id).populate("comments.user");
  if (user) {
    if (post) {
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json({ comments: post.comments, _id: post.user });
    } else {
      res.status(404);
      throw new Error("Post not found !");
    }
  } else {
    res.status(401);
    throw new Error("User not authorized !");
  }
});

// @desc    Delete comment from post
// @route   DELETE /api/posts/comment/:id/:comment_id
// @access  Private
export const removeCommentFromPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("comments.user");
  // Pull out comment :
  const comment = post.comments.find(
    (comment) => String(comment._id) === String(req.params.comment_id)
  );
  // Make sure comment exsists :
  if (comment) {
    // Check user :
    if (String(comment.user._id) !== String(req.user.id)) {
      res.status(401);
      throw new Error("User not authorized !");
    } else {
      // Get removed id :
      const removedIndex = post.comments
        .map((comment) => String(comment.user._id))
        .indexOf(req.user.id);

      post.comments.splice(removedIndex, 1);
      await post.save();
      res.json(post.comments);
    }
  } else {
    res.status(404);
    throw new Error("Comment does not exist !");
  }
});

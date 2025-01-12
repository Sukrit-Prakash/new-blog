const Comment = require('../models/Comment')
const Post = require('../models/Post')
const {validationResult} = require('express-validator')


exports.createComment = async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const{content,postId,parentId} = req.body

   try {
     const post = await Post.findById(postId)
     if(!post){
         res.status(404).json({msg:"Post not found"})
     }
     // checking if this post has a parent id
     if(parentId){
         const parentComment = await Comment.findById(parentId)
         if(!parentComment){
             res.status(404).json({msg:"Parent comment not found"})
         }
     }
     //creating a comment
 
     const newComment = new Comment({
         content,
         postId,
         author:req.user.id,
         parentId:parentId || null
     })
     const savedComment = await newComment.save()
     post.commentsCount+=1;
     await post.save()
 
     res.status(201).json(savedComment);
   } catch (error) {
    console.error('Error creating comment:',error.message)
    res.status(500).json({error:'Server error while creating coment'})
   }
};


exports.getComments = async (req,res)=>{
    const {postId} = req.params

    try {
        const post = await Post.findById(postId)
        
        if(!post){
            res.status(404).json({msg:"Post not found"})
        }
        const comments = await Comment.find({postId})
        .populate('author','username email')
        .sort({createdAt:-1})
        res.json(comments)
    } catch (error) {
        console.log('Error fetching comments:',error.message)
        res.status(500).json({error:'Server error while fetching comments'})
    }
}
//only delete comment is not checked
exports.deleteComment = async (req,res)=>{
    const {id} = req.params
try {
    
        let comment = await Comment.findById(id)
        if(!comment){
            res.status(404).json({msg:"Comment not found"})
        }
        //why would i give a delete option on the frontend
        if(comment.author.toString() !== req.user.id){
           return res.status(403).json({msg:"Unauthorized to delete this comment"}) 
        }
    
        const postId = comment.postId;
    
         // Use deleteOne instead of remove
         await Comment.deleteOne({ _id: id });
        const post = await Post.findById(postId)
        if(post && post.commentsCount > 0){
            post.commentsCount -= 1;
        await post.save()
        }
    
        res.status(200).json({msg:"Comment deleted successfully"})
} catch (error) {
    console.log('error deleting comment:',error.message)
    res.status(500).json({error:'Server error while deleting comment'})
}
}
    



// postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
// author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// content: { type: String, required: true },
// likes: { type: Number, default: 0 },
// likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] ,// To track users who liked the comment
// parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // For nested comments
// createdAt: { type: Date, default: Date.now }
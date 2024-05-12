const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const multer = require('multer');
const BlogPost = require("../models/blog")
const path = require('path');
const fs = require('fs');

const {v4 : uuidv4} = require('uuid');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images'); // Destination directory for file uploads
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = uuidv4() + ext;
      cb(null, fileName); // Rename file with UUID
    },
  });
const upload = multer({ storage });

// for user registration

router.post("/register", async (req, res) => {
    console.log(req.body)

    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });
        console.log(preuser)

        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
            console.log("This Email is Already Exist")
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password Not Match" })
        } else {
            const finalUser = new userdb({
                fname, email, password, cpassword
            });

            // here password hasing

            const storeData = await finalUser.save();

            console.log(storeData);
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }

});




// user Login

router.post("/login", async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
       const userValid = await userdb.findOne({email:email});

        if(userValid){

            const isMatch = await bcrypt.compare(password,userValid.password);

            if(!isMatch){
                res.status(422).json({ error: "invalid details"})
            }else{

                // token generate
                const token = await userValid.generateAuthtoken();

                // cookiegenerate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error);
        console.log("catch block");
        console.log(error)
    }
});



// user valid
router.get("/validuser",authenticate,async(req,res)=>{
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
        console.log(error)
    }
});


// user logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(201).json({status:201})

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})

router.post('/posts', upload.single('image'), async (req, res) => {
    console.log(req.body)


    try {
      // Extract data from request body (title, description, categories)
      const { title, description, categories,username } = req.body;
      const imageUrl = req.file.filename; // Get the filename of the uploaded image
  
      // Create a new blog post instance
      const newPost = new BlogPost({
        title,
        description,
        categories,
        username,
        imageUrl: imageUrl // Relative path to the image
      });
  
      // Save the new post to the database
      const savedPost = await newPost.save();
  
      res.status(201).json(savedPost); // Respond with the saved post
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  });
  

  router.get('/getblog', async (req, res) => {
    try {
      // Fetch all posts from the database
      const allPosts = await BlogPost.find({});
  
      res.status(200).json(allPosts); // Respond with all posts as JSON
    } catch (error) {
      console.error('Error retrieving posts:', error);
      res.status(500).json({ message: 'Failed to retrieve posts' });
    }
  });



  router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description, username } = req.body;
    
    try {
      // Find the blog post by ID
      const blogPost = await BlogPost.findById(id);
      
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Update the blog post with new data
      blogPost.title = title;
      blogPost.description = description;
      blogPost.username = username;
      
      if (req.file) {
        blogPost.imageUrl = req.file.filename; // Update image URL if a new image was uploaded
      }
      
      // Save the updated blog post
      const updatedPost = await blogPost.save();
      
      res.status(200).json(updatedPost); // Respond with the updated post
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  router.delete('/deletePost/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the blog post by ID and delete it
      const deletedPost = await BlogPost.findByIdAndDelete(id);
  
      if (!deletedPost) {
        // If no blog post was found with the provided ID
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }
  
      // Respond with a success message if the post was deleted
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete blog post',
      });
    }
  });

module.exports = router;







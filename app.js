//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

main().catch(err=>
  console.log(err)
)

async function main(){

  await mongoose.connect("mongodb://127.0.0.1:27017/BlogsDB");

  const blogsSchema = new mongoose.Schema({
    title: String,
    content: String
  })

  const Blog = mongoose.model('Blog', blogsSchema);

  const blog1 = new Blog({
    title: "This is Blog 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cum sociis natoque penatibus et. Viverra suspendisse potenti nullam ac tortor vitae. Id donec ultrices tincidunt arcu non sodales. Lacinia at quis risus sed vulputate odio ut enim. Lacus suspendisse faucibus interdum posuere. Senectus et netus et malesuada fames. Volutpat consequat mauris nunc congue nisi. Sociis natoque penatibus et magnis dis parturient montes. Arcu dui vivamus arcu felis bibendum ut. At imperdiet dui accumsan sit amet nulla facilisi morbi. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. Facilisi nullam vehicula ipsum a. Vestibulum lorem sed risus ultricies tristique nulla. Sociis natoque penatibus et magnis dis parturient montes. Nunc sed velit dignissim sodales. Dictum varius duis at consectetur lorem donec massa sapien faucibus"
  })

  // blog1.save();

// const blogs = [];

app.set('view engine', 'ejs');  
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const blogsArray = [];
// const blogs = await Blog.find();

//   blogs.forEach(function(blog){
//     blogsArray.push(blog);
//   })
app.get('/', async function (req, res){
  const findBlogs = await Blog.find();


  res.render('home', {
    titleHome : 'Home',
    homeContent: homeStartingContent,
    addBlog : findBlogs
  });
})

app.post('/', function (req, res){
  
  const  inTitle = req.body.title;
  const  inContent = req.body.post;
  
  const newBlog = new Blog({
    title: inTitle,
    content: inContent
  })
  newBlog.save();
  res.redirect('/');
})

app.get('/posts/:topic', async function (req, res){
  let requestedtitle = _.lowerCase(req.params.topic);
  // const requestedtitle = req.params.topic;
  const findBlog = await Blog.find();
  // console.log(findBlog);

  // res.render('post', {
  //   blogTitle: findBlog.title,
  //   blogContent: findBlog.content
  // });


  console.log(req.params.topic);
  let content;
  let title;
  findBlog.forEach(function(blog){
    if(_.lowerCase(blog.title) === requestedtitle){
      content = blog.content;
      title = blog.title;
      res.render('post', {
        blogTitle: title,
        blogContent: content
      })
    }
   
  })
})

app.post('/post', function(req, res){
  console.log(req.body);
})
// app.post('/post', function (req, res) {
//   // console.log(req.body.read_more);
//   const inTitle = req.body.read_more;

//   const titleFromDB = Blog.find({title:  })
//   // res.redirect(`/posts/${title}`);
//   blogs.forEach(function(blog){
//     if(blog.title.replaceAll(' ','') === title){
//       res.render('post',{
//         blogTitle:  blog.title,
//         blogContent: blog.content
//       })
//     }
//   })
//   })

app.get('/home', function (req, res){
  res.redirect('/');
})

app.get('/about', function (req, res){
  res.render('about', {
    titleAbout : 'About Us',
    aboutContent : aboutContent
  });
})

app.get('/contact', function (req, res){
  res.render('contact',{
    titleContact: "Contact Us",
    contactContent : contactContent,
  });
})

app.get('/compose', function (req, res){
  res.render('compose',{
    title: "Compose"
  });
})

app.post('/compose', function(req, res){
  console.log(req.body);
})

}
app.listen(3000, function() {
  console.log("Server started on port 3000");
});



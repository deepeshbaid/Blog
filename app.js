var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    methodOverride=require("method-override"),
    sanitizer=require("express-sanitizer"),
    mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(sanitizer());

var blogSchema=new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{
       type:Date,default:Date.now
   }
    
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//   title:"kuch bhi",
//   image:"https://images.unsplash.com/photo-1532215930506-a2b2b5624df9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3b3016b14acc0590622735c714ba1fb0&auto=format&fit=crop&w=500&q=60",
//   body:"hii fraands"
// });


app.get("/",function(req, res) {
   res.redirect("/blogs"); 
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index",{blogs:blogs});
            
        }
    });
    
});

app.get("/blogs/new",function(req, res) {
   res.render("new"); 
});

app.post("/blogs",function(req,res){
   
    
   Blog.create(req.body.blog,function(err,newBlog){
       if(err)
       {
           res.render("new");
       }
       else{
           res.redirect("/blogs");
       }
   }) ;
});

app.get("/blogs/:id",function(req, res) {
   Blog.findById(req.params.id,function(err,foundBlog){
      if(err)
      {
          res.render("/blogs");
      }
      else{
          res.render("show",{blog:foundBlog});
      }
       
   });
});

app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit",{blog:foundBlog});
        }
    });
  
});

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err)
       {
           res.redirect("/blogs");
       }
       else{
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
        
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
var app=require('express')();
var http=require('http').Server(app);
app.get('/', (req,res)=>{res.sendFile(__dirname+'/static/anothergame/html/index.html')});
app.get('/about', (req,res)=>{res.sendFile(__dirname+'/static/anothergame/html/about.html')});
app.get('/menu', (req,res)=>{res.sendFile(__dirname+'/static/anothergame/html/menu.html')});
app.get('/profile', (req,res)=>{res.sendFile(__dirname+'/static/anothergame/html/profile.html')});
app.get('/rating', (req,res)=>{res.sendFile(__dirname+'/static/anothergame/html/rating.html')});
app.get('*', (req,res)=>{res.status('404').send('what?')});
http.listen(3000, ()=>{
console.log('listen 3000');})

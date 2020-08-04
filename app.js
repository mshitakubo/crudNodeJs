//Instalar as extensões e depois fazer o import dentro do arquivo.
//App trabalha do lado backend, servidor!
const express=require('express')
const bodyParse=require('body-parser')
const mysql=require('mysql')
const handlebars=require('express-handlebars')
const app=express()
const urlencodeParser=bodyParse.urlencoded({extended:false})
const sql=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Entrada.1234',
    port: 3306
})
sql.query("use nodesql");
app.use('/img', express.static('img'))

//Template engine
app.engine("handlebars", handlebars({defaultLayout:'main'}))
app.set('view engine','handlebars')

//Vinculando o arquivo CSS e Javascript . 
//Inserir tambem o link relstyle e tag script no main.handlebars
//Poderiamos fazer o mesmo para a pasta img
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))

//Routes and templates
app.get("/", function(req,res){
    //res.send("Essa é minha página inicial")
    //res.sendFile(__dirname + "/index.html")
    //res.render('index')
    //console.log(req.params.id)
    res.render('index')
})

app.get("/inserir",function(req,res){
    res.render("inserir")
})

app.get("/select/:id?",function(req,res){
    if(!req.params.id){
        sql.query("select * from user order by id asc", function(err, results, fields){
            res.render('select',{data:results})
        })
    } else {
        sql.query("select * from user where id=? order by id asc",[req.params.id], function(err, results, fields){
            res.render('select',{data:results})
        })
}
})
/** 
app.post("/controllerForm", urlencodeParser,function(req,res){
    sql.query("insert into user values (?,?,?)",[req.body.id, req.body.name, req.body.age])
    res.render('controllerForm', {name: req.body.name})
})*/

//Otimização do Insert, aproveitando o autoincrement do ID no mysql
app.post("/controllerForm", urlencodeParser,function(req,res){
    sql.query("insert into user (name, age) values (?,?)",[req.body.name, req.body.age])
    res.render('controllerForm', {name: req.body.name})
})

app.get('/deletar/:id',function(req,res){
    sql.query("delete from user where id=?",[req.params.id])
    res.render('deletar')
})

app.get("/update/:id",function(req,res){
    sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
    });
})

app.post("/controllerUpdate",urlencodeParser,function(req,res){
    sql.query("update user set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
    res.render('controllerUpdate');
 })

//Start server
app.listen(3000,function(req,res){
    console.log('Servidor está rodando!')
})
/*------------------------------------------------------------------------------ */
/* Importando e carregando módulos */
/*------------------------------------------------------------------------------ */
    const express = require("express");
    const handlebars = require("express-handlebars"); // Template Engine
    const bodyParser = require("body-parser"); // Serve para lidar com os dados que recebo do banco de dados
    const mongoose = require("mongoose"); // Modulo para uso do banco de dados MongoDB
    const admin = require("./routes/admin.js"); // Rota prefixo: admin
    const path = require("path"); // Serve para lidar/manipular diretórios
    const session = require("express-session"); // Modulo utilizado para se realizar sessões
    const flash = require("connect-flash") 
    // Gerando uma instancia para uso do modulo "express"
        const app = express(); 
    // Importando os Models
        // Model -> Postagem
            require("./models/Postagem")
            const Postagem = mongoose.model("postagens");
        // Model -> Categoria
            require("./models/Categoria")
            const Categoria = mongoose.model("categorias")  

/*------------------------------------------------------------------------------ */
/*Configurações*/
/*------------------------------------------------------------------------------ */
    // Sessão
        app.use(session({
            secret: "secret",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
        
    // Middleware
        app.use((req, res, next)=>{

            // Criando uma variavel global para mensagens de sucesso
            res.locals.success_msg = req.flash("success_msg");

            // Criando uma variavel global para mensagens de erro
            res.locals.error_msg = req.flash("error_msg");
            
            // Dando um console log para confirmar que o middleware está pegando
            console.log("Middleware its here");

            // -!!!!- Importante para fazer o programa rodar depois do middleware. POR NO FINAL.
            next()
        })
        
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    // HandleBars
        app.engine("handlebars", handlebars({defaultLayout: "main"}));
        app.set("view engine", "handlebars");

    // Mongoose
        mongoose.Promise = global.Promise; // Config para se evitar erros
        mongoose.connect('mongodb://localhost/blogapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false          
        }).then(()=>console.log("Conexão realizada com sucesso no banco de dados")).catch((err)=>console.log("Erro ao se conectar ao banco de dados: "+err));
    // Public
        app.use(express.static(path.join(__dirname, "public")))


/*------------------------------------------------------------------------------ */
/*Rotas*/
/*------------------------------------------------------------------------------ */
    // Rota principal    
        app.get("/", (req, res) => 
            {
                Postagem.find().populate("categoria").sort({data: "desc"}).then( (postagens) => 
                {
                    
                    res.render("index", {postagens: postagens.map( postagem => postagem.toJSON())})
                
                }).catch( (err) => 
                {
                    req.flash("erro_msg", "Houver um erro interno");
                    res.redirect("/404")
                })
            } );
    // Rota de error
        app.get("/404", (req, res) => 
        {
            res.send("404");
        })
    // Rota com uma lista de posts
        app.get("/posts", (req, res) => res.send("Post List") ); 
    
    // Rota prefixada admin
        app.use("/admin", admin) 
            
    // Rota de listagem de cada postagem
        app.get("/postagem/:slug", (req, res) => 
        {
            Postagem.findOne({ slug: req.params.slug }).lean().then( (postagem) => 
                {
                    if (postagem) {
                        res.render("postagem/index", {postagem: postagem})
                    
                    } else {
                        req.flash("error_msg", "Esta postagem não existe");
                        res.redirect("/")
                    }      
                }               
            ).catch( (err) => 
            {
                req.flash("error_msg", "Houve um erro interno");
                res.redirect("/");
            })
        })
    // Exibindo todas as categorias
        app.get("/categoria", (req, res) => {
            Cat
        })
    //Exemplo de middleware
    //<!!!!!!!!!!!!!> Tudo que se é usado app.use() é
    //-> um middleware("Espécie de espião que fica espionando o as requisições que o cliente faz ao servidor")
        /*
        app.use((req, res, next)=>{
            console.log("MIDDLEWARE ITS HERE URRR BITCHHHHHHHHHHH")
            next()})
        */


/*------------------------------------------------------------------------------ */
/*Outros*/
/*------------------------------------------------------------------------------ */
    // "Rodando" o servidor
    const PORT = 8081;
    app.listen(PORT, ()=>{
        console.log("O servidor está rodando...")
    })

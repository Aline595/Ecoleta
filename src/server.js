const express = require("express")
const server = express()

//pegar bd
const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//habilitar uso de req.body
server.use(express.urlencoded({ extended: true }))


//Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da minha aplicação
//página inicial
server.get("/", (req, res) =>{
    return res.render("index.html", {title: "Um titulo"})
})

server.get("/create-point", (req, res) =>{
    //console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    
    //console.log(req.body)

    //inserir dados no bd
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afyerInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }
        console.log("cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afyerInsertData)

    
})


server.get("/search", (req, res) =>{

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }

    //pega dados do bd
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }


        //console.log(rows)

        const total = rows.length

        //mostrar pagina html com bd
        return res.render("search-results.html", { places: rows, total: total})
    })

})

//ligar servidor
server.listen(3000)
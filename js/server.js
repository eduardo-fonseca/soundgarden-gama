/*
    DECLARACAO DOS REQUIRES DO SERVER.
*/

const http = require('http')
const url = require('url')
const fs = require('fs')


/*
    FUNCAO QUE REMOVE LINHA ESPECIFICA DE ACORDO COM A STRING PASSADA NO SEU PARAMETRO DE UM ARQUIVO PREDETERMINADO.
*/
function removeLine(searchString) {
    fs.readFile('../assets/fakeDB.txt', {encoding: 'utf-8'}, function(err, data) {
        if (err) throw error
      
        let dataArray = data.split('\n')
        const searchKeyword = searchString

        let newDataArray = dataArray.filter(line => line !== searchKeyword)
        const updatedData = newDataArray.join('\n')
      
        fs.writeFile('../assets/fakeDB.txt', updatedData, (err) => {
            if (err) throw err
        })
      
    })
}

/*
    FUNCAO QUE INSERE UM TEXTO EM UM ARQUIVO PREDETERMINADO. CASO O ARQUIVO NAO EXISTA ELE É CRIADO.
*/
function writeFile(text) {
    var stats = fs.statSync('../assets/fakeDB.txt')
    var fileSizeInBytes = stats.size
    if(fileSizeInBytes == 0) {
        fs.appendFile('../assets/fakeDB.txt', (`${text}`), function (error) {
            if (error) throw error;
        })
    } 
    else {
        fs.appendFile('../assets/fakeDB.txt', (`\n${text}`), function (error) {
            if (error) throw error;
        })
    }
}

/*
    OBJETO PARA SALVAR A POSICAO E O ID DA FAKEDB PARA SER TRATADO NA ADMIN.HTML
*/
function paramsAdmin(pos, id) {
    this.pos = pos
    this.id = id
}

/*
    INICIALIZA O SERVIDOR NODE.JS PARA RECEBER AS REQUISICOES.
*/
let server = http.createServer(function (request, response) {
  if(request.method === 'GET') {

    var url_parts = url.parse(request.url, true)
    var query = url_parts.query

    // ADICIONAR EVENTO NA FAKEDB
    if (query.addEvent != undefined) {
        writeFile(`${query.addEvent}`)
    }

    else if (query.delEvent != undefined) {
        removeLine(`${query.delEvent}`)
    }

  }
})

server.listen(8443)
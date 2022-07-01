//import fetch from "node-fetch";

/*
    FUNÇAO QUE CONVERTE O FORMATO DA DATA RECEBIDO NOS INPUTS DO HTML PARA O FORMATO ACEITO PELA API.
*/
function parseDate(dateTime) {
    dateTime = dateTime.split(/[\s/:]+/)
    return new Date(dateTime[2], (dateTime[1] - 1), dateTime[0], dateTime[3], dateTime[4]);
}

/*
    FUNÇAO QUE CONVERTE O FORMATO DA DATA QUE A API ENVIA PARA PADRONIZAR COM O INPUT DO HTML.
*/
function returnDateFormat(dateFormat) {
    const date = new Date(dateFormat)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/*
    FUNÇAO QUE CONVERTE O FORMATO DA DATA QUE A API ENVIA PARA PADRONIZAR COM O HTML DA EVENTOS.HTML.
*/
function returnDate(dateFormat) {
    const date = new Date(dateFormat)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

/*
    FUNÇAO QUE PEGA O PARAMETRO ID DA URL.
*/
function getUrlId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id')
}

/*
    FUNCAO QUE FAZ UMA REQUEST NO SERVIDOR NODEJS COM ALGUM PARAMETRO E VALOR ESPECIFICADO.
*/

async function makeRequest(parameter, content) {
    const fetchResult = await fetch(`http://localhost:8443/?${parameter}=${content}`, {
            method: 'GET',
    })
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.log(error.message)
    })
}

/*
    FUNÇAO QUE PREENCHE OS DADOS DOS INPUTS DO HTML COM OS DADOS RECEBIDOS DA API NO FORMATO JSON. RECEBE
    UM OBJETO JSON COMO PARAMETRO.
*/
function setEventData(receivedJSON) {
    document.getElementById('nome').value = receivedJSON.name
    document.getElementById('banner').value = receivedJSON.poster
    document.getElementById('atracoes').value = receivedJSON.attractions.join(', ')
    document.getElementById('data').value = returnDateFormat(receivedJSON.scheduled)
    document.getElementById('descricao').value = receivedJSON.description
    document.getElementById('lotacao').value = receivedJSON.number_tickets
}

/*
    FUNCAO QUE FAZ UMA REQUISICAO PUT PARA ATUALIZAR UM EVENTO PELA ID NA API. UTILIZA-SE NA PAGINA EDITAR-EVENTO.HTML.
*/
async function atualizarEvento() {
    const idURL = getUrlId()
    let campoNome = document.getElementById('nome').value
    let campoAtracoes = document.getElementById('atracoes').value
    .split(',')
    .map(element => element.trim())
    let campoBanner = document.getElementById('banner').value
    let campoDescricao = document.getElementById('descricao').value
    let campoData = document.getElementById('data').value
    let campoLotacao = document.getElementById('lotacao').value

    const postContent = {
        "name": `${campoNome}`,
        "poster": `${campoBanner}`,
        "attractions": campoAtracoes,
        "description": `${campoDescricao}`,
        "scheduled": parseDate(campoData),
        "number_tickets": `${campoLotacao}`
    }

    const fetchResult = await fetch(`https://xp41-soundgarden-api.herokuapp.com/events/${idURL}`, {
        method: 'PUT',
        body: JSON.stringify(postContent),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function (response) {
        if (response.status == 200) {
            window.alert("Evento atualizado com sucesso!")
            window.location.href = './admin.html'
            return console.log(response.json())
        }
        else
            window.alert("Erro na atualização do evento!")
    })
    .catch(function (error) {
        return console.log(error.message)
    })
}

function callbackEventoAleatorio() {
    var quantidade = window.prompt('Quantidade de eventos a serem criados: ')
    cadastroEventoAleatorio(quantidade)
}

/*
    FUNCAO QUE FAZ UMA REQUISICAO POST PARA CRIAR EVENTOS ALEATÓRIOS PELA NA API. UTILIZA-SE NA PAGINA CADASTRAR-EVENTO.HTML.
*/
async function cadastroEventoAleatorio(quantidade) {

    var counter = 1

    for(var i = 0; i < quantidade; i++) {
        const postContent = {
            "name": `Festival de Música ${counter++}`,
            "poster": "link da imagem",

            "attractions": "Capital Inicial, O Rappa, Ben Harper"
            .split(',')
            .map(element => element.trim()),

            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro aperiam sunt quo similique, dolorum consectetur inventore ipsam, officiis neque natus eius harum alias quidem. Possimus nobis in inventore tenetur",
            "scheduled": parseDate('12/12/2022 20:00'),
            "number_tickets": "10000"
        }

        const fetchResult = await fetch("https://xp41-soundgarden-api.herokuapp.com/events", {
            method: 'POST',
            body: JSON.stringify(postContent),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(function (response) {
            if (response.status == 201) {
                return response.json()
            }
        })
        .then(function (json) {
            console.log(json._id)
            makeRequest('addEvent', `${json._id}`) // SALVA O EVENTO NA FAKEDB
        })
        .catch(function (error) {
            return console.log(error.message)
        })
    }
}

/*
    FUNCAO QUE FAZ UMA REQUISICAO POST PARA CRIAR UM EVENTO PELA NA API. UTILIZA-SE NA PAGINA CADASTRAR-EVENTO.HTML.
*/
async function cadastroEvento() {
    let campoNome = document.getElementById('nome').value

    let campoAtracoes = document.getElementById('atracoes').value
    .split(',')
    .map(element => element.trim())

    let campoDescricao = document.getElementById('descricao').value
    let campoData = document.getElementById('data').value
    let campoLotacao = document.getElementById('lotacao').value

    const postContent = {
        "name": `${campoNome}`,
        "poster": "link da imagem",
        "attractions": campoAtracoes,
        "description": `${campoDescricao}`,
        "scheduled": parseDate(campoData),
        "number_tickets": `${campoLotacao}`
    }

    const fetchResult = await fetch("https://xp41-soundgarden-api.herokuapp.com/events", {
        method: 'POST',
        body: JSON.stringify(postContent),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function (response) {
        if (response.status == 201) {
            window.alert("Evento cadastrado com sucesso!")
            window.location.href = './admin.html'
            return response.json()
        }
        else
            window.alert("Erro na criação do evento!")
    })
    .then(function (json) {
        makeRequest('addEvent', `${json._id}`) // SALVA O EVENTO NA FAKEDB
    })
    .catch(function (error) {
        return console.log(error.message)
    })
}

/*
    FUNCAO QUE PEGA UM ID DE UM EVENTO E FAZ UMA REQUISICAO GET NA API PARA PEGAR OS DADOS DO EVENTO. RETORNA UM JSON.
    
    OPTION:
        1 = PREENCHE OS INPUTS HTML CHAMANDO A FUNCAO setEventData
        2 = APENAS RETORNA O JSON PARA UTILIZACAO FUTURA
    */
async function fetchAPIEvent(option, id) {
    let idURL
    (getUrlId() != '') ? idURL = getUrlId() : idURL = id
    
    if (idURL) {
        const fetchResult = await fetch(`https://xp41-soundgarden-api.herokuapp.com/events/${idURL}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            switch(option) {
                case 1:
                    setEventData(json)
                    break
            }
        })
        .catch(function (error) {
            return console.log(error.message)
        })

    }
}

/*
    FUNCAO QUE FAZ UMA REQUISICAO DEL PARA REMOVER UM EVENTO PELA ID DA API. UTILIZA-SE NA PAGINA EXCLUIR-EVENTO.HTML.
    OBS: COMO ESTÁ DESABILITADO NA API A REQUISIÇAO DEL NAO CONSEGUI VERIFICAR 100% A FUNCIONALIDADE DA FUNCAO.
*/

async function excluirEvento() {
    const idURL = getUrlId()

    if (confirm('Tem certeza que deseja remover o evento? Este ato não poderá ser desfeito.') == true) {
        if (idURL) {
            const fetchResult = await fetch(`https://xp41-soundgarden-api.herokuapp.com/events/${idURL}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(function (response) {
                if (response.status == 204) {
                    window.alert("Evento deletado com sucesso!")
                    makeRequest('delEvent', `${idURL}`) // DELETA O EVENTO DA FAKEDB
                    window.location.href = './admin.html'
                }
                else
                    window.alert("Erro na remoção do evento!")
            })
            .catch(function (error) {
                return console.log(error.message)
            })
        }
    }
}
/*
    FAZ UMA REQUISICAO GET NO FAKEDB PARA LEITURA DO CONTEUDO CLIENT-SIDE. RETORNA O JSON VIA CALLBACK.
*/
function readTextFile(callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", '../assets/fakeDB.txt', false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText)
            }
        }
    }
    rawFile.send(null);
}

/* 
    FAZ UMA REQUISICAO NA API E RETORNA UM JSON COM OS DADOS DO EVENTO. 
*/
async function fetchAPI(id) {
    var jsonReturn
    const fetchResult = await fetch(`https://xp41-soundgarden-api.herokuapp.com/events/${id}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (json) {
        jsonReturn = json
    })

    return jsonReturn
}


/*
    FUNCAO QUE FAZ A LEITURA DA FAKEDB E ADICIONA O CODIGO HTML PARA ADICIONAR AS TABELAS NA PAGINA ADMIN.HTML
    PUXANDO PELOS IDS ADICIONADOS NA FAKEDB.
*/
async function addEventsAdminPage() {
    var eventsLog
    var counterRow = 1
    var tableIdentifier = document.getElementsByTagName('tbody')[0]

    readTextFile(result => {
        eventsLog = result.split('\n')
    })

    var eventsQnt = eventsLog.length

    if(eventsLog[0] != "") {
        for (var index = 0; index < eventsQnt; index++) {
            var requestResult = fetchAPI(eventsLog[index])

            requestResult.then(function(value) {
                    tableIdentifier.innerHTML += `<tr>
                    <th scope="row">${counterRow++}</th>
                    <td>${returnDateFormat(value.scheduled)}</td>
                    <td>${value.name}</td>
                    <td>${value.attractions.join(', ')}</td>
                    <td>
                        <button data-reservastotais="${value.number_tickets}" data-eventid="${value._id}" onclick="verReservas(this)" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Ver reservas</button>
                        <a href="editar-evento.html?id=${value._id}" class="btn btn-secondary">editar</a>
                        <a href="excluir-evento.html?id=${value._id}" class="btn btn-danger">excluir</a>
                    </td>
                </tr>`
            })
        }
    }
}

/*
    FUNCAO QUE FAZ A LEITURA DA FAKEDB E ADICIONA O CODIGO HTML PARA ADICIONAR AS TABELAS NA PAGINA EVENTOS.HTML
    PUXANDO PELOS IDS ADICIONADOS NA FAKEDB.
*/
async function addEventsAllEventsPage() {
    var eventsLog
    var tableIdentifier = document.getElementsByClassName('container d-flex justify-content-center align-items-center flex-wrap')[0]

    readTextFile(result => {
        eventsLog = result.split('\n')
    })

    var eventsQnt = eventsLog.length

    if(eventsLog[0] != "") {
        for (var index = 0; index < eventsQnt; index++) {
            var requestResult = fetchAPI(eventsLog[index])

            requestResult.then(function(value) {
                    tableIdentifier.innerHTML += `<article class="evento card p-5 m-3 data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo"">
                    <h2>${value.name} - ${returnDate(value.scheduled)}</h2>
                    <h4>${value.attractions.join(', ')}</h4>
                    <p>${value.description}</p>
                    <button type="button" data-evento="${value._id}" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">reservar ingresso</button>
                </article>`
            })
        }
    }
}

/*
    FUNCAO QUE FAZ A LEITURA DA FAKEDB E ADICIONA O CODIGO HTML PARA ADICIONAR AS TABELAS NA PAGINA INDEX.HTML
    PUXANDO PELOS IDS ADICIONADOS NA FAKEDB.
*/
async function addEventsIndex() {
    var eventsLog
    var tableIdentifier = document.getElementById("container-eventos")

    readTextFile(result => {
        eventsLog = result.split('\n')
    })

    if(eventsLog[0] != "") {
        for (var index = 0; index < 3; index++) {
            var requestResult = fetchAPI(eventsLog[index])

            requestResult.then(function(value) {
                    tableIdentifier.innerHTML += `<article class="evento card p-5 m-3 data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo"">
                    <h2>${value.name} - ${returnDate(value.scheduled)}</h2>
                    <h4>${value.attractions.join(', ')}</h4>
                    <p>${value.description}</p>
                    <button type="button" data-evento="${value._id}" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">reservar ingresso</button>
                </article>`
            })
        }
    }
}

/*
    FUNCAO QUE SE COMUNICA COM A API ENVIANDO OS DADOS NECESSARIOS PARA REALIZAR A RESERVA NO EVENTO. PEGA OS
    DADOS DO MODAL EXIBIDO NA INDEX OU NA EVENTOS.HTML QUANDO CLICA EM RESERVAR INGRESSO
*/
async function reservarIngresso() {
    let campoNome = document.getElementById('nome').value
    let campoEmail = document.getElementById('email').value
    let campoQuantidade = document.getElementById('quantidade').value
    let campoEventId = document.getElementById('event-id').value

    const postContent = {
        "owner_name": campoNome,
        "owner_email": campoEmail,
        "number_tickets": campoQuantidade,
        "event_id": campoEventId
    }

    const fetchResult = await fetch("https://xp41-soundgarden-api.herokuapp.com/bookings", {
        method: 'POST',
        body: JSON.stringify(postContent),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function (response) {
        if (response.status == 201) {
            window.alert("Reserva realizada com sucesso!")
            return console.log(response.json())
        }
        else
            window.alert("Erro na reserva do evento!")
    })
    .catch(function (error) {
        return console.log(error.message)
    })
}

/*
    FUNCAO QUE ENVIA DADOS PARA A API VIA GET E RETORNA COM ALGUNS DADOS DO BOOKING DO EVENTO PARA SEREM EXIBIDOS
    NO PAINEL DE ADMIN DEPOIS DE CLICAR EM "VER RESERVA".
*/
async function verReservas(self) {
    var id = self.dataset.eventid
    var reservasTotais = self.dataset.reservastotais
    const fetchResult = await fetch(`https://xp41-soundgarden-api.herokuapp.com/bookings/event/${id}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (json) {
        var reservasEfetuadas = 0

        for (var i = 0; i < json.length; i++) {
            reservasEfetuadas += Number(json[i].number_tickets)
        }

        var reservasRestantes = (Number(reservasTotais) - Number(reservasEfetuadas))

        document.getElementById('reservasTotaisModal').value = reservasTotais
        document.getElementById('reservasEfetuadas').value = reservasEfetuadas
        document.getElementById('reservasRestantes').value = reservasRestantes
        document.getElementById('event-id').value = id
    })
}

function divIndexOculta(e) { 
    if (e.matches)
        document.getElementsByClassName('col')[1].style.display = "none"
    else 
        document.getElementsByClassName('col')[1].style.display = "block"
}

// ----------------- FIM DAS FUNCOES  -------------------- //

    /*
        OCULTA A DIV COL QUE TEM O IMG-BANNER DA HOME PARA RESPONSIVIDADE
    */

if(window.location.pathname == '/index.html' || window.location.pathname == '/' || window.location.pathname == '/eventos.html') {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    mediaQuery.addListener(divIndexOculta)
    divIndexOculta(mediaQuery)
}


/*
    PEGA OS DADOS DO PARAGRAFO HTML "IDEVENTO" E INSERE NO INPUT EVENT-ID DO MODAL PARA RESERVA DE INGRESSO.
*/
if(window.location.pathname == '/' || window.location.pathname == '/eventos.html' || window.location.pathname == '/index.html') {
    $(window).on('shown.bs.modal', function(event) { 
        $('#exampleModal').modal('show');
            var idDoEvento = $(event.relatedTarget).data('evento')
            document.getElementById("event-id").value = idDoEvento
    })
}
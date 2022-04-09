let chamber = document.querySelector("#senators") ? "senate" : "house"
let html = document.querySelector('html')
let urlApi = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "X58yLx5zVyoPecCSYOtUXieXlrLJostpi37u9lMd"
    }
}
// let loading = document.querySelector("#loader-container")

        // html.style.overflowY = 'hidden'
        // html.style.overflowX = 'hidden'

fetch(urlApi, init)
    .then(response => response.json())
    .then(datos => {
        const data = datos.results[0].members  
        // loading.classList.add("loader-desactive")
        // html.style.overflowY = "auto" 
        
        // renderOptions(showState(data));
        // renderMember(data)


// A- POR CONSOLA: MOSTRAR UN LISTADO (O TABLA) DE TODOS LOS MIEMBROS DE LA CÁMARA CORRESPONDIENTE (house, o senate)

// const showMembers = arrayMembers => arrayMembers.results[0].members.forEach(resultado => console.log(resultado.first_name))
// showMembers(data)

// B- POR CONSOLA: MOSTRAR UN LISTADO (O TABLA) DE TODOS LOS ESTADOS, ORDENADOS ALFABETICAMENTE Y SIN REPETIR

const showState = (arrayState) => {
    let listState = [];
    arrayState.results[0].members.forEach(element => {
        if (!listState.includes(element.state)) {
            listState.push(element.state)
        }
    })
    return listState.sort();
}
// console.table(showState(data))


// C- GENERAR UNA FUNCION QUE ME PERMITA MOSTRAR SÓLO LOS MIEMBROS DE UN DETERMINADO PARTIDO 

const showParty = (arrayParty, party) => {
    let filterByParty = arrayParty.filter(element => element.party === party)
    filterByParty.forEach(element2 => {
        console.log((element2.last_name + " " + element2.first_name));
    })

}
// showParty(data, "R")


// const showParty2 = (arrayParty, party) => { arrayParty.results[0].members.filter(element => element.party === party).forEach(element2 => {
//         console.log(element2.last_name + " " + element2.first_name);
//     })
// }
// showParty2(data,"R")


// D- GENERAR UNA FUNCION QUE ME PERMITA MOSTRAR SÓLO LOS MIEMBROS DE UN DETERMINADO ESTADO 


const stateMember = (arrayMembers, state) => {
    let filterByState = arrayMembers.filter(element => element.state === state)
    filterByState.forEach(elementState => {
        console.log(elementState.last_name + " " + elementState.first_name);
    })
}
// stateMember(data,"LA")

//////////////////-------------/////////////////////////////////////


// document.getElementById("senate_data").innerHTML = JSON.stringify(dataSenate);

if (document.querySelector("#senators_table")) {
    const tableSenators = document.querySelector("#senators_table")

    const renderMember = (arraySenators) => {
        tableSenators.innerHTML = ""
        arraySenators.forEach((senator) => {
            let listSenators = document.createElement("tr")
            listSenators.innerHTML = `
        <td>
            <a href="${senator.url}" target="_blank">${senator.last_name} 
            ${senator.first_name}
            ${senator.middle_name ? senator.middle_name : ""}
            </a>           
        </td>
        <td>${senator.party}</td>
        <td>${senator.state}</td>
        <td>${senator.seniority}</td>
        <td>${senator.votes_with_party_pct} &percnt;</td>
        `
            tableSenators.appendChild(listSenators)
        })
    } 

    // TAREA DOM

    // Crear e instertar options //

    const stateInSelect = document.querySelector("#select-id")

    function renderOptions(arrayMembers) {
        arrayMembers.forEach(data => {
            let stateOption = document.createElement("option")
            stateOption.innerHTML = `${data.state}`
            stateOption.value = `${data.state}`
            stateInSelect.appendChild(stateOption)
        })
    }
    
    renderOptions(data)
    //Filtrado en los imputs//

    let form = document.querySelector("form")

    let selectForm = document.querySelector("#select-id")

    form.addEventListener("change", () => {
        const checkForms = document.querySelectorAll("input[type='checkbox']")
        let arrayCheckbox = Array.from(checkForms)  // El Array.from con la A mayuscula crea una nueva instancia de Array a partir de un objeto iterable. permite crear Arrays de: Objetos array-like (objetos con propiedad length o elementos indexados).
        let checkboxSeleccionado = arrayCheckbox.filter(checkbox => checkbox.checked === true)
        let allChecks = checkboxSeleccionado.map(element => element.value)
        let selectOption = selectForm.value
        
        let auxiliarParty = []
        const filterParty = () => {
            if (allChecks.length == 0) {
                auxiliarParty = data
            } else {
                data.forEach(miembro =>
                    allChecks.forEach(check => {
                        if (check == miembro.party) {
                            auxiliarParty.push(miembro)
                        }
                    }))
            }
        }

        filterParty();

        console.log(allChecks, selectOption)

        const filterState = () => {
            let auxiliarState = []
            auxiliarParty.forEach(miembro => {
                if (selectOption == "all") {
                    auxiliarState.push(miembro)
                } else if (selectOption == miembro.state) {
                    auxiliarState.push(miembro)
                }

            })
            renderMember(auxiliarState)
        }
        filterState()
    })
    renderMember(data)
}

// TASK 3 //

// Representantes por partido //Nos sirve para tener el largo del array por partido //
const repByParty = (arrayParty, party) => {
    let filterByParty = arrayParty.filter(element => element.party === party)
    return filterByParty;
}

let totalRepublicans = repByParty(data, "R")
let totalDemocratics = repByParty(data, "D")
let totalIndependents = repByParty(data, "ID")
let totalMembers = totalDemocratics.concat(totalIndependents, totalRepublicans)

if (document.querySelector("#leastEngaged")){

///////////////////////////////////////////////////////////////

// Porcentajes //
function sumPctParty(party) {

    let sumaPctParty = 0
    data.forEach(senator => { senator.party == party ? sumaPctParty += senator.votes_with_party_pct : "" })
    return sumaPctParty;
}
sumPctParty()
sumPctParty("R")
sumPctParty("D")
sumPctParty("ID")

console.log(sumPctParty("R"))
console.log(sumPctParty("D"))
console.log(sumPctParty("ID"))

function porcentajeTotal(sumaPctParty, miembrosParty) {
    if (sumaPctParty == 0) {
        return 0
    } else {
        let resultado = sumaPctParty / miembrosParty.length
        return resultado
    }
}

// Porcentajes //
let percntR = porcentajeTotal(sumPctParty("R"), totalRepublicans)
let percntD = porcentajeTotal(sumPctParty("D"), totalDemocratics)
let percntID = porcentajeTotal(sumPctParty("ID"), totalIndependents)
let sumpercnt = (sumPctParty("R") + sumPctParty("D") + sumPctParty("ID")) / totalMembers.length

// function renderGlance

function renderGlance(arrayParty, party, percent) {
    let table = document.querySelector(`#partyId`)
    let createRows = document.createElement("tr")
    createRows.innerHTML = `
    <td>${party}</td>
    <td>${arrayParty.length}</td>
    <td>${percent.toFixed(2)}&#37;</td>
    `
    table.appendChild(createRows)
}

let tableFoot = document.querySelector(`#footParty`)
tableFoot.innerHTML = `
    <tr>
    <td>Total</td>
    <td>${totalMembers.length}</td>
    <td>${sumpercnt.toFixed(2)} &#37</td>
    </tr>
    `
// &#37 es el porcentaje %

renderGlance(totalDemocratics, "Democraticans", percntD)
renderGlance(totalRepublicans, "Republicans", percntR)
renderGlance(totalIndependents, "Independents", percntID)

/// Engaged (10% Attendance) ///

let auxPorcentaje = []
/// Por si se agrega un nuevo miembro automaticamente. ///
totalMembers.forEach(member => {
    if (!auxPorcentaje.includes(member.votes_with_party_pct)) {
        auxPorcentaje.push(member)
    }
})
auxPorcentaje.sort(function (a, b) { return a.missed_votes_pct - b.missed_votes_pct})

let membersTenPercent = Math.floor((totalMembers.length * 0.1)) // la regla de 3

let ordenadoFinalMost = auxPorcentaje.slice(0, membersTenPercent)

let ordenadoFinalLeast = auxPorcentaje.reverse().slice(0, membersTenPercent)
// console.log(auxPorcentaje)
console.log(membersTenPercent)
// console.log(ordenadoFinalLeast)
// console.log(ordenadoFinalMost)

/// Tablas de abajo ///

const renderEngagedTable = (array, id) => {
    let tableEngaged = document.querySelector(`#${id}`)

    array.forEach(senator => {
        let crearMiembro = document.createElement("tr")
        crearMiembro.innerHTML = `
            <td>
            <a href="${senator.url}" target="_blank">${senator.last_name} 
            ${senator.first_name}
            ${senator.middle_name ? senator.middle_name : ""}
            </a>           
            </td>
            <td>${senator.missed_votes}</td>
            <td>${senator.missed_votes_pct.toFixed(2)}&#37</td>
            `
        tableEngaged.appendChild(crearMiembro)
    })
}



renderEngagedTable(ordenadoFinalMost, "mostEngaged")
renderEngagedTable(ordenadoFinalLeast, "leastEngaged")

}

if(document.querySelector("#mainPrueba")){
    function sumPctParty(party) {

        let sumaPctParty = 0
        data.forEach(senator => {senator.party == party ? sumaPctParty += senator.votes_with_party_pct : "" })
        return sumaPctParty;
    }
    
    // console.log(sumPctParty("R"))
    // console.log(sumPctParty("D"))
    // console.log(sumPctParty("ID"))
    
    function porcentajeTotal(sumaPctParty, repByParty) {
        if (sumaPctParty == 0) {
            return 0
        } else {
            let resultado = sumaPctParty / repByParty.length
            return resultado
        }
    }
    
    let percntR = porcentajeTotal(sumPctParty("R"), totalRepublicans) //totalRepublicans//
    let percntD = porcentajeTotal(sumPctParty("D"), totalDemocratics)
    let percntID = porcentajeTotal(sumPctParty("ID"), totalIndependents)
    let sumpercnt = (sumPctParty("R") + sumPctParty("D") + sumPctParty("ID")) / totalMembers.length
    
    // console.log(porcentajeTotal(sumPctParty("R"),totalRepublicans.length))
    // console.log(porcentajeTotal(sumPctParty("D"),repByParty(data,"D").length))
    // console.log(porcentajeTotal(sumPctParty("ID"),repByParty(data,"ID").length))
    // Porcentajes //
    // let percntR = porcentajeTotal(sumPctParty("R"), repByParty(data, "R")) //totalRepublicans ↑ lo mismo que arriba pero despues lo acorte//
    // let percntD = porcentajeTotal(sumPctParty("D"), repByParty(data, "D"))
    // let percntID = porcentajeTotal(sumPctParty("ID"), repByParty(data, "ID"))
    
    ///////////////////////////////////////////////////////////////
    
    // function renderGlance
    
    function renderGlance(arrayParty, party, percent) {
        let table = document.querySelector(`#partyId2`)
        let createRows = document.createElement("tr")
        createRows.innerHTML = `
        <td>${party}</td>
        <td>${arrayParty.length}</td>
        <td>${percent.toFixed(2)}&#37;</td>
        `
        table.appendChild(createRows)
    }
    // &#37 es el porcentaje %
    
    let tableFoot = document.querySelector(`#footParty2`)
    
    tableFoot.innerHTML = `
        <tr>
        <td>Total</td>
        <td>${totalMembers.length}</td>
        <td>${sumpercnt.toFixed(2)} &#37</td>
        <tr>
        `
    
    renderGlance(totalDemocratics, "Democraticans", percntD)
    renderGlance(totalRepublicans, "Republicans", percntR)
    renderGlance(totalIndependents, "Independents", percntID)
    
    
    /// Engaged (10% Attendance) ///
    
    let auxPorcentaje = []
    
    totalMembers.forEach(member => {
        if (!auxPorcentaje.includes(member.votes_with_party_pct)) {
            auxPorcentaje.push(member)
        }
    })
    auxPorcentaje.sort(function (a, b) { return a.votes_with_party_pct - b.votes_with_party_pct })
    
    // console.log(auxPorcentaje)
    
    let membersTenPercent = Math.floor((totalMembers.length * 0.1)) // la regla de 3
    
    // console.log(membersTenPercent)
    
    let ordenadoFinalLeast = auxPorcentaje.slice(0, membersTenPercent)
    let ordenadoFinalMost = auxPorcentaje.reverse().slice(0, membersTenPercent)
    
    // console.log(ordenadoFinalLeast)
    // console.log(ordenadoFinalMost)
    
    /// Tablas de abajo ///
    
    const renderLoyaltyTable = (array, id) => {
        let tableEngaged = document.querySelector(`#${id}`)
    
        array.forEach(senator => {
            let crearMiembro = document.createElement("tr")
            crearMiembro.innerHTML = `
                <td>
                <a href="${senator.url}" target="_blank">${senator.last_name} 
                ${senator.first_name}
                ${senator.middle_name ? senator.middle_name : ""}
                </a>           
                </td>
                <td>${Math.round((totalMembers.length / 100) * senator.votes_with_party_pct)}</td>
                <td>${senator.votes_with_party_pct.toFixed(2)}&#37</td>
                `
            tableEngaged.appendChild(crearMiembro)
        })
    }
    renderLoyaltyTable(ordenadoFinalLeast, "leastLoyalty")
    renderLoyaltyTable(ordenadoFinalMost, "mostLoyalty")
}


})
.catch(error=> console.warn(error.message))


window.addEventListener('load', () => {
    const contenedor_loader = document.querySelector('.contenedor_loader')
    contenedor_loader.style.opacity = 0
    contenedor_loader.style.visibility = 'hidden'
  })
  

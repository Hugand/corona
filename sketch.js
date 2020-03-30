const s = 4
const nSquares = 500
const w = s*nSquares
let a

let people = []
const nPeople = 20000

let timePassed = 0
let timeToDevInfection = 10

let deadRegister = []
let infectedRegister = []
let biggestInfectionDay = 1

function setup() {
    createCanvas(w*3+s , w+s)
    frameRate(30)
    a = new Agent(s, nSquares)
    console.log(a)
    const indexToBeInfected = Math.round(Math.random() * nPeople)

    for(let i = 0; i < nPeople; i++){
        people.push(new Agent(s, nSquares-2))
        if(indexToBeInfected === i)
            people[i].infect()
    }
    console.log(people.length)
    console.log(people.filter(p => p.isInfected === true))
}

function draw() {
    background(230)
    // gridDisplay()
    
    let posRegistration = {}
    let deathPeopleIndexes = []
    let nInfectedPeople = 0
    for(let i = 0; i < people.length; i++){
        if(people[i].status === "dead"){
            // console.log("DEATH", people[i].infectionLevel)
            if(people[i].isInfected === false)
                console.log("NOT INFECTED!")
            deathPeopleIndexes.push(i)
            continue
        }
        people[i].move()
        let personPos = people[i].pos
        if(posRegistration[personPos.x+""] === undefined){
            posRegistration[personPos.x+""] = {}
            posRegistration[personPos.x+""][personPos.y+""] = ""
        }else if((posRegistration[personPos.x+""] && posRegistration[personPos.x+""][personPos.y+""]) === undefined){
            posRegistration[personPos.x+""][personPos.y+""] = ""
        }else{
            if(people[i].isInfected === true)
                people.forEach(p => (p.pos.x === personPos.x && p.pos.y === personPos.y) ? p.infect() : p)
            else{
                const isAnyoneInfected = people.filter(p => 
                    p.pos.x === personPos.x && p.pos.y === personPos.y && p.isInfected === true).length > 0
                if(isAnyoneInfected === true){
                    people.forEach(p => (p.pos.x === personPos.x && p.pos.y === personPos.y) ? p.infect() : p)
                }
            }
        }

        if(people[i].isInfected === true){
            nInfectedPeople++
            people[i].increaseInfection()
        }
        people[i].draw()
    }

    deathPeopleIndexes.forEach(i => people.splice(i, 1))
    // if(deadRegister.length === 0)
    deadRegister.push(nPeople-people.length)
    infectedRegister.push(nInfectedPeople)
    let sortedInfectedRegister = [...infectedRegister].sort()
    biggestInfectionDay = sortedInfectedRegister[sortedInfectedRegister.length-1]
    // deadRegister.push(deadRegister[deadRegister.length-1]+deathPeopleIndexes.length)

    // if(timePassed === timeToDevInfection)
    //     timePassed = 0
    // else
    timePassed++
    // // if(timePassed === 1)
    //     // console.log(people.filter(p => p.isInfected === true))
    deathChart()
    infectionChart()
}


function deathChart(){
    let YX1 = w+100, YY1 = w/2, YX2 = YX1, YY2 = w-30
    let XX1 = w+100, XY1 = w-30, XX2 = w+100+w-30, XY2 = XY1

    let width = XX2-XX1
    let height = YY2-YY1

    fill(200)
    stroke(1)
    line(YX1, YY1, YX2, YY2)
    line(XX1, XY1, XX2, XY2)

    drawDeathChartPoints(width, height, XX1, YY2)
}


function drawDeathChartPoints(width, height, x, y){
    const stepX = width/timePassed
    const nDead = nPeople-people.length

    const stepY= height/nDead
    
    for(let i = 0; i < timePassed; i++){
        fill(10, 10, 200)
        noStroke()
        ellipse(x+(stepX*i), y-(stepY*deadRegister[i]), 3, 3)
    }
}

function drawInfectionChartPoints(width, height, x, y){
    const stepX = width/timePassed
    // const nDead = nPeople-people.length

    const stepY= height/biggestInfectionDay
    
    for(let i = 0; i < timePassed; i++){
        fill(200, 10, 10)
        noStroke()
        ellipse(x+(stepX*i), y-(stepY*infectedRegister[i]), 3, 3)
    }
}

function infectionChart(){
    let YX1 = w+100, YY1 = 30, YX2 = YX1, YY2 = w/2-30
    let XX1 = w+100, XY1 = w/2-30, XX2 = w+100+w-30, XY2 = XY1

    let width = XX2-XX1
    let height = YY2-YY1

    fill(200)
    stroke(1)
    line(YX1, YY1, YX2, YY2)
    line(XX1, XY1, XX2, XY2)

    drawInfectionChartPoints(width, height, XX1, YY2)
}

function gridDisplay(){
    for(let i = 0; i <= nSquares; i++){
        fill(200)
        line(s, i*s, w, i*s)
        line(i*s, s, i*s, w)
    }

    // for(let i = 0; i< nSquares; i++){
    //     fill(10, 200, 23)
    //     rect(i*s, s, i*s, w)
    // }
}
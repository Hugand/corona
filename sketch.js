const s = 4
const nSquares = 300
const w = s*nSquares
let a

let people = []
const nPeople = 8000

let timePassed = 0
let timeToDevInfection = 48
let nDays = 0;

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

    deathChart()
    infectionChart()
    noStroke()
    
    let posRegistration = {}
    let deathPeopleIndexes = []
    let nInfectedPeople = 0
    let nHealthy = 0
    let nImune = 0
    let nDead = 0
    
    for(let i = 0; i < people.length; i++){
        if(people[i].status === "dead"){
            nDead++
            // console.log("DEATH", people[i].infectionLevel)
            if(people[i].isInfected === false)
                console.log("NOT INFECTED!")
            // deathPeopleIndexes.push(i)
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
            if(people[i].status === "infected")
                people.forEach(p => (p.pos.x === personPos.x && p.pos.y === personPos.y) ? p.infect() : p)
            else{
                const isAnyoneInfected = people.filter(p => 
                    p.pos.x === personPos.x && p.pos.y === personPos.y && p.status === "infected").length > 0
                if(isAnyoneInfected === true){
                    people.forEach(p => (p.pos.x === personPos.x && p.pos.y === personPos.y) ? p.infect() : p)
                }
            }
        }

        if(people[i].status === "infected"){
            nInfectedPeople++
            people[i].increaseInfection()

            if(timePassed === timeToDevInfection)
                people[i].n_days_infected++;
        }




        if(people[i].status == "healthy")
            nHealthy++
        else if(people[i].status == "imune")
            nImune++
        people[i].draw()
    }

    // deathPeopleIndexes.forEach(i => people.splice(i, 1))
    // if(deadRegister.length === 0)
    deadRegister.push(nDead)
    infectedRegister.push(nInfectedPeople)

    let sortedInfectedRegister = [...infectedRegister].sort()
    biggestInfectionDay = sortedInfectedRegister[sortedInfectedRegister.length-1]

    deadRegister.push(deadRegister[deadRegister.length-1]+deathPeopleIndexes.length)

    textSize(32)
    fill(0)
    text("DAYS: "+nDays, 2*w+200, 100)
    text("N infected: "+nInfectedPeople, 2*w+200, 140)
    text("N healthy: "+nHealthy, 2*w+200, 180)
    text("N imune: "+nImune, 2*w+200, 220)
    text("N dead: "+nDead, 2*w+200, 260)
    text("N total: "+people.length, 2*w+200, 300)


    if(timePassed === timeToDevInfection){
        console.log(deathPeopleIndexes)
        timePassed = 0
        nDays++
    }else
        timePassed++
    // // if(timePassed === 1)
    //     // console.log(people.filter(p => p.isInfected === true))
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
    const totalTime = (nDays*timeToDevInfection)+timePassed
    const stepX = width/totalTime
    const nDead = nPeople-people.length

    const stepY= height/nDead
    // stroke(3)
    
    for(let i = 0; i < totalTime; i++){
        fill(10, 10, 200)
        noStroke()
        // line(x+(stepX*(i-1)), y-(stepY*deadRegister[i-1]), x+(stepX*i), y-(stepY*deadRegister[i]))
        ellipse(x+(stepX*i), y-(stepY*deadRegister[i]), 3, 3)
    }
}

function drawInfectionChartPoints(width, height, x, y){
    const totalTime = (nDays*timeToDevInfection)+timePassed
    const stepX = width/totalTime
    // const nDead = nPeople-people.length

    const stepY= height/(8000)
    
    for(let i = 0; i < totalTime; i++){
        fill(200, 10, 10)
        noStroke()
        // line(x+(stepX*(i-1)), y-(stepY*infectedRegister[i-1]), x+(stepX*i), y-(stepY*infectedRegister[i]))
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
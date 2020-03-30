class Agent{
    constructor(s, l){
        this.s = s
        this.l = l

        // Properties
        this.age = Math.round(Math.random() * 100 + 1)
        this.isInfected = false
        this.infectionLevel = 0
        this.n_days_infected = 0

        this.deathRate = {
            "-20": 0.2,
            "20-39": 0.4,
            "40-59": 1.7,
            "60-79": 8,
            "80+": 14.8
        }

        // Movement
        this.status = 'outside'
        this.nSteps = 1
        this.dir = 'u'
        this.pos = {
            x: Math.round(Math.random() * l + 1),
            y: Math.round(Math.random() * l + 1)
        }
    }
    draw(){
        if(this.state !== 'dead'){
            if(this.isInfected === true)
                fill(240, 43, 43, (this.infectionLevel * 205 / 30)+50)
            else if(this.isInfected === false)
                fill(74, 184, 55)
            ellipse((this.pos.x*s)+this.s/2, (this.pos.y*s)+this.s/2, this.s, this.s)
        }
    }

    move(){
        if(this.nSteps > 0){
            switch(this.dir){
                case 'u':
                    if(this.pos.y > 1)
                        this.pos.y -= 1
                    else
                        this.resetMovement()
                    break
                case 'd':
                    if(this.pos.y <= this.l)
                        this.pos.y += 1
                    else
                        this.resetMovement()
                    break
                case 'l':
                    if(this.pos.x <= this.l)
                        this.pos.x += 1
                    else
                        this.resetMovement()
                    break
                case 'r':
                    if(this.pos.x > 1)
                        this.pos.x -= 1
                    else
                        this.resetMovement()
                    break
                
            }
    
            this.nSteps--
        }else{
            this.resetMovement()
        }
    }

    resetMovement(){
        const d = Math.ceil(Math.random() * 4)
            switch(d){
                case 1:
                    this.dir = 'r'
                    break
                    
                case 2:
                    this.dir = 'd'
                    break

                case 3:
                    this.dir = 'l'
                    break
                case 4:
                    this.dir = 'u'
                    break
    
            }

            this.nSteps = Math.round(Math.random() * 6 +1)
    }

    infect(){
        this.isInfected = true
    }

    increaseInfection(){
        if(this.isInfected){
            const toIncInfection = (Math.round(Math.random() * 100) >= 50)
            if(toIncInfection)
                this.infectionLevel++
    
            const deathRandomRate = Math.random() * 100
            const dieUnder20 = this.age < 20 && this.deathRate["-20"] > deathRandomRate
            const die20to40 = this.age >= 20 && this.age < 40 && this.deathRate["20-39"] > deathRandomRate
            const die40to60 = this.age >= 40 && this.age < 60 && this.deathRate["40-59"] > deathRandomRate
            const die60to80 = this.age >= 60 && this.age < 80 && this.deathRate["60-79"] > deathRandomRate
            const dieOver80 = this.age >= 80 && this.deathRate["80+"] > deathRandomRate
    
            if(dieUnder20 || die20to40 || die40to60 || die60to80 || dieOver80){
                this.status = "dead"
                // console.log("DEAD", this.age)
            }
        }
    }


}
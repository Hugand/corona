class Agent{
    constructor(s, l){
        this.s = s
        this.l = l
        this.possibleDeseases = ["card_vasc", "diabetes", "respiratory", "hypertension", "cancer"]

        // Properties
        this.age = Math.round(Math.random() * 100 + 1)
        this.isInfected = false
        this.infectionLevel = 0
        this.n_days_infected = 0

        let randomDeseaseIndex = Math.round(Math.random() * 10)-6
        this.desease = (randomDeseaseIndex >= 0) 
            ? this.possibleDeseases[randomDeseaseIndex]
            : "none"
        this.deseaseDeathRateList = {
            "card_vasc": 10.5,
            "diabetes": 7.3,
            "respiratory": 6.3,
            "hypertension": 6,
            "cancer": 5.6,
            "none": 0
        }

        this.deathRateList = {
            "-20": 0.2,
            "20-39": 0.4,
            "40-59": 1.7,
            "60-79": 8,
            "80+": 14.8
        }
        this.deathRate = 0
        this.baseDeathRate = 0

        this.baseRecoverRateList = {
            "-20": 10,
            "20-39": 9,
            "40-59": 7,
            "60-79": 5,
            "80+": 2
        }
        this.recoverRate = 0
        this.imuneRate = 0.025

        if(this.age > 0 && this.age < 20){
            this.baseDeathRate = this.deathRateList["-20"]
            this.recoverRate = this.baseRecoverRateList["-20"]
        }else if(this.age >= 20 && this.age < 40){
            this.baseDeathRate = this.deathRateList["20-39"]
            this.recoverRate = this.baseRecoverRateList["20-39"]
        }else if(this.age >= 40 && this.age < 60){
            this.baseDeathRate = this.deathRateList["40-59"]
            this.recoverRate = this.baseRecoverRateList["40-59"]
        }else if(this.age >= 60 && this.age < 80){
            this.baseDeathRate = this.deathRateList["60-79"]
            this.recoverRate = this.baseRecoverRateList["60-79"]
        }else if(this.age >= 80){
            this.baseDeathRate = this.deathRateList["80+"]
            this.recoverRate = this.baseRecoverRateList["80+"]
        }
        this.baseDeathRate += this.deseaseDeathRateList[this.desease]

        

        // Movement
        this.status = 'healthy'
        this.nSteps = 1
        this.dir = 'u'
        this.pos = {
            x: Math.round(Math.random() * l + 1),
            y: Math.round(Math.random() * l + 1)
        }
    }
    draw(){
        if(this.status !== 'dead'){
            if(this.status === "infected")
                // fill(240, 43, 43, (this.infectionLevel * 205 / 30)+50)
                fill(240, 43, 43)
            else if(this.status === "healthy")
                fill(74, 184, 55)
            else if(this.status === "imune")
                fill(45, 138, 224)
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
        if(this.status !== "imune" && this.status !== "dead"){
            this.isInfected = true
            this.status = 'infected'
        }
    }

    increaseInfection(){
        if(this.status == 'infected'){
            const toIncInfection = (Math.round(Math.random() * 100) >= 50)
            if(toIncInfection)
                this.infectionLevel++
    
            const deathRandomRate = Math.random() * 100

            this.deathRate = Math.pow(this.n_days_infected, 2.5) * (this.baseDeathRate/1500)
    
            if(deathRandomRate <= this.deathRate){
                this.status = "dead"
                // console.log("DEAD", this.age)
            }

            this.recoverRate = Math.pow(this.n_days_infected, 2)*8/this.age
            const recoverRate = Math.random() * 100;
            

            if(recoverRate < this.recoverRate){
                this.status = 'healthy'
                if(recoverRate < this.imuneRate)
                    this.status = 'imune'
                this.n_days_infected = 0
            }

        }
    }


}
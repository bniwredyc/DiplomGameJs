'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
    }
    plus(vector) {
      try {
        if (!(vector instanceof Vector)) {
          throw `Можно прибавлять к вектору только объект типа Vector`
        }

        let plus_x = this.x + vector.x
        let plus_y = this.y + vector.y
        return new Vector(plus_x, plus_y)

        } catch(err) {
          console.log(`Ошибка ${err}`)
        }

    }
    times(time)  {
      var new_vector = {
        'x' : this.x * time,
        'y' : this.y * time
      }
      return new Vector(new_vector.x, new_vector.y)
    }
}


class Actor {

    constructor(pos = new Vector(), size = new Vector(1 , 1), speed = new Vector()) {
      try {
        if (!((pos instanceof Vector) || (size instanceof Vector) || (speed instanceof Vector)))  {
          throw `передаваемые парметры должны быть типа Vector`
        }

        this.pos = pos
        this.size = size
        this.speed = speed

      } catch (err) {
        console.log(`Ошибка ${err}`)
      }
    }

    act()  {}

    get type()  {
      return 'actor'
    }

    get left()  {
      return this.pos.x
    }

    get right() {
      return this.pos.x + this.size.x
    }

    get bottom()  {
      return this.pos.y
    }

    get top() {
      return this.pos.y + this.size.y
    }

    isIntersect(someActor) {
      try {
        if (!(someActor instanceof Actor)) {
          throw `Можно передать только объект типа Vector`
        }
        else if(someActor === undefined) {
          throw 'Необходимо указать аргумент типа Vector'
        }
        else if(this === someActor) {
          return false
        }
        else if(this.left < someActor.right &&
           this.right > someActor.scrollLeft &&
           this.top < someActor.bottom &&
           this.bottom > someActor.top) {
          return true
        }
        return false

      } catch (err) {
        console.log(`Ошибка ${err}`)
      }
    }
}


class Level  {
  constructor (grid, actors) {
    if(Array.isArray(grid))  {
      this.grid = grid.slice()
      this.height = this.grid.length

      if (this.grid.some((element) => Array.isArray(element))) {
        this.width = is.grid.map((element, i) => i).sort((i, j) =>
        this.grid[j].length - this.grid[i].length)[0].length
      } else {
          this.width = 1
        }
      }else{
        this.height = 0
        this.width = 0
      }

    this.status = null
    this.finishDelay = 1
    this.actors = actors

    if (this.actors) {
      this.player = this.actors.find(function (actor) {
        return actor.type === 'player'
      })
    }
  }

    isFinished()  {
      ret this.status != null && finishDelay < 0
    }

    actorAt(actor)  {
      if (!(actor instanceof Actor))  {
        throw new Error('тип объекта не Actor, или объект не задан')
      }

      for (let someActor of this.actors)  {
        if (someActor.isIntersect(actor)) {
          return someActor
        }
        else{
          return undefined
        }
      }
    }

    obstacleAt(pos, size)  {
      if(!(pos instanceof Vector) || !(size instanceof Vector)) {
        throw new Error('переданные объекты не относяться к типу Vector')
      }

      const leftBorder = Math.floor(position.x)
      const rightBorder = Math.ceil(position.x + size.x)
      const topBorder = Math.floor(position.y)
      const bottomBorder = Math.ceil(position.y + size.y)

      if (leftBorder < 0 || rightBorder > this.width || topBorder < 0) {
        return 'wall'
      } else if (bottomBorder > this.height) {
        return 'lava'
        }

        for (let y = topBorder; y < bottomBorder; y++) {
          for (let x = leftBorder; x < rightBorder; x++) {
            if (this.grid[y][x]) {
              return this.grid[y][x]
            }
            else {
              return undefined
            }
          }
        }
      }

    removeActor(actor)  {
      let index = this.actors.indexOf(actor)
      this.actors.splice(index, 1)
    }

    noMoreActors(str_actor) {
      if (Array.isArray(this.actors)) {
          return (!this.actors.find(actor => actor.type === str_actor))
      }
      return true
    }

    playerTouched(touchedType, actor)  {
      if (this.atatus === null) {
        if (['lava', 'fireball'].some((el) => el === touchedType)) {
          this.status = 'lost'
        } else if (touchedType === 'coin' && actor.type === 'coin') {
          this.removeActor(actor)
        if (this.noMoreActors('coin')) {
          this.status = 'won'
        }
      }
    }
  }
}

class LevelParser {
  constructor(obj) {

  }
  actorFromSymbol(str) {

  }
  createGrid()  {

  }
  createActors()  {

  }
  parse(arr) {

  }
}


class Fireball extends Actor{
  constructor(pos, speed){
    this.type = fireball
    this.size = vector
  }

  handleObstacle()  {

  }
  act(int, lvl) {

  }
}


class HorizontalFireball  {
  constructor() {

  }
}

class FireRain  {
  constructor() {

  }
}


class Coin extends Actor {
  constructor(vector) {
    this.type = "coin"
    springSpeed = 8
    springDist = 0.07
    spring = rand0m
  }

  updateSpring(time, int = 0)  {

  }

  getSpringVector() {

  }

  getNextPosition(time, int = 1) {

  }
  act(time) {

  }
}

class Player  {
  constructor(vector) {
    this.type = "player"
  }
}

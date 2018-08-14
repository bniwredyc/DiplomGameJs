'use strict';


class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error(`Можно прибавлять к вектору только объект типа Vector`);
        }

        // если значение присваивается переменной один раз,
        // то лучше использовать const
        // в данном случе можно обойтись вообще без переменных
        let plus_x = this.x + vector.x;
        let plus_y = this.y + vector.y;

        return new Vector(plus_x, plus_y);
    }

    times(time)  {
      // var использовать вообще не нужно
      // создввать объект тут тоже не надо - лишнее усложнение
      var new_vector = {
          'x' : this.x * time,
          'y' : this.y * time
      }
      return new Vector(new_vector.x, new_vector.y);
    }
}


class Actor {
    // не опускайте параметры конструктора Vector
    // если кто-то изменит их на 1, 1 всё сломается
    constructor(pos = new Vector(), size = new Vector(1 , 1), speed = new Vector()) {
        if ((!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)))  {
            throw new Error(`Передаваемые парметры должны быть типа Vector`)
        }

        this.pos = pos;
        this.size = size;
        this.speed = speed;
    }

    act()  {}

    get type()  {
        return 'actor';
    }

    get left()  {
        return this.pos.x;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get top()  {
        return this.pos.y;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }

    isIntersect(someActor) {
        if (!someActor || !(someActor instanceof Actor)) {
            throw new Error(`Можно передать только объект типа Vector`);

          // else тут можно убрать потому что в if выбрасывается иключение
        } else if(this === someActor) {
            return false;

        // else тут не нужен, т.к. в if return
        // и if тут можно убрать и написать просто
        // return <выражение в if>
        } else if(this.left < someActor.right &&
          this.right > someActor.left &&
          this.top < someActor.bottom &&
          this.bottom > someActor.top) {
              return true;
        }
        return false;
    }
}


class Level  {
    constructor (grid, actors) {
        // лучше добавить значения по-умолчанию для аргументов
        // и убрать проверки
        if(Array.isArray(grid))  {
            this.grid = grid.slice();
            this.height = this.grid.length;

          // тут что-то не то написано, я не смог разобраться к логике :(
          // тут нужно использовать reduce или Math.max
          // почему тут другие отступы?
          if (this.grid.some((element) => Array.isArray(element))) {
              this.width = this.grid.sort(function (i, j) {
                  return j.length - i.length;
              })[0].length;
          } else {
              this.width = 1;
          }

        } else {
            this.height = 0;
            this.width = 0;
        }

      this.status = null;
      this.finishDelay = 1;
      this.actors = actors;

      // значения по-умолчанию для аргументов позволят убрать эту проверку
      if (this.actors) {
          this.player = this.actors.find(function (actor) {
              return actor.type === 'player';
          });
      }
    }

    isFinished()  {
        return this.status !== null && this.finishDelay < 0;
    }

    actorAt(actor)  {
        if (!(actor instanceof Actor))  {
            throw new Error('Тип объекта не Actor, или объект не задан');
        // else не нужен, сравнивать лучше через ===
        // целостность объекта лучше проверять в конструкторе
        }else if (this.actors == undefined)  {
            return undefined;
        }

        // тут можно написать проще, если использовать метод поиска в массиве
        for (let someActor of this.actors)  {
            if (someActor.isIntersect(actor)) {
                return someActor;
            }
        }
    }


    obstacleAt(pos, size)  {
        if(!(pos instanceof Vector) || !(size instanceof Vector)) {
            throw new Error('Переданные объекты не относяться к типу Vector');
        }


        const leftBorder = Math.floor(pos.x);
        const rightBorder = Math.ceil(pos.x + size.x);
        const topBorder = Math.floor(pos.y);
        const bottomBorder = Math.ceil(pos.y + size.y);

        if (leftBorder < 0 || rightBorder > this.width || topBorder < 0) {
            return 'wall';
        // else не нужен
        } else if (bottomBorder > this.height) {
            return 'lava';
        }

        for (let y = topBorder; y < bottomBorder; y++) {
            for (let x = leftBorder; x < rightBorder; x++) {
                // this.grid[y][x] лучше записать в переменную,
                // чтобы 2 раза не писать
                if (this.grid[y][x]) {
                    return this.grid[y][x];
                }
            }
        }
    }

    removeActor(actor)  {
        // если значение присваивается переменной 1 раз,
        // то лучше использовать const
        let index = this.actors.indexOf(actor);
        // если объект не будет найден, то метод отработает неправильно
        this.actors.splice(index, 1);
    }

    noMoreActors(str_actor) {
        // целостность объекта лучше проверять в конструкторе
        if (Array.isArray(this.actors)) {
            // здесь лучше использовать другой метод
            // который определяет есть ли в массиве элементы
            // удовлетворяющие условию
            return (!this.actors.find(actor => actor.type === str_actor));
        }
        return true;
    }

    playerTouched(touchedType, actor)  {
        // лучше обратить условие и напиать там return,
        // чтобы уменьшить вложенность
        if (this.status === null) {
            if (['lava', 'fireball'].some((el) => el === touchedType)) {
                this.status = 'lost';
            } else if (touchedType === 'coin' && actor.type === 'coin') {
                // почему разные отступы?
                  this.removeActor(actor);
                if (this.noMoreActors('coin')) {
                    this.status = 'won';
                }
            }
        }
    }
}


class LevelParser {
    // не самое удачное название переменнй - непонятно что в ней
    // лучше добавить значение по-умолчанию
    constructor(itemsField) {
        this.itemsField = itemsField;
    }

    actorFromSymbol(item) {
        // что изменится, если убрать эти проверки?
        if (typeof item !== 'string' || !this.itemsField) {
            return undefined;
        }
        return this.itemsField[item];
    }

    obstacleFromSymbol(item)  {
        // const
        // и лучше вынести этот словарь за пределы класса,
        // или сделать полем класса,
        // чтобы не создавать объект каждый раз
        let obstacles = {'x': 'wall', '!': 'lava'};
        return obstacles[item];
    }

    createGrid(field)  {
        // ?
        if (field instanceof Actor) {
            return;
        }

        // значение присваивается переменной 1 раз - const
        let grid = [];

        // код будет намного проще, если использовать map
        for (let line of field) {
            let result = [];
            // строки лучше преобразовывать к массивы с помощью метода split
            // так понятно, что работаем со строкой
            [...line].forEach((element) => result.push(this.obstacleFromSymbol(element)));
            grid.push(result);
        }
        return grid;
    }

    createActors(movieField)  {
        // проще добавить значение по-умолчанию
        if (!Array.isArray(movieField)) {
            return;
        }
        // const
        let items = [];

        movieField.forEach((itemY, y) => {
          // split
          [...itemY].forEach((itemX, x) => {
              // const
              let Constructor = this.actorFromSymbol(itemX)
              // зачем объявлять переменную здесь?
              let result;
              if (typeof Constructor === 'function')  {
                  result = new Constructor(new Vector(x, y));
              }
              if (result instanceof Actor)  {
                  items.push(result);
              }
          });
        });
        return items;
    }


    parse(field) {
        // const
        let grid = this.createGrid(field);
        let actors = this.createActors(field);
        // без этой переменной можно обойтись
        let level = new Level(grid, actors);
        return level;
    }
}


class Fireball extends Actor {
    constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)){
        // второй аргумент неправильный, мы знаем размер шара
        super(pos, undefined, speed);
    }

    get type()  {
        return 'fireball';
    }

    getNextPosition(time = 1) {
        return this.pos.plus(this.speed.times(time));
    }

    handleObstacle()  {
        this.speed = this.speed.times(-1);
    }

    act(time, lvl) {
        // const
        let nextPosition = this.getNextPosition(time);
        if (lvl.obstacleAt(nextPosition, this.size))  {
            this.handleObstacle();
        } else {
            this.pos = nextPosition;
        }
    }
}


class HorizontalFireball extends Fireball {
    constructor(pos) {
        super(pos, new Vector(2, 0));
    }
}


class VerticalFireball extends Fireball {
    constructor(pos) {
        super(pos, new Vector(0, 2));
    }
}

class FireRain extends Fireball {
    constructor(pos) {
        // ;
        super(pos, new Vector(0, 3))
        this.starPosition = pos;
    }

    handleObstacle()  {
        this.pos = this.starPosition;
    }
}


class Coin extends Actor {
    constructor(pos) {
        super(pos, new Vector(0.6, 0.6));
        this.pos = this.pos.plus(new Vector(0.2, 0.1));
        // неправильное использование Object.assign и оно тут вообще не нужно
        this.startPos = Object.assign(this.pos);
        this.spring = Math.random() * (Math.PI * 2);
        this.springDist = 0.07;
        this.springSpeed = 8;
    }

    get type()  {
        return 'coin';
    }

    updateSpring(time = 1)  {
        this.spring += this.springSpeed * time;
    }

    getSpringVector() {
        return new Vector(0, (Math.sin(this.spring) * this.springDist));
    }

    getNextPosition(time = 1) {
        this.updateSpring(time);
        return this.startPos.plus(this.getSpringVector());
    }

    act(time) {
        this.pos = this.getNextPosition(time);
    }
}

class Player extends Actor  {
    constructor(pos) {
        super(pos, new Vector(0.8, 1.5));
        this.pos = this.pos.plus(new Vector(0, -0.5));
    }

    get type()  {
        return 'player';
    }
}


const actorDict = {
    '@': Player,
    'v': FireRain,
    'o': Coin,
    '=': HorizontalFireball,
    '|': VerticalFireball
};

const parser = new LevelParser(actorDict);


loadLevels()
      .then((res) => {runGame(JSON.parse(res), parser, DOMDisplay)
      .then(() => alert('Вы выиграли!'))});

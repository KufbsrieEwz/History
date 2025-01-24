let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
c.imageSmoothingEnabled = false

class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(that) {
        return new Vector2(this.x + that.x, this.y + that.y)
    }

    multiply(that) {
        return new Vector2(this.x * that, this.y * that)
    }
}

let dice = {
    0: new Image(),
    1: new Image(),
    2: new Image(),
    3: new Image(),
    4: new Image(),
    5: new Image(),
    6: new Image()
}

let die = {
    state: 0,
    value: 0,
    rolling: false,
    canRoll: false
}

dice[0].src = `Images/0.png`
dice[1].src = `Images/1.png`
dice[2].src = `Images/2.png`
dice[3].src = `Images/3.png`
dice[4].src = `Images/4.png`
dice[5].src = `Images/5.png`
dice[6].src = `Images/6.png`

function drawRect(pos, dim, r, g, b, a) {
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillRect(pos.x, pos.y, dim.x, dim.y)
}

function drawLine(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
}

function drawPoly(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
    c.fill()
}

function drawArc(pos, rad, sa, ea, clock, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.arc(pos.x, pos.y, rad, sa, ea, !clock)
    c.stroke()
    c.fill()
}

function drawImg(img, cropPos, cropDim, pos, dim) {
    c.drawImage(img, cropPos.x, cropPos.y, cropDim.x, cropDim.y, pos.x, pos.y, dim.x, dim.y)
}

function write(text, pos, r, g, b, a) {
    c.font = '20px Arial'
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillText(text, pos.x, pos.y)
}

function clear() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
}

function chooseNumber() {
    return Math.ceil(Math.random() * 6)
}

let questions = []
let answers = [
    'C',
    'B',
    'D',
    'A',
    'C',
    'C',
    'B',
    'D',
    'B',
    'B',
    'A',
    'A',
    'D',
    'D',
    'C',
    'B',
    'C',
    'A',
    'D',
    'C',
]

for (let i = 0; i < 20; i++) {
    questions.push(new Image())
}
questions[-1] = new Image()
questions[-1].src = 'Images/Back Card.png'
for (let i = 0; i < questions.length; i++) {
    questions[i].src = `Images/Card ${i}.png`
}

let currentQuestion = Math.floor(Math.random() * questions.length)

class BoardTile {
    constructor(pre = null, next = null, type = null) {
        this.previous = pre
        this.next = next
        this.type = type
        this.pos = new Vector2(0, 0)
    }
}

class Player {
    constructor(name, pos, src) {
        this.name = name
        this.pos = pos
        this.img = new Image()
        this.img.src = src
    }
}

let tileTypes = {
    plains: 'plains',
    forest: 'forest',
    tundra: 'tundra',
    water: 'water',
}

let tileImgs = {
    plains: new Image(),
    forest: new Image(),
    tundra: new Image(),
    water: new Image(),
}

tileImgs.plains.src = 'Images/tilePlains.png'
tileImgs.forest.src = 'Images/tileForest.png'
tileImgs.tundra.src = 'Images/tileTundra.png'
tileImgs.water.src = 'Images/tileWater.png'

function drawBoard() {
    const cols = 14
    const tileSize = 100
    const rows = Math.ceil(board.length / cols)

    for (let i = 0; i < board.length; i++) {
        if (board[i].type == -1) {
            continue
        }
        const row = Math.floor(i / cols)
        const colInRow = i % cols

        const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow

        const x = col * tileSize
        const y = row * tileSize

        const tile = board[i]

        drawImg(tileImgs[tile.type], new Vector2(0, 0), new Vector2(40, 40), new Vector2(x + 10, y + 10), new Vector2(tileSize - 20, tileSize - 20))

        const tileCenter = new Vector2(x + tileSize / 2, y + tileSize / 2)

        board[i].pos = new Vector2(tileCenter.x - 24, tileCenter.y - 34)

        if (tile.next) {
            const nextIndex = i + 1
            const nextRow = Math.floor(nextIndex / cols)
            const nextColInRow = nextIndex % cols
            const nextCol = nextRow % 2 === 0 ? nextColInRow : cols - 1 - nextColInRow
            const nextX = nextCol * tileSize + tileSize / 2
            const nextY = nextRow * tileSize + tileSize / 2

            drawRect(new Vector2((tileCenter.x + nextX) / 2 - 10, (tileCenter.y + nextY) / 2 - 10), new Vector2(20, 20), 0, 0, 0, 1)
        }
    }
}

let board = []

board[-1] = null
for (let i = 0; i < 56; i++) {
    board[i] = new BoardTile()
}
let tileTypesReference = []
for (let i in tileTypes) {
    tileTypesReference.push(i)
}
for (let i = 0; i < board.length; i++) {
    board[i].previous = board[i-1]
    board[i].next = board[i+1]
    board[i].type = tileTypes[tileTypesReference[Math.floor(Math.random() * tileTypesReference.length)]]
    if (i > 4) {
        if (board[i].type == tileTypes.water && board[i-1].type == tileTypes.water && board[i-2].type == tileTypes.water && board[i-3].type == tileTypes.water) {
            board[i].type == tileTypes.tundra
        }
    }
}
board[0].type = tileTypes.plains
board[board.length] = {type: -1}

let redX = new Image()
redX.src = 'Images/redX.png'
let arrows = new Image()
arrows.src = 'Images/Arrows.png'
let instructions = new Image()
instructions.src = 'Images/instructions.png'

function run() {
    clear()
    drawRect(new Vector2(0, 0), new Vector2(canvas.width, canvas.height), 128, 128, 128, 1)
    drawBoard()
    drawImg(dice[die.state], new Vector2(0, 0), new Vector2(40, 40), new Vector2(canvas.width/2 - 50, canvas.height * 7/8 - 50), new Vector2(100, 100))
    
    for (let player of players) {
        if (player.pos >= board.length-1) {
            player.pos = board.length-1
        }
        drawImg(player.img, new Vector2(0, 0), new Vector2(12, 17), board[player.pos].pos, new Vector2(48, 68))
    }
    drawImg(questions[currentQuestion], new Vector2(0, 0), new Vector2(192, 272), new Vector2(0, canvas.height - 272*1.25), new Vector2(192, 272).multiply(1.25))
    if (!die.canRoll && (!die.rolling || !turn == 0)) {
        drawImg(redX, new Vector2(0, 0), new Vector2(100, 100), new Vector2(canvas.width/2 - 50, canvas.height * 7/8 - 50), new Vector2(100, 100))
    } else if (!die.rolling) {
        drawImg(arrows, new Vector2(0, 0), new Vector2(100, 100), new Vector2(canvas.width/2 - 100, canvas.height * 7/8 - 100), new Vector2(200, 200))
    }
    drawImg(instructions, new Vector2(0, 0), new Vector2(144, 78), new Vector2(canvas.width * 9/10, canvas.height * 9/10), new Vector2(canvas.width/10, canvas.height/10))
}

function moveForward(player, num) {
    if (num > 0){
        player.pos++
        switch (board[player.pos].type) {
            case tileTypes.plains:
                setTimeout(moveForward, 200, player, num - 1)
                break
            case tileTypes.forest:
                setTimeout(moveForward, 200, player, num - 2)
                break
            case tileTypes.tundra:
                setTimeout(moveForward, 200, player, num - 3)
                break
            case tileTypes.water:
                setTimeout(moveForward, 200, player, num - 1)
                break
        }
    } else if (board[player.pos].type == tileTypes.water) {
        setTimeout(moveBackward, 200, player, 1)
    }
}

function moveBackward(player, num) {
    if (num > 0){
        player.pos--
        setTimeout(moveBackward, 200, player, num-1)
    } else if (board[player.pos].type == tileTypes.water) {
        setTimeout(moveBackward, 200, player, 1)
    }
}

setInterval(run, 1)

function rollDice(t) {
    die.rolling = true
    die.canRoll = false
    die.value = 0
    die.state = chooseNumber()
    if (t > 0) {
        setTimeout(rollDice, 50, t-1)
    } else {
        die.value = die.state
        die.rolling = false
        switch (board[players[turn].pos].type) {
            case tileTypes.plains:
                moveForward(players[turn], die.value)
                break
            case tileTypes.forest:
                moveForward(players[turn], die.value - 1)
                break
            case tileTypes.tundra:
                moveForward(players[turn], die.value - 2)
                break
            case tileTypes.water:
                moveForward(players[turn], die.value)
                break
        }
        if (players[turn].pos >= board.length - 1) {
            players[turn].pos = board.length - 1
            alert(`${players[turn].name} won!!!`)
        }
        turn++
        while (turn > 3) {
            turn -= 4
        }
        if (turn == 0) {
            currentQuestion = Math.floor(Math.random() * questions.length)
        } else if (Math.random() < 0.8) {
            setTimeout(rollDice, 1000, 10)
        } else {
            turn++
            while (turn > 3) {
                turn -= 4
            }
            if (turn == 0) {
                currentQuestion = Math.floor(Math.random() * questions.length)
            } else {
                setTimeout(rollDice, 1000, 10)
            }
        }
    }
}

let mouse = new Vector2(0, 0)

document.addEventListener("mousemove", function(event) {
    mouse.x = event.clientX
    mouse.y = event.clientY
})
document.addEventListener("click", function(event) {
    mouse.x = event.clientX
    mouse.y = event.clientY
    if (
        (
            mouse.x < canvas.width/2 + 50
            &&
            mouse.x > canvas.width/2 - 50
        )
        &&
        (
            mouse.y < canvas.height * 7/8 + 50
            &&
            mouse.y > canvas.height * 7/8 - 50
        )
    ) {
        if (!die.rolling && die.canRoll) {
            rollDice(10)
        }
    }
    if (
            mouse.y > canvas.height - 55
            &&
            mouse.y < canvas.height - 35
            &&
            currentQuestion != -1
    ) {
        if (
                mouse.x > 40
                &&
                mouse.x < 60
                &&
                currentQuestion != -1
        ) {
            //A
            if (answers[currentQuestion] == 'A') {
                die.canRoll = true
            } else {
                turn++
                rollDice(10)
            }
            currentQuestion = -1
        }
        if (
            mouse.x > 84
            &&
            mouse.x < 104
        ) {
            //B
            if (answers[currentQuestion] == 'B') {
                die.canRoll = true
            } else {
                turn++
                rollDice(10)
            }
            currentQuestion = -1
        }
        if (
            mouse.x > 128
            &&
            mouse.x < 148
        ) {
            //C
            if (answers[currentQuestion] == 'C') {
                die.canRoll = true
            } else {
                turn++
                rollDice(10)
            }
            currentQuestion = -1
        }
        if (
            mouse.x > 172
            &&
            mouse.x < 192
        ) {
            //D
            if (answers[currentQuestion] == 'D') {
                die.canRoll = true
            } else {
                turn++
                rollDice(10)
            }
            currentQuestion = -1
        }
    }
    if (mouse.x > canvas.width * 9/10 && mouse.y > canvas.height * 9/10) {
        window.open('https://kufbsrieewz.github.io/History/instructions.txt')
    }
})

let turn = 0

let players = [
    new Player('Player', 0, 'Images/YellowPawn.png'),
    new Player('Alice', 0, 'Images/RedPawn.png'),
    new Player('Bobby', 0, 'Images/GreenPawn.png'),
    new Player('Claire', 0, 'Images/BluePawn.png')
]

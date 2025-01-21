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
    rolling: false
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

function askQuestion() {
    return questions[Math.floor(Math.random() * questions.length)]
}

let questions = [
    'When was Canada born?',
    'True or false: the underground railroad was an actual underground railroad?',
    'What was a symbolic term representing the monarch of Britain?',
    'What was the term for the highest social class?',
    'Where did people race to for the gold rush?',
    'What does Yukon mean?',
    'What was the capital of Yukon before Whitehorse?',
    'In what year did British North America end slavery?',
    'How many slaves did Harriet Tubman help escape through the underground railroad? 50-60, 60-70, 70-80, or 80+?',
    'Harriet Tubman had a $40,000 bounty on her head, how much is that worth today?',
    'What is reciprocity?',
    'What were the first 4 provinces in Canada?',
    'what network helped slaves escape to British North America?'
]

let answers = [
    // i have them on a doc
    // i just need to paste it in
]

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
    moveForward(num) {
        this.pos += num
    }
    moveBackward(num) {
        this.pos -= num
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
for (let i = 0; i < 86; i++) {
    board[i] = new BoardTile()
}
let tileTypesReference = []
for (let i in tileTypes) {
    tileTypesReference.push(i)
}
for (let i of board) {
    i.previous = board[board.indexOf(i)-1]
    i.next = board[board.indexOf(i)+1]
    i.type = tileTypes[tileTypesReference[Math.floor(Math.random() * tileTypesReference.length)]]
}
console.log(board)
drawBoard()

function run() {
    clear()
    drawRect(new Vector2(0, 0), new Vector2(canvas.width, canvas.height), 128, 128, 128, 1)
    drawBoard()
    drawImg(dice[die.state], new Vector2(0, 0), new Vector2(40, 40), new Vector2(canvas.width/2 - 50, canvas.height * 7/8 - 50), new Vector2(100, 100))
    for (let player of players) {
        drawImg(player.img, new Vector2(0, 0), new Vector2(12, 17), board[player.pos].pos, new Vector2(48, 68))
    }
    if (turn != 0) {

    } else {

    }
}

setInterval(run, 1)

function rollDice(t) {
    die.rolling = true
    die.value = 0
    die.state = chooseNumber()
    if (t > 0) {
        setTimeout(rollDice, 50, t-1)
    } else {
        die.value = die.state
        die.rolling = false
        if (true) {
            players[turn].moveForward(die.value)
        }
        if (players[turn].pos > board.length - 1) {
            players[turn].pos = board.length - 1
            alert(`${players[turn].name} won!!!`)
        }
        turn++
        while (turn > 3) {
            turn -= 4
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
        if (!die.rolling) {
            rollDice(10)
        }
    }
})

let turn = 0

let players = [
    new Player('Player', 0, 'Images/YellowPawn.png'),
    new Player('Alice', 0, 'Images/RedPawn.png'),
    new Player('Bobby', 0, 'Images/GreenPawn.png'),
    new Player('Claire', 0, 'Images/BluePawn.png')
]
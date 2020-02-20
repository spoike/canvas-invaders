const canvas = document.getElementById('canvas')
const width = canvas.width
const height = canvas.height

const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false;

let invaderWidth = 8;
let invaderHalfWidth = Math.ceil(invaderWidth / 2);
let invaderHeight = 8;

function drawInvader(imageData, fillColor) {
    const sw = invaderHalfWidth;
    const fsw = invaderWidth;
    const sh = invaderHeight;

    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const i = (x + (y * fsw)) * 4
            const ii = ((fsw - x - 1) + (y * fsw)) * 4
            if (Math.random() > 0.5) {
                imageData.data[i] = fillColor[0]
                imageData.data[i + 1] = fillColor[1]
                imageData.data[i + 2] = fillColor[2]
                imageData.data[i + 3] = 255
                imageData.data[ii] = fillColor[0]
                imageData.data[ii + 1] = fillColor[1]
                imageData.data[ii + 2] = fillColor[2]
                imageData.data[ii + 3] = 255
            } else {
                imageData.data[i] = 0
                imageData.data[i + 1] = 0
                imageData.data[i + 2] = 0
                imageData.data[i + 3] = 0
                imageData.data[ii] = 0
                imageData.data[ii + 1] = 0
                imageData.data[ii + 2] = 0
                imageData.data[ii + 3] = 0
            }
        }
    }
}

const fillColors = [
    [100, 255, 100], // green
    [255, 180, 100], // amber
    [255, 255, 255], // white
]
let currentFillColor = 0

function wrap(value, min, max) {
    if (value >= max) {
        return value % max + min
    }
    return value
}
canvas.addEventListener('pointerdown', () => {
    currentFillColor = wrap(currentFillColor + 1, 0, 4)
})

function drawInvaders() {
    const cx = Math.floor(width / invaderWidth)
    const cy = Math.floor(height / invaderHeight)
    const y = 0
    let imageData = ctx.getImageData(0, 0, invaderWidth, invaderHeight)
    for (let x = 0; x < cx; x++) {
        let fillColor = currentFillColor >= fillColors.length ? 
            fillColors[Math.floor(Math.random() * fillColors.length)] :
            fillColors[currentFillColor]
        let posX = x * (invaderWidth + 2) + 1
        let posY = y * (invaderHeight + 2) + 1
        if (Math.random() >= 0.80) {
            drawInvader(imageData, fillColor)
            ctx.putImageData(imageData, posX, posY)
        } 
    }
}

function dimAll(factor) {
    let imageData = ctx.getImageData(0, 0, width, height)
    for (let i = 0; i < imageData.data.length; i = i + 4) {
        imageData.data[i + 3] = Math.floor(imageData.data[i + 3] * factor)
    }
    ctx.putImageData(imageData, 0, 0)
}

function moveDown() {
    const d = ctx.getImageData(0, 0, width, height)
    ctx.putImageData(d, 0, 1)
}

let i = 0
let hue = 0
function update() {
    if (i % (invaderHeight + 2) === 0) {
        drawInvaders()
        dimAll(0.95)
    }
    i++
    moveDown()
    window.requestAnimationFrame(update);
    document.body.style.backgroundImage = `linear-gradient(black, black 80%, hsl(${hue}deg, 100%, 12%))`
}
update()
canvas.addEventListener('mousemove', (event) => {
    hue = wrap(event.x / window.innerWidth * 360 + 140, 0, 360)
})

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min)
}
document.body.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowDown':
            invaderHeight = clamp(invaderHeight - 1, 1, 12)
            break;
        case 'ArrowUp':
            invaderHeight = clamp(invaderHeight + 1, 1, 12)
            break;
        case 'ArrowLeft':
            invaderWidth = clamp(invaderWidth - 1, 1, 12)
            break;
        case 'ArrowRight':
            invaderWidth = clamp(invaderWidth + 1, 1, 12)
            break;
        default:
            break;
    }
    invaderHalfWidth = Math.ceil(invaderWidth / 2)
    console.log(`resized to (${invaderWidth}, ${invaderHeight})`)
})

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

// background
ctx.imageSmoothingEnabled = false;

function drawInvader(imageData, fillColor) {
    const sh = 6;
    const sw = 3;
    const fsw = 6;

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
document.getElementById('hitzone').addEventListener('pointerdown', () => {
    currentFillColor = wrap(currentFillColor + 1, 0, 4)
})

function drawInvaders() {
    const cy = Math.floor(height / 8)
    const cx = Math.floor(width / 8)
    const y = 0
    let imageData
    for (let x = 0; x < cx; x++) {
        let fillColor = currentFillColor >= fillColors.length ? 
            fillColors[Math.floor(Math.random() * fillColors.length)] :
            fillColors[currentFillColor]
        let posX = x * 8 + 1
        let posY = y * 8 + 1
        imageData = ctx.getImageData(posX, posY, 6, 6)
        if (Math.random() >= 0.80) {
            drawInvader(imageData, fillColor)
        } 
        ctx.putImageData(imageData, posX, posY)
    }
}

function dimAll(factor) {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    let imageData = ctx.getImageData(0, 0, w, h)
    for (let i = 0; i < imageData.data.length; i = i + 4) {
        imageData.data[i + 3] = Math.floor(imageData.data[i + 3] * factor)
    }
    ctx.putImageData(imageData, 0, 0)
}

function moveDown() {
    const d = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.putImageData(d, 0, 1)
}

let i = 0
let hue = 0
function update() {
    if (i % 8 === 0) {
        drawInvaders()
        dimAll(0.95)
    }
    i++
    moveDown()
    window.requestAnimationFrame(update);
    const dataUrl = canvas.toDataURL()
    document.getElementById('hitzone').style.backgroundImage = `url(${dataUrl}), linear-gradient(black, black 80%, hsl(${hue}deg, 100%, 12%))`
}
update()
document.getElementById('hitzone').addEventListener('mousemove', (event) => {
    hue = wrap(event.x / window.innerWidth * 360 + 140, 0, 360)
})
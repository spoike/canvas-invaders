const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

// background
ctx.fillStyle = 'black'
ctx.rect(0, 0, width, height)
ctx.fill();
ctx.imageSmoothingEnabled = false;

function drawInvader(imageData, x, y, fillColor) {
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
    ctx.putImageData(imageData, x, y)
}

const fillColors = [
    [255, 255, 255], // white
    [255, 180, 100], // amber
    [100, 255, 100], // green
]
let currentFillColor = 0

function wrap(value, min, max) {
    if (value > max) {
        return min
    }
    return value
}

function drawInvaders() {
    const imageData = ctx.getImageData(0, 0, 6, 6)
    const cy = Math.floor(height / 8)
    const cx = Math.floor(width / 8)
    for (let y = 0; y < cy; y++) {
        for (let x = 0; x < cx; x++) {
            let fillColor = currentFillColor >= fillColors.length ? 
                fillColors[Math.floor(Math.random() * fillColors.length)] :
                fillColors[currentFillColor]
            drawInvader(imageData, x * 8 + 1, y * 8 + 1, fillColor)
        }
    }
    currentFillColor = wrap(currentFillColor + 1, 0, 3)
}

drawInvaders()
setInterval(drawInvaders, 10 * 1000);
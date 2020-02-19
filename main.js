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
}

function dimDown(imageData, x, y, factor) {
    const w = 6;
    const h = 6;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (x + (y * w)) * 4
            imageData.data[i + 3] = Math.floor(imageData.data[i + 3] * factor)
        }
    }
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
    const cy = Math.floor(height / 8)
    const cx = Math.floor(width / 8)
    let imageData
    for (let y = 0; y < cy; y++) {
        for (let x = 0; x < cx; x++) {
            let fillColor = currentFillColor >= fillColors.length ? 
                fillColors[Math.floor(Math.random() * fillColors.length)] :
                fillColors[currentFillColor]
            let posX = x * 8 + 1
            let posY = y * 8 + 1
            imageData = ctx.getImageData(posX, posY, 6, 6)
            if (Math.random() >= 0.80) {
                drawInvader(imageData, posX, posY, fillColor)
            } 
            ctx.putImageData(imageData, posX, posY)
        }
    }
    currentFillColor = wrap(currentFillColor + 1, 0, 3)
    const dataUrl = canvas.toDataURL()
    document.body.style.backgroundImage = `url(${dataUrl})`
}

function dimAll() {
    const cy = Math.floor(height / 8)
    const cx = Math.floor(width / 8)
    let imageData
    for (let y = 0; y < cy; y++) {
        for (let x = 0; x < cx; x++) {
            let posX = x * 8 + 1
            let posY = y * 8 + 1
            imageData = ctx.getImageData(posX, posY, 6, 6)
            dimDown(imageData, posX, posY, 0.95)
            ctx.putImageData(imageData, posX, posY)
        }
    }
    currentFillColor = wrap(currentFillColor + 1, 0, 3)
    const dataUrl = canvas.toDataURL()
    document.body.style.backgroundImage = `url(${dataUrl})`
}

drawInvaders()
setInterval(drawInvaders, 5000);
setInterval(dimAll, 200)

import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.2.13/dist/web.js'

class Loader {
    static loadedFiles = []
    constructor(type, src, onload) {
        Loader.load(type, src, onload)
    }
    static load(type, src, onload) {
        if (this.loadedFiles.includes(src)) {
            onload()
        }
        const element = createElementByType(type)
        element.src = src
        if (type === 'img') {
            const eventName = 'load'
            const evFunc = () => {
                element.removeEventListener(eventName, evFunc)
                this.loadedFiles.push(src)
                onload()
            }
            element.addEventListener(eventName, evFunc)
        } else if (type === 'video') {
            const eventName = 'loadeddata'
            const evFunc = () => {
                if (element.readyState === 4) {
                    element.removeEventListener(eventName, evFunc)
                    this.loadedFiles.push(src)
                    onload()
                }
            }
            element.addEventListener(eventName, evFunc)
        } else {
            throw 'Don`t know how to check load progress'
        }
    }
}

function createElementByType(type) {
    if (type === 'img') {
        return document.createElement('img')

    } else if (type === 'video') {
        return document.createElement('video')
    } else {
        throw 'Incorrect type'
    }
}

const bg = document.getElementById('bg')
function changeBg(type, src) {
    const newElement = createElementByType(type)
    newElement.src = src
    bg.appendChild(newElement)
    newElement.classList.add('bg-content')
    while (bg.children.length > 1) {
        bg.removeChild(bg.children[0])
    }
    if (type === 'video') {
        newElement.play()
        newElement.loop = true
    }
}

let typeBotIndex = 0
function runTypeBot(asset, typebotInfo, next) {
    Loader.load(asset.type, asset.src, () => {
        changeBg(asset.type, asset.src)
        const typebotDiv = document.createElement('typebot-standard')
        typebotDiv.id = `typebot-${typeBotIndex}`
        typebotDiv.classList.add('typebot')
        document.getElementById('typebots').appendChild(typebotDiv)
        typeBotIndex += 1
        Typebot.initStandard({
            id: typebotDiv.id,
            typebot: typebotInfo.bot,
            apiHost: typebotInfo.host,
            onEnd: () => {
                if (next.length > 0) {
                    setTimeout(() => {
                        typebotDiv.style.display = 'none'
                        runTypeBot(...next)
                    }, 500)
                }
            }
        });
    })
}


function generateBotsInFlow(bots) {
    const flow = []
    let nowArr = flow
    for (const bot of bots) {
        nowArr.push(bot.asset, bot.bot)
        const newNowArr = []
        nowArr.push(newNowArr)
        nowArr = newNowArr
    }
    return flow
}


(() => {

    Loader.load('video', 'public/rain.mp4', () => { })
    Loader.load('img', 'public/1.jpg', () => { })

    const bot1 = {
        asset: {type: 'video', src: 'public/rain.mp4'},
        bot: {
            bot: 'welcome-eer92l9',
            host: 'https://app.ferreiraview.com'
        }
    }
    const bot2 = {
        asset: {type: 'img', src: 'public/1.jpg'},
        bot: {
            bot: 'id2-woken44',
            host: 'https://app.ferreiraview.com'
        }
    }

    const bots = [bot1, bot2]

    runTypeBot(...generateBotsInFlow(bots))
})()
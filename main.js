import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.2.22/dist/web.js';

class Loader {
    static loadedFiles = [];

    static load(type, src, onload) {
        if (this.loadedFiles.includes(src)) {
            onload();
            return;
        }

        const element = this.createElementByType(type);
        element.src = src;

        if (type === 'video') {
            element.muted = true;
            element.autoplay = true;
            element.playsinline = true;
            element.datawfignore = true;
            element.addEventListener('canplaythrough', () => this.onMediaLoaded(src, onload, element));
        } else if (type === 'img') {
            element.addEventListener('load', () => this.onMediaLoaded(src, onload, element));
        } else {
            throw new Error('Unknown type for loading media');
        }

        document.body.appendChild(element); // Temporariamente para carregar
    }

    static onMediaLoaded(src, onload, element) {
        this.loadedFiles.push(src);
        onload();

        if (element.tagName === 'VIDEO') {
            element.play().catch(e => console.error("Erro ao tentar autoplay: ", e));
        }

        document.body.removeChild(element); // Remove após carregar
    }

    static createElementByType(type) {
        if (type === 'img') {
            return document.createElement('img');
        } else if (type === 'video') {
            return document.createElement('video');
        } else {
            throw new Error('Incorrect type');
        }
    }
}

const bg = document.getElementById('bg');
function changeBg(type, src) {
    const newElement = Loader.createElementByType(type);
    if (type === 'video') {
        newElement.loop = true;
        newElement.autoplay = true;
        newElement.muted = true;
        newElement.playsinline = true;
        newElement.play();
    }
    newElement.src = src;
    bg.appendChild(newElement);
    newElement.classList.add('bg-content');
    while (bg.children.length > 1) {
        bg.removeChild(bg.children[0]);
    }
}

let typeBotIndex = 0;
function runTypeBot(asset, typebotInfo, next) {
    Loader.load(asset.type, asset.src, () => {
        changeBg(asset.type, asset.src);
        if (typeBotIndex > 0) {
            document.getElementById('typebots').removeChild(document.getElementById(`typebot-${typeBotIndex - 1}`));
        }
        const typebotDiv = document.createElement('typebot-standard');
        typebotDiv.id = `typebot-${typeBotIndex}`;
        typebotDiv.classList.add('typebot');
        document.getElementById('typebots').appendChild(typebotDiv);
        typeBotIndex += 1;
        Typebot.initStandard({
            id: typebotDiv.id,
            typebot: typebotInfo.bot,
            apiHost: typebotInfo.host,
            onEnd: () => {
                if (next.length > 0) {
                    setTimeout(() => {
                        typebotDiv.style.display = 'none';
                        runTypeBot(...next);
                    }, 500);
                }
            }
        });
    })
}

function generateBotsInFlow(bots) {
    const flow = [];
    let nowArr = flow;
    for (const bot of bots) {
        nowArr.push(bot.asset, bot.bot);
        const newNowArr = [];
        nowArr.push(newNowArr);
        nowArr = newNowArr;
    }
    return flow;
}

(() => {
    Loader.load('video', 'public/rain.mp4', () => { });
    Loader.load('img', 'public/1.jpg', () => { });

    const bot1 = {
        asset: { type: 'video', src: 'public/rain.mp4' },
        bot: {
            bot: 'welcome-eer92l9',
            host: 'https://app.ferreiraview.com'
        }
    };
    const bot2 = {
        asset: { type: 'img', src: 'public/1.jpg' },
        bot: {
            bot: 'id2-woken44',
            host: 'https://app.ferreiraview.com'
        }
    };

    const bots = [bot1, bot2];

    runTypeBot(...generateBotsInFlow(bots));
})();

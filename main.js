import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.2.22/dist/web.js'; 

class Loader {
    static loadedFiles: string[] = [];

    static load(type: 'video' | 'img', src: string, onload: () => void): void {
        if (this.loadedFiles.includes(src)) {
            onload();
            return;
        }

        const element = this.createElementByType(type);
        element.src = src;

        if (type === 'video') {
            const videoElement = element as HTMLVideoElement;
            videoElement.muted = true;
            videoElement.autoplay = true;
            videoElement.playsinline = true;
            videoElement.addEventListener('canplaythrough', () => this.onMediaLoaded(src, onload, videoElement));
        } else if (type === 'img') {
            element.addEventListener('load', () => this.onMediaLoaded(src, onload, element));
        } else {
            throw new Error('Unknown type for loading media');
        }

        document.body.appendChild(element); // Temporariamente para carregar
    }

    static onMediaLoaded(src: string, onload: () => void, element: HTMLElement): void {
        this.loadedFiles.push(src);
        onload();

        if (element.tagName === 'VIDEO') {
            (element as HTMLVideoElement).play().catch(e => console.error("Erro ao tentar autoplay: ", e));
        }

        document.body.removeChild(element); // Remove após carregar
    }

    static createElementByType(type: 'video' | 'img'): HTMLVideoElement | HTMLImageElement {
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
if (bg) {
    function changeBg(type: 'video' | 'img', src: string): void {
        const newElement = Loader.createElementByType(type);
        if (type === 'video') {
            const videoElement = newElement as HTMLVideoElement;
            videoElement.loop = true;
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.playsinline = true;
            videoElement.play();
        }
        newElement.src = src;
        bg.appendChild(newElement);
        newElement.classList.add('bg-content');
        while (bg.children.length > 1) {
            bg.removeChild(bg.children[0]);
        }
    }
}

// Restante do código para Typebot e geração de bots...

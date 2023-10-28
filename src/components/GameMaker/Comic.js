import { v4 as uuidv4 } from 'uuid';
import utils from '@/utils/index'
class Part {
    constructor(options = {}) {
        this.id = options.id || uuidv4();
        this.type = options.type || 'part';
        this.label = options.label || '零件label';
        this.name = options.name || '零件名称';
        this.description = options.description || '零件描述'
        
        this.parent = options.parent || null;
        this.canFill = options.canFill || false;
        options.style = options.style || {};
        this.style = {}
        this.style.x = parseFloat(options.style.x) || 0;
        this.style.y = parseFloat(options.style.y) || 0;
        this.style.w = parseFloat(options.style.w) || 0;
        this.style.h = parseFloat(options.style.h) || 0;
        this.zIndex = options.zIndex || 0
        this.isShowBorderAfterPainted = options.isShowBorderAfterPainted || false,
        

        this.children = options.children || [];
        if (Array.isArray(this.children)) {
            this.children = this.children.map(item => {
                return new Part({
                    ...item,
                    parent: this
                });
            })
        }

        this.observe()

        this._drawImage = options._drawImage
        this.drawImage = options._drawImage || ''
        this.drawImageObj = null;
        this.borderImage = options.borderImage || ''
        this.disabledImage = options.disabledImage || ''
    }
    get assetsBaseUrl () {
        let assetsBaseUrl = '';
        if (!this.comic) {
            this.comic = this.findComic();
        }
        if (this.comic) {
            assetsBaseUrl = this.comic.assetsBaseUrl
        }
        return assetsBaseUrl
    }
    observe () {
        Object.defineProperties(this, {
            drawImage: {
                get () {
                    return this._drawImage
                },
                async set (value) {
                    // self.drawImage = value;
                    
                    if (value) {
                        debugger
                        this._drawImage = value;
                        this.drawImageObj = await this.loadImg(this.assetsBaseUrl + value);
                    }
                    // this.drawImage = value
                    // if (this.drawImage != value) {
                    // }
                }
            }
        })
    }
    async loadImg (imgUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imgUrl;
            img.onload = () => {
                resolve(img);
            }
        })
    }
    findComic () {
        let node = this;
        while (node.parent) {
            node = node.parent;
        }
        if (node.type !== 'comic') {
            node = null
        }
        return node;
    }
    createPart (options) {
        let part = new Part(options);
        this.children.push(part);
        return part;
    }
    createParts (optionList) {
        optionList.forEach(option => {
            this.createPart(option);
        })
    }
    removeSelf () {
        let index = this.parent.children.indexOf(this);
        this.parent.children.splice(index, 1);
    }
    render (ctx) {
        if (this.drawImageObj) {
            let x = this.style.x;
            let y = this.style.y;
            let w = this.style.w || this.drawImageObj.naturalWidth;

            let h = this.style.h || this.drawImageObj.naturalHeight;
            ctx.drawImage(this.drawImageObj, x, y, w, h);
        }
    }
}

class Comic {
    constructor(options = {}) {
        this.id = options.id || uuidv4();
        this.type = options.type || 'comic';
        this.label = options.label || '漫画';
        this.name = options.name || '漫画';
        this.filename = options.filename || '';
        this.assetsBaseUrl = options.assetsBaseUrl || 'http://cdn.hyn.com/colouring_game/sleep/';
        this.assetsRealPath = options.assetsRealPath || 'E:\\work\\cdn\\colouring_game\\sleep';
        this.filepath = options.filepath || '';
        this.children = options.children || [];
        if (Array.isArray(this.children)) {
            this.children = this.children.map(item => {
                return new Part({
                    ...item,
                    parent: this
                });
            })
        }
    }
    createPart (options) {
        let part = new Part({
            ...options,
            parent: this
        });
        this.children.push(part);
        return part;
    }
    createParts (optionList) {
        // let parts = [];
        // for (let i = 0; i < optionList.length; i++) {
        //     let part = new Part(optionList[i]);
        //     parts.push(part);
        // }
        // return parts;
        optionList.forEach(option => {
            this.createPart(option);
        })
    }
    delete () {
        this.children.forEach(part => {
            part.delete();
        })
    }
    render (ctx) {
        // this.
    }
}

export {
    Part,
    Comic
}
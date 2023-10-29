import { v4 as uuidv4 } from 'uuid';
import utils from '@/utils/index'
class Part {
    constructor(options = {}) {
        this.id = options.id || utils.getIncreamentId();
        if (this.id) {
            utils.updateIdLib(this.id)
        }
        this.uuid = options.uuid || utils.uuid();
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
        this.zIndex = options.zIndex || 1
        // if (this.parent) {
        //     this.zIndex = 
        // }
        this.isDefaultDisabled = options.isDefaultDisabled || true;
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

        // this._drawImage = options._drawImage
        this.drawImage = options.drawImage || ''
        this.drawImageObj = null;
        if (this.drawImage) {
            this.loadAndSetImg('drawImageObj', this.drawImage)
        }
        this.borderImage = options.borderImage || ''
        if (this.borderImage) {
            this.loadAndSetImg('borderImageObj', this.borderImage)
        }
        this.disabledImage = options.disabledImage || ''
        if (this.disabledImage) {
            this.loadAndSetImg('disabledImageObj', this.disabledImage)
        }
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
            _parent: {},
            _drawImage: {
                async set (value) {
                    if (value) {
                        this.drawImage = this.assetsBaseUrl + value;
                        this.drawImageObj = await this.loadImg(this.drawImage);
                        this.style.w = this.drawImageObj.naturalWidth * 0.497
                        this.style.h = this.drawImageObj.naturalHeight * 0.497
                    }
                }
            },
            _borderImage: {
                async set (value) {
                    if (value) {
                        this.borderImage = this.assetsBaseUrl + value;
                        this.borderImageObj = await this.loadImg(this.borderImage);
                    }
                }
            },
            _disabledImage: {
                async set (value) {
                    if (value) {
                        this.disabledImage = this.assetsBaseUrl + value;
                        this.disabledImageObj = await this.loadImg(this.disabledImage);
                    }
                }
            }
        })
    }
    async loadAndSetImg (key, imgUrl) {
        const img = await this.loadImg(imgUrl)
        this[key] = img
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
    createPart (options = {zIndex: 1}) {
        let zIndex = 1;
        if (!isNaN(parseInt(options.zIndex))) {
            zIndex = parseInt(options.zIndex)
        }
        if (!isNaN(parseInt(this.zIndex))) {
            zIndex += this.zIndex
        }
        let part = new Part({
            ...options,
            parent: this,
            zIndex
        });
        this.children.push(part);
        return part;
    }
    createParts (optionList) {
        optionList.forEach(option => {
            this.createPart(option);
        })
    }
    copyPart () {
        const parent = this.parent;
        const copyPartOptions = {
            ...this,
            id: null,
            uuid: null
        }
        const copyPart = new Part(copyPartOptions)
        parent.children.push(copyPart)
    }
    sortChildren () {
        const children = this.children
        if (Array.isArray(children)) {
            children.sort((node1, node2) => {
                return node1.zIndex - node2.zIndex
            })
            children.forEach((node) => {
                if (node.sortChildren) {
                    node.sortChildren()
                }
            })
        }
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
            if (this.borderImageObj) {
                ctx.drawImage(this.borderImageObj, x, y, w, h);
            } else if (this.disabledImageObj) {
                ctx.drawImage(this.disabledImageObj, x, y, w, h);
            }
        }
    }
}

class Comic {
    constructor(options = {}) {
        this.id = options.id || utils.getIncreamentId();
        if (this.id) {
            utils.updateIdLib(this.id)
        }
        this.uuid = options.uuid || utils.uuid();
        this.type = options.type || 'comic';
        this.label = options.label || '漫画';
        this.name = options.name || '漫画';
        this.filename = options.filename || '';
        this.assetsBaseUrl = options.assetsBaseUrl || 'http://cdn.hyn.com/colouring_game/sleep/';
        this.assetsRealPath = options.assetsRealPath || 'E:\\work\\cdn\\colouring_game\\sleep';
        this.filepath = options.filepath || '';
        this.children = options.children || [];
        this.zIndex = options.zIndex || 1
        if (Array.isArray(this.children)) {
            this.children = this.children.map(item => {
                return new Part({
                    ...item,
                    parent: this
                });
            })
        }
    }
    createPart (options = {zIndex: 1}) {
        let zIndex = 1;
        
        if (!isNaN(parseInt(options.zIndex))) {
            zIndex = parseInt(options.zIndex)
        }
        if (!isNaN(parseInt(this.zIndex))) {
            zIndex += this.zIndex
        }
        let part = new Part({
            ...options,
            parent: this,
            zIndex,
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
    sortChildren () {
        const children = this.children
        if (Array.isArray(children)) {
            children.sort((node1, node2) => {
                return node1.zIndex - node2.zIndex
            })
            children.forEach((node) => {
                if (node.sortChildren) {
                    node.sortChildren()
                }
            })
        }
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
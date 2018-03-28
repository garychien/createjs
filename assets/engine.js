class Engine {
    constructor(option = {}) {
        this.assetsObj = {
            image: {},
            audio: {}
        }
        this.assetsCount = {
            image: 0,
            audio: 0
        }
        this.assetsErrorQueue = [];
        this.assetsErrorCount = 0
    }

    addImg(name, src, retry = 0) {
        if (!retry) this.assetsCount.image += 1;
        const i = new window.Image();
        i.src = src;
        i.onload = () => {
            this.assetsObj.image[name] = i;
        }
        i.onerror = () => {
            this.assetsErrorQueue.push({
                name,
                src,
                retry: retry + 1,
                type: 'image'
            })
        }
    }

    addAudio(name, src, retry = 0) {
        if (!retry) this.assetsCount.audio += 1;
        const a = new window.Audio();
        a.src = src;
        this.assetsObj.audio[name] = a;
        a.load();
    }

    load(onload, loading) {
        const id = setInterval(() => {
            const assetsTotalCount = this.assetsCount.image + this.assetsCount.audio;
            const assetsLoadedCount = Object.keys(this.assetsObj.image).length + Object.keys(this.assetsObj.audio).length;

            console.log(assetsLoadedCount);
            if (loading) {
                loading({
                    success: assetsLoadedCount,
                    failed: this.assetsErrorCount,
                    total: assetsTotalCount
                });
            }

            if (assetsTotalCount === assetsLoadedCount) {
                clearInterval(id);
            }
        }, 200);
    }
}
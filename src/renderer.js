var util = require("./util");

function Renderer(ctx, settings, images, debugMode){

    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
    // var stageWidth = settings.width,
    //     stageHeight = settings.height;

    var imageCache = images;

    var self = this;

    this.autoRender = false;

    this.clear = function() {
        ctx.clearRect(0,0,settings.width,settings.height);
    };

    this.drawSprites = function(sprites){
        bubbleSort(sprites._sprites); // 針對 z-index 做排序，讓越大的排在越後面，可以繪製在最上層
        sprites.each(function(instance) {
            self.drawInstance(instance, ctx);
        });
    };

    this.drawInstance = function(instance, ctx){
        // console.log(instance);
        if(!instance.hidden){
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            var img = this.getImgFromCache(instance.getCurrentCostume());
            instance.width = img.width * instance.scale;
            instance.height = img.height * instance.scale;

            var rad = util.degreeToRad(instance.direction - 90);
            ctx.globalAlpha = instance.opacity;
            if (instance.rotationStyle === 'flipped') {
                if(instance.direction > 180) {
                    ctx.translate(instance.x*2, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(  img,
                                    (instance.x-instance.width/2),
                                    (instance.y-instance.height/2),
                                    instance.width,
                                    instance.height
                    )
                    ctx.scale(-1, 1);
                    ctx.translate(-instance.x*2, 0);
                    ctx.globalAlpha = 1;
                    return;
                } else {
                    var rad = 0;
                }
            }
            if(instance.rotationStyle === 'fixed') {
                var rad = 0;
            }
            ctx.translate(instance.x, instance.y);
            ctx.rotate(rad);
            ctx.drawImage( img,
                        (-instance.width / 2),
                        (-instance.height / 2),
                        instance.width,
                        instance.height
            );
            ctx.rotate(-rad);
            ctx.translate(-instance.x, -instance.y);
            ctx.globalAlpha = 1;
        }
    };

    // @Params:
    // - src: backdrop image location
    // - options: {x:number, y:number, width:number, height:number}
    this.drawBackdrop = function(src, x, y, width, height){
        if(src.includes('.')) {
            var img = this.getImgFromCache(src);
            ctx.drawImage(img, (x||0), (y||0), (width||img.width), (height||img.height));
        } else if(src) {
            ctx.fillStyle=src;
            ctx.fillRect(0,0,settings.width, settings.height);
        }
    };

    // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
    this.getImgFromCache = function(path){
        var img = imageCache[path];
        if( !img ){
            img = new Image();
            img.onerror = function() {
                console.error("無法載入 \"" + path + "\", 請檢查素材是否存在或名稱是否輸入正確。");
            };
            img.src = path;
            imageCache[path] = img;
        }
        return img;
    }
}

function bubbleSort(arr) {
    var n = arr.length;
    var swapped = true;
    for (let i = 0; i < n && swapped; i++) {
        swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j].layer > arr[j + 1].layer) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
    }
    return arr;
}

module.exports = Renderer;
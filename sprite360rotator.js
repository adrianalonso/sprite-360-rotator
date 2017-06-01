(function () {
    /**
     * Sprite360Rotator Plugin
     * This function allows doing 360 rotator animation with horizontal sprite
     * This library requires easeljs (http://createjs.com/easeljs)
     *
     * @author aalonso@laliga.es
     * @version 1.0.0
     * @param container
     * @param url_image
     * @param options
     * @returns {*}
     * @constructor
     */
    this.Sprite360Rotator = function (container, url_image, options) {

        // attributes
        this.container = null;
        this.canvasContainer = null;
        this.img = false;
        this.currentFrame = 0;
        this.rotate360Interval = false;
        this.stage = null;
        this.bmp = null;
        this.start_x = 0;
        this.spriteWidth = false;
        this.spriteHeight = false;

        // options
        var defaults = {
            speed: 60,
            numElements: 30
        };

        if (arguments[2] && typeof arguments[2] === "object") {
            this.options = extendDefaults(defaults, arguments[2]);
        } else {
            this.options = defaults;
        }

        // Initialize
        this.container = container;
        this.canvasContainer = document.getElementById(container);
        this.img = new Image();
        this.img.src = url_image;

        // Load Images
        var selfElement = this;
        this.img.onload = function () {
            selfElement.spriteWidth = this.width / selfElement.options.numElements;
            selfElement.spriteHeight = this.height;
            selfElement.canvasContainer.width = selfElement.spriteWidth;
            selfElement.canvasContainer.height = selfElement.spriteHeight;
            selfElement.initStage(selfElement);
        };

        /**
         * Init Create Stage
         * @param selfElement
         */
        this.initStage = function (selfElement) {
            var stage = new createjs.Stage(selfElement.canvasContainer);
            stage.enableMouseOver(true);
            stage.mouseMoveOutside = true;
            createjs.Touch.enable(stage);

            selfElement.stage = stage;

            document.body.style.cursor = 'progress';
            selfElement.addNavigation();

            createjs.Ticker.addEventListener("tick", function () {
            });
            createjs.Ticker.setFPS(60);
            createjs.Ticker.useRAF = true;

            selfElement.goTo(0);
            selfElement.animate(0);
        };

        /**
         *  Play Animation
         */
        this.play = function () {
            console.log(this);
            var animate = this.animate.bind(this);
            var selfElement = this;
            selfElement.rotate360Interval = setInterval(
                function () {
                    animate(1);
                }, this.options.speed
            );
        };

        /**
         *  Stop animation
         */
        this.stop = function () {
            clearInterval(this.rotate360Interval);
        };

        /**
         * Add Createjs Navigation
         */
        this.addNavigation = function () {
            this.stage.onMouseOver = this.mouseOver.bind(this);
            this.stage.onMouseDown = this.mousePressed.bind(this);
            document.body.style.cursor = 'auto';
        };

        /**
         * This function draw next frame on canvas
         * @param dir rtl or ltr
         */
        this.animate = function (dir) {
            this.currentFrame -= dir;

            if (this.currentFrame < 0) {
                this.currentFrame = this.options.numElements - 1;
            }
            else if (this.currentFrame > this.options.numElements - 1) {
                this.currentFrame = 0;
            }

            var sourceX = this.currentFrame * this.spriteWidth;
            var sourceY = 0;

            if (this.stage) {
                var ctx = this.stage.canvas.getContext("2d");
                ctx.clearRect(0, 0, this.spriteWidth, this.spriteHeight);
                ctx.drawImage(this.img,
                    sourceX, sourceY, this.spriteWidth, this.spriteHeight,
                    0, 0, this.spriteWidth, this.spriteHeight);
            }

        };

        /**
         * This function indicate frame to go
         * @param frame
         */
        this.goTo = function (frame) {
            this.currentFrame = frame;
        };

        /**
         * @param event
         */
        this.mouseOver = function (event) {
            document.body.style.cursor = 'pointer';
        };

        /**
         * @param event
         */
        this.mousePressed = function (event) {
            this.start_x = event.rawX;
            this.stage.onMouseMove = this.mouseMoved.bind(this);
            this.stage.onMouseUp = this.mouseUp.bind(this);

            document.body.style.cursor = 'w-resize';
            this.stop();
        };

        /**
         * @param event
         */
        this.mouseMoved = function (event) {
            var dx = event.rawX - this.start_x;
            var abs_dx = Math.abs(dx);

            if (abs_dx > 5) {
                this.animate(dx / abs_dx);
                this.start_x = event.rawX;
            }
        };

        /**
         * @param event
         */
        this.mouseUp = function (event) {
            this.stage.onMouseMove = null;
            this.stage.onMouseUp = null;
            document.body.style.cursor = 'pointer';
            this.play();
        };


        return this;
    };

    /**
     * Extend options properties
     * @param source
     * @param properties
     * @returns {*}
     */
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }
}());


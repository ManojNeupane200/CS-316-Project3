const tank = document.getElementById("tank");

/*
    Five possible fish images.
    Make sure these filenames match your GitHub files exactly.
*/
const fishImages = [
    "fish1.png",
    "fish2.png",
    "fish3.png",
    "fish4.png",
    "fish5.png"
];

/*
    At least 7 fish are required.
*/
const numberOfFish = 7;


/*
    Fish class
*/
class Fish {

    constructor() {

        /*
            Create image element
        */
        this.element = document.createElement("img");

        this.element.classList.add("fish");


        /*
            Random image
        */
        const randomImage =
            Math.floor(Math.random() * fishImages.length);

        this.element.src = fishImages[randomImage];


        /*
            Fish dimensions
        */
        this.width = 90;
        this.height = 60;


        /*
            Find tank's usable size
        */
        this.tankWidth = tank.clientWidth;
        this.tankHeight = tank.clientHeight;


        /*
            Random starting location.

            Subtracting fish width/height prevents
            the fish from spawning outside the tank.
        */
        this.x = Math.floor(
            Math.random() *
            (this.tankWidth - this.width)
        );

        this.y = Math.floor(
            Math.random() *
            (this.tankHeight - this.height)
        );


        /*
            Random initial direction.

            1 = right
            -1 = left
        */
        if (Math.random() < 0.5) {
            this.direction = 1;
        } else {
            this.direction = -1;
        }


        /*
            Every fish gets its own normal speed.
        */
        this.normalSpeed =
            1 + Math.random() * 1.5;

        this.speed = this.normalSpeed;


        /*
            Used for click speed timer
        */
        this.speedTimer = null;


        /*
            Put fish at its random starting point
        */
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";


        /*
            Make fish face its direction
        */
        this.updateDirection();


        /*
            Add the fish to the tank
        */
        tank.appendChild(this.element);


        /*
            Clicking THIS fish changes only
            THIS fish's speed.
        */
        this.element.addEventListener(
            "click",
            () => this.changeSpeed()
        );


        /*
            Start independent direction checks
        */
        this.scheduleDirectionCheck();
    }


    /*
        Move the fish
    */
    move() {

        this.x += this.speed * this.direction;


        /*
            LEFT WALL
        */
        if (this.x <= 0) {

            this.x = 0;

            this.direction = 1;

            this.updateDirection();
        }


        /*
            RIGHT WALL
        */
        if (
            this.x + this.width >=
            this.tankWidth
        ) {

            this.x =
                this.tankWidth - this.width;

            this.direction = -1;

            this.updateDirection();
        }


        /*
            Update the fish's location
        */
        this.element.style.left =
            this.x + "px";
    }


    /*
        Every fish independently checks
        whether it should change direction.
    */
    scheduleDirectionCheck() {

        /*
            Random time between
            2 and 8 seconds
        */
        const randomTime =
            Math.floor(
                Math.random() * 6000
            ) + 2000;


        setTimeout(() => {

            /*
                50% chance to change direction
            */
            if (Math.random() < 0.5) {

                this.direction *= -1;

                this.updateDirection();
            }


            /*
                Schedule another independent check
            */
            this.scheduleDirectionCheck();

        }, randomTime);
    }


    /*
        Flip image depending on swimming direction
    */
    updateDirection() {

        if (this.direction === 1) {

            this.element.style.transform =
                "scaleX(1)";

        } else {

            this.element.style.transform =
                "scaleX(-1)";
        }
    }


    /*
        Clicking a fish temporarily makes it faster.
    */
    changeSpeed() {

        /*
            Set speed relative to NORMAL speed.

            This prevents repeated clicks from
            multiplying the speed again.
        */
        this.speed =
            this.normalSpeed * 2;


        /*
            If it was clicked again while already fast,
            remove the old timer.
        */
        if (this.speedTimer !== null) {

            clearTimeout(
                this.speedTimer
            );
        }


        /*
            Return to normal after 3 seconds.
        */
        this.speedTimer =
            setTimeout(() => {

                this.speed =
                    this.normalSpeed;

                this.speedTimer = null;

            }, 3000);
    }
}


/*
    Store all fish separately.
*/
const fishTank = [];


/*
    Generate at least seven fish
    every time the page loads.
*/
for (
    let i = 0;
    i < numberOfFish;
    i++
) {

    fishTank.push(
        new Fish()
    );
}


/*
    Animation loop
*/
function animate() {

    /*
        Each fish moves independently.
    */
    for (let fish of fishTank) {

        fish.move();
    }


    requestAnimationFrame(
        animate
    );
}


/*
    Start swimming
*/
animate();

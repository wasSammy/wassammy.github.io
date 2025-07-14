const cursor = document.getElementById("cursor");
const amount = 10;
const sineDots = Math.floor(amount * 0.3);
const width = 5;
const idleTimeout = 150;
let lastFrame = 0;
let mousePosition = {x: 0, y: 0};
let dots = [];
let timeoutID;
let idle = false;
let hoverButton;
let hoverTL;

class HoverButton {
    constructor(id) {
        this.hovered = false;
        this.animatingHover = false;
        this.forceOut = false;
        this.timing = 0.65;
        this.el = document.getElementById(id);
        this.bg = this.el.getElementsByClassName("bg")[0];
        this.el.addEventListener("mouseenter", this.onMouseEnter);
        this.el.addEventListener("mouseleave", this.onMouseLeave);
    }

    onMouseEnter = () => {
        this.hoverInAnim();
    };

    hoverInAnim = () => {
        if (!this.hovered) {
            this.hovered = true;
            this.animatingHover = true;
            this.forceOut = false;
            TweenMax.fromTo(
                this.bg,
                this.timing,
                {x: "-112%"},
                {
                    x: "-12%",
                    ease: Power3.easeOut,
                    onComplete: () => {
                        this.animatingHover = false;
                        if (this.forceOut) {
                            this.foceOut = false;
                            this.hoverOutAnim();
                        }
                    }
                }
            );
        }
    };

    onMouseLeave = () => {
        if (!this.animatingHover) {
            this.hoverOutAnim();
        } else {
            this.forceOut = true;
        }
    };

    hoverOutAnim = () => {
        this.hovered = false;
        TweenMax.to(this.bg, this.timing, {
            x: "100%",
            ease: Power3.easeOut,
            onComplete: () => {
            }
        });
    };
}

class Dot {
    constructor(index = 0) {
        this.index = index;
        this.anglespeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.scale = .6 - 0.05 * index;
        this.range = width / 2 - width / 2 * this.scale + 2;
        this.limit = width * 0.75 * this.scale;
        this.element = document.createElement("span");
        TweenMax.set(this.element, {scale: this.scale});
        cursor.appendChild(this.element);
    }

    lock() {
        this.lockX = this.x;
        this.lockY = this.y;
        this.angleX = Math.PI * 2 * Math.random();
        this.angleY = Math.PI * 2 * Math.random();
    }

    draw(delta) {
        if (!idle || this.index <= sineDots) {
            TweenMax.set(this.element, {x: this.x, y: this.y});
        } else {
            this.angleX += this.anglespeed;
            this.angleY += this.anglespeed;
            this.y = this.lockY + Math.sin(this.angleY) * this.range;
            this.x = this.lockX + Math.sin(this.angleX) * this.range;
            TweenMax.set(this.element, {x: this.x, y: this.y});
        }
    }
}

class Circle {
    constructor(id) {
        const el = document.getElementById(id);
        const parent = el.parentElement;
        parent.removeChild(el);
        const chars = el.innerText.split("");
        chars.push(" ");
        for (let i = 0; i < chars.length; i++) {
            const span = document.createElement("span");
            span.innerText = chars[i];
            span.className = `char${i + 1}`;
            parent.appendChild(span);
        }
    }
}

function init() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('blur', animateInactive);

    const body = document.body;
    body.addEventListener("mouseenter", onWindowFocus);
    window.addEventListener("mouseenter", onWindowFocus);
    window.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && !e.toElement) {
            animateInactive(); // real exit from window
        }
    });

    const buttons = document.querySelectorAll('#hoverButton');
    buttons.forEach(btn => {
        btn.addEventListener("mouseenter", animateDotsOnHover);
        btn.addEventListener("mouseleave", resetDotsAfterHover);
    });

    // if moves out of the window, reset idle timer

    lastFrame += new Date();
    buildDots();
    render();
}

function startIdleTimer() {
    timeoutID = setTimeout(goInactive, idleTimeout);
    idle = false;
}

function resetIdleTimer() {
    clearTimeout(timeoutID);
    startIdleTimer();
}

function goInactive() {
    idle = true;
    for (let dot of dots) {
        dot.lock();
    }
}

function animateDotsOnHover() {
    console.log("Hovering over button, animating dots");
    dots.forEach((dot, i) => {
        // Add scale, rotation, and glow for a modern effect
        TweenMax.to(dot.element, 0.5, {
            scale: dot.scale * 1.5,
            opacity: 1,
            rotation: 360,
            delay: i * 0.03,
            ease: Power2.easeOut
        });
    });
}

function resetDotsAfterHover() {
    console.log("Hover ended, resetting dots");
    dots.forEach((dot, i) => {
        // Return to default scale, color, and opacity
        TweenMax.to(dot.element, 0.5, {
            scale: dot.scale,
            opacity: 1,
            delay: i * 0.03,
            ease: Power2.easeOut,
        });
    });
}

function animateInactive() {
    dots.forEach(dot => {
        TweenMax.to(dot.element, 0.1, { scale: 0.1, opacity: 0, ease: Power2.easeOut });
    });
}

function animateActive() {
    dots.forEach(dot => {
        TweenMax.to(dot.element, .5, { scale: dot.scale, opacity: 1, ease: Power2.easeOut });
    });
}

function onWindowFocus() {
    idle = false;
    animateActive();
}

function buildDots() {
    for (let i = 0; i < amount; i++) {
        let dot = new Dot(i);
        dots.push(dot);
    }
}

const onMouseMove = event => {
    mousePosition.x = event.clientX - width / 2;
    mousePosition.y = event.clientY - width / 2;
    resetIdleTimer();
};

const onTouchMove = () => {
    mousePosition.x = event.touches[0].clientX - width / 2;
    mousePosition.y = event.touches[0].clientY - width / 2;
    resetIdleTimer();
};

const render = timestamp => {
    const delta = timestamp - lastFrame;
    positionCursor(delta);
    lastFrame = timestamp;
    requestAnimationFrame(render);
};

const positionCursor = delta => {
    let x = mousePosition.x;
    let y = mousePosition.y;
    dots.forEach((dot, index, dots) => {
        let nextDot = dots[index + 1] || dots[0];
        dot.x = x;
        dot.y = y;
        dot.draw(delta);
        if (!idle || index <= sineDots) {
            const dx = (nextDot.x - dot.x) * 0.35;
            const dy = (nextDot.y - dot.y) * 0.35;
            x += dx;
            y += dy;
        }
    });
};

init();

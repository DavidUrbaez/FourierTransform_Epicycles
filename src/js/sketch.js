// Coding Challenge 130.3: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
// https://youtu.be/7_vKzcgpfvU


const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = -1;

function mousePressed() {


    if ((mouseX > 0) && (mouseX < width)) {
        if ((mouseY > 0) && (mouseY < height)) {

            state = USER;
            drawing = [];
            x = [];
            time = 0;
            path = [];

        }
    }

}

function mouseReleased() {
    if ((mouseX > 0) && (mouseX < width)) {
        if ((mouseY > 0) && (mouseY < height)) {

            state = FOURIER;
            const skip = 1;
            for (let i = 0; i < drawing.length; i += skip) {
                x.push(new Complex(drawing[i].x, drawing[i].y));
            }
            fourierX = dft(x);

            fourierX.sort((a, b) => b.amp - a.amp);

        }
    }
}

function setup() {
    colorMode(HSB, 1, 1, 1);
    myCanvas = createCanvas(windowWidth * 0.6, windowHeight * 0.8 * 0.8);
    myCanvas.parent("CanvasDiv");

    slider = createSlider(0, 100, 100);
    slider.style('width', '60vw');
    //slider.position(adjustx + 30, height - 250 + adjusty);
    slider.parent('n_comp_slider');

    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("Click here to start drawing!", width / 2, height / 2);
}

function epicycles(x, y, rotation, fourier) {
    let per_epicycle = slider.value() / 100;
    let N_to_plot = fourier.length * per_epicycle;
    let cols = 0;
    for (let i = 0; i < N_to_plot; i++) {
        let prevx = x;
        let prevy = y;
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;
        x += radius * cos(freq * time + phase + rotation);
        y += radius * sin(freq * time + phase + rotation);

        //stroke(255, 100);
        noFill();
        cols = min(N_to_plot, 30)
        strokeWeight(2 * (1 - i / cols) + 0.1);
        stroke((i + 1) / cols, 1, 1);
        ellipse(prevx, prevy, radius * 2);
        line(prevx, prevy, x, y);
        stroke(255);
    }
    return createVector(x, y);
}

function draw() {

    if (state == USER) {
        frameRate(60);
        background(0);
        let point = createVector(mouseX - width / 2, mouseY - height / 2);
        drawing.push(point);
        stroke(255);
        noFill();
        beginShape();
        for (let v of drawing) {
            vertex(v.x + width / 2, v.y + height / 2);
        }
        endShape();
    } else if (state == FOURIER) {
        background(0);
        let v = epicycles(width / 2, height / 2, 0, fourierX);
        path.unshift(v);
        beginShape();
        noFill();
        strokeWeight(2);
        stroke(255);
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();

        const dt = TWO_PI / fourierX.length;
        time += dt;

        if (time > TWO_PI) {
            time = 0;
            path = [];
        }
        frameRate(24);
    }


}
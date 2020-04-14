let humans = [];
let fx = [];

let x = 1, N = 0, I = 0, R = 0, Iprev = 0, R0 = 0; // variaveis do grafico

let tempo = 1; // tempo para se contaminar 
let Fr = 60; // framerate
let population;
let prob = 0.20; //probabilidade de contaminação no tempo dado
let n = 30; // população é o quadrado desse número
let rec = 14 * tempo * Fr; // frames para a recuperação (20 segundos) 

let box = 600;

function setup() {
	createCanvas(2 * box, box);
	setFrameRate(Fr);

	population = pow(n, 2); //população
	let b = box / n; //dividir a população em colunas e linhas
	let i0 = floor(random(population + 0.99)); //escolher um individuo aleatório

	for (let i = 0; i < n; i++) { // FOR para cada linha
		for (let j = 0; j < n; j++) { // FOR para cada coluna
			let x = 2 + ((i + random(- 0.3, 0.3)) * b);	//posição x
			let y = 2 + ((j + random(- 0.3, 0.3)) * b);	// posição y
			//individuo(coordenada x, coordenada y, infectado?, imune?)
			if (humans.length == i0) { //escolher o infectado n°1
				humans.push(new Individuo(x, y, true, false, 0));
			} else { //criar todos os outros
				humans.push(new Individuo(x, y, false, false, 0));
			}
		}
	}
	fx.push(new Graph(population, 0, 0, 0));
}

function draw() {

	background(51); //background rsrs
	//retangulo / paredes
	noFill();
	strokeWeight(5);
	stroke(102, 102);
	rect(0, 0, box);
	// FOR para infecção
	for (ind of humans) {
		for (other of humans) {
			if (frameCount / (Fr * tempo) % 1 == 0) {
				if (ind !== other && ind.covid(other)) {
					if(random(1) < prob) {
						other.inf = true;
						ind.rep++;
					}
				}
			}
		}
		ind.update();
		ind.display();
	}

	let infectado = 0;
	let removido = 0;
	let normal = 0;
	let Ra = 0;

	push();
	translate(box + 50, 40);
	
	if ( frameCount / (Fr * tempo / 8) % 1 == 0) {
		for (each of humans) {
			if (each.inf) {
				Ra += each.rep;
				infectado++;
			} if (each.im) {
				removido++
			} if (!each.inf && !each.im) {
				normal++
			}
		}

		R0 = 1 + Ra / infectado;
		N = normal;
		I = infectado;
		R = removido;

		let f = new Graph(N, I, R, x);
		fx.push(f);
		x += 2;
	}

	for (every of fx) {
		every.update();
	}

	stroke(255);
	strokeWeight(1);
	line(0, 70, 0, 540);
	line(-20, 520, 500, 520);

	noStroke();
	fill(255);
	text("Pessoas não expostas " + N, 0, 0);
	text("Pessoas infectadas " + I, 0, 20);
	text("Pessoas mortas ou imunes " + R, 0, 40);
	text("Tempo passado " + floor(frameCount / (Fr * tempo)), 200, 0);
	text("R0 " + R0, 200, 20);
	
	if ( frameCount / (Fr * tempo) % 1 == 0) {
		print("infectados no dia " + I);
		print("infectados nesse dia " + (I - Iprev));
		Iprev = I;
	}
	pop();
}

class Graph {
	constructor(N, I, R, abs) {
		this.t = abs;
		this.y0 = map(N + I + R, 0, N + I + R, 0, 450);
		this.y1 = map(N + I, 0, N + I + R, 0, 450);
		this.y2 = map(I, 0, N + I + R, 0, 450);
	}

	update() {
		strokeWeight(1);
		push()
		translate(0, 520);
		stroke(25, 255, 25);
		line(this.t, 0, this.t, -this.y0);
		stroke(255, 25, 255);
		line(this.t, 0, this.t, -this.y1);
		stroke(255, 25, 25);
		line(this.t, 0, this.t, -this.y2); 
		pop();
	}
}

class Individuo {
	constructor(x, y, inf, im, rep) {
		this.rep = rep;
		this.pos = createVector(x, y);
		this.inf = inf;
		this.im = im;		
		this.r = 16;
		this.diametro = 4;
		this.speed = p5.Vector.random2D(-3, 3);
		this.i = 0
	}

	covid(other) {
		if (this.inf && !other.inf && !other.im) {
			let d = dist(this.pos.x, this.pos.y,
						 other.pos.x, other.pos.y);
			return (d < this.r + (other.diametro / 2));
		}
	}

	update() {
		this.pos.add(this.speed);
		if (this.pos.x > box - 1 || this.pos.x < 1) {
			this.speed.x *= -1;
		}
		if (this.pos.y > box - 1 || this.pos.y < 1) {
			this.speed.y *= -1;
		}
    	if (this.inf) {
    		this.i++;
    		if(this.i == rec) {
    			this.im = true;
    			this.inf = false;
    		}
    	}
	}

	display() {		
		noStroke();
		fill(204, 204, 204);

		if (!this.inf) {
			if (this.im) {
				fill(102, 255, 102);
			}
			ellipse(this.pos.x, this.pos.y, this.diametro);

		} else {
			fill(255, 102, 102);
			ellipse(this.pos.x, this.pos.y, this.diametro);

			if (frameCount % 2 == 0) {
				noFill();
				stroke(255, 102, 102, 102);
				strokeWeight(2);
				ellipse(this.pos.x, this.pos.y, this.r * 2);	
			}
		}
	}
}
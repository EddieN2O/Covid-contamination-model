let humans = [];
let fx = [];

let x = 1, M = 0, N = 0, I = 0, R = 0, Iprev = 0, R0 = 0; // variaveis do grafico

let tempo = 1; // tempo para se contaminar 
let Fr = 120; // framerate
let population;
let probC = 0.4, probM = 0.01; //probabilidade de contaminação em um dia
let n = 30; // população é o quadrado desse número
let dia = tempo * Fr;
let rec = 7; // frames para a recuperação (14 dias) 
let det = 5; //nível de detalhe (iterações por "dia")
let raio = 12; //raio de contagio

let box = 600;
let finish = 0;

function setup() {
	createCanvas(2 * box, box);
	setFrameRate(Fr);
	
	pC = pow((1 + probC), (1 / det)) - 1; //ajustando a probabilidade para 
	pM = pow((1 + probM), (1 / (rec * det))) - 1;

	population = pow(n, 2); //população
	let b = box / n; //dividir a população em colunas e linhas
	let i0 = floor(random(population + 0.99)); //escolher um individuo aleatório

	for (let i = 0; i < n; i++) { // FOR para cada linha
		for (let j = 0; j < n; j++) { // FOR para cada coluna
			let x = 2 + ((i + random(- 0.3, 0.3)) * b);	//posição x
			let y = 2 + ((j + random(- 0.3, 0.3)) * b);	// posição y
			//individuo(coordenada x, coordenada y, vivo?, infectado?, imune?, quantos contaminou)
			if (humans.length == i0) { //escolher o infectado n°1
				humans.push(new Individuo(x, y, true, true, false, 0));
			} else { //criar todos os outros
				humans.push(new Individuo(x, y, true, false, false, 0));
			}
		}
	}
	fx.push(new Graph(population, 0, 0, 0, 0));
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
			if (frameCount * det / dia % 1 == 0) {
				if (ind !== other && ind.covid(other)) {
					if(random(1) < pC) {
						other.inf = true;
						ind.rep++;
					}
				}
			}
		}
		ind.update();
		ind.display();
	}

	let infectado = 0, morte = 0, recuperado = 0, 
		normal = 0, Ra = 0;

	push();
	translate(box + 50, 40);
	
	if ( (frameCount * det / dia) % 1 == 0) {
		for (each of humans) {
			if (each.inf) {
				Ra += each.rep;
				infectado++;
			}
			if (each.im)
				recuperado++;
			if (!each.life)
				morte++;
			if (!each.inf && !each.im && each.life)
				normal++;
		}

		R0 = 1 + Ra / infectado;
		M = morte;
		N = normal;
		I = infectado;
		R = recuperado;

		let f = new Graph(N, M, I, R, x);
		fx.push(f);
		x++;
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
	text("Pessoas não expostas: " + N, 0, 0);
	text("Pessoas infectadas: " + I, 0, 20);
	text("Pessoas recuperadas: " + R, 0, 40);
	text("Mortes: " + M, 200, 40);
	text("Tempo passado " + floor(frameCount / dia), 200, 0);
	text("R0 " + round(R0, 3), 200, 20);
	
	if ( frameCount / dia % 1 == 0) {
		print("infectados no dia " + I);
		print("infectados nesse dia " + (I - Iprev));

		if (Iprev == I) {
			if (finish == 10)
				noLoop();
			finish++;
		}
		Iprev = I;
	}
	pop();
}

class Graph {
	constructor(N, M, I, R, abs) {
		this.t = abs;
		let total = N + M + I + R;
		this.y1 = map(N + I + R, 0, total, 0, 450);
		this.y2 = map(N + I, 0, total, 0, 450);
		this.y3 = map(I, 0, total, 0, 450);
	}

	update() {
		strokeWeight(1);
		push()
		translate(0, 520);
		stroke(0, 0, 0);
		line(this.t, 0, this.t, - 450);
		stroke(25, 255, 25);
		line(this.t, 0, this.t, - this.y1);
		stroke(255, 102, 0);
		line(this.t, 0, this.t, - this.y2);
		stroke(255, 0, 0);
		line(this.t, 0, this.t, - this.y3); 
		pop();
	}
}

class Individuo {
	constructor(x, y, life, inf, im, rep) {
		this.life = life;
		this.rep = rep;
		this.pos = createVector(x, y);
		this.inf = inf;
		this.im = im;		
		this.r = raio;
		this.diametro = 4;
		this.speed = p5.Vector.random2D(-3, 3);
		this.i = 0
	}

	covid(other) {
		if (this.inf && this.life && !other.inf && !other.im && other.life) {
			let d = dist(this.pos.x, this.pos.y,
						 other.pos.x, other.pos.y);
			return (d < this.r + (other.diametro / 2));
		}
	}

	update() {
		this.pos.add(this.speed);
		if (this.pos.x > box - 1 || this.pos.x < 1)
			this.speed.x *= -1;
		if (this.pos.y > box - 1 || this.pos.y < 1)
			this.speed.y *= -1;

    	if (this.inf) {
    		if(random(1) < pM && frameCount * det / dia % 1 == 0) {
    			this.life = false;
    			this.im = false;
    			this.inf = false;
    		}
    		if(this.life && this.i == rec * dia) {
    			this.im = true;
    			this.inf = false;
    		}
    		this.i++;
    	}
	}

	display() {		
		noStroke();
		fill(204, 204, 204);

		if (!this.inf) {
			if (this.im)
				fill(102, 255, 102);
			if (!this.life)
				fill(0);
			ellipse(this.pos.x, this.pos.y, this.diametro);

		} else {
			fill(255, 102, 102);
			ellipse(this.pos.x, this.pos.y, this.diametro);
		}
	}
}
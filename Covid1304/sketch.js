let humans = [];
let first;
let prob = 0.10;
let n = 30; // população é o quadrado desse número
let rec = 600; // frames para a recuperação (20 segundos) 
let Fr = 30

function setup() {
	createCanvas(610, 610);
	setFrameRate(Fr);

	let pop = pow(n, 2); //população
	let w = width / n; //dividir a população pela largura
	let h = height / n; //dividir a população pela altura
	let i0 = ceil(random(pop)); //escolher um individuoiduo aleatório

	for (let i = 0; i < n; i++) { // FOR para cada linha
		for (let j = 0; j < n; j++) { // FOR para cada coluna
			let x = 2 + (i * w);	//posição x
			let y = 2 + (j * h);	// posição y
			//individuoiduo(coordenada x, coordenada y, infectado?, imune?)
			if (humans.length == i0) { //escolher o infectado n°1
				humans.push(new Individuo(x, y, true, false));
			} else { //criar todos os outros
				humans.push(new Individuo(x, y, false, false));
			}
		}
	}
}

function draw() {

	background(51); //background rsrs
	//retangulo / paredes
	rectMode(CENTER);
	noFill();
	strokeWeight(5);
	stroke(102, 102);
	rect(width / 2, height / 2, 605, 605);
	// FOR para infecção
	for (ind of humans) {
		for (other of humans) {
			if (frameCount % Fr == 0) {
				if (ind !== other && ind.covid(other)) {
					if(random(1) < prob) {
						other.inf = true;
					}
				}
			}
		}
		ind.update();
		ind.display();
	}
}

class Individuo {
	constructor(x, y, inf, im) {
		this.pos = createVector(x, y);
		this.inf = inf;
		this.im = im;		
		this.r = 16;
		this.diametro = 4;
		this.speed = p5.Vector.random2D(-1, 1);
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
		if (this.pos.x > width - 1 || this.pos.x < 1) {
			this.speed.x *= -1;
		}
		if (this.pos.y > height - 1 || this.pos.y < 1) {
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

			if (frameCount % 3 == 0) {
				noFill();
				stroke(255, 102, 102, 102);
				ellipse(this.pos.x, this.pos.y, this.r * 2);	
			}
			if (frameCount % 3 == 1) {
				noFill();
				stroke(255, 102, 102 ,102);
				strokeWeight(2);
				ellipse(this.pos.x, this.pos.y, this.r * 1.8);	
			}	
		}
	}
}
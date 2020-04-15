
let boxes = [];
let fG = [];

let x = 1, M = 0, N = 0, I = 0, R = 0, Iprev = 0, Ip = 1, R0 = 0, t = 0, finish = 0; // variaveis do grafico
let uni = true;
let tempo = 1; // tempo para se contaminar 
let Fr = 60; // framerate
let probC = 0.2, probM = 0.01; //probabilidade de contaminação em um dia

let population, b;
let n = 10; // população é o quadrado desse número
let m = 5;
let box = 100;
let l = box / n; //dividir a população em colunas e linhas

let dia = tempo * Fr;
let rec = 14; // frames para a recuperação (14 dias) 
let det = 5; //nível de detalhe (iterações por "dia")
let raio = 6; //raio de contagio

function setup() {
	w = 2 * box * ((1.1 * m) + 0.1);
	h = box * ((1.1 * m) + 0.1);
	b = pow(m, 2);

	createCanvas(w, h);
	setFrameRate(Fr);
	
	pC = pow((1 + probC), (1 / det)) - 1; //ajustando a probabilidade para 
	pM = pow((1 + probM), (1 / (rec * det))) - 1;
	population = pow(n, 2); //população

	for (let i = 0; i < m; i++) {
		for (let j = 0; j < m; j++) {
			let x = (1.1 * i + 0.1) * box;
			let y = (1.1 * j + 0.1) * box;
			let i0 = floor(random(population + 0.99)); //escolher um individuo aleatório
			boxes.push(new Box(x, y, i0));
		}	
	}
}

function draw() {
	background(51); //background rsrs
	stroke(255);
	strokeWeight(1);

	for (bs of boxes) {
		bs.update();
		bs.show();
		bs.updateG(!uni);
	}

	if (uni) {
		push();
		scale(box);
		translate(1.2 * m, 1.15);
		scale(m - 1);
		let infectado = 0, morte = 0, recuperado = 0, 
			normal = 0, Ra = 0;

		if ((frameCount * det / dia) % 1 == 0) {
			for (bs of boxes) {
				for (bs.each of bs.humans) {
					if (bs.each.inf) {
						Ra += bs.each.rep;
						infectado++;
					}
					if (bs.each.im)
						recuperado++;
					if (!bs.each.life)
						morte++;
					if (!bs.each.inf && !bs.each.im && bs.each.life)
						normal++;
				}
			}
			R0 = (1 + Ra / Ip);
			M = morte;
			N = normal;
			I = infectado;
			R = recuperado;	

			Ip = infectado;
			let f = new Graph(N, M, I, R, t);
			fG.push(f);
			t++;
		}

		for (Gr of fG)
			Gr.update();

		noStroke();
		fill(255);
		push();
		scale(0.67 / box);
		textSize(0.067 * box);
		translate(0, - 1.5 * box / m);
		text("Pessoas não expostas: " + N, 0, 0);
		text("Pessoas infectadas: " + I, 0, 0.1 * box);
		text("Pessoas recuperadas: " + R, 0, 0.2 * box);
		text("Mortes: " + M, box, 0.2 * box);
		text("Tempo passado " + floor(frameCount / dia), box, 0);
		text("R0 " + round(R0, 3), box, 0.1 * box);
		pop();
		if (frameCount / dia % 1 == 0) {
	/*
			print("infectados no dia " + I);
			print("infectados nesse dia " + (I - Iprev));
	*/			for(bs of boxes) {
			if (Iprev == I) {
				if (bs.finish < m * 10)
					continue;
				if (bs.finish >= m * 10)
					noLoop();
				bs.finish++;
				}
			}
			Iprev = I;
		}		
		pop();

		push();
		scale(box);
		translate(1.2 * m, 1.15);
		scale(m - 1);
		strokeWeight(1 / (box * m));
		line(0, 1.05, 0, 0);
		//scale(m);
		line(- 0.05, 1, m / (m - 1), 1);
		pop();
	}
}
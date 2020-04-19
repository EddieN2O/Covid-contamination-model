let boxes = [];
let fG = [];
let mor = [];

let x = 1, M = 0, N = 0, I = 0, R = 0, Iprev = 0, Ip = 1, R0 = 0, t = 0, timex = 0, finish = 0; // variaveis do grafico
let uni = true;
let tempo = 1; // tempo para se contaminar 
let Fr = 60; // framerate

let population, b;
let n = 10; // população é o quadrado desse número
let m = 3;
let box = 100;
let l = box / n; //dividir a população em colunas e linhas

var gui;
var probC = 0.2, probCMax = 1, probCMin = 0, probCStep = 0.01, 		//probabilidade de contaminação em um dia
	probM = 0.01, probMMax = 0.5, probMMin = 0, probMStep = 0.005,	//probabilidade de morte em um dia
	detalhe = 5, detalheMax = 10, detalheMin = 1, detalheStep = 1,	//nível de detalhe (iterações por "dia")
	raio = 6, raioMax = box * 0.2, raioMin = 0, raioStep = 0.1,			//raio de contagio
	recuperar = 14, recuperarMax = 21, recuperarMin = 1, recuperarStep = 1;

let dia = tempo * Fr;
let plot;


function setup() {

	w = 2 * box * ((1.1 * m) + 0.1);
	h = box * ((1.1 * m) + 0.1);
	b = pow(m, 2);

	gui = createGui('Variaveis');
	gui.addGlobals('probC', 'probM', 'detalhe', 'raio', 'recuperar');
	gui.setPosition(0.1 * box, h + 0.1 * box);

	createCanvas(w, h);
	setFrameRate(Fr);
	
	pC = pow((1 + probC), (1 / detalhe)) - 1; 			// Ajuste da probabilidade para que
	pM = pow((1 + probM), (1 / (recuperar * detalhe))) - 1;	// cada dia tenha a prob_ definida
	population = pow(n, 2); //população

	for (let i = 0; i < m; i++) {
		for (let j = 0; j < m; j++) {
			let x = (1.1 * i + 0.1) * box;
			let y = (1.1 * j + 0.1) * box;
			let i0 = floor(random(population + 0.99)); //escolher um individuo aleatório
			boxes.push(new Box(x, y, i0));
		}	
	}

	plot = new GPlot(this);
	plot.setPos(box * ((1.1 * m) + 0.15), 0.05 * box);
	plot.setOuterDim(1.1 * m * box, 1.1 * m * box);
	plot.setBgColor(color(51));
	plot.setLineColor(255);
	plot.setFontColor(255);
	plot.setTitleText("Mortes / tempo");
	plot.getXAxis().setAxisLabelText("tempo");
	plot.getYAxis().setAxisLabelText("mortes");

	plot.setPointColor(0, 204);
	plot.getTitle().setFontColor(255);
	plot.getMainLayer().setFontColor(255);
	plot.getMainLayer().setLineColor(255);
	plot.getXAxis().setLineColor(255);
	plot.getXAxis().setFontColor(255);
	plot.getYAxis().setFontColor(255);
	plot.getXAxis().setLineColor(255);
	plot.getYAxis().setLineColor(255);
	plot.getYAxis().setLineColor(255);
}

function draw() {
	background(51); //background rsrs
	stroke(255);
	strokeWeight(1);

	plot.setPointColor(0, 204);
	plot.setFontColor(255);
	plot.setLineColor(255);



	pC = pow((1 + probC), (1 / detalhe)) - 1; //ajustando a probabilidade para 
	pM = pow((1 + probM), (1 / (recuperar * detalhe))) - 1;

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

		if ((frameCount * detalhe / dia) % 1 == 0) {
			for (bs of boxes) {
				for (bs.each of bs.humans) {
					if (bs.each.inf) {
						Ra += bs.each.rep;
						infectado++;
					}
					if (bs.each.im)
						recuperado++;
					if (!bs.each.life) {
						morte++;
					}
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

			if(t / detalhe % 1 == 0) {
				mor[timex] = new GPoint(t, morte);
				timex++
			}
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
	
			print("infectados no dia " + I);
			print("infectados nesse dia " + (I - Iprev));
			for(bs of boxes) {
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

		plot.setPoints(mor)
		plot.defaultDraw();
	}
}
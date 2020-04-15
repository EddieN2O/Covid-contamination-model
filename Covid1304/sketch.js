
let boxes = [];

let x = 1, M = 0, N = 0, I = 0, R = 0, Iprev = 0, R0 = 0; // variaveis do grafico

let tempo = 1; // tempo para se contaminar 
let Fr = 60; // framerate
let probC = 0.2, probM = 0.01; //probabilidade de contaminação em um dia

let population, b;
let n = 20; // população é o quadrado desse número
let m = 2;
let box = 300;
let l = box / n; //dividir a população em colunas e linhas

let dia = tempo * Fr;
let rec = 7; // frames para a recuperação (14 dias) 
let det = 5; //nível de detalhe (iterações por "dia")
let raio = 8; //raio de contagio

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

	for (bs of boxes) {
		bs.update();
		bs.updateG();
		bs.show();
		bs.showG();
		
	}
}
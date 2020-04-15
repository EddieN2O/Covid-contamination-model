class Box {
	constructor(x, y, i0) {
		let humans = [];
		let fx = [];
		let t = 0;
		let finish = 0;

		this.t = t;
		this.f = finish
		this.humans = humans;
		this.fx = fx;

		this.x = x;
		this.y = y;
		this.i0 = i0;

		for (let i = 0; i < n; i++) { // FOR para cada linha
			for (let j = 0; j < n; j++) { // FOR para cada coluna
				let x = 0.5 * l + ((i + random(- 0.3, 0.3)) * l);	//posição x
				let y = 0.5 * l + ((j + random(- 0.3, 0.3)) * l);	// posição y
				//individuo(coordenada x, coordenada y, vivo?, infectado?, imune?, quantos contaminou)
				if (this.humans.length == i0) { //escolher o infectado n°1
					this.humans.push(new Individuo(x, y, true, true, false, 0));
				} else { //criar todos os outros
					this.humans.push(new Individuo(x, y, true, false, false, 0));
				}
			}
		}
		this.fx.push(new Graph(population, 0, 0, 0, 0));
	}

	update() {
		push();
		translate(this.x, this.y);
		for (this.ind of this.humans) {
			for (this.other of this.humans) {
				if (frameCount * det / dia % 1 == 0) {
					if (this.ind !== this.other && this.ind.covid(this.other)) {
						if(random(1) < pC) {
							this.other.inf = true;
							this.ind.rep++;
						}
					}
				}
			}
		this.ind.update();
		}
		pop();
	}

	updateG() {
		let infectado = 0, morte = 0, recuperado = 0, 
			normal = 0, Ra = 0;
		push();
		translate(this.x + box * (1.1 * m + 0.1), this.y);

		if ((frameCount * det / dia) % 1 == 0) {
			for (this.each of this.humans) {
				if (this.each.inf) {
					Ra += this.each.rep;
					infectado++;
				}
				if (this.each.im)
					recuperado++;
				if (!this.each.life)
					morte++;
				if (!this.each.inf && !this.each.im && this.each.life)
					normal++;
			}

			R0 = 1 + Ra / infectado;
			M = morte;
			N = normal;
			I = infectado;
			R = recuperado;	

			let f = new Graph(N, M, I, R, this.t);
			this.fx.push(f);
			this.t++;
		}
		pop();
	}

	show() {
		push();
		translate(this.x, this.y);
		noFill();
		strokeWeight(5);
		stroke(102, 102);
		rect(-5, -5, box + 10);
		for(this.ind of this.humans)
			this.ind.display();
		pop();
	}

	showG() {
		push();
		translate(this.x + box * (1.1 * m + 0.1), this.y);
		for (this.graf of this.fx) {
			this.graf.update();
		}
		stroke(255);
		strokeWeight(1);
		line(0, 1.05 * box, 0, 0);
		line(- 0.05 * box, box, box, box);
/*
		noStroke();
		fill(255);
		text("Pessoas não expostas: " + N, 0, 0);
		text("Pessoas infectadas: " + I, 0, 20);
		text("Pessoas recuperadas: " + R, 0, 40);
		text("Mortes: " + M, 200, 40);
		text("Tempo passado " + floor(frameCount / dia), 200, 0);
		text("R0 " + round(R0, 3), 200, 20);
*/		
		if ( frameCount / dia % 1 == 0) {
/*
			print("infectados no dia " + I);
			print("infectados nesse dia " + (I - Iprev));
*/
			if (Iprev == I) {
				if (this.finish == m * m * 10)
					noLoop();
				this.finish++;
			}
			Iprev = I;
		}
		pop();

	}
}




	
/*
	for (let i = 0; i < n; i++) { // FOR para cada linha
		for (let j = 0; j < n; j++) { // FOR para cada coluna
			let x = 2 + ((i + random(- 0.3, 0.3)) * l);	//posição x
			let y = 2 + ((j + random(- 0.3, 0.3)) * l);	// posição y
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
*/
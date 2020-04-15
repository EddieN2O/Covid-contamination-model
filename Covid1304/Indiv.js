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
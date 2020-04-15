

class Graph {
	constructor(N, M, I, R, abs) {
		this.t = abs / (m * box);
		let total = N + M + I + R;
		this.y1 = map(N + I + R, 0, total, 0, 1);
		this.y2 = map(N + I, 0, total, 0, 1);
		this.y3 = map(I, 0, total, 0, 1);
	}

	update() {
		strokeWeight(1 / m / box);
		push()
		translate(0, 1);
		stroke(0, 0, 0);
		line(this.t, 0, this.t, - 1);
		stroke(25, 255, 25);
		line(this.t, 0, this.t, - this.y1);
		stroke(255, 102, 0);
		line(this.t, 0, this.t, - this.y2);
		stroke(255, 0, 0);
		line(this.t, 0, this.t, - this.y3);
		pop();
	}
}
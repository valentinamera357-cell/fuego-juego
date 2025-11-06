window.onload = function() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Ajustar tamaño dinámico
  canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;
context.imageSmoothingEnabled = true;


  let x = canvas.width / 2 - 50;
  let y = canvas.height / 2 - 50;
  let coinx = Math.random() * (canvas.width - 50);
  let coiny = Math.random() * (canvas.height - 50);
  let t = Date.now();
  let speed = 350;
  let dir = 0;
  let score = 0;

  // === Partículas de fuego ===
  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      r: Math.random() * 4 + 2,
      s: Math.random() * 1 + 0.5,
      o: Math.random() * 0.5 + 0.2
    });
  }

  // Botones de control
  const up = document.getElementById('up');
  const down = document.getElementById('down');
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const press = d => () => dir = d;
  const release = () => dir = 0;

  [up, down, left, right].forEach((btn, i) => {
    const dirCode = [4, 3, 2, 1][i];
    btn.onmousedown = press(dirCode);
    btn.ontouchstart = press(dirCode);
    btn.onmouseup = release;
    btn.ontouchend = release;
  });

  // === Dibujar ===
  function draw() {
    const timePassed = (Date.now() - t) / 1000;
    t = Date.now();

    // Fondo oscuro translúcido
    context.fillStyle = "rgba(0, 0, 0, 0.15)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // --- FUEGO DE FONDO (partículas ascendentes) ---
    for (let p of particles) {
      context.beginPath();
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, ${120 + Math.random() * 100}, 0, ${p.o})`;
      context.fill();
      p.y -= p.s;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
    }

    // Texto de puntuación
    const gradientText = context.createLinearGradient(0, 0, 200, 0);
    gradientText.addColorStop(0, "#fff500");
    gradientText.addColorStop(1, "#ff6600");
    context.font = "30px 'Segoe UI', sans-serif";
    context.fillStyle = gradientText;
    context.fillText("🔥 Score: " + score, 30, 40);

    // Cuadro principal (jugador)
    const playerGrad = context.createRadialGradient(x + 50, y + 50, 10, x + 50, y + 50, 80);
    playerGrad.addColorStop(0, "#00ffff");
    playerGrad.addColorStop(1, "#0033ff");
    context.shadowBlur = 25;
    context.shadowColor = "#00ffff";
    context.fillStyle = playerGrad;
    context.fillRect(x, y, 100, 100);

    // Cuadro objetivo (moneda)
    const coinGrad = context.createLinearGradient(coinx, coiny, coinx + 50, coiny + 50);
    coinGrad.addColorStop(0, "#ff0000");
    coinGrad.addColorStop(1, "#ffcc00");
    context.shadowBlur = 20;
    context.shadowColor = "#ff3300";
    context.fillStyle = coinGrad;
    context.fillRect(coinx, coiny, 50, 50);

    // Movimiento
    if (dir === 1 && x + 100 < canvas.width) x += speed * timePassed;
    else if (dir === 2 && x > 0) x -= speed * timePassed;
    else if (dir === 3 && y + 100 < canvas.height) y += speed * timePassed;
    else if (dir === 4 && y > 0) y -= speed * timePassed;

    // Colisión
    if (coinx <= x + 100 && x <= coinx + 50 && coiny <= y + 100 && y <= coiny + 50) {
      score++;
      // Efecto de “explosión de fuego”
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          context.beginPath();
          context.arc(coinx + 25, coiny + 25, Math.random() * 40, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, 0.5)`;
          context.fill();
        }, i * 15);
      }
      coinx = Math.random() * (canvas.width - 50);
      coiny = Math.random() * (canvas.height - 50);
    }

    requestAnimationFrame(draw);
  }

  draw();
};
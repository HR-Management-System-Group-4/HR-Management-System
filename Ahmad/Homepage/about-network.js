(() => {
  const visual = document.querySelector('.about-visual');
  const canvas = visual?.querySelector('.about-network');
  const context = canvas?.getContext('2d');
  if (!context) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const points = Array.from({ length: 46 }, (_, index) => {
    const y = 1 - (2 * (index + .5)) / 46;
    const ring = Math.sqrt(1 - y * y);
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(angle) * ring, y, z: Math.sin(angle) * ring };
  });
  const edges = [];
  const edgeKeys = new Set();
  points.forEach((point, index) => {
    const nearest = points
      .map((other, otherIndex) => ({ otherIndex, distance: (point.x - other.x) ** 2 + (point.y - other.y) ** 2 + (point.z - other.z) ** 2 }))
      .filter(({ otherIndex }) => otherIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    nearest.forEach(({ otherIndex }) => {
      const key = [index, otherIndex].sort((a, b) => a - b).join('-');
      if (edgeKeys.has(key)) return;
      edgeKeys.add(key);
      edges.push([index, otherIndex]);
    });
  });

  let width = 0;
  let height = 0;
  let yaw = .35;
  let pitch = -.13;
  let pointerX = 0;
  let pointerY = 0;
  let hovering = false;
  let visible = false;
  let frame = 0;
  let lastDraw = 0;

  const rotate = (point) => {
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosX = Math.cos(pitch);
    const sinX = Math.sin(pitch);
    const x = point.x * cosY + point.z * sinY;
    const depth = point.z * cosY - point.x * sinY;
    return {
      x,
      y: point.y * cosX - depth * sinX,
      z: point.y * sinX + depth * cosX
    };
  };

  const draw = (time = 0) => {
    if (!width || !height) return;
    const dark = document.body.classList.contains('dark-mode');
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width * .32, height * .35);
    context.clearRect(0, 0, width, height);

    // The orbit and its satellites sit behind the transparent network sphere.
    context.lineWidth = 1;
    context.strokeStyle = dark ? 'rgba(107, 207, 226, .3)' : 'rgba(49, 142, 184, .25)';
    context.beginPath();
    context.ellipse(cx, cy, radius * 1.48, radius * .5, -.42, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = dark ? 'rgba(123, 159, 224, .26)' : 'rgba(104, 139, 206, .2)';
    context.beginPath();
    context.ellipse(cx, cy, radius * 1.28, radius * .73, .67, 0, Math.PI * 2);
    context.stroke();

    const orbitAngle = -.42;
    for (let index = 0; index < 5; index += 1) {
      const angle = index * Math.PI * 2 / 5 + time * .00016;
      const orbitX = Math.cos(angle) * radius * 1.48;
      const orbitY = Math.sin(angle) * radius * .5;
      const x = cx + orbitX * Math.cos(orbitAngle) - orbitY * Math.sin(orbitAngle);
      const y = cy + orbitX * Math.sin(orbitAngle) + orbitY * Math.cos(orbitAngle);
      context.strokeStyle = dark ? 'rgba(100, 196, 222, .2)' : 'rgba(65, 149, 188, .16)';
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(cx + (x - cx) * .63, cy + (y - cy) * .63);
      context.stroke();
      context.fillStyle = index === 0 ? '#20a9c8' : dark ? '#8bd4e4' : '#7aabd0';
      context.beginPath();
      context.arc(x, y, index === 0 ? 4 : 2.5, 0, Math.PI * 2);
      context.fill();
    }

    const fill = context.createRadialGradient(cx - radius * .36, cy - radius * .44, radius * .04, cx, cy, radius * 1.3);
    if (dark) {
      fill.addColorStop(0, '#366987');
      fill.addColorStop(.58, '#173e59');
      fill.addColorStop(1, '#102b49');
    } else {
      fill.addColorStop(0, '#ffffff');
      fill.addColorStop(.48, '#e6f7fa');
      fill.addColorStop(1, '#9fc6de');
    }
    context.fillStyle = fill;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = dark ? 'rgba(139, 212, 228, .7)' : 'rgba(71, 151, 190, .55)';
    context.lineWidth = 1.3;
    context.stroke();

    const projected = points.map((point) => {
      const rotated = rotate(point);
      const perspective = 1 + rotated.z * .085;
      return { x: cx + rotated.x * radius * perspective, y: cy + rotated.y * radius * perspective, z: rotated.z };
    });
    edges.forEach(([start, end]) => {
      const a = projected[start];
      const b = projected[end];
      const depth = (a.z + b.z) / 2;
      const opacity = .1 + Math.max(0, depth) * .34;
      context.strokeStyle = dark ? `rgba(143, 220, 234, ${opacity})` : `rgba(39, 130, 178, ${opacity})`;
      context.lineWidth = depth > 0 ? 1.05 : .7;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    });
    projected.forEach((point, index) => {
      const front = Math.max(0, point.z);
      const size = (index % 8 === 0 ? 3.4 : 2.1) * (1 + front * .25);
      context.fillStyle = dark
        ? `rgba(170, 235, 241, ${.35 + front * .65})`
        : `rgba(29, 145, 185, ${.28 + front * .72})`;
      context.beginPath();
      context.arc(point.x, point.y, size, 0, Math.PI * 2);
      context.fill();
    });

    // A small glint gives the globe depth without adding a panel background.
    context.fillStyle = dark ? 'rgba(213, 248, 250, .55)' : 'rgba(255, 255, 255, .8)';
    context.beginPath();
    context.arc(cx - radius * .36, cy - radius * .45, radius * .055, 0, Math.PI * 2);
    context.fill();
  };

  const resize = () => {
    const rect = visual.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw(lastDraw);
  };

  const animate = (time) => {
    frame = requestAnimationFrame(animate);
    if (time - lastDraw < 33) return;
    lastDraw = time;
    const targetYaw = hovering ? .35 + pointerX * .75 : .35 + Math.sin(time * .00018) * .16;
    const targetPitch = hovering ? -.13 + pointerY * .52 : -.13 + Math.sin(time * .00023) * .07;
    yaw += (targetYaw - yaw) * .065;
    pitch += (targetPitch - pitch) * .065;
    draw(time);
  };

  const updateAnimation = () => {
    if (reduceMotion || !visible || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    if (!frame) frame = requestAnimationFrame(animate);
  };

  if (!reduceMotion) {
    const followPointer = (event) => {
      const rect = visual.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      hovering = true;
    };
    visual.addEventListener('pointermove', followPointer);
    visual.addEventListener('pointerdown', followPointer);
    visual.addEventListener('pointerleave', () => { hovering = false; });
    visual.addEventListener('pointercancel', () => { hovering = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updateAnimation();
      }, { rootMargin: '100px' }).observe(visual);
    } else {
      visible = true;
    }
    document.addEventListener('visibilitychange', updateAnimation);
  }

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(visual);
  else window.addEventListener('resize', resize);
  new MutationObserver(() => draw(lastDraw)).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  resize();
  updateAnimation();
})();

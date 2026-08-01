"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Shape =
    | "square"
    | "rounded"
    | "circle"
    | "triangle"
    | "diamond"
    | "hexagon"
    | "star";

interface ProximityHoverProps {
    shape?: Shape;
    fill?: "solid" | "stroke";
    strokeWidth?: number;
    particleColor?: string;
    backgroundColor?: string;
    maxSize?: number;
    minSize?: number;
    gap?: number;
    influence?: number;
    style?: CSSProperties;
    /** Optional secondary color for gradient fill effect */
    gradientColor?: string;
    /** Enable rotation animation on particles */
    rotateOnHover?: boolean;
    /** Auto-pulse: particles gently breathe even without mouse */
    autoPulse?: boolean;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

export default function ProximityHover({
    shape = "rounded",
    fill = "solid",
    strokeWidth = 1.5,
    particleColor = "#FFFFFF",
    backgroundColor = "#000000",
    maxSize = 36,
    minSize = 12,
    gap = 4,
    influence = 300,
    style,
    gradientColor,
    rotateOnHover = false,
    autoPulse = false,
}: ProximityHoverProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
    const propsRef = useRef({
        shape, fill, strokeWidth, particleColor, backgroundColor,
        maxSize, minSize, gap, influence, gradientColor, rotateOnHover, autoPulse,
    });
    const currentRef = useRef<Float32Array>(new Float32Array(0));
    const rotationRef = useRef<Float32Array>(new Float32Array(0));
    const pulseRef = useRef(0);

    useEffect(() => {
        propsRef.current = {
            shape, fill, strokeWidth, particleColor, backgroundColor,
            maxSize, minSize, gap, influence, gradientColor, rotateOnHover, autoPulse,
        };
    }, [shape, fill, strokeWidth, particleColor, backgroundColor, maxSize, minSize, gap, influence, gradientColor, rotateOnHover, autoPulse]);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const syncSize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            const s = sizeRef.current;
            if (s.w === w && s.h === h && s.dpr === dpr) return;
            sizeRef.current = { w, h, dpr };
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const buildPath = (cx: number, cy: number, s: number, shp: Shape, rot: number) => {
            const half = s / 2;
            ctx.save();
            ctx.translate(cx, cy);
            if (rot) ctx.rotate(rot);
            ctx.beginPath();
            switch (shp) {
                case "circle":
                    ctx.arc(0, 0, half, 0, Math.PI * 2);
                    break;
                case "rounded": {
                    const r = Math.min(half, s * 0.28);
                    const x = -half;
                    const y = -half;
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + s, y, x + s, y + s, r);
                    ctx.arcTo(x + s, y + s, x, y + s, r);
                    ctx.arcTo(x, y + s, x, y, r);
                    ctx.arcTo(x, y, x + s, y, r);
                    ctx.closePath();
                    break;
                }
                case "triangle":
                    ctx.moveTo(0, -half);
                    ctx.lineTo(half, half);
                    ctx.lineTo(-half, half);
                    ctx.closePath();
                    break;
                case "diamond":
                    ctx.moveTo(0, -half);
                    ctx.lineTo(half, 0);
                    ctx.lineTo(0, half);
                    ctx.lineTo(-half, 0);
                    ctx.closePath();
                    break;
                case "hexagon":
                    for (let k = 0; k < 6; k++) {
                        const a = ((-90 + 60 * k) * Math.PI) / 180;
                        const px = half * Math.cos(a);
                        const py = half * Math.sin(a);
                        if (k === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    break;
                case "star": {
                    const inner = half * 0.5;
                    for (let k = 0; k < 10; k++) {
                        const rad = k % 2 === 0 ? half : inner;
                        const a = ((-90 + 36 * k) * Math.PI) / 180;
                        const px = rad * Math.cos(a);
                        const py = rad * Math.sin(a);
                        if (k === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    break;
                }
                default:
                    ctx.rect(-half, -half, s, s);
            }
            ctx.restore();
        };

        const draw = () => {
            syncSize();
            const p = propsRef.current;
            const { w, h } = sizeRef.current;
            const mouse = mouseRef.current;
            const isStroke = p.fill === "stroke";

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = p.backgroundColor;
            ctx.fillRect(0, 0, w, h);

            const cell = Math.max(1, p.maxSize + p.gap);
            const cols = Math.max(1, Math.floor(w / cell));
            const rows = Math.max(1, Math.floor(h / cell));
            const offX = (w - cols * cell) / 2 + cell / 2;
            const offY = (h - rows * cell) / 2 + cell / 2;
            const count = cols * rows;

            if (currentRef.current.length !== count) {
                currentRef.current = new Float32Array(count).fill(p.minSize);
                rotationRef.current = new Float32Array(count).fill(0);
            }
            const sizes = currentRef.current;
            const rotations = rotationRef.current;

            // Auto pulse
            if (p.autoPulse) {
                pulseRef.current += 0.015;
            }
            const pulseVal = p.autoPulse ? Math.sin(pulseRef.current) * 0.15 : 0;

            ctx.strokeStyle = p.particleColor;
            ctx.fillStyle = p.particleColor;
            ctx.lineJoin = "round";
            ctx.lineWidth = Math.max(0.5, p.strokeWidth);

            const radius = Math.max(1, p.influence);

            // Gradient support
            if (p.gradientColor) {
                const grad = ctx.createLinearGradient(0, 0, w, h);
                grad.addColorStop(0, p.particleColor);
                grad.addColorStop(1, p.gradientColor);
                ctx.fillStyle = grad;
                ctx.strokeStyle = grad;
            }

            for (let j = 0; j < rows; j++) {
                for (let i = 0; i < cols; i++) {
                    const idx = j * cols + i;
                    const cx = offX + i * cell;
                    const cy = offY + j * cell;
                    let infl = 0;
                    if (mouse) {
                        const dx = mouse.x - cx;
                        const dy = mouse.y - cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        infl = clamp(1 - dist / radius, 0, 1);
                    }

                    // Add auto-pulse wave effect
                    if (p.autoPulse) {
                        const waveInfl = Math.sin(pulseRef.current + (i + j) * 0.3) * 0.2;
                        infl = clamp(infl + Math.abs(waveInfl) * 0.3, 0, 1);
                    }

                    const target = lerp(p.minSize, p.maxSize, infl + pulseVal * infl);
                    const cur = lerp(sizes[idx] || p.minSize, target, 0.15);
                    sizes[idx] = cur;

                    // Rotation
                    if (p.rotateOnHover) {
                        const rotTarget = infl * Math.PI;
                        rotations[idx] = lerp(rotations[idx] || 0, rotTarget, 0.1);
                    }

                    if (cur <= 0.2) continue;
                    buildPath(cx, cy, cur, p.shape, rotations[idx] || 0);
                    if (isStroke) ctx.stroke();
                    else ctx.fill();
                }
            }
            rafRef.current = requestAnimationFrame(draw);
        };

        const onMove = (e: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onLeave = () => { mouseRef.current = null; };

        syncSize();
        const ro = new ResizeObserver(syncSize);
        ro.observe(container);
        container.addEventListener("pointermove", onMove);
        container.addEventListener("pointerleave", onLeave);
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            ro.disconnect();
            container.removeEventListener("pointermove", onMove);
            container.removeEventListener("pointerleave", onLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor,
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    );
}

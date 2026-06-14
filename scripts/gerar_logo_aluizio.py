#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Recria a logo "Aluizio Pires · Educação" (emblema de livro aberto em traço fino
+ wordmark) com Pillow. Renderiza em supersampling e reduz para anti-aliasing.

Gera, em --outdir:
  aluizio-logo-black.png   logo completa, preta, fundo transparente
  aluizio-logo-white.png   logo completa, branca, fundo transparente
  aluizio-mark-black.png   só o emblema (livro), preto
  aluizio-mark-white.png   só o emblema (livro), branco
"""
import os, math, argparse
from PIL import Image, ImageDraw, ImageFont

FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts", "Questrial-Regular.ttf")
if not os.path.exists(FONT):  # fallback p/ download em /tmp
    FONT = "/tmp/fonts/Questrial-Regular.ttf"
SS = 3  # supersampling

# ---------------------------------------------------------------- geometria
def qbezier(p0, p1, p2, n=26):
    pts = []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
        pts.append((x, y))
    return pts

def scale_pts(pts, s, ox, oy):
    return [(x * s + ox, y * s + oy) for (x, y) in pts]

def stroke(draw, pts, width, ink):
    draw.line(pts, fill=ink, width=width, joint="curve")
    r = width / 2.0
    for (x, y) in (pts[0], pts[-1]):  # round caps
        draw.ellipse([x - r, y - r, x + r, y + r], fill=ink)

def draw_book(draw, s, ox, oy, ink, w):
    """Livro aberto, desenhado num sistema base ~ largura 240, altura 160."""
    cx = 120.0
    # ---- página esquerda (contorno) ----
    P1 = (cx, 40);  P2 = (10, 26);  P3 = (10, 128); P4 = (cx, 150)
    top    = qbezier(P1, (66, 18),  P2)   # borda superior (bojo p/ cima)
    outer  = [P2, P3]                      # borda externa
    bottom = qbezier(P3, (62, 150), P4)    # borda inferior (bojo p/ baixo)
    spine  = [P4, P1]                      # lombada (centro)
    for seg in (top, outer, bottom, spine):
        stroke(draw, scale_pts(seg, s, ox, oy), w, ink)
    # linhas de texto na página esquerda
    for (yi, yo) in ((60, 54), (80, 74), (100, 94)):
        stroke(draw, scale_pts([(102, yi), (32, yo)], s, ox, oy), max(2, int(w * 0.7)), ink)
    # ---- página direita (espelho em torno de cx) ----
    def mir(pts): return [(240 - x, y) for (x, y) in pts]
    for seg in (top, outer, bottom):
        stroke(draw, scale_pts(mir(seg), s, ox, oy), w, ink)
    for (yi, yo) in ((60, 54), (80, 74), (100, 94)):
        stroke(draw, scale_pts(mir([(102, yi), (32, yo)]), s, ox, oy), max(2, int(w * 0.7)), ink)

# ---------------------------------------------------------------- texto
def text_tracked(draw, text, font, tracking, cx, y, ink):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2.0
    for ch, wch in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=ink)
        x += wch + tracking

# ---------------------------------------------------------------- render
def render(ink, mark_only=False):
    if mark_only:
        W, H = 300, 210
    else:
        W, H = 760, 680
    img = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w_icon = int(4.2 * SS)
    if mark_only:
        draw_book(d, SS, (W / 2 - 120) * SS, 30 * SS, ink, w_icon)
    else:
        draw_book(d, SS, (W / 2 - 120) * SS, 56 * SS, ink, w_icon)
        f_name = ImageFont.truetype(FONT, int(96 * SS))
        f_sub  = ImageFont.truetype(FONT, int(38 * SS))
        text_tracked(d, "Aluizio Pires", f_name, 6 * SS, (W / 2) * SS, 270 * SS, ink)
        text_tracked(d, "Educação", f_sub, 14 * SS, (W / 2) * SS, 410 * SS, ink)
    return img.resize((W, H), Image.LANCZOS)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--outdir", default="brand")
    args = ap.parse_args()
    os.makedirs(args.outdir, exist_ok=True)
    BLACK = (24, 26, 32, 255)
    WHITE = (255, 255, 255, 255)
    outs = {
        "aluizio-logo-black.png": render(BLACK, False),
        "aluizio-logo-white.png": render(WHITE, False),
        "aluizio-mark-black.png": render(BLACK, True),
        "aluizio-mark-white.png": render(WHITE, True),
    }
    for name, im in outs.items():
        p = os.path.join(args.outdir, name)
        im.save(p)
        print("salvo:", p, im.size)

if __name__ == "__main__":
    main()

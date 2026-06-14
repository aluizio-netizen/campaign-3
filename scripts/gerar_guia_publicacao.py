#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera um guia visual ilustrado (PNG) de como publicar o site no Netlify
e apontar o subdomínio onu.aluizio.education. Marca Aluizio Pires Educação."""
import os
from PIL import Image, ImageDraw, ImageFont

SS = 2
W = 1080
NAVY=(27,42,74); BLUE=(46,90,172); GOLD=(201,162,39); INK=(42,47,58)
GRAY=(92,102,120); LIGHT=(238,242,250); LIGHT2=(247,249,252); WHITE=(255,255,255)
GREEN=(30,142,90)

BASE = os.path.dirname(os.path.abspath(__file__))
QF = os.path.join(BASE, "fonts", "Questrial-Regular.ttf")
MARK = os.path.join(BASE, "..", "brand", "aluizio-mark-white.png")

_fc = {}
def font(sz):
    sz = int(sz * SS)
    if sz not in _fc: _fc[sz] = ImageFont.truetype(QF, sz)
    return _fc[sz]

def S(v): return int(v * SS)

class Canvas:
    def __init__(self, w, h):
        self.img = Image.new("RGB", (S(w), S(h)), WHITE)
        self.d = ImageDraw.Draw(self.img)
    def rrect(self, box, r, fill=None, outline=None, width=1):
        self.d.rounded_rectangle([S(box[0]),S(box[1]),S(box[2]),S(box[3])],
                                 radius=S(r), fill=fill, outline=outline, width=S(width))
    def rect(self, box, fill):
        self.d.rectangle([S(box[0]),S(box[1]),S(box[2]),S(box[3])], fill=fill)
    def text(self, xy, s, sz, fill=INK, anchor="la", track=0):
        f = font(sz)
        if track == 0:
            self.d.text((S(xy[0]), S(xy[1])), s, font=f, fill=fill, anchor=anchor)
        else:
            x = S(xy[0])
            for ch in s:
                self.d.text((x, S(xy[1])), ch, font=f, fill=fill, anchor="la")
                x += self.d.textlength(ch, font=f) + S(track)
    def textwidth(self, s, sz, track=0):
        f = font(sz); w = sum(self.d.textlength(c, font=f) for c in s)
        return (w + S(track)*(len(s)-1)) / SS
    def paste(self, im, xy, h):
        ratio = im.width / im.height
        im2 = im.resize((int(S(h)*ratio), S(h)), Image.LANCZOS)
        self.img.paste(im2, (S(xy[0]), S(xy[1])), im2 if im2.mode=="RGBA" else None)

def chip(c, x, y, label, sz=17, fill=LIGHT, fg=NAVY, pad=12):
    w = c.textwidth(label, sz) + pad*2
    c.rrect([x, y, x+w, y+sz+pad], (sz+pad)/2, fill=fill)
    c.text((x+pad, y+pad/2-1), label, sz, fill=fg)
    return w

def field(c, x, y, w, label, value, sz=17):
    c.text((x, y), label, 13, fill=GRAY)
    c.rrect([x, y+18, x+w, y+18+34], 8, fill=WHITE, outline=(208,216,230), width=2)
    c.text((x+12, y+18+8), value, sz, fill=INK)
    return 18+34

def main():
    H = 1500
    c = Canvas(W, H)
    # fundo geral
    c.rect([0,0,W,H], LIGHT2)

    # ---- header navy ----
    c.rect([0,0,W,150], NAVY)
    try:
        c.paste(Image.open(MARK).convert("RGBA"), (60, 40), 70)
    except Exception:
        pass
    c.text((150, 46), "Publicar o site", 34, fill=WHITE)
    c.text((150, 96), "onu.aluizio.education  ·  guia rápido (Netlify)", 18, fill=(199,208,224))
    c.rect([0,150,W,156], GOLD)

    # ---- passos ----
    x0, x1 = 50, W-50
    y = 195
    steps = [
        ("1","Importar do GitHub",
         ["No app.netlify.com, clique em Add new site →","Import an existing project → Deploy with GitHub","e autorize o acesso ao seu GitHub."],
         "btn", "Import an existing project"),
        ("2","Escolher o repositório",
         ["Na lista de repositórios, selecione:"],
         "repo", "aluizio-netizen / campaign-3"),
        ("3","Conferir o build (já vem pronto)",
         ["As configurações vêm do arquivo netlify.toml.","Não precisa mudar nada — só conferir."],
         "build", None),
        ("4","Fazer o deploy",
         ["Clique em Deploy. Em ~1 min sai a URL de teste:"],
         "deploy", "https://SEU-SITE.netlify.app"),
        ("5","Adicionar o domínio",
         ["Domain management → Add a domain →","digite o subdomínio e confirme:"],
         "domain", "onu.aluizio.education"),
        ("6","Apontar o DNS (no seu provedor)",
         ["No DNS de aluizio.education, crie 1 registro CNAME","com o ALVO que o Netlify mostrar na tela:"],
         "dns", None),
    ]
    card_h = {"btn":150,"repo":150,"build":210,"deploy":150,"domain":150,"dns":190}
    for num, title, lines, kind, val in steps:
        h = card_h[kind]
        c.rrect([x0, y, x1, y+h], 14, fill=WHITE, outline=(225,231,242), width=2)
        # badge
        bx, by = x0+24, y+24
        c.d.ellipse([S(bx),S(by),S(bx+34),S(by+34)], fill=GOLD)
        c.text((bx+17, by+17), num, 19, fill=NAVY, anchor="mm")
        tx = x0+78
        c.text((tx, y+22), title, 24, fill=NAVY)
        ly = y+58
        for ln in lines:
            c.text((tx, ly), ln, 16.5, fill=GRAY); ly += 24
        # mock à direita / abaixo
        if kind == "btn":
            bw = c.textwidth(val, 16)+40
            c.rrect([x1-24-bw, y+50, x1-24, y+50+40], 8, fill=GREEN)
            c.text((x1-24-bw/2, y+50+20), val, 16, fill=WHITE, anchor="mm")
        elif kind == "repo":
            c.rrect([tx, ly+2, x1-24, ly+40], 8, fill=LIGHT, outline=(208,216,230), width=2)
            c.d.ellipse([S(tx+12),S(ly+13),S(tx+26),S(ly+27)], outline=NAVY, width=S(2))
            c.text((tx+38, ly+12), val, 17, fill=NAVY)
        elif kind == "build":
            colw = (x1-24-tx-20)/2
            field(c, tx, ly+4, colw, "Branch to deploy", "main")
            field(c, tx+colw+20, ly+4, colw, "Publish directory", "onu-site")
            c.text((tx, ly+62), "Build command:  (vazio)", 15, fill=GRAY)
            chip(c, tx+ c.textwidth("Build command:  (vazio)",15)+24, ly+58, "vem do netlify.toml", 13, fill=(232,240,251), fg=BLUE)
        elif kind == "deploy":
            bw = c.textwidth(val, 16)+30
            c.rrect([tx, ly+2, tx+bw, ly+2+36], 8, fill=(232,240,251), outline=(190,206,236), width=2)
            c.text((tx+15, ly+2+10), val, 16, fill=BLUE)
        elif kind == "domain":
            c.rrect([tx, ly+2, tx+c.textwidth(val,18)+90, ly+2+38], 8, fill=WHITE, outline=(208,216,230), width=2)
            c.text((tx+14, ly+2+10), val, 18, fill=INK)
            c.rrect([tx+c.textwidth(val,18)+44, ly+6, tx+c.textwidth(val,18)+86, ly+2+34], 7, fill=NAVY)
            c.text((tx+c.textwidth(val,18)+65, ly+2+18), "Add", 13, fill=WHITE, anchor="mm")
        elif kind == "dns":
            ty = ly+4
            c.rrect([tx, ty, x1-24, ty+58], 10, fill=(251,244,221), outline=(214,182,80), width=2)
            cols = [("Tipo","CNAME"),("Nome","onu"),("Valor","<alvo do Netlify>")]
            cw = (x1-24-tx)/3
            for i,(k,v) in enumerate(cols):
                cx = tx+ i*cw + 16
                c.text((cx, ty+10), k.upper(), 12, fill=(154,123,22))
                c.text((cx, ty+28), v, 17, fill=INK)
        y += h + 18

    # rodapé
    c.text((W/2, y+6), "HTTPS é emitido automaticamente após o DNS propagar (minutos a poucas horas).",
           15, fill=GRAY, anchor="ma")
    c.text((W/2, y+30), "Dúvida em alguma tela? Me mande um print que eu indico o clique exato.",
           15, fill=BLUE, anchor="ma")

    out = "/tmp/guia_publicacao_onu.png"
    # recorta altura usada
    final = c.img.crop((0,0,S(W),S(y+62)))
    final.save(out)
    print("salvo:", out, final.size)

if __name__ == "__main__":
    main()

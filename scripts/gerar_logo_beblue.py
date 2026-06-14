#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recria a logo 'BeBlue — Personal English' (wordmark Be vermelho + Blue azul,
spark vermelho e tagline cinza) com Pillow. Fundo transparente, full color."""
import os
from PIL import Image, ImageDraw, ImageFont

SS=3
RED=(226,34,26,255); BLUE=(37,64,142,255); GRAY=(94,94,94,255)
_FD=os.path.join(os.path.dirname(os.path.abspath(__file__)),"fonts")
def _font(name):
    p=os.path.join(_FD,name)
    return p if os.path.exists(p) else os.path.join("/tmp/fonts",name)
F_BLACK=_font("Poppins-BlackItalic.ttf")
F_BOLD=_font("Poppins-BoldItalic.ttf")
def S(v): return int(v*SS)

def stroke(d, p0, p1, w, color):
    d.line([p0,p1], fill=color, width=w, joint="curve")
    r=w/2
    for (x,y) in (p0,p1):
        d.ellipse([x-r,y-r,x+r,y+r], fill=color)

def render():
    W,H=1180,430
    img=Image.new("RGBA",(S(W),S(H)),(0,0,0,0))
    d=ImageDraw.Draw(img)
    fw=ImageFont.truetype(F_BLACK, S(168))
    # wordmark: "Be" (red) + "Blue" (blue)
    x=S(40); ytop=S(40)
    be="Be"; blue="Blue"
    wbe=d.textlength(be,font=fw)
    d.text((x,ytop), be, font=fw, fill=RED)
    d.text((x+wbe,ytop), blue, font=fw, fill=BLUE)
    wword=wbe+d.textlength(blue,font=fw)
    word_right=x+wword
    # spark (3 raios vermelhos) à direita, parte superior
    ox=word_right+S(18); oy=ytop+S(58)
    sw=S(26)
    stroke(d,(ox+S(6),oy),         (ox+S(120),oy-S(54)), sw, RED)   # superior (longo)
    stroke(d,(ox+S(2),oy+S(40)),   (ox+S(104),oy+S(20)), sw, RED)   # meio
    stroke(d,(ox+S(8),oy+S(78)),   (ox+S(96),oy+S(104)), sw, RED)   # inferior (desce)
    # tagline "PERSONAL ENGLISH" cinza, espaçada, centralizada sob o wordmark
    ft=ImageFont.truetype(F_BOLD, S(46))
    tag="PERSONAL ENGLISH"; track=S(8)
    widths=[d.textlength(c,font=ft) for c in tag]
    total=sum(widths)+track*(len(tag)-1)
    tx=x+(wword-total)/2; ty=ytop+S(196)
    cx=tx
    for ch,wch in zip(tag,widths):
        d.text((cx,ty), ch, font=ft, fill=GRAY); cx+=wch+track
    # recorta com margem
    bbox=img.getbbox()
    pad=S(16)
    img=img.crop((max(0,bbox[0]-pad),max(0,bbox[1]-pad),min(S(W),bbox[2]+pad),min(S(H),bbox[3]+pad)))
    return img.resize((img.width//SS, img.height//SS), Image.LANCZOS)

if __name__=="__main__":
    out=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","brand","beblue-color.png")
    out=os.path.normpath(out)
    im=render(); im.save(out); print("salvo:", out, im.size)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Guia visual SIMPLES (PNG) de como criar o registro CNAME 'onu' na Cloudflare."""
import os
from PIL import Image, ImageDraw, ImageFont

SS=2; W=1080
NAVY=(27,42,74); BLUE=(46,90,172); GOLD=(201,162,39); INK=(42,47,58)
GRAY=(92,102,120); LIGHT=(238,242,250); LIGHT2=(247,249,252); WHITE=(255,255,255)
GREEN=(30,142,90); ORANGE=(232,146,40); REDBG=(252,238,238); RED=(190,55,55)
BASE=os.path.dirname(os.path.abspath(__file__))
QF=os.path.join(BASE,"fonts","Questrial-Regular.ttf")
MARK=os.path.join(BASE,"..","brand","aluizio-mark-white.png")
_fc={}
def font(sz):
    sz=int(sz*SS)
    if sz not in _fc:_fc[sz]=ImageFont.truetype(QF,sz)
    return _fc[sz]
def S(v):return int(v*SS)
class C:
    def __init__(s,w,h):s.img=Image.new("RGB",(S(w),S(h)),WHITE);s.d=ImageDraw.Draw(s.img)
    def rr(s,b,r,fill=None,outline=None,width=1):
        s.d.rounded_rectangle([S(b[0]),S(b[1]),S(b[2]),S(b[3])],radius=S(r),fill=fill,outline=outline,width=S(width))
    def rect(s,b,fill):s.d.rectangle([S(b[0]),S(b[1]),S(b[2]),S(b[3])],fill=fill)
    def t(s,xy,txt,sz,fill=INK,anchor="la"):s.d.text((S(xy[0]),S(xy[1])),txt,font=font(sz),fill=fill,anchor=anchor)
    def tw(s,txt,sz):return sum(s.d.textlength(c,font=font(sz)) for c in txt)/SS
    def paste(s,im,xy,h):
        r=im.width/im.height;im2=im.resize((int(S(h)*r),S(h)),Image.LANCZOS)
        s.img.paste(im2,(S(xy[0]),S(xy[1])),im2 if im2.mode=="RGBA" else None)

def main():
    H=1180; c=C(W,H); c.rect([0,0,W,H],LIGHT2)
    # header
    c.rect([0,0,W,150],NAVY)
    try:c.paste(Image.open(MARK).convert("RGBA"),(60,40),70)
    except Exception:pass
    c.t((150,44),"Criar o endereço onu.aluizio.education",26,fill=WHITE)
    c.t((150,92),"1 linha no painel da Cloudflare  ·  guia simples",18,fill=(199,208,224))
    c.rect([0,150,W,156],GOLD)

    x0,x1=50,W-50
    # intro
    c.t((x0,185),"O que é isto, em 1 frase:",20,fill=NAVY)
    c.t((x0,218),"Você vai dizer ao seu domínio que “onu” deve abrir o seu novo site.",17,fill=GRAY)
    c.t((x0,244),"Esse ajuste fica na Cloudflare. É só preencher e salvar 1 formulário.",17,fill=GRAY)

    # passo A
    c.t((x0,290),"Passo 1  —  No Netlify",19,fill=BLUE)
    c.t((x0,318),"Domain management → Add a domain → digite  onu.aluizio.education",16,fill=GRAY)
    c.t((x0,342),"O Netlify mostra um endereço (algo como  seu-site.netlify.app).  Copie.",16,fill=GRAY)

    # passo B — formulario cloudflare
    c.t((x0,388),"Passo 2  —  Na Cloudflare (dash.cloudflare.com → aluizio.education → DNS)",19,fill=BLUE)
    fy=420; fh=470
    c.rr([x0,fy,x1,fy+fh],16,fill=WHITE,outline=(214,182,80),width=3)
    c.t((x0+30,fy+24),"Add record  —  preencha assim:",18,fill=NAVY)
    iw=x1-x0-60; ix=x0+30; yy=fy+70
    def field(label,value,hint=None,vcolor=INK):
        nonlocal yy
        c.t((ix,yy),label,14,fill=GRAY)
        c.rr([ix,yy+22,ix+iw,yy+22+44],9,fill=LIGHT2,outline=(208,216,230),width=2)
        c.t((ix+16,yy+22+12),value,19,fill=vcolor)
        if hint:c.t((ix+iw-c.tw(hint,13)-16,yy+22+15),hint,13,fill=BLUE)
        yy+=22+44+22
    field("Type (tipo)","CNAME")
    field("Name (nome)","onu","só isto, não o domínio inteiro")
    field("Target (aponta para)","cole o endereço do Netlify  (ex.: seu-site.netlify.app)",vcolor=GRAY)
    # proxy toggle
    c.t((ix,yy),"Proxy status (MUITO IMPORTANTE)",14,fill=GRAY)
    c.rr([ix,yy+22,ix+iw,yy+22+50],9,fill=REDBG,outline=(220,150,150),width=2)
    # nuvem cinza selecionada
    c.d.ellipse([S(ix+18),S(yy+34),S(ix+44),S(yy+52)],fill=(120,128,140))
    c.t((ix+54,yy+22+15),"DNS only  (nuvem CINZA)  ✓   —   NÃO deixe laranja!",16,fill=RED)
    yy+=22+50+18
    # botao save
    c.rr([ix,yy,ix+120,yy+42],9,fill=GREEN)
    c.t((ix+60,yy+21),"Save",16,fill=WHITE,anchor="mm")

    # rodape
    fy2=fy+fh+28
    c.rr([x0,fy2,x1,fy2+70],12,fill=LIGHT)
    c.t((x0+24,fy2+16),"Passo 3  —  volte ao Netlify e espere.",17,fill=NAVY)
    c.t((x0+24,fy2+42),"Em alguns minutos o cadeado (HTTPS) aparece sozinho e o site abre em onu.aluizio.education.",15,fill=GRAY)

    c.t((W/2,fy2+92),"Travou em alguma tela? Tira um print e me manda — eu te digo onde clicar.",15,fill=BLUE,anchor="ma")
    out="/tmp/guia_dns_cloudflare.png"
    c.img.crop((0,0,S(W),S(fy2+120))).save(out)
    print("salvo:",out)

if __name__=="__main__":
    main()

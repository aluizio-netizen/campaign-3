#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Guia visual (PNG) para publicar o site INGLÊS em unitednations.aluizio.education.
Destaque para 'Base directory = un-site'. Marca Aluizio Pires Education."""
import os
from PIL import Image, ImageDraw, ImageFont
SS=2; W=1080
NAVY=(27,42,74); BLUE=(46,90,172); GOLD=(201,162,39); INK=(42,47,58)
GRAY=(92,102,120); LIGHT=(238,242,250); LIGHT2=(247,249,252); WHITE=(255,255,255)
GREEN=(30,142,90); REDBG=(252,238,238); RED=(190,55,55); WARN=(251,244,221); WARNL=(214,182,80)
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
    def __init__(s,w,h):s.img=Image.new("RGB",(S(w),S(h)),LIGHT2);s.d=ImageDraw.Draw(s.img)
    def rr(s,b,r,fill=None,outline=None,width=1):
        s.d.rounded_rectangle([S(b[0]),S(b[1]),S(b[2]),S(b[3])],radius=S(r),fill=fill,outline=outline,width=S(width))
    def rect(s,b,fill):s.d.rectangle([S(b[0]),S(b[1]),S(b[2]),S(b[3])],fill=fill)
    def t(s,xy,txt,sz,fill=INK,anchor="la"):s.d.text((S(xy[0]),S(xy[1])),txt,font=font(sz),fill=fill,anchor=anchor)
    def tw(s,txt,sz):return sum(s.d.textlength(c,font=font(sz)) for c in txt)/SS
    def paste(s,im,xy,h):
        r=im.width/im.height;im2=im.resize((int(S(h)*r),S(h)),Image.LANCZOS)
        s.img.paste(im2,(S(xy[0]),S(xy[1])),im2 if im2.mode=="RGBA" else None)

def field(c,x,y,w,label,value,vcolor=INK,box=(208,216,230),bg=LIGHT2):
    c.t((x,y),label,13,fill=GRAY)
    c.rr([x,y+20,x+w,y+20+40],8,fill=bg,outline=box,width=2)
    c.t((x+14,y+20+9),value,18,fill=vcolor)

def main():
    H=1320;c=C(W,H)
    c.rect([0,0,W,150],NAVY)
    try:c.paste(Image.open(MARK).convert("RGBA"),(60,40),70)
    except Exception:pass
    c.t((150,44),"Publish the English site",26,fill=WHITE)
    c.t((150,92),"unitednations.aluizio.education  ·  step by step (Netlify)",18,fill=(199,208,224))
    c.rect([0,150,W,156],GOLD)
    x0,x1=50,W-50;y=185
    def card(h):
        nonlocal y
        c.rr([x0,y,x1,y+h],14,fill=WHITE,outline=(225,231,242),width=2);return y
    def badge(num,yy):
        c.d.ellipse([S(x0+24),S(yy+22),S(x0+24+34),S(yy+22+34)],fill=GOLD)
        c.t((x0+24+17,yy+22+17),num,19,fill=NAVY,anchor="mm")

    # 1
    card(120);badge("1",y)
    c.t((x0+78,y+22),"New site from GitHub",24,fill=NAVY)
    c.t((x0+78,y+58),"Netlify → Add new site → Import an existing project → GitHub →",16,fill=GRAY)
    c.t((x0+78,y+82),"choose the repo  aluizio-netizen / campaign-3.   Branch:  main",16,fill=GRAY)
    y+=120+16
    # 2 — DESTAQUE base directory
    card(200);badge("2",y)
    c.t((x0+78,y+22),"Set the Base directory  ← the key step!",24,fill=NAVY)
    c.t((x0+78,y+58),"In Build settings, type the base directory exactly as:",16,fill=GRAY)
    # warning box
    c.rr([x0+78,y+86,x1-30,y+86+50],10,fill=WARN,outline=WARNL,width=3)
    c.t((x0+96,y+86+13),"Base directory:",15,fill=(154,123,22))
    c.rr([x0+96+c.tw('Base directory:',15)+16,y+86+9,x0+96+c.tw('Base directory:',15)+16+180,y+86+41],7,fill=WHITE,outline=WARNL,width=2)
    c.t((x0+96+c.tw('Base directory:',15)+30,y+86+16),"un-site",19,fill=RED)
    c.t((x0+78,y+150),"Build command:  (leave empty).   Without this, Netlify would publish the",14.5,fill=GRAY)
    c.t((x0+78,y+172),"Portuguese site (onu) or fail trying to build the Next.js app.",14.5,fill=GRAY)
    y+=200+16
    # 3 deploy
    card(110);badge("3",y)
    c.t((x0+78,y+22),"Deploy",24,fill=NAVY)
    c.t((x0+78,y+58),"Click Deploy. In ~1 min you get a test URL:",16,fill=GRAY)
    bw=c.tw("https://YOUR-SITE.netlify.app",15)+30
    c.rr([x0+78+c.tw('Click Deploy. In ~1 min you get a test URL:',16)+16,y+52,x0+78+c.tw('Click Deploy. In ~1 min you get a test URL:',16)+16+bw,y+52+30],8,fill=(232,240,251),outline=(190,206,236),width=2)
    c.t((x0+78+c.tw('Click Deploy. In ~1 min you get a test URL:',16)+30,y+58),"https://YOUR-SITE.netlify.app",15,fill=BLUE)
    y+=110+16
    # 4 domain
    card(110);badge("4",y)
    c.t((x0+78,y+22),"Add the domain",24,fill=NAVY)
    c.t((x0+78,y+58),"Domain management → Add a domain →  unitednations.aluizio.education",16,fill=GRAY)
    y+=110+16
    # 5 dns
    h=150;card(h);badge("5",y)
    c.t((x0+78,y+22),"Point the DNS (Cloudflare)",24,fill=NAVY)
    c.t((x0+78,y+56),"aluizio.education → DNS → Add record:",15,fill=GRAY)
    ty=y+84;tx=x0+78
    c.rr([tx,ty,x1-30,ty+50],10,fill=WARN,outline=WARNL,width=2)
    cols=[("Type","CNAME"),("Name","unitednations"),("Target","<your .netlify.app>"),("Proxy","DNS only")]
    cw=(x1-30-tx)/4
    for i,(k,v) in enumerate(cols):
        cx=tx+i*cw+14
        c.t((cx,ty+9),k.upper(),11,fill=(154,123,22))
        c.t((cx,ty+26),v,15,fill=(RED if k=="Proxy" else INK))
    y+=h+14
    c.t((W/2,y+4),"Grey cloud (DNS only) — never orange. HTTPS is issued automatically after DNS propagates.",13.5,fill=GRAY,anchor="ma")
    c.t((W/2,y+26),"Different screen? Send a screenshot and I'll point to the exact click.",13.5,fill=BLUE,anchor="ma")
    out="/tmp/guia_un_deploy.png"
    c.img.crop((0,0,S(W),S(y+52))).save(out);print("salvo:",out)

if __name__=="__main__":main()

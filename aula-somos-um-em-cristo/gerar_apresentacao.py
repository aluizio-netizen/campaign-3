# -*- coding: utf-8 -*-
"""
Gera a apresentacao em PowerPoint para a aula "Somos um em Cristo"
Escola Biblica Dominical - Segunda Igreja Batista de Campo Grande-MS
Base: comentario de Romanos 11-12 (Caps. 18 e 19 do material anexo).
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ---------------- Paleta ----------------
AZUL      = RGBColor(0x1F, 0x3A, 0x5F)   # azul profundo
AZUL_ESC  = RGBColor(0x16, 0x2A, 0x45)
DOURADO   = RGBColor(0xC9, 0xA2, 0x27)   # dourado
CREME     = RGBColor(0xF6, 0xF2, 0xE8)   # creme claro
BRANCO    = RGBColor(0xFF, 0xFF, 0xFF)
CINZA_TX  = RGBColor(0x2B, 0x2B, 0x2B)
TEAL      = RGBColor(0x2E, 0x6E, 0x6A)

FONTE_T = "Georgia"        # titulos
FONTE_C = "Calibri"        # corpo

EMU_W = Inches(13.333)
EMU_H = Inches(7.5)

prs = Presentation()
prs.slide_width = EMU_W
prs.slide_height = EMU_H
BLANK = prs.slide_layouts[6]


def add_slide(bg=CREME):
    s = prs.slides.add_slide(BLANK)
    r = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, EMU_W, EMU_H)
    r.fill.solid(); r.fill.fore_color.rgb = bg
    r.line.fill.background()
    r.shadow.inherit = False
    # manda o retangulo para o fundo
    sp = r._element
    sp.getparent().remove(sp)
    s.shapes._spTree.insert(2, sp)
    return s


def faixa(s, top, height, color):
    r = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, top, EMU_W, height)
    r.fill.solid(); r.fill.fore_color.rgb = color
    r.line.fill.background(); r.shadow.inherit = False
    return r


def caixa(s, left, top, width, height):
    tb = s.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    return tb, tf


def setp(p, text, size, color, bold=False, font=FONTE_C, italic=False,
         align=PP_ALIGN.LEFT, space_after=8, space_before=0):
    p.text = text
    p.alignment = align
    p.space_after = Pt(space_after)
    p.space_before = Pt(space_before)
    r = p.runs[0]
    r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
    r.font.name = font; r.font.color.rgb = color
    return p


def bullet(tf, text, size=20, color=CINZA_TX, bold=False, level=0,
           first=False, space_after=10, marker="• ", italic=False):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.text = (marker + text) if marker else text
    p.level = level
    p.space_after = Pt(space_after)
    r = p.runs[0]
    r.font.size = Pt(size); r.font.bold = bold; r.font.name = FONTE_C
    r.font.color.rgb = color; r.font.italic = italic
    return p


def rodape(s, num, dark=False):
    cor = CREME if dark else AZUL
    tb, tf = caixa(s, Inches(0.4), Inches(7.0), Inches(9), Inches(0.4))
    setp(tf.paragraphs[0], "Somos um em Cristo  ·  EBD – 2ª IB Campo Grande-MS",
         11, cor, font=FONTE_C)
    tb2, tf2 = caixa(s, Inches(12.4), Inches(7.0), Inches(0.8), Inches(0.4))
    setp(tf2.paragraphs[0], str(num), 11, cor, align=PP_ALIGN.RIGHT)


def titulo_secao(s, kicker, titulo):
    """Slide divisor de secao (fundo azul)."""
    faixa(s, Inches(3.05), Inches(0.06), DOURADO)
    tb, tf = caixa(s, Inches(1.0), Inches(2.0), Inches(11.3), Inches(1.0))
    setp(tf.paragraphs[0], kicker, 22, DOURADO, bold=True,
         font=FONTE_C, align=PP_ALIGN.CENTER)
    tb2, tf2 = caixa(s, Inches(1.0), Inches(3.2), Inches(11.3), Inches(2.0))
    setp(tf2.paragraphs[0], titulo, 40, BRANCO, bold=True,
         font=FONTE_T, align=PP_ALIGN.CENTER)


def cabecalho(s, titulo, ref=None):
    """Cabecalho padrao de slide de conteudo."""
    faixa(s, 0, Inches(1.25), AZUL)
    faixa(s, Inches(1.25), Inches(0.08), DOURADO)
    tb, tf = caixa(s, Inches(0.6), Inches(0.28), Inches(12.1), Inches(0.95))
    p = tf.paragraphs[0]
    setp(p, titulo, 30, BRANCO, bold=True, font=FONTE_T)
    if ref:
        tb2, tf2 = caixa(s, Inches(0.6), Inches(0.92), Inches(12.1), Inches(0.35))
        setp(tf2.paragraphs[0], ref, 15, DOURADO, bold=True, italic=True)


def versiculo_box(s, top, texto, ref, height=Inches(1.6)):
    """Caixa destacada para versiculo biblico."""
    card = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), top,
                              Inches(11.5), height)
    card.fill.solid(); card.fill.fore_color.rgb = BRANCO
    card.line.color.rgb = DOURADO; card.line.width = Pt(1.5)
    card.shadow.inherit = False
    # barra lateral
    bar = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), top,
                             Inches(0.13), height)
    bar.fill.solid(); bar.fill.fore_color.rgb = DOURADO
    bar.line.fill.background(); bar.shadow.inherit = False
    tf = card.text_frame; tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Inches(0.4); tf.margin_right = Inches(0.35)
    setp(tf.paragraphs[0], "“" + texto + "”", 19, AZUL_ESC,
         italic=True, font=FONTE_T, space_after=4)
    p2 = tf.add_paragraph()
    setp(p2, ref, 15, TEAL, bold=True, align=PP_ALIGN.RIGHT)


N = 0
def n():
    global N
    N += 1
    return N

# =====================================================================
# SLIDE 1 - CAPA
# =====================================================================
s = add_slide(AZUL)
faixa(s, 0, EMU_H, AZUL)
# losango decorativo
faixa(s, Inches(2.55), Inches(0.06), DOURADO)
faixa(s, Inches(5.35), Inches(0.06), DOURADO)
tb, tf = caixa(s, Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.6))
setp(tf.paragraphs[0], "ESCOLA BÍBLICA DOMINICAL  ·  CLASSE DE ADULTOS",
     16, DOURADO, bold=True, align=PP_ALIGN.CENTER)
tb, tf = caixa(s, Inches(0.8), Inches(2.7), Inches(11.7), Inches(2.0))
setp(tf.paragraphs[0], "SOMOS UM EM CRISTO", 60, BRANCO, bold=True,
     font=FONTE_T, align=PP_ALIGN.CENTER)
tb, tf = caixa(s, Inches(0.8), Inches(4.5), Inches(11.7), Inches(0.8))
setp(tf.paragraphs[0], "Uma só oliveira, um só corpo, um só amor",
     22, CREME, italic=True, font=FONTE_T, align=PP_ALIGN.CENTER)
tb, tf = caixa(s, Inches(0.8), Inches(5.5), Inches(11.7), Inches(0.6))
setp(tf.paragraphs[0], "Estudo em Romanos 11 e 12", 18, DOURADO,
     bold=True, align=PP_ALIGN.CENTER)
tb, tf = caixa(s, Inches(0.8), Inches(6.6), Inches(11.7), Inches(0.5))
setp(tf.paragraphs[0],
     "Segunda Igreja Batista de Campo Grande-MS  ·  Duração: 60 minutos",
     14, CREME, align=PP_ALIGN.CENTER)

# =====================================================================
# SLIDE 2 - VERSICULO TEMA
# =====================================================================
s = add_slide(AZUL_ESC)
faixa(s, 0, EMU_H, AZUL_ESC)
tb, tf = caixa(s, Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.6))
setp(tf.paragraphs[0], "VERSÍCULO-TEMA", 18, DOURADO, bold=True,
     align=PP_ALIGN.CENTER)
tb, tf = caixa(s, Inches(1.2), Inches(2.1), Inches(10.9), Inches(3.0))
setp(tf.paragraphs[0],
     "“Assim nós, conquanto muitos, somos um só corpo em Cristo, "
     "e membros uns dos outros.”",
     34, BRANCO, italic=True, font=FONTE_T, align=PP_ALIGN.CENTER, space_after=10)
tb, tf = caixa(s, Inches(1.2), Inches(5.2), Inches(10.9), Inches(0.7))
setp(tf.paragraphs[0], "Romanos 12.5", 24, DOURADO, bold=True,
     align=PP_ALIGN.CENTER)

# =====================================================================
# SLIDE 3 - OBJETIVOS / ROTEIRO
# =====================================================================
s = add_slide()
cabecalho(s, "Para onde vamos hoje")
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(5.0))
bullet(tf, "Compreender que, em Cristo, Deus forma UM só povo de "
        "muitos povos.", 21, AZUL, bold=True, first=True, space_after=14)
bullet(tf, "1.  UM SÓ POVO — a oliveira de Deus (Romanos 11)",
       20, CINZA_TX, space_after=10)
bullet(tf, "2.  UM SÓ CORPO — unidade, diversidade, mutualidade e "
        "utilidade (Romanos 12.1-8)", 20, CINZA_TX, space_after=10)
bullet(tf, "3.  UM SÓ AMOR — a vida que sustenta a unidade "
        "(Romanos 12.9-21)", 20, CINZA_TX, space_after=10)
bullet(tf, "Aplicação: como vivemos essa unidade na nossa igreja?",
       20, TEAL, bold=True, space_after=10)
rodape(s, n() if False else 3)

# =====================================================================
# SLIDE 4 - INTRODUCAO: DA DOUTRINA A VIDA
# =====================================================================
s = add_slide()
cabecalho(s, "Introdução: da doutrina à vida", "Romanos 1–11 → 12–16")
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(5.0))
bullet(tf, "Romanos é o maior tratado teológico do Novo Testamento. "
        "Nos capítulos 1–11, Paulo expõe a doutrina; a partir do 12, "
        "trata da ética — da teologia para a vida.", 20, CINZA_TX,
        first=True, space_after=14)
bullet(tf, "O capítulo 11 termina em adoção: “A Ele seja a "
        "glória para sempre!” (Rm 11.36). A unidade nasce da adoração.",
        20, CINZA_TX, space_after=14)
bullet(tf, "Não podemos ter um relacionamento vertical correto com Deus "
        "se os relacionamentos horizontais com os irmãos estão errados.",
        20, AZUL, bold=True, space_after=10)
rodape(s, 4)

# =====================================================================
# SLIDE 5 - DIVISOR PONTO 1
# =====================================================================
s = add_slide(AZUL)
faixa(s, 0, EMU_H, AZUL)
titulo_secao(s, "PONTO 1", "Um só povo: a oliveira de Deus")
tb, tf = caixa(s, Inches(1.0), Inches(5.0), Inches(11.3), Inches(0.8))
setp(tf.paragraphs[0], "Romanos 11", 20, CREME, italic=True,
     align=PP_ALIGN.CENTER)

# =====================================================================
# SLIDE 6 - DEUS NAO REJEITOU O SEU POVO
# =====================================================================
s = add_slide()
cabecalho(s, "Deus não rejeitou o seu povo", "Romanos 11.1-10")
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(5.0))
bullet(tf, "“De modo nenhum!” — Deus não rejeitou Israel. "
        "O próprio Paulo é a prova: israelita, da descendência de "
        "Abraão.", 20, CINZA_TX, first=True, space_after=12)
bullet(tf, "A rejeição de Israel é apenas parcial: sempre houve "
        "um remanescente fiel — como os 7.000 que não dobraram os "
        "joelhos a Baal.", 20, CINZA_TX, space_after=12)
bullet(tf, "Esse remanescente existe “segundo a eleição da "
        "graça” (11.5). Não por obras — do contrário, "
        "a graça já não seria graça.", 20, AZUL, bold=True,
        space_after=10)
rodape(s, 6)

# =====================================================================
# SLIDE 7 - GENTIOS ENXERTADOS
# =====================================================================
s = add_slide()
cabecalho(s, "Gentios enxertados na oliveira", "Romanos 11.11-24")
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(4.0))
bullet(tf, "A queda de Israel abriu espaço para a salvação dos "
        "gentios — e isso, por sua vez, deve provocar Israel ao ciûme "
        "santo, para a sua restauração.", 20, CINZA_TX, first=True,
        space_after=12)
bullet(tf, "Raiz e oliveira: a raiz é Abraão; os ramos naturais "
        "são os judeus; os gentios são ramos silvestres enxertados "
        "pela fé.", 20, CINZA_TX, space_after=12)
bullet(tf, "“Não te glories contra os ramos” (11.18). O gentio "
        "não sustenta a raiz — a raiz é que o sustenta. Lugar de "
        "humildade, não de orgulho.", 20, AZUL, bold=True, space_after=10)
rodape(s, 7)

# =====================================================================
# SLIDE 8 - UMA SO OLIVEIRA (verdade central do ponto 1)
# =====================================================================
s = add_slide(TEAL)
faixa(s, 0, EMU_H, TEAL)
tb, tf = caixa(s, Inches(0.8), Inches(0.9), Inches(11.7), Inches(1.0))
setp(tf.paragraphs[0], "A verdade central", 20, CREME, bold=True,
     align=PP_ALIGN.CENTER)
versiculo_box(s, Inches(2.0),
    "Uma só oliveira representa todos os salvos, sem importar a sua "
    "origem. Para judeus e gentios, a salvação é a mesma: "
    "sobre a base da expiação de Cristo, pela graça, por meio da fé.",
    "Comentário de Romanos 11", height=Inches(2.0))
tb, tf = caixa(s, Inches(0.9), Inches(4.7), Inches(11.5), Inches(2.0))
bullet(tf, "Judeus e gentios foram chamados a formar “um só corpo em "
        "Cristo, a saber, a igreja” (Ef 3.4-6).", 21, BRANCO, bold=True,
        first=True, space_after=10)
bullet(tf, "A unidade do povo de Deus não é uniformidade étnica "
        "ou cultural — é união na mesma raiz, pela mesma graça.",
        20, CREME, space_after=10)

# =====================================================================
# SLIDE 9 - DIVISOR PONTO 2
# =====================================================================
s = add_slide(AZUL)
faixa(s, 0, EMU_H, AZUL)
titulo_secao(s, "PONTO 2", "Um só corpo em Cristo")
tb, tf = caixa(s, Inches(1.0), Inches(5.0), Inches(11.3), Inches(0.8))
setp(tf.paragraphs[0], "Romanos 12.1-8", 20, CREME, italic=True,
     align=PP_ALIGN.CENTER)

# =====================================================================
# SLIDE 10 - A BASE: CORPOS CONSAGRADOS, MENTES TRANSFORMADAS
# =====================================================================
s = add_slide()
cabecalho(s, "A base da unidade: vidas transformadas", "Romanos 12.1-2")
tb, tf = caixa(s, Inches(0.9), Inches(1.65), Inches(11.5), Inches(2.2))
bullet(tf, "Relacionamento com Deus primeiro: oferecer o corpo em "
        "sacrifício vivo, santo e agradável — nosso culto racional.",
        20, CINZA_TX, first=True, space_after=10)
bullet(tf, "Não se conformar com este mundo, mas ser transformado pela "
        "renovação da mente (gr. metamorfose: mudança de dentro "
        "para fora).", 20, CINZA_TX, space_after=10)
versiculo_box(s, Inches(4.5),
    "Rogo-vos... que apresenteis o vosso corpo por sacrifício vivo... "
    "Transformai-vos pela renovação da vossa mente.",
    "Romanos 12.1-2", height=Inches(1.7))
rodape(s, 10)

# =====================================================================
# SLIDE 11 - QUATRO VERDADES (visao geral)
# =====================================================================
s = add_slide()
cabecalho(s, "Um só corpo: quatro verdades", "Romanos 12.3-8")
labels = [
    ("UNIDADE", "Somos um só corpo\nRm 12.5", AZUL),
    ("DIVERSIDADE", "Muitos membros,\ndons diferentes\nRm 12.4-6", TEAL),
    ("MUTUALIDADE", "Membros uns\ndos outros\nRm 12.5", DOURADO),
    ("UTILIDADE", "Dons para edificar\no corpo\nRm 12.6-8", AZUL_ESC),
]
x = Inches(0.7)
for titulo, desc, cor in labels:
    card = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2),
                              Inches(2.85), Inches(3.4))
    card.fill.solid(); card.fill.fore_color.rgb = cor
    card.line.fill.background(); card.shadow.inherit = False
    tf = card.text_frame; tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Inches(0.2); tf.margin_right = Inches(0.2)
    setp(tf.paragraphs[0], titulo, 22, BRANCO if cor != DOURADO else AZUL_ESC,
         bold=True, font=FONTE_T, align=PP_ALIGN.CENTER, space_after=10)
    for ln in desc.split("\n"):
        p = tf.add_paragraph()
        setp(p, ln, 15, CREME if cor != DOURADO else AZUL_ESC,
             align=PP_ALIGN.CENTER, space_after=2)
    x = Emu(int(x) + int(Inches(3.05)))
rodape(s, 11)

# =====================================================================
# SLIDE 12 - UNIDADE
# =====================================================================
s = add_slide()
cabecalho(s, "1. Unidade", "Romanos 12.5")
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(5.0))
bullet(tf, "“Somos um só corpo.” Fazemos parte de uma só "
        "família, somos um só rebanho.", 21, AZUL, bold=True,
        first=True, space_after=14)
bullet(tf, "O que dá unidade ao corpo é estarmos ligados à mesma "
        "Cabeça — Cristo — e sermos irrigados pelo mesmo sangue.",
        20, CINZA_TX, space_after=12)
bullet(tf, "A unidade não é algo que produzimos; é algo que "
        "recebemos. Já somos um em Cristo — cabe-nos guardar essa "
        "unidade.", 20, CINZA_TX, space_after=10)
rodape(s, 12)

# =====================================================================
# SLIDE 13 - DIVERSIDADE
# =====================================================================
s = add_slide()
cabecalho(s, "2. Diversidade", "Romanos 12.4-6a")
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(5.0))
bullet(tf, "“Nem todos os membros têm a mesma função.” A "
        "marca das obras de Deus é a uniformidade dentro da unidade.",
        21, TEAL, bold=True, first=True, space_after=14)
bullet(tf, "Homens e mulheres das mais diversas origens, ambientes e "
        "temperamentos são dotados por Deus de grande variedade de dons.",
        20, CINZA_TX, space_after=12)
bullet(tf, "A diversidade não ameaça a unidade — ela a "
        "enriquece. Cada um coopera para o bem de todos.", 20, CINZA_TX,
        space_after=10)
rodape(s, 13)

# =====================================================================
# SLIDE 14 - MUTUALIDADE
# =====================================================================
s = add_slide()
cabecalho(s, "3. Mutualidade", "Romanos 12.5")
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(5.0))
bullet(tf, "“Somos membros uns dos outros.” Não estamos "
        "competindo — estamos servindo uns aos outros.", 21, DOURADO,
        bold=True, first=True, space_after=14)
bullet(tf, "Como as mãos levam o alimento à boca: os membros "
        "trabalham para a edificação do corpo, com igual cuidado uns "
        "pelos outros (1Co 12.25).", 20, CINZA_TX, space_after=12)
bullet(tf, "Precisamos uns dos outros. Ninguém é dispensável; "
        "ninguém é autossuficiente.", 20, CINZA_TX, space_after=10)
rodape(s, 14)

# =====================================================================
# SLIDE 15 - UTILIDADE / DONS
# =====================================================================
s = add_slide()
cabecalho(s, "4. Utilidade: dons para servir", "Romanos 12.6-8")
tb, tf = caixa(s, Inches(0.9), Inches(1.6), Inches(11.5), Inches(1.0))
bullet(tf, "Os dons são dados pela Trindade para a edificação do "
        "corpo — nenhum para exibição própria:", 20, AZUL,
        bold=True, first=True, space_after=6)
dons = [
    "Profecia — proclamar a Palavra",
    "Ministério / serviço — servir com amor",
    "Ensino — instruir no entendimento",
    "Exortação — encorajar e consolar",
    "Contribuição — repartir com liberalidade",
    "Presidência / liderança — dirigir com diligência",
    "Misericórdia — acolher com alegria",
]
tb, tf = caixa(s, Inches(0.9), Inches(2.5), Inches(11.5), Inches(4.2))
for i, d in enumerate(dons):
    bullet(tf, d, 19, CINZA_TX, first=(i == 0), space_after=7)
rodape(s, 15)

# =====================================================================
# SLIDE 16 - DIVISOR PONTO 3
# =====================================================================
s = add_slide(AZUL)
faixa(s, 0, EMU_H, AZUL)
titulo_secao(s, "PONTO 3", "Um só amor")
tb, tf = caixa(s, Inches(1.0), Inches(5.0), Inches(11.3), Inches(0.8))
setp(tf.paragraphs[0], "Romanos 12.9-21", 20, CREME, italic=True,
     align=PP_ALIGN.CENTER)

# =====================================================================
# SLIDE 17 - AMOR SINCERO (versiculo)
# =====================================================================
s = add_slide()
cabecalho(s, "O amor que sustenta a unidade", "Romanos 12.9")
versiculo_box(s, Inches(1.8),
    "O amor seja sem hipocrisia. Detestai o mal, apegando-vos ao bem.",
    "Romanos 12.9", height=Inches(1.5))
tb, tf = caixa(s, Inches(0.9), Inches(3.7), Inches(11.5), Inches(3.0))
bullet(tf, "O amor (gr. ágape) é o sistema circulatório do "
        "corpo espiritual: faz todos os membros funcionarem de forma "
        "saudável.", 20, AZUL, bold=True, first=True, space_after=12)
bullet(tf, "Amor sincero (sem máscara), com discernimento: detestar o "
        "mal, apegar-se ao bem.", 20, CINZA_TX, space_after=10)
bullet(tf, "Afeição fraternal e honra mútua: “preferíndo-vos "
        "em honra uns aos outros” (12.10).", 20, CINZA_TX, space_after=10)
rodape(s, 17)

# =====================================================================
# SLIDE 18 - QUATRO PORTAS ABERTAS
# =====================================================================
s = add_slide()
cabecalho(s, "Um amor que se abre", "Romanos 12.13-16")
items = [
    ("Coração aberto", "Amor fraternal, sincero e cordial (12.9-10)"),
    ("Lábios abertos", "Abençoar e não amaldiçoar (12.14)"),
    ("Mãos abertas", "Repartir com os santos nas necessidades (12.13a)"),
    ("Casa aberta", "Praticar a hospitalidade — acolher (12.13b)"),
]
y = Inches(1.8)
for titulo, desc in items:
    card = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), y,
                              Inches(11.5), Inches(1.05))
    card.fill.solid(); card.fill.fore_color.rgb = CREME
    card.line.color.rgb = DOURADO; card.line.width = Pt(1.25)
    card.shadow.inherit = False
    tf = card.text_frame; tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Inches(0.35)
    p = tf.paragraphs[0]
    r1 = p.add_run(); r1.text = titulo + "  —  "
    r1.font.bold = True; r1.font.size = Pt(20); r1.font.name = FONTE_C
    r1.font.color.rgb = AZUL
    r2 = p.add_run(); r2.text = desc
    r2.font.size = Pt(19); r2.font.name = FONTE_C; r2.font.color.rgb = CINZA_TX
    y = Emu(int(y) + int(Inches(1.2)))
rodape(s, 18)

# =====================================================================
# SLIDE 19 - VENCER O MAL COM O BEM
# =====================================================================
s = add_slide()
cabecalho(s, "Vencer o mal com o bem", "Romanos 12.17-21")
tb, tf = caixa(s, Inches(0.9), Inches(1.65), Inches(11.5), Inches(2.4))
bullet(tf, "A unidade cristã alcança até os inimigos: não "
        "retaliar, não criar conflitos, não vingar-se, não "
        "guardar mágoa.", 20, CINZA_TX, first=True, space_after=10)
bullet(tf, "“Se possível, quanto depender de vós, tende paz com "
        "todos os homens” (12.18). O cristão é pacificador, "
        "apaga focos de incêndio.", 20, CINZA_TX, space_after=10)
versiculo_box(s, Inches(4.4),
    "Não te deixes vencer do mal, mas vence o mal com o bem.",
    "Romanos 12.21", height=Inches(1.4))
rodape(s, 19)

# =====================================================================
# SLIDE 20 - APLICACAO
# =====================================================================
s = add_slide(AZUL)
faixa(s, 0, EMU_H, AZUL)
faixa(s, Inches(1.25), Inches(0.08), DOURADO)
tb, tf = caixa(s, Inches(0.6), Inches(0.4), Inches(12), Inches(0.9))
setp(tf.paragraphs[0], "E na nossa igreja?", 32, BRANCO, bold=True,
     font=FONTE_T)
tb, tf = caixa(s, Inches(0.9), Inches(1.7), Inches(11.5), Inches(5.0))
bullet(tf, "Guardo a unidade ou alimento divisões e fofocas? (12.16)",
       21, CREME, first=True, space_after=14)
bullet(tf, "Conheço e uso o meu dom para edificar o corpo — ou vivo "
        "como espectador?", 21, CREME, space_after=14)
bullet(tf, "Valorizo a diversidade de dons e pessoas, ou exijo que todos "
        "sejam iguais a mim?", 21, CREME, space_after=14)
bullet(tf, "Meu amor é sincero? Minha casa, mãos e lábios "
        "estão abertos aos irmãos?", 21, CREME, space_after=14)
bullet(tf, "Há alguém com quem preciso fazer as pazes esta semana?",
       21, DOURADO, bold=True, space_after=10)

# =====================================================================
# SLIDE 21 - CONCLUSAO
# =====================================================================
s = add_slide()
cabecalho(s, "Conclusão")
tb, tf = caixa(s, Inches(0.9), Inches(1.8), Inches(11.5), Inches(3.0))
bullet(tf, "Em Cristo, Deus fez de muitos um só povo: uma só "
        "oliveira, um só corpo, um só amor.", 22, AZUL, bold=True,
        first=True, space_after=16)
bullet(tf, "A unidade é dom de Deus — recebida pela graça. A "
        "diversidade é presente de Deus para nos enriquecer. O amor é "
        "o que mantém tudo unido.", 21, CINZA_TX, space_after=14)
bullet(tf, "Sermos um em Cristo não é um ideal distânte: é "
        "uma realidade a ser vivida, todos os dias, uns com os outros.",
        21, CINZA_TX, space_after=10)
versiculo_box(s, Inches(5.4),
    "A Ele seja a glória para sempre! Amém.",
    "Romanos 11.36", height=Inches(1.1))
rodape(s, 21)

# =====================================================================
# SLIDE 22 - ENCERRAMENTO
# =====================================================================
s = add_slide(AZUL_ESC)
faixa(s, 0, EMU_H, AZUL_ESC)
faixa(s, Inches(2.85), Inches(0.06), DOURADO)
tb, tf = caixa(s, Inches(0.8), Inches(2.6), Inches(11.7), Inches(1.4))
setp(tf.paragraphs[0], "SOMOS UM EM CRISTO", 46, BRANCO, bold=True,
     font=FONTE_T, align=PP_ALIGN.CENTER)
tb, tf = caixa(s, Inches(0.8), Inches(4.2), Inches(11.7), Inches(0.8))
setp(tf.paragraphs[0],
     "“Conquanto muitos, somos um só corpo em Cristo” — Rm 12.5",
     20, DOURADO, italic=True, align=PP_ALIGN.CENTER)
tb, tf = caixa(s, Inches(0.8), Inches(5.6), Inches(11.7), Inches(0.6))
setp(tf.paragraphs[0],
     "Escola Bíblica Dominical · Segunda Igreja Batista de Campo Grande-MS",
     15, CREME, align=PP_ALIGN.CENTER)

prs.save("/home/user/campaign-3/aula-somos-um-em-cristo/Somos_um_em_Cristo_apresentacao.pptx")
print("PPTX gerado com", len(prs.slides._sldIdLst), "slides.")

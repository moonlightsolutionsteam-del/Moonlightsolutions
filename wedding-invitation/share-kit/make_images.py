"""Builds the share-kit designs as HTML pages (rendered to PNG by render.js)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
SPRITE = open(os.path.join(HERE, '..', 'sprite.svg')).read()
JAALI = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='22'%3E%3Cg fill='none' stroke='%23ffcf4d' stroke-width='1'%3E"
         "%3Cpath d='M0 1.5H44M0 20.5H44'/%3E%3Crect x='17' y='6' width='10' height='10'/%3E%3Crect x='17' y='6' width='10' height='10' transform='rotate(45 22 11)'/%3E"
         "%3Cpath d='M0 7.5L3.5 11L0 14.5M44 7.5L40.5 11L44 14.5'/%3E%3C/g%3E%3C/svg%3E")

BASE_CSS = f"""
* {{ box-sizing:border-box; margin:0; }}
html, body {{ width:var(--w); height:var(--h); overflow:hidden; }}
body {{ background:radial-gradient(ellipse at 50% 18%,#19b5af 0%,#0c868d 50%,#086670 100%); color:#fff; font-family:'Plus Jakarta Sans',sans-serif; position:relative; }}
.frame {{ position:absolute; inset:28px; border:3px solid #ffcf4d; }}
.frame::after {{ content:""; position:absolute; inset:12px; border:1px solid rgba(255,207,77,.6); }}
.jaali {{ position:absolute; left:0; right:0; height:30px; background:url("{JAALI}") repeat-x center/60px 30px; opacity:.55; }}
.gold {{ background:linear-gradient(135deg,#fff3c4 0%,#ffcf4d 50%,#f5b82e 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }}
.cin {{ font-family:'Cinzel',serif; }}
.script {{ font-family:'Great Vibes',cursive; }}
.ar {{ font-family:'Amiri',serif; }}
.center {{ position:absolute; left:0; right:0; text-align:center; }}
.lantern {{ position:absolute; top:0; display:flex; flex-direction:column; align-items:center; }}
.lantern i {{ display:block; width:2px; background:linear-gradient(rgba(255,207,77,0),#ffcf4d); }}
.lantern svg {{ filter:drop-shadow(0 0 18px rgba(255,207,77,.6)); }}
.cluster {{ position:absolute; bottom:-10px; }}
.cluster.r {{ transform:scaleX(-1); }}
.ev {{ display:grid; grid-template-columns:auto 1fr; gap:4px 22px; align-items:baseline; text-align:left; }}
.dot {{ width:16px; height:16px; border-radius:50%; display:inline-block; }}
"""

def lantern(left_or_right, w, chain):
    return f'<div class="lantern" style="{left_or_right}"><i style="height:{chain}px"></i><svg width="{w}" height="{w*2.3:.0f}" viewBox="0 0 40 92"><use href="#a-lantern"/></svg></div>'
def crest(size, extra=''):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 104 104" style="display:block;margin:0 auto;{extra}"><use href="#a-crest"/></svg>'
def divider(w=360):
    return f'<svg width="{w}" height="{w*32/240:.0f}" viewBox="0 0 240 32" style="display:block;margin:0 auto"><use href="#a-divider"/></svg>'
def clusters(w):
    h = w * 210 / 240
    return (f'<svg class="cluster l" style="left:-10px" width="{w}" height="{h:.0f}" viewBox="0 0 240 210"><use href="#a-cluster"/></svg>'
            f'<svg class="cluster r" style="right:-10px" width="{w}" height="{h:.0f}" viewBox="0 0 240 210"><use href="#a-cluster"/></svg>')

def page(w, h, body, css=''):
    return f'<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cinzel:wght@500;600;700&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@400;500;600&display=block"><style>:root{{--w:{w}px;--h:{h}px}}{BASE_CSS}{css}</style></head><body>{SPRITE}{body}</body></html>'

BISMILLAH = 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
EVENTS = [('#ffb020', 'WED 20 JAN', 'Haldi, Mehendi & DJ Night', 'from 12:00 PM'),
          ('#fff1c9', 'THU 21 JAN', 'Nikah', '10:00 AM'),
          ('#ff4f93', 'THU 21 JAN', 'Reception / Walima', '6:30 PM')]
def events_block(scale=1.0):
    rows = ''.join(f'''<div style="display:flex;align-items:center;gap:{18*scale:.0f}px;padding:{12*scale:.0f}px 0;border-bottom:1px solid rgba(255,207,77,.25)">
        <span class="dot" style="background:{c};width:{16*scale:.0f}px;height:{16*scale:.0f}px;box-shadow:0 0 12px {c}"></span>
        <span class="cin" style="font-size:{22*scale:.0f}px;letter-spacing:.12em;color:#ffd36b;width:{190*scale:.0f}px;text-align:left">{d}</span>
        <span style="font-size:{30*scale:.0f}px;font-weight:600;flex:1;text-align:left">{n}</span>
        <span class="cin" style="font-size:{22*scale:.0f}px;color:#fff0b8">{t}</span></div>''' for c, d, n, t in EVENTS)
    return f'<div style="width:{820*scale:.0f}px;margin:0 auto">{rows}</div>'

def poster(w, h, tall=False):
    s = 1.0
    top = 330 if tall else 168
    body = f'''<div class="jaali" style="top:0"></div><div class="jaali" style="bottom:0"></div><div class="frame"></div>
    {lantern('left:90px', 70, 120 if tall else 60)}{lantern('left:210px', 46, 210 if tall else 120)}{lantern('right:90px', 74, 160 if tall else 80)}{lantern('right:215px', 44, 90 if tall else 40)}
    <div class="center" style="top:{top}px">
      {crest(150 if tall else 120)}
      <p class="ar gold" style="font-size:{60 if tall else 52}px;margin-top:22px;line-height:1.5" dir="rtl" lang="ar">{BISMILLAH}</p>
      <p class="cin" style="font-size:20px;letter-spacing:.32em;color:#ffd36b;margin-top:{26 if tall else 14}px">TOGETHER WITH THEIR FAMILIES</p>
      <p class="script gold" style="font-size:{150 if tall else 116}px;line-height:1.15;margin-top:{22 if tall else 6}px;padding:0 20px">Nadeem Khan</p>
      <p class="cin" style="font-size:34px;color:#fff0b8;letter-spacing:.3em">&amp;</p>
      <p class="script gold" style="font-size:{150 if tall else 116}px;line-height:1.15;padding:0 20px">Dariya</p>
      <p style="font-size:{30 if tall else 27}px;margin-top:{20 if tall else 10}px;opacity:.95">invite you to celebrate their wedding</p>
      <div style="margin-top:{30 if tall else 16}px">{divider(300)}</div>
      <p class="cin" style="font-size:{50 if tall else 44}px;font-weight:700;letter-spacing:.14em;margin-top:{26 if tall else 14}px">20 · 21 JANUARY 2027</p>
      <p class="cin" style="font-size:22px;letter-spacing:.34em;color:#ffd36b;margin-top:10px">GREENWOOD RESORT · BENGALURU</p>
      <div style="margin-top:{44 if tall else 22}px">{events_block(1.12 if tall else .9)}</div>
      <p class="cin" style="font-size:{22 if tall else 20}px;letter-spacing:.18em;color:#fff0b8;margin-top:{40 if tall else 22}px">KINDLY RSVP BY 15 DECEMBER 2026</p>
      <p style="font-size:{20 if tall else 18}px;opacity:.85;margin-top:8px">Entry by RSVP pass only · Link in the message</p>
    </div>
    {clusters(300 if tall else 230)}'''
    return page(w, h, body)

def save_the_date():
    body = f'''<div class="jaali" style="top:0"></div><div class="jaali" style="bottom:0"></div><div class="frame"></div>
    {lantern('left:110px', 64, 70)}{lantern('right:110px', 64, 110)}{lantern('left:230px', 40, 150)}{lantern('right:230px', 40, 40)}
    <div class="center" style="top:250px">
      <p class="cin" style="font-size:30px;letter-spacing:.5em;color:#ffd36b">SAVE THE DATE</p>
      <p class="script gold" style="font-size:150px;line-height:1.2;margin-top:12px">Nadeem &amp; Dariya</p>
      <div style="margin-top:6px">{divider(320)}</div>
      <p class="cin" style="font-size:64px;font-weight:700;letter-spacing:.12em;margin-top:28px">20 · 21</p>
      <p class="cin" style="font-size:38px;letter-spacing:.3em;color:#fff0b8">JANUARY 2027</p>
      <p class="cin" style="font-size:24px;letter-spacing:.34em;color:#ffd36b;margin-top:26px">GREENWOOD RESORT · BENGALURU</p>
      <p style="font-size:24px;opacity:.9;margin-top:20px">Invitation to follow, In shaa Allah</p>
    </div>{clusters(250)}'''
    return page(1080, 1080, body)

DAY1 = [('12:00 PM', 'Arrival & welcome drinks'), ('1:30 PM', 'Lunch'), ('2:30 PM', 'Family Face-Off games'), ('3:15 PM', 'Pool session'),
        ('4:45 PM', 'Haldi & Mehendi', '#ffb020'), ('6:45 PM', 'Shukrana', '#fff1c9'), ('8:00 PM', 'DJ Night & dinner', '#ff4f93')]
DAY2 = [('7:30 AM', 'Breakfast'), ('10:00 AM', 'Nikah · seated by 9:50', '#fff1c9'), ('1:00 PM', 'Nikah lunch'), ('3:00 PM', 'Julwa', '#fff1c9'),
        ('5:30 PM', 'Sundowner tea'), ('6:30 PM', 'Reception / Walima', '#ff4f93'), ('7:15 PM', 'Couple’s entry', '#ff4f93'), ('9:30 PM', 'Rukhsati & farewell', '#fff1c9')]
def col(title, sub, rows):
    items = ''.join(f'''<div style="display:grid;grid-template-columns:170px 1fr;gap:18px;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,207,77,.2)">
        <span class="cin" style="font-size:24px;color:#ffd36b;text-align:right">{r[0]}</span>
        <span style="font-size:29px;display:flex;align-items:center;gap:14px">{f'<span class="dot" style="background:{r[2]};box-shadow:0 0 10px {r[2]}"></span>' if len(r) > 2 else '<span class="dot" style="border:1.5px solid rgba(255,207,77,.6)"></span>'}{r[1]}</span></div>''' for r in rows)
    return f'''<div style="background:rgba(4,70,80,.38);border:1px solid rgba(255,207,77,.4);border-radius:22px;padding:30px 30px 18px">
        <p class="cin" style="font-size:20px;letter-spacing:.3em;color:#ffd36b">{sub}</p>
        <p class="cin gold" style="font-size:36px;font-weight:700;margin:6px 0 10px">{title}</p>{items}</div>'''
def schedule():
    body = f'''<div class="jaali" style="top:0"></div><div class="jaali" style="bottom:0"></div><div class="frame"></div>
    <div class="center" style="top:90px">{crest(96)}
      <p class="script gold" style="font-size:96px;line-height:1.2;margin-top:4px">Two Days at a Glance</p>{divider(280)}</div>
    <div style="position:absolute;left:84px;right:84px;top:370px;display:grid;gap:30px">
      {col('Arrival & Haldi', 'DAY 1 · WED 20 JANUARY', DAY1)}
      {col('Nikah & Reception', 'DAY 2 · THU 21 JANUARY', DAY2)}
    </div>
    <div class="center" style="bottom:70px"><p class="cin" style="font-size:20px;letter-spacing:.3em;color:#fff0b8">GREENWOOD RESORT · KANAKAPURA ROAD · BENGALURU</p></div>'''
    return page(1080, 1920, body)

DRESS = [('Arrival & games', 'Wed afternoon', 'Comfortable casual', []),
         ('Haldi & Mehendi', 'Wed 4:45 PM', 'Yellow, mustard, green or floral ethnic', ['#f7c600', '#d49a00', '#3aa655', '#f48fb1']),
         ('Shukrana', 'Wed 6:45 PM', 'Modest whites or pastels', ['#ffffff', '#f8d7e3', '#cfe6f7', '#d5f0e0']),
         ('DJ Night', 'Wed 8:00 PM', 'Royal maroon, velvet or festive ethnic', ['#800020', '#5a1846', '#1f2a6b', '#d4af37']),
         ('Nikah', 'Thu 10:00 AM', 'Traditional festive ethnic or pastel formals', ['#fff4dc', '#d4af37', '#f8d3c5', '#c8e0cf']),
         ('Reception / Walima', 'Thu 6:30 PM', 'Royal black, emerald or formal bespoke', ['#111111', '#0b6e4f', '#d4af37'])]
def dress():
    cards = ''.join(f'''<div style="background:rgba(4,70,80,.38);border:1px solid rgba(255,207,77,.4);border-radius:22px;padding:34px 34px;display:grid;gap:16px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="cin gold" style="font-size:36px;font-weight:700">{n}</span><span class="cin" style="font-size:21px;color:#ffd36b;letter-spacing:.1em">{t}</span></div>
        <div style="display:flex;align-items:center;gap:16px"><span style="display:flex;gap:8px">{''.join(f'<span style="width:42px;height:42px;border-radius:50%;background:{c};border:2px solid rgba(255,255,255,.7);display:inline-block"></span>' for c in sw)}</span>
        <span style="font-size:28px">{d}</span></div></div>''' for n, t, d, sw in DRESS)
    body = f'''<div class="jaali" style="top:0"></div><div class="jaali" style="bottom:0"></div><div class="frame"></div>
    <div class="center" style="top:100px">{crest(96)}<p class="script gold" style="font-size:100px;line-height:1.2;margin-top:4px">What to Wear</p>{divider(280)}</div>
    <div style="position:absolute;left:84px;right:84px;top:410px;display:grid;gap:34px">{cards}</div>
    <div class="center" style="bottom:80px"><p style="font-size:22px;opacity:.9">Pack a shawl for the cool January evenings, and comfortable shoes for the lawns.</p></div>'''
    return page(1080, 1920, body)

out = os.path.join(HERE, 'html'); os.makedirs(out, exist_ok=True)
for name, html in [('poster', poster(1080, 1350)), ('status', poster(1080, 1920, tall=True)), ('save-the-date', save_the_date()),
                   ('schedule', schedule()), ('dress-code', dress())]:
    open(os.path.join(out, name + '.html'), 'w').write(html)
print('built')

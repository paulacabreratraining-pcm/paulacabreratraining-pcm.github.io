import cv2, numpy as np, sys, os
sys.path.insert(0,'/home/claude/scripts')
from PIL import Image, ImageDraw, ImageFont
W,H=1080,1350; NAVY=(31,59,92); AZUL=(169,200,232); ROSA=(243,198,211); BLANCO=(250,247,246)
F='/usr/share/fonts/opentype/inter/Inter-'; f=lambda w,s: ImageFont.truetype(F+w+'.otf',s)
U='/mnt/user-data/uploads/'; OUT='/home/claude/fotos/carrusel2'; os.makedirs(OUT,exist_ok=True)
def tone(im,lift,warm,sat=1.06):
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB).astype(np.float32); L=lab[:,:,0]/255.
    lab[:,:,0]=np.clip((L+lift*L*(1-L)**2)*255,0,255)
    lab[:,:,1]=128+(lab[:,:,1]-128)*sat; lab[:,:,2]=128+(lab[:,:,2]-128)*sat+warm
    o=cv2.cvtColor(np.clip(lab,0,255).astype(np.uint8),cv2.COLOR_LAB2BGR); b=cv2.GaussianBlur(o,(0,0),1.2)
    return cv2.addWeighted(o,1.35,b,-0.35,0)
def blur_el(im,x0,y0,x1,y1):
    m=np.zeros(im.shape[:2],np.float32); cv2.ellipse(m,((x0+x1)//2,(y0+y1)//2),((x1-x0)//2+10,(y1-y0)//2+10),0,0,360,1,-1)
    m=cv2.GaussianBlur(m,(0,0),25)[:,:,None]; b=cv2.GaussianBlur(im,(0,0),14); im[:]=(im*(1-m)+b*m).astype(np.uint8)
def foto(fn,lift,warm,cy,blurs=()):
    im=cv2.imread(U+fn)
    for b in blurs: blur_el(im,*b)
    im=tone(im,lift,warm); h,w=im.shape[:2]; ch=int(w*5/4); y0=int((h-ch)*cy)
    im=cv2.resize(im[y0:y0+ch],(W,H),interpolation=cv2.INTER_AREA)
    return Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB))
def degradado(img,lado,alto,alpha=235):
    g=Image.new('L',(1,256)); 
    for i in range(256): g.putpixel((0,i),int(alpha*min(1,(1-i/255)*1.6)))
    g=g.resize((W,alto)); 
    if lado=='bottom': g=g.transpose(Image.FLIP_TOP_BOTTOM)
    capa=Image.new('RGB',(W,alto),NAVY); y=0 if lado=='top' else H-alto
    img.paste(capa,(0,y),g)
def wrap(d,t,font,maxw):
    out,cur=[], ''
    for w in t.split():
        s=(cur+' '+w).strip()
        if d.textlength(s,font=font)<=maxw: cur=s
        else: out.append(cur); cur=w
    return out+[cur]
def bloque(d,x,y,t,font,fill,maxw,lh=1.18,tachar=None):
    for l in wrap(d,t,font,maxw):
        d.text((x,y),l,font=font,fill=fill)
        if tachar: 
            yy=y+int(font.size*0.58); d.line((x-4,yy,x+d.textlength(l,font=font)+4,yy),fill=tachar,width=7)
        y+=int(font.size*lh)
    return y
def chip(d,x,y,t,bg,fg):
    fo=f('Black',26); w=d.textlength(t,font=fo); d.rounded_rectangle((x,y,x+w+44,y+52),radius=26,fill=bg); d.text((x+22,y+11),t,font=fo,fill=fg)
def pie(d,n,fg=BLANCO):
    fo=f('SemiBold',24); d.text((60,H-66),'@paulacabrera.training',font=fo,fill=fg)
    s=f'{n}/6'; d.text((W-60-d.textlength(s,font=fo),H-66),s,font=fo,fill=fg)
def medir(d,mito,real,maxw):
    return len(wrap(d,mito,f('Black',66),maxw))*78+len(wrap(d,real,f('SemiBold',40),maxw))*50+220
# 1 portada
im=foto('3d78ad2e-image.jpg',0.55,4,0.0); degradado(im,'top',780); d=ImageDraw.Draw(im)
chip(d,60,90,'MITO O REALIDAD',ROSA,NAVY)
y=bloque(d,60,180,'4 mitos de la fuerza',f('Black',118),BLANCO,620,1.02)
bloque(d,60,y+24,'que te frenan a empezar',f('SemiBold',40),ROSA,600)
d.text((60,H-130),'Desliza →',font=f('Bold',36),fill=BLANCO); pie(d,1); im.save(f'{OUT}/slide-1.jpg',quality=93)
S=[('396ad8e9-image.jpg',0.35,3,0.05,(),'bottom',W-120,'«Las pesas te ponen enorme»','Ganar mucho músculo lleva años y comer a propósito para ello. Al empezar, lo normal es ganar fuerza y firmeza.',None),
   ('f3d2536f-image.jpg',0.10,2,0.0,(),'top',W-120,'«A mi edad ya no se gana fuerza»','La fuerza se entrena a cualquier edad. Bien planteada, en personas mayores sus beneficios superan los riesgos.','Fragala et al., 2019'),
   ('439ebc5b-image.jpg',0.20,0,0.3,((270,660,400,1020),(640,620,780,1000)),'top',600,'«Sin agujetas no vale»','Las agujetas dicen que hiciste algo nuevo, no que el entreno fuera bueno. Lo que cuenta es progresar.',None),
   ('c2e745bd-image.jpg',0.55,4,0.0,(),'top',W-120,'«Necesitas un gimnasio»','Para empezar basta con tu peso, una silla o una mochila.',None)]
for i,(fn,lift,warm,cy,bl,lado,maxw,mito,real,nota) in enumerate(S):
    im=foto(fn,lift,warm,cy,bl); d=ImageDraw.Draw(im); alto=medir(d,mito,real,maxw)+120
    degradado(im,lado,min(alto+430,H)); d=ImageDraw.Draw(im)
    y=80 if lado=='top' else H-alto-40
    chip(d,60,y,f'MITO {i+1} · FALSO',ROSA,NAVY); y+=84
    y=bloque(d,60,y,mito,f('Black',66),BLANCO,maxw,1.18,tachar=None)
    d.text((60,y+22),'REALIDAD →',font=f('Black',30),fill=ROSA); y+=72
    y=bloque(d,60,y,real,f('SemiBold',40),BLANCO,maxw,1.25)
    if nota: d.text((60,y+12),nota,font=f('Medium',24),fill=AZUL)
    pie(d,i+2); im.save(f'{OUT}/slide-{i+2}.jpg',quality=93)
# 6 cierre
im=Image.new('RGB',(W,H),NAVY); d=ImageDraw.Draw(im)
d.text((60,150),'¿Cuál te',font=f('Black',120),fill=BLANCO); d.text((60,290),'habías',font=f('Black',120),fill=BLANCO); d.text((60,430),'creído?',font=f('Black',120),fill=ROSA)
bloque(d,60,620,'Cuéntamelo en comentarios y guárdalo para cuando te lo vuelvan a decir.',f('SemiBold',40),AZUL,900,1.3)
d.rounded_rectangle((60,860,W-60,1150),radius=36,fill=ROSA)
bloque(d,110,905,'¿Quieres un plan hecho para ti?',f('Black',50),NAVY,860)
bloque(d,110,1045,'Escríbeme EMPEZAR por mensaje directo',f('Bold',36),NAVY,860)
pie(d,6,AZUL); im.save(f'{OUT}/slide-6.jpg',quality=93)
th=[Image.open(f'{OUT}/slide-{k}.jpg').resize((360,450)) for k in range(1,7)]
sh=Image.new('RGB',(3*360+40,2*450+30),(255,255,255))
for k,t in enumerate(th): sh.paste(t,(10+(k%3)*370,10+(k//3)*460))
sh.save(f'{OUT}/vista_carrusel.jpg',quality=90)

"""Publica en Instagram un post aprobado, con la API de Instagram (Graph API).

Uso (desde la raíz del repo):
    IG_USER_ID=... IG_TOKEN=... python3 instagram/publicar.py instagram/posts/<carpeta>

Variables de entorno (nunca en el repositorio):
    IG_USER_ID     id de la cuenta profesional de Instagram
    IG_TOKEN       token de acceso con permiso para publicar contenido
    IG_HOST        graph.facebook.com (por defecto) o graph.instagram.com
    GRAPH_VERSION  versión de la API, p. ej. v23.0 (comprobar la actual en developers.facebook.com)

Las imágenes tienen que estar ya publicadas en GitHub Pages (push hecho y 1-2 minutos de espera).
"""
import json, os, sys, time, urllib.parse, urllib.request

WEB = "https://paulacabreratraining-pcm.github.io"


def api(metodo, ruta, **params):
    host = os.environ.get("IG_HOST", "graph.facebook.com")
    version = os.environ.get("GRAPH_VERSION", "v23.0")
    params["access_token"] = os.environ["IG_TOKEN"]
    datos = urllib.parse.urlencode(params).encode()
    url = f"https://{host}/{version}/{ruta}"
    if metodo == "GET":
        req = urllib.request.Request(url + "?" + datos.decode())
    else:
        req = urllib.request.Request(url, data=datos, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Error de la API ({e.code}): {e.read().decode()}")


def esperar(contenedor):
    for _ in range(30):
        estado = api("GET", contenedor, fields="status_code").get("status_code")
        if estado == "FINISHED":
            return
        if estado in ("ERROR", "EXPIRED"):
            sys.exit(f"Instagram no pudo procesar el contenido: {estado}")
        time.sleep(5)
    sys.exit("Instagram tarda demasiado en procesar el contenido; inténtalo más tarde.")


def main():
    carpeta = sys.argv[1].rstrip("/")
    post = json.load(open(os.path.join(carpeta, "post.json"), encoding="utf-8"))
    if not post.get("aprobado"):
        sys.exit("Este post no está aprobado. Pide el visto bueno a Paula antes de publicar.")
    if post.get("publicado"):
        sys.exit("Este post ya está publicado.")
    ig = os.environ["IG_USER_ID"]
    n = len(post["diapositivas"])
    rel = carpeta.split("instagram/", 1)[-1]
    urls = [f"{WEB}/instagram/{rel}/slide-{i}.jpg" for i in range(1, n + 1)]
    texto = post["texto"] + "\n\n" + " ".join("#" + h for h in post.get("hashtags", []))

    if post["formato"] == "historia":
        ids = []
        for u in urls:
            c = api("POST", f"{ig}/media", media_type="STORIES", image_url=u)["id"]
            esperar(c)
            ids.append(api("POST", f"{ig}/media_publish", creation_id=c)["id"])
        print("Historias publicadas:", ids)
    elif n == 1:
        c = api("POST", f"{ig}/media", image_url=urls[0], caption=texto)["id"]
        esperar(c)
        print("Publicado:", api("POST", f"{ig}/media_publish", creation_id=c)["id"])
    else:
        hijos = []
        for u in urls:
            h = api("POST", f"{ig}/media", image_url=u, is_carousel_item="true")["id"]
            esperar(h)
            hijos.append(h)
        c = api("POST", f"{ig}/media", media_type="CAROUSEL", children=",".join(hijos), caption=texto)["id"]
        esperar(c)
        print("Carrusel publicado:", api("POST", f"{ig}/media_publish", creation_id=c)["id"])

    post["publicado"] = True
    with open(os.path.join(carpeta, "post.json"), "w", encoding="utf-8") as f:
        json.dump(post, f, ensure_ascii=False, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()

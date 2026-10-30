# Configurar la publicación automática

Hay dos formas. La más sencilla es Metricool.

## Opción A · Metricool (recomendada)

1. Crea la cuenta de Instagram y pásala a cuenta profesional.
2. Regístrate en metricool.com y vincula tu Instagram.
3. En claude.ai, ve a los conectores y conecta «Metricool».
4. Listo: cuando apruebes un post, Claude lo programa en Metricool con su fecha y hora.

Comprueba si el conector funciona con el plan gratuito de Metricool o necesita uno de pago.

## Opción B · API de Instagram (más técnica)

1. Cuenta de Instagram profesional.
2. Cuenta en developers.facebook.com y una app de tipo «Empresa» con el producto de Instagram y permiso para publicar contenido.
3. Un token de acceso de larga duración y el id de tu cuenta de Instagram.
4. En claude.ai, en la configuración de capacidades, permite el dominio `graph.facebook.com` (o `graph.instagram.com`) para que el entorno de Claude pueda llamar a la API. Ahora mismo está bloqueado.
5. El token NO va en el repositorio (la web es pública). Se configura como variable de entorno del entorno de Claude Code.

El token caduca a los 60 días si no se renueva.

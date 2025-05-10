Aplicacion de Clima Pulpoline

Esta es una aplicacion de clima como proyecto para Pulpoline hecha con React y NextJS en el cliente y NestJS en el backend, en ambos proyectos se usa typescript y context como gestor de estado, incluye implementacion con redis y conexion a la base de datos con mongo atlas

Funcionalidades Clave:

Búsqueda de ciudades con autocompletado y validaciones.

Visualización detallada del clima (Celsius/Fahrenheit, ícono, datos extra).

Historial de búsquedas local.

Gestión de favoritos persistente en el backend (listar, agregar, eliminar).

Vistas en tabla y detallada.

Diseño responsivo/adaptado a móvil.

API RESTful en el backend para clima, autocompletado y favoritos.

Integración con WeatherAPI.

Manejo de errores.

Cache de resultados (opcional: Map o Redis).

Autenticación básica opcional (mock con JWT).

Dockerización del frontend y backend con Docker Compose para fácil ejecución.


Levantar el proyecto con Docker

1_ Tener docker instalado y corriendo
2_ Clonar el repositorio y asegurarse de que la carpeta api y client se encuentren en un directorio hijo archivo docker compose de la siguiente manera

```text
.
├── api/                
│   ├── src/
│   │   ├── schemas/    
│   │   ├── services/    
│   └── ...
├── client/             
│   ├── src/
│   │   ├── app/        
│   │   ├── components/ 
│   │   ├── context/    
│   │   └── types/     
│   └── ...
└── docker-compose.yml  

3_ Ejecutar el comando docker-compose up --build

4_ La aplicacion se ejecutara en http://localhost:3007

Sin docker:

1_ Clonar el positorio y pegar las variables de entorno en el directorio raiz de ambos proyectos

2_ Ejecutar npm i en la raiz de ambos proyectos

3_ Ejecutar npm run dev en el directorio del front y npm run dev start:dev para el backend, los puertos dependeran del valor que se le asigne al .env, si tiene puertos ocupados deberá liberarlos o usar otros en su defecto

Las variables de entorno se encuentran en el compose.
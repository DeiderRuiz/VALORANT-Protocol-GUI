# VALORANT Protocol - Frontend

VALORANT Protocol es una plataforma de gestión de proyectos y equipos de trabajo inspirada en el universo de Valorant. Su interfaz permite administrar agentes, crear y asignar misiones, supervisar su progreso y consultar estadísticas generales e individuales.

## Funcionalidades principales

- **Autenticación y gestión de sesiones:** inicio de sesión, recuperación de contraseñas y renovación de tokens de autenticación.
- **Gestión de agentes:** visualización, registro y edición de agentes, incluyendo sus perfiles, habilidades y disponibilidad.
- **Gestión de misiones:** creación, edición, asignación de agentes y consulta de los detalles de cada misión.
- **Seguimiento de misiones:** visualización de estados, actualización de progreso, envío de informes y gestión de solicitudes de aborto.
- **Búsqueda y filtrado:** búsqueda de misiones mediante términos y filtros por prioridad, estado, resultado y tipo de misión.
- **Paginación:** navegación entre resultados y conservación de los filtros de búsqueda mediante parámetros de URL.
- **Notificaciones:** visualización de notificaciones sobre eventos relevantes de las misiones y gestión de su estado de lectura.
- **Dashboard y estadísticas:** visualización de información general y estadísticas específicas de los agentes.
- **Control de acceso:** protección de rutas mediante Guards y funcionalidades adaptadas según el rol del usuario.

## Arquitectura y características técnicas

- Arquitectura basada en componentes reutilizables y separación de responsabilidades.
- Servicios para centralizar la comunicación con la API.
- Gestión reactiva del estado mediante Angular Signals.
- Interceptores HTTP para la gestión de tokens y solicitudes autenticadas.
- Guards para proteger las vistas privadas y controlar el acceso según los roles.
- Lazy Loading para carga diferida de componentes y vistas mediante loadComponent.

## Tecnologías utilizadas

- Angular 21
- TypeScript
- Tailwind CSS
- RxJS
- HTML5 / CSS3
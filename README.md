# CuidaMás 🏥

Sistema web de monitoreo de adultos mayores vulnerables en Huancayo, Perú.

## 📋 Descripción

CuidaMás es una plataforma digital desarrollada para cuidadores, voluntarios y el CIAM (Centro Integral de Atención al Adulto Mayor) que permite:

- Registrar y monitorear adultos mayores vulnerables
- Visualizar alertas por inactividad o riesgo
- Ver distribución geográfica en mapa interactivo
- Gestionar visitas domiciliarias

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21 |
| Estilos | CSS3 Responsive |
| Mapas | Leaflet.js + OpenStreetMap |
| Backend (próximo) | FastAPI (Python) |
| Base de datos (próximo) | PostgreSQL |
| Autenticación (próximo) | JWT + bcrypt |

## 📁 Estructura del proyecto
## 🚀 Instalación y ejecución

```bash
# Clonar repositorio
git clone https://github.com/TuUsuario/cuida-mas.git

# Entrar al proyecto
cd cuida-mas

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
ng serve

# Abrir en navegador
http://localhost:4200
```

## 🔑 Credenciales de prueba

| Usuario | Correo | Contraseña |
|---------|--------|-----------|
| Administrador | admin@cuidamas.pe | 1234 |
| Cuidadora | cuidador@cuidamas.pe | 1234 |

## 📱 Pantallas

- **Login** — Autenticación de usuarios
- **Dashboard** — Métricas generales y tabla de adultos
- **Registro** — Formulario de registro en 3 secciones
- **Alertas** — Panel de alertas con filtros por urgencia
- **Mapa** — Visualización geográfica con Leaflet.js

## 👥 Equipo

**Los Capibaras** — Universidad Continental, Huancayo
Curso: Programación Web

## 📌 Estado del proyecto

- [x] Frontend Angular (Login, Dashboard, Registro, Alertas, Mapa)
- [x] Diseño responsive
- [x] Mapa interactivo con Leaflet.js
- [ ] Backend FastAPI
- [ ] Base de datos PostgreSQL
- [ ] Autenticación JWT real
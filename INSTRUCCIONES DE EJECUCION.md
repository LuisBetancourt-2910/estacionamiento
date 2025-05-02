# Proyecto Estacionamiento

Este proyecto es una aplicación de control de estacionamiento con backend en Node.js y base de datos en SQL Server.

---

## ✅ PASOS PARA EJECUTAR EL PROYECTO

### 1. 📥 Descargar el proyecto y la base de datos

- Clona o descarga este repositorio desde GitHub.
- Asegúrate de obtener también el archivo de la base de datos (`.bak` o `.sql`).
- La base fue creada con **SQL Server Management Studio (SSMS) versión 20.2.1**.

---

### 2. 🛠️ Restaurar la base de datos en SQL Server

1. Abre **SQL Server Management Studio (SSMS)**.
2. Conéctate a tu instancia de SQL Server.
3. Clic derecho en "Bases de datos" → **Restaurar base de datos...**
4. Selecciona el archivo `.bak` descargado.
5. Asegúrate de recordar:
   - El **nombre de la base de datos** restaurada.
   - Tu **usuario y contraseña** para SQL Server.

---

### 3. ⚙️ Configurar archivo de conexión

Abre el archivo `db.js` (o `connections.js`) en el directorio `/backend` y actualiza con tu configuración:

```js
const config = {
  user: 'TU_USUARIO',
  password: 'TU_CONTRASEÑA',
  server: 'TU_SERVIDOR', // Ejemplo: 'localhost' o 'LAPTOP-XXXX'
  database: 'NOMBRE_DE_LA_BASE_DE_DATOS',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
```

---

### 4. 🔓 Permitir conexiones remotas (si es necesario)

Es posible que debas habilitar las conexiones remotas en SQL Server.

📺 [Video tutorial - Cómo habilitar conexiones remotas en SQL Server](https://www.youtube.com/watch?v=wVNPjDeZOhA)

---

### 5. 🧱 Preparar entorno (Node.js, npm, dependencias)

1. Verifica que tienes instalado Node.js:
   ```bash
   node -v
   npm -v
   ```

2. Si no los tienes, instálalos desde: [https://nodejs.org](https://nodejs.org)

3. Instala las dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

---

### 6. 🚀 Iniciar el backend

Ejecuta el servidor con:

```bash
node index.js
```

Si todo está bien configurado, deberías ver:

```
Servidor corriendo en http://localhost:3000
Conexión a la base de datos exitosa (poolPromise)
Conexión a la base de datos exitosa
```

---

### 7. ▶️ Ejecutar el frontend

1. Abre una nueva terminal.
2. Navega al directorio del frontend.
3. Ejecuta:

```bash
npm install      # solo la primera vez
npm run dev
```

Se abrirá la app en el navegador (por defecto en [http://localhost:5173]).

---

### 8. 🔑 Credenciales de acceso

**Usuario:** `admin`  
**Contraseña:** `admin`

---

### ✅ Requisitos

- Node.js
- npm
- SQL Server + SSMS
- Te pedira instalar algunas dependencias extras 

# Gestor de Opiniones API

API REST para Gestion de opiniones.

## Alcance de esta guía

Este README explica únicamente:
- cómo ejecutar el proyecto,
- cómo consumir los endpoints.



## Ejecución local

1. Instala dependencias:

```bash
pnpm install
```

2. Inicia el servidor en modo desarrollo:

```bash
pnpm run dev
```

3. Verifica salud del servicio:

```http
GET http://localhost:3000/api/v1/health
```

Base URL:

```text
http://localhost:3000/api/v1
```

## Autenticación

Los endpoints protegidos aceptan token JWT en:
- `Authorization: Bearer <token>`
- o `x-token: <token>`

## Flujo recomendado de uso

1. Registrar usuario
2. Verificar correo
3. Iniciar sesión
4. Usar token para endpoints protegidos
5. Crear publicación
6. Comentar publicación

## Endpoints

### 1) Auth (`/auth`)

#### `POST /auth/register`
Registra usuario (multipart/form-data).

Campos:
- `name` (string, requerido)
- `surname` (string, requerido)
- `username` (string, requerido)
- `email` (string, requerido)
- `password` (string, requerido)
- `phone` (string, requerido, 8 dígitos)
- `profilePicture` (archivo, opcional)

#### `POST /auth/verify-email`
Verifica correo con token.

Body JSON:

```json
{ "token": "TOKEN_VERIFICACION" }
```

#### `POST /auth/login`
Inicia sesión y devuelve JWT.

Body JSON:

```json
{
	"emailOrUsername": "usuario@correo.com",
	"password": "TuPassword"
}
```

#### `POST /auth/resend-verification`
Reenvía correo de verificación.

```json
{ "email": "usuario@correo.com" }
```

#### `POST /auth/forgot-password`
Solicita recuperación de contraseña.

```json
{ "email": "usuario@correo.com" }
```

#### `POST /auth/reset-password`
Cambia contraseña usando token de recuperación.

```json
{
	"token": "TOKEN_RESET",
	"newPassword": "NuevaPassword123"
}
```

#### `GET /auth/profile` (protegido)
Obtiene el perfil del usuario autenticado.

#### `POST /auth/profile/by-id`
Obtiene perfil por ID.

```json
{ "userId": "usr_xxxxxxxxxxxx" }
```

#### `PUT /auth/profile` (protegido)
Actualiza perfil (form-data).

Campos opcionales:
- `name`
- `surname`
- `username`
- `phone`
- `profilePicture` (archivo)

#### `PUT /auth/change-password` (protegido)

```json
{
	"currentPassword": "Actual123",
	"newPassword": "Nueva12345"
}
```

---

### 2) Publicaciones (`/posts`)

#### `GET /posts`
Lista publicaciones.

#### `GET /posts/:postId`
Obtiene publicación por ID.

#### `POST /posts` (protegido)
Crear publicación.

```json
{
	"title": "Título",
	"category": "General",
	"content": "Contenido de la publicación"
}
```

#### `PUT /posts/:postId` (protegido)
Actualizar publicación (solo autor).

```json
{
	"title": "Título actualizado",
	"content": "Contenido actualizado"
}
```

#### `DELETE /posts/:postId` (protegido)
Eliminar publicación (solo autor).

---

### 3) Comentarios (`/comments`)

#### `GET /comments/post/:postId`
Lista comentarios de una publicación.

#### `POST /comments` (protegido)
Crear comentario.

```json
{
	"postId": "<id_post_mongo>",
	"content": "Texto del comentario"
}
```

#### `PUT /comments/:commentId` (protegido)
Actualizar comentario (solo autor).

```json
{ "content": "Comentario actualizado" }
```

#### `DELETE /comments/:commentId` (protegido)
Eliminar comentario (solo autor).

---

### 4) Usuarios/Roles (`/users`) (protegidos)

> Requieren JWT. Algunos endpoints requieren usuario administrador.

#### `PUT /users/:userId/role`
Actualizar rol de usuario (admin).

```json
{ "roleName": "ADMIN_ROLE" }
```

Valores válidos:
- `ADMIN_ROLE`
- `USER_ROLE`

#### `GET /users/:userId/roles`
Obtiene roles del usuario.

#### `GET /users/by-role/:roleName`
Lista usuarios por rol (admin).

## Códigos de estado comunes

- `200` operación exitosa
- `201` recurso creado
- `400` validación o datos inválidos
- `401` token inválido o ausente
- `403` sin permisos
- `404` recurso no encontrado
- `409` conflicto de datos
- `423` cuenta bloqueada/desactivada
- `429` límite de peticiones alcanzado
- `500` error interno



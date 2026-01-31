# Manual de Usuario - Sara
## Sistema de Gestión de Proyectos con Predicción de Riesgos mediante IA

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Primeros Pasos](#2-primeros-pasos)
3. [Perfil de Usuario](#3-perfil-de-usuario)
4. [Gestión de CV](#4-gestión-de-cv)
5. [Cuestionario BFI-44](#5-cuestionario-bfi-44)
6. [Organizaciones](#6-organizaciones)
7. [Proyectos](#7-proyectos)
8. [Predicción y Gestión de Riesgos](#8-predicción-y-gestión-de-riesgos)
9. [Notificaciones](#9-notificaciones)
10. [Configuración de Idioma](#10-configuración-de-idioma)

---

## 1. Introducción

**Sara** es una plataforma inteligente de gestión de proyectos que utiliza inteligencia artificial para predecir riesgos de personal y ayudar a tomar mejores decisiones sobre equipos de trabajo.

### ¿Qué puede hacer Sara?

- ✅ Gestionar proyectos y equipos
- ✅ Predecir riesgos de personal mediante análisis de personalidad (BFI-44) y habilidades técnicas
- ✅ Analizar compatibilidad de equipos
- ✅ Gestionar currículums de empleados
- ✅ Monitorear resultados reales vs. predicciones

### Roles en la Plataforma

**Empleado (Employee)**
- Gestiona su propio perfil y CV
- Completa el test de personalidad BFI-44
- Ve los proyectos donde está asignado
- Recibe notificaciones

**Administrador de Organización (Org Admin)**
- Todo lo anterior, más:
- Crea y gestiona organizaciones
- Agrega empleados a organizaciones
- Crea y gestiona proyectos
- Asigna empleados a proyectos
- Accede a predicciones de riesgos
- Ve estadísticas de CVs

---

## 2. Primeros Pasos

### 2.1. Registro

El proceso de registro tiene **3 pasos**:

#### Paso 1: Datos Personales

1. Vaya a la página de registro (`/register`)
2. Ingrese su **nombre de usuario** (mínimo 3 caracteres)
3. Seleccione su **rol**:
   - **Administrador de Organización**: Si creará/gestionará organizaciones
   - **Empleado**: Si formará parte de un equipo
4. Clic en **"Siguiente"**

#### Paso 2: Crear Contraseña

1. Ingrese su **correo electrónico**
2. Cree una **contraseña** que cumpla:
   - ✓ Mínimo 8 caracteres
   - ✓ Al menos una mayúscula
   - ✓ Al menos una minúscula
   - ✓ Al menos un número
   - ✓ Al menos un carácter especial (@, #, $, etc.)
3. **Confirme** la contraseña
4. Clic en **"Siguiente"**

#### Paso 3: Verificación por Email

1. Revise su bandeja de entrada
2. Abra el email de Sara
3. Haga clic en el enlace de verificación
4. Su cuenta estará activa

> **💡 Tip**: Si no recibe el email, revise la carpeta de spam y use el botón **"Reenviar correo"** en la página de registro.

### 2.2. Inicio de Sesión

#### Opción 1: Con Email y Contraseña

1. Vaya a `/login`
2. Ingrese su **correo electrónico**
3. Ingrese su **contraseña**
4. Clic en **"Iniciar sesión"**

#### Opción 2: Con Google

1. En la página de login, clic en **"Continuar con Google"**
2. Seleccione su cuenta de Google
3. Autorice el acceso
4. Será redirigido automáticamente

> ⚠️ **Importante**: Debe verificar su cuenta por email antes de poder iniciar sesión.

---

## 3. Perfil de Usuario

### 3.1. Acceder al Perfil

- Clic en su **avatar/nombre** en la barra superior → **"Perfil"**
- O navegue a `/` (página de inicio)

### 3.2. Información del Perfil

Su perfil muestra:

- **Nombre de usuario**
- **Correo electrónico** (no editable)
- **Rol** (Empleado o Administrador)
- **Organización** (si pertenece a alguna)
- **Badge de Admin** (solo para administradores)

### 3.3. Editar Perfil

1. Clic en **"Editar Perfil"**
2. Modifique:
   - Nombre de usuario
   - País
   - Zona horaria
3. Guarde con **"Guardar Cambios"** o cancele con **"Cancelar"**

### 3.4. Preferencias

#### Horario de Trabajo

- **Horario Flexible**: Active la casilla si tiene horario flexible
- **Horas preferidas**: Establezca su horario (ej: 09:00 - 18:00)

#### Notificaciones

- **Notificaciones por Email**: Active/desactive emails de notificación
- **Notificaciones en la App**: Active/desactive notificaciones en la plataforma

### 3.5. Consentimiento de Procesamiento de CV con IA

La plataforma requiere su **consentimiento explícito** para procesar su CV con inteligencia artificial.

**Ver estado**:
- Sección "Consentimiento de Datos" en su perfil
- Muestra si ha aceptado, fecha y versión de términos

**Otorgar consentimiento**:
1. Clic en **"Revisar y Aceptar"**
2. Lea los términos
3. Acepte
4. Su CV podrá ser procesado automáticamente

**Revocar consentimiento**:
1. Clic en **"Revocar Consentimiento"**
2. Confirme
3. El procesamiento IA será deshabilitado

### 3.6. Accesos Rápidos

Desde su perfil puede acceder rápidamente a:

- **"Ver mi CV"**: Navega a `/my-cv`
- **"Ver Estadísticas"** (solo admins): Estadísticas de CVs (`/cv-stats`)
- **"Ver Todos los CVs"** (solo admins): Panel administrativo (`/admin/cvs`)

### 3.7. Eliminar Cuenta

⚠️ **ACCIÓN IRREVERSIBLE**

1. Busque la sección **"Zona de Peligro"** en su perfil
2. Clic en **"Eliminar Cuenta"**
3. Escriba su **correo electrónico** para confirmar
4. Clic en **"Confirmar Eliminación"**

**Se eliminará**:
- ✗ Todos sus datos personales
- ✗ Su CV
- ✗ Acceso a proyectos
- ✗ Historial de la cuenta

---

## 4. Gestión de CV

### 4.1. Acceder a Mi CV

- Navegue a **"Mi CV"** desde el menú
- O vaya a `/my-cv`

### 4.2. Cargar un CV por Primera Vez

1. En `/my-cv`, verá un mensaje "No tienes CV cargado"
2. Clic en **"Subir CV"**
3. Seleccione un archivo:
   - **Formatos aceptados**: PDF, DOC, DOCX
   - **Tamaño máximo**: 5MB
4. Clic en **"Cargar"**
5. El sistema procesará automáticamente:
   - Datos de contacto (nombre, email, teléfono, ubicación)
   - Experiencia laboral (empresa, puesto, fechas, descripción)
   - Educación (institución, título, fechas)
   - Habilidades técnicas
   - Idiomas (y nivel)
   - Certificaciones
   - Proyectos personales

### 4.3. Ver mi CV

Una vez cargado, su CV se muestra en secciones:

- **Información de Contacto**
- **Experiencia Laboral**
- **Educación**
- **Habilidades Técnicas**
- **Idiomas**
- **Certificaciones**
- **Proyectos**

### 4.4. Editar el CV

1. Clic en **"Editar"** en la parte superior
2. Se activa el modo de edición
3. Puede:
   - Modificar información de contacto
   - Agregar/editar/eliminar experiencias laborales
   - Agregar/editar/eliminar estudios
   - Agregar/editar/eliminar habilidades
   - Agregar/editar/eliminar idiomas
   - Agregar/editar/eliminar certificaciones
   - Agregar/editar/eliminar proyectos
4. Clic en **"Guardar"** para aplicar cambios
5. O **"Cancelar"** para descartar

**Botones en cada sección**:
- **Lápiz (Editar)**: Modifica un elemento
- **Papelera (Eliminar)**: Elimina un elemento
- **+ Agregar**: Añade un nuevo elemento

### 4.5. Subir un Nuevo CV

Si ya tiene un CV cargado:

1. Clic en **"Subir Nuevo CV"**
2. Seleccione el nuevo archivo
3. Confirme que desea reemplazar el actual
4. El nuevo CV será procesado

### 4.6. Eliminar CV

1. Clic en **"Eliminar CV"**
2. Confirme la acción
3. El CV será eliminado permanentemente

### 4.7. Enviar CV a una Organización

1. En su CV, clic en **"Enviar a Organización"**
2. Seleccione la organización
3. (Opcional) Agregue un mensaje
4. Clic en **"Enviar"**

**Requisitos**:
- Debe tener CV cargado
- Debe haber otorgado consentimiento a la organización

### 4.8. Estadísticas de CV (Solo Administradores)

Los administradores pueden acceder a `/cv-stats` para ver:

- Total de CVs en el sistema
- CVs procesados recientemente
- Distribución de habilidades
- Tendencias

### 4.9. Lista Administrativa de CVs (Solo Administradores)

En `/admin/cvs` pueden:

- Ver todos los CVs del sistema
- Buscar por nombre, habilidades, experiencia
- Filtrar por estado
- Ver detalles de cualquier CV

---

## 5. Cuestionario BFI-44

### 5.1. ¿Qué es el BFI-44?

El **Big Five Inventory** es un cuestionario psicológico de 44 preguntas que evalúa 5 dimensiones de personalidad:

1. **Extraversión**: Sociabilidad y energía
2. **Amabilidad**: Cooperación y empatía
3. **Responsabilidad**: Organización y disciplina
4. **Neuroticismo**: Estabilidad emocional
5. **Apertura**: Creatividad y curiosidad

### 5.2. ¿Para qué se usa?

Sara utiliza los resultados del BFI-44 para:

- **Predecir riesgos** de incompatibilidad en equipos
- **Analizar sinergia** entre miembros del equipo
- **Sugerir mejores** composiciones de equipo
- **Identificar conflictos** potenciales

### 5.3. Acceder al Cuestionario

- Navegue a **"BFI-44"** desde el menú
- O vaya a `/bfi-44`

### 5.4. Completar el Cuestionario

**Formato**:
- 44 preguntas
- Dividido en 4 páginas (11 preguntas por página)
- Escala: 1 (Totalmente en desacuerdo) a 5 (Totalmente de acuerdo)

**Navegación**:
1. Responda todas las preguntas en la página actual
2. Clic en **"Siguiente"** para avanzar
3. Use **"Anterior"** para volver atrás
4. Un indicador muestra su progreso (Ej: "Página 2 de 4")

**Envío**:
1. Complete las 44 preguntas
2. En la última página, clic en **"Enviar Cuestionario"**
3. El sistema calculará sus resultados inmediatamente

### 5.5. Ver Resultados

Una vez completado, verá:

**Gráfico de Radar**:
- Visualización de las 5 dimensiones
- Puntuaciones de 0 a 100
- Comparación visual rápida

**Puntuaciones Detalladas**:
- Cada dimensión con su puntuación
- Interpretación (Bajo, Medio, Alto)
- Descripción de lo que significa

**Interpretación de Niveles**:

| Dimensión | Bajo (0-40) | Medio (40-60) | Alto (60-100) |
|-----------|-------------|---------------|---------------|
| **Extraversión** | Reservado, introspectivo | Balance social | Muy sociable, energético |
| **Amabilidad** | Competitivo, directo | Cooperativo moderado | Muy empático, altruista |
| **Responsabilidad** | Flexible, espontáneo | Organizado moderado | Muy disciplinado, metódico |
| **Neuroticismo** | Emocionalmente estable | Balance emocional | Sensible, puede sentir estrés |
| **Apertura** | Práctico, convencional | Balance entre ideas | Muy creativo, curioso |

### 5.6. ¿Puedo Cambiar mis Respuestas?

**No**. Solo puede completar el cuestionario **una vez**.

Para rehacerlo, debe contactar al administrador.

### 5.7. ¿Quién Puede Ver mis Resultados?

- **Usted mismo**: Siempre
- **Administradores de su organización**: Solo con permiso
- **Project Managers**: Al analizar equipos de proyectos donde participa

---

## 6. Organizaciones

### 6.1. Ver Mis Organizaciones

- Navegue a **"Organizaciones"** en el menú
- O vaya a `/organizations`

Verá:
- Organizaciones donde es **administrador**
- Organizaciones donde es **miembro**

### 6.2. Crear una Organización (Solo Admins)

1. En `/organizations`, clic en **"+ Crear Organización"**
2. Complete el formulario:
   - **Nombre**: Nombre de la organización (obligatorio)
   - **Descripción**: Descripción breve (opcional)
   - **Sitio Web**: URL (opcional)
   - **Ubicación**: Ciudad/país (opcional)
3. Clic en **"Crear"**

### 6.3. Ver Detalles de Organización

1. Clic en una tarjeta de organización
2. Accede a `/organizations/:id`
3. Verá:
   - Información general
   - Miembros del equipo
   - CVs recibidos (si es admin)
   - Proyectos de la organización
   - Estadísticas

### 6.4. Gestionar Empleados (Solo Admins)

#### Agregar Empleado

1. En detalle de organización, sección "Miembros"
2. Clic en **"Agregar Empleado"**
3. Ingrese el **correo electrónico** del usuario
4. Seleccione el **rol**:
   - Employee
   - Project Manager (puede crear proyectos)
5. Clic en **"Agregar"**

#### Eliminar Empleado

1. Localice al empleado en la lista
2. Clic en **"Eliminar"**
3. Confirme

#### Cambiar Rol

1. Clic en **"Editar"** junto al empleado
2. Seleccione el nuevo rol
3. Guarde

### 6.5. CVs Recibidos (Solo Admins)

Los administradores pueden ver CVs compartidos con la organización:

1. Sección "CVs Recibidos"
2. Lista de CVs con:
   - Nombre del candidato
   - Fecha de envío
   - Estado del consentimiento
3. Clic en **"Ver Detalles"** para ver el CV completo

### 6.6. Editar Organización (Solo Admins)

1. En detalle de organización, clic en **"Editar"**
2. Modifique los campos
3. Guarde los cambios

---

## 7. Proyectos

### 7.1. Vista General de Proyectos

- Navegue a **"Proyectos"** en el menú
- O vaya a `/projects`

**Pestañas**:
- **Mis Proyectos**: Proyectos que creó o lidera
- **Asignados a Mí**: Proyectos donde es miembro del equipo

### 7.2. Crear un Proyecto (Solo Admins y Project Managers)

1. En `/projects`, clic en **"+ Crear Proyecto"**
2. Complete el formulario:

**Información Básica**:
- **Nombre**: Título del proyecto (obligatorio)
- **Descripción**: Descripción detallada (obligatorio)
- **Organización**: Seleccione la organización (obligatorio)
- **Estado**: 
  - Borrador (Draft)
  - Planificación
  - Activo
  - En Pausa
  - Completado
  - Cancelado

**Fechas**:
- **Fecha de Inicio** (obligatorio)
- **Fecha de Fin Estimada** (obligatorio)

**Detalles**:
- **Presupuesto** (opcional)
- **Prioridad**: Baja, Media, Alta, Crítica
- **Tecnologías**: Lista de tecnologías a usar
- **Objetivos**: Objetivos del proyecto

3. Clic en **"Crear Proyecto"**

### 7.3. Ver Detalles de Proyecto

1. Clic en un proyecto
2. Accede a `/projects/:id`

**Pestañas disponibles**:
- **Resumen**: Información general, progreso, fechas
- **Equipo**: Miembros asignados y sus roles
- **Riesgos**: Predicciones y riesgos manuales
- **Análisis de Equipo**: Sinergia y compatibilidad

### 7.4. Editar Proyecto

1. En detalle del proyecto, clic en **"Editar Proyecto"**
2. Modifique campos deseados
3. Clic en **"Guardar Cambios"**

### 7.5. Gestionar Estado del Proyecto

**Estados disponibles**:

- **Borrador**: Proyecto en creación inicial
- **Planificación**: Definiendo alcance y equipo
- **Activo**: Proyecto en ejecución
- **En Pausa**: Temporalmente detenido
- **Completado**: Finalizado exitosamente
- **Cancelado**: Terminado sin completar

**Cambiar estado**:
- Use el selector de estado en el detalle del proyecto
- O use botones específicos:
  - **"Activar Proyecto"**: Borrador → Activo
  - **"Completar Proyecto"**: Activo → Completado
  - **"Cancelar Proyecto"**: Cualquiera → Cancelado

### 7.6. Gestionar Equipo del Proyecto

#### Asignar Empleado

1. En detalle del proyecto, clic en **"Asignar Empleado"**
2. Seleccione el empleado de la organización
3. Asigne un **rol en el proyecto**:
   - Developer
   - Designer
   - Analyst
   - Tester
   - DevOps
   - Otro
4. Defina **responsabilidades**
5. Clic en **"Asignar"**

#### Eliminar Miembro

1. En la lista de equipo, localice al miembro
2. Clic en el ícono de **papelera**
3. Confirme

### 7.7. Filtrar Proyectos

**Por Estado**:
- Todos
- Planificación
- Activo
- En Pausa
- Completado
- Cancelado

**Por Organización**:
- Todas
- Organización específica

### 7.8. Eliminar Proyecto (Solo Creador o Admin)

1. En detalle del proyecto, clic en **"Eliminar Proyecto"**
2. Confirme la acción
3. El proyecto será eliminado permanentemente

---

## 8. Predicción y Gestión de Riesgos

### 8.1. Sistema de Predicción de Riesgos

Sara utiliza un **sistema de 3 capas** para predecir riesgos:

1. **Árboles de Decisión (DT)**: Reglas expertas sobre configuración del proyecto
2. **Razonamiento Basado en Casos (CBR)**: Aprendizaje de proyectos anteriores
3. **Selección del Project Manager**: Decisión final sobre qué riesgos monitorear

### 8.2. Ejecutar Predicción de Riesgos

**Requisitos**:
- Proyecto en estado **Activo** o superior (no borrador)
- Al menos un miembro en el equipo
- Preferiblemente, miembros con BFI-44 completado

**Pasos**:
1. Vaya al detalle del proyecto (`/projects/:id`)
2. Pestaña **"Riesgos"**
3. Clic en **"Ejecutar Predicción"** o **"Ver Predicción de Riesgos"**

### 8.3. Interpretar Resultados de Predicción

#### Capa 1: Alertas de Reglas Expertas (DT)

**Ejemplos de advertencias**:
- ⚠️ "Equipo muy grande (>8 personas): Mayor riesgo de comunicación"
- ⚠️ "Proyecto corto (<3 meses): Presión de tiempo alta"
- ⚠️ "Pocos miembros con BFI-44: Predicción limitada"

**Interpretación**:
- Son advertencias automáticas basadas en reglas fijas
- No son riesgos confirmados, son **factores de atención**
- Ayudan a identificar configuraciones subóptimas

#### Capa 2: Riesgos Aprendidos (CBR)

**Qué muestra**:
- Riesgos que ocurrieron en proyectos similares del pasado
- **Similitud**: % de parecido con el proyecto actual
- **Probabilidad**: Qué tan probable es que ocurra aquí
- **Severidad**: Impacto potencial (Baja, Media, Alta, Crítica)
- **Descripción**: Qué problema se observó

**Filtro de Similitud**:
- Use el slider para filtrar por % de similitud mínima
- Ejemplo: 50% muestra solo riesgos con ≥50% similitud
- Mayor similitud = predicción más confiable

**Selección de Riesgos**:
- Marque los riesgos que considera relevantes
- Clic en **"Seleccionar Todo"** para marcar todos los filtrados
- Clic en **"Limpiar Selección"** para desmarcar todos

#### Capa 3: Aceptar Riesgos para Monitoreo

1. Revise alertas DT y riesgos CBR
2. Seleccione los riesgos relevantes para su proyecto
3. Clic en **"Aceptar Riesgos para Monitoreo"**
4. Los riesgos seleccionados se agregan al proyecto para seguimiento

### 8.4. Riesgos Manuales

Los Project Managers pueden registrar riesgos manualmente.

#### Agregar Riesgo Manual

1. Pestaña **"Riesgos"** del proyecto
2. Sección **"Riesgos Manuales"**
3. Clic en **"+ Agregar Riesgo"**
4. Complete el formulario:
   - **Título**: Nombre del riesgo (obligatorio)
   - **Descripción**: Descripción detallada (obligatorio)
   - **Categoría**: 
     - Personal
     - Técnico
     - Presupuesto
     - Cronograma
     - Calidad
     - Externo
   - **Probabilidad**: Baja, Media, Alta (obligatorio)
   - **Impacto**: Bajo, Medio, Alto, Crítico (obligatorio)
   - **Plan de Mitigación**: Cómo manejarlo (obligatorio)
   - **Responsable**: Quién monitorea (opcional)
   - **Fecha Límite**: Fecha de revisión (opcional)
5. Clic en **"Guardar Riesgo"**

#### Gestionar Riesgos Manuales

**Ver detalles**: Clic en un riesgo para expandirlo

**Editar**: 
1. Clic en el ícono de **lápiz**
2. Modifique campos
3. Guarde

**Eliminar**:
1. Clic en el ícono de **papelera**
2. Confirme

**Estados de Riesgos**:
- **Identificado**: Recién registrado
- **En Seguimiento**: Monitoreando activamente
- **Mitigado**: Medidas aplicadas
- **Resuelto**: Ya no existe
- **Materializado**: El riesgo se convirtió en problema real

#### Re-predicción de Riesgos

Si el equipo o configuración del proyecto cambia:

1. En la sección de **Riesgos Manuales**
2. Clic en **"Re-predecir Riesgos"**
3. El sistema actualizará las predicciones con la nueva información

### 8.5. Análisis de Sinergia del Equipo

En la pestaña **"Análisis de Equipo"**:

**Cobertura de Perfiles BFI-44**:
- Muestra cuántos miembros tienen BFI-44 completado
- Ejemplo: "5/8 miembros"

**Análisis de Compatibilidad**:
- Solo disponible si suficientes miembros tienen BFI-44
- Muestra potenciales conflictos de personalidad
- Sugiere ajustes en el equipo

**Visualización**:
- Gráficos de distribución de personalidades
- Identificación de perfiles dominantes/faltantes

### 8.6. Registrar Outcomes (Resultados Reales)

Cuando el proyecto finaliza o ocurre un riesgo:

1. Navegue a la sección **"Resultados y Monitoreo"**
2. Clic en **"Registrar Outcome"**
3. Complete:
   - **Descripción**: Qué sucedió realmente
   - **Fecha**: Cuándo ocurrió
   - **Severidad Real**: Impacto observado
   - **Relación con Predicción**: ¿Coincidió?
   - **Notas**: Observaciones adicionales
4. Clic en **"Guardar"**

**Importancia de Outcomes**:
- Alimenta el sistema CBR con datos reales
- Mejora predicciones futuras
- Permite medir precisión del sistema

### 8.7. Completar Proyecto con Cuestionario

Al completar un proyecto:

1. Cambie el estado a **"Completado"**
2. Puede aparecer un **Cuestionario de Finalización**
3. Responda sobre:
   - Satisfacción con el equipo
   - Problemas encontrados
   - Precisión de las predicciones
   - Sugerencias de mejora
4. Puede **"Responder Ahora"** o **"Responder Después"** o **"Omitir"**

---

## 9. Notificaciones

### 9.1. Ver Notificaciones

**Acceso Rápido**:
- Clic en el **ícono de campana** (🔔) en la barra superior
- El número en el badge indica notificaciones sin leer

**Página Completa**:
- Navegue a `/notifications`
- Lista completa con:
  - Título y descripción
  - Fecha y hora
  - Estado (leída/no leída)
  - Tipo de notificación

### 9.2. Tipos de Notificaciones

**Proyectos**:
- Asignado a nuevo proyecto
- Cambio de estado del proyecto
- Nuevo miembro agregado al equipo
- Proyecto completado/cancelado

**Riesgos**:
- Nuevo riesgo identificado
- Riesgo actualizado
- Riesgo materializado

**Organizaciones**:
- Agregado como miembro
- Cambio de rol
- Nuevo CV recibido (admins)

**CV**:
- CV procesado exitosamente
- Error en procesamiento de CV

### 9.3. Gestionar Notificaciones

**Marcar como Leída**:
- Clic en una notificación la marca como leída automáticamente
- O use **"Marcar todas como leídas"**

**Eliminar**:
- Clic en el ícono de **papelera**
- Confirme si es necesario

**Filtrar**:
- **Todas**: Muestra todas las notificaciones
- **No Leídas**: Solo las sin leer
- **Por Tipo**: Filtra por categoría

### 9.4. Configurar Notificaciones

En su **Perfil** > **Preferencias** > **Notificaciones**:

- **Notificaciones por Email**: Active/desactive
- **Notificaciones en la App**: Active/desactive

---

## 10. Configuración de Idioma

### 10.1. Idiomas Disponibles

Sara soporta:
- 🇪🇸 **Español**
- 🇬🇧 **Inglés**

### 10.2. Cambiar Idioma

**Método 1: Desde el Selector de Idioma**

1. Clic en el **selector de idioma** en la barra superior (ícono de globo/bandera)
2. Seleccione el idioma deseado
3. La interfaz cambia inmediatamente

**Método 2: Desde el Perfil**

1. Vaya a **Perfil**
2. En la sección **"Preferencias"**
3. Seleccione el idioma en el dropdown
4. Guarde los cambios

### 10.3. Persistencia del Idioma

- La preferencia se guarda en el **backend**
- Se aplica en todos sus dispositivos
- Permanece después de cerrar sesión

---

## Glosario

**BFI-44**: Big Five Inventory de 44 preguntas. Cuestionario de personalidad.

**CBR**: Case-Based Reasoning. Razonamiento basado en casos previos.

**CV**: Curriculum Vitae. Documento de experiencia profesional.

**DT**: Decision Tree. Árbol de decisión para reglas expertas.

**Outcome**: Resultado real observado en un proyecto.

**Project Manager**: Usuario que puede crear y gestionar proyectos.

**Org Admin**: Administrador de Organización.

---

## Preguntas Frecuentes (FAQ)

**P: ¿Puedo cambiar mi rol?**
R: No puede cambiar su propio rol. Contacte al administrador.

**P: ¿Puedo pertenecer a varias organizaciones?**
R: Sí, puede ser miembro de múltiples organizaciones.

**P: ¿Puedo tener varios CVs?**
R: No, solo un CV activo. Puede actualizarlo cuando quiera.

**P: ¿Debo completar el BFI-44?**
R: Es opcional, pero muy recomendado para mejores predicciones de riesgos.

**P: ¿Cuánto tiempo toma el BFI-44?**
R: Aproximadamente 10-15 minutos.

**P: ¿Puedo cambiar mis respuestas del BFI-44?**
R: No después de enviarlo. Contacte al administrador para rehacerlo.

**P: ¿Quién ve mis resultados del BFI-44?**
R: Usted mismo, y administradores cuando analizan equipos (con permiso).

**P: ¿Qué formatos de CV acepta?**
R: PDF, DOC y DOCX, máximo 5MB.

**P: ¿Cómo funcionan las predicciones de riesgos?**
R: Usa 3 capas: Reglas expertas (DT), casos previos (CBR) y selección manual del PM.

**P: ¿Las predicciones son 100% precisas?**
R: No. Son probabilísticas. Se basan en datos históricos y mejoran con el tiempo.

**P: ¿Puedo crear proyectos siendo Employee?**
R: No. Solo Org Admins y Project Managers pueden crear proyectos.

**P: ¿Qué pasa si no otorgo consentimiento para procesar mi CV?**
R: El procesamiento automático estará deshabilitado. Debe ingresar datos manualmente.

**P: ¿La aplicación funciona en móvil?**
R: Sí, es responsive y funciona en navegadores móviles.

**P: ¿Qué navegadores son compatibles?**
R: Chrome, Firefox, Safari y Edge en versiones recientes.

**P: ¿Mis datos están seguros?**
R: Sí. Se usa encriptación HTTPS y cumplimiento de privacidad.

---

## Soporte

**Para problemas técnicos o preguntas**:
- Contacte al administrador de su organización
- O envíe un email a soporte con:
  - Descripción del problema
  - Pasos para reproducir
  - Capturas de pantalla
  - Navegador y versión

---

**Versión del Manual**: 2.0 (Basado en código real)  
**Fecha**: Enero 2026  
**Aplicación**: Sara - Sistema de Gestión de Proyectos con IA

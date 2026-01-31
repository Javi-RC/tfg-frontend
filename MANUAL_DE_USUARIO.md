# Manual de Usuario - Sara

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Primeros Pasos](#primeros-pasos)
3. [Perfil de Usuario](#perfil-de-usuario)
4. [Gestión de CV](#gestión-de-cv)
5. [Cuestionario BFI-44](#cuestionario-bfi-44)
6. [Organizaciones](#organizaciones)
7. [Proyectos](#proyectos)
8. [Predicción y Gestión de Riesgos](#predicción-y-gestión-de-riesgos)
9. [Notificaciones](#notificaciones)
10. [Configuración](#configuración)

---

## Introducción

**Sara** es una plataforma de gestión de proyectos con inteligencia artificial que ayuda a organizaciones a:

- Gestionar proyectos y equipos de trabajo
- Predecir riesgos de personal mediante análisis de personalidad (BFI-44) y competencias técnicas
- Administrar currículums y perfiles de empleados
- Tomar decisiones informadas sobre asignación de recursos

### Roles en la Plataforma

- **Empleado (Employee)**: Puede ver proyectos asignados y gestionar su perfil y CV
- **Administrador de Organización (Org Admin)**: Puede crear organizaciones, gestionar empleados, crear proyectos y acceder a CVs con consentimiento

---

## Primeros Pasos

### Registro

El registro consta de 3 pasos:

**Paso 1: Datos Personales**
1. Vaya a la página de registro
2. Ingrese su **nombre de usuario** (mínimo 3 caracteres)
3. Seleccione su rol:
   - **Administrador de Organización**: Si va a crear y gestionar una organización
   - **Empleado**: Si va a formar parte de un equipo
4. Haga clic en **"Siguiente"**

**Paso 2: Crear Contraseña**
1. Ingrese su **correo electrónico**
2. Cree una **contraseña** que cumpla los requisitos:
   - Mínimo 8 caracteres
   - Al menos una letra mayúscula
   - Al menos una letra minúscula
   - Al menos un número
   - Al menos un carácter especial
3. Confirme la contraseña
4. Haga clic en **"Siguiente"**

**Paso 3: Verificación**
1. Se enviará un correo electrónico de verificación a su email
2. Revise su bandeja de entrada (y spam)
3. Haga clic en el enlace de verificación
4. Su cuenta estará lista para usar

**¿No recibió el correo?**
- Puede hacer clic en **"Reenviar correo"** en la página de registro

### Inicio de Sesión

**Con Correo y Contraseña**
1. Vaya a `/login`
2. Ingrese su correo electrónico
3. Ingrese su contraseña
4. Haga clic en **"Iniciar sesión"**

**Con Google OAuth**
1. En la página de login, haga clic en **"Continuar con Google"**
2. Seleccione su cuenta de Google
3. Autorice el acceso
4. Será redirigido automáticamente a la aplicación

**Confirmación de Cuenta**
- Después del registro, debe confirmar su cuenta mediante el enlace en el correo
- Hasta que no confirme, no podrá iniciar sesión

---

## Perfil de Usuario

### Acceder al Perfil

1. Haga clic en su avatar/nombre en la barra de navegación superior
2. Seleccione **"Perfil"** del menú desplegable
3. O navegue directamente a `/` (página principal después del login)

### Información Personal

En el perfil puede ver y editar:

- **Nombre**: Su nombre de usuario
- **Correo Electrónico**: Email (no editable)
- **Rol**: Su rol en la plataforma
- **Organización**: Organización a la que pertenece (si aplica)

### Editar Perfil

1. Haga clic en **"Editar Perfil"**
2. Modifique los campos disponibles:
   - Nombre
   - País
   - Zona horaria
3. Configure sus **Preferencias**:
   - **Horario Flexible**: Active si tiene horario flexible
   - **Horas de trabajo preferidas**: Establezca su horario (ej: 09:00 - 18:00)
4. Configure **Notificaciones**:
   - Notificaciones por correo electrónico
   - Notificaciones en la aplicación
5. Haga clic en **"Guardar Cambios"**
6. O **"Cancelar"** para descartar los cambios

### Gestión de Consentimiento de CV

La plataforma requiere su consentimiento para procesar su CV con IA.

**Ver Estado del Consentimiento**
- En su perfil, sección "Consentimiento de Datos"
- Verá si ha aceptado o no el consentimiento
- Fecha de aceptación y versión de términos

**Otorgar Consentimiento**
1. Haga clic en **"Revisar y Aceptar"**
2. Lea los términos de consentimiento
3. Acepte los términos
4. Su CV podrá ser procesado automáticamente

**Revocar Consentimiento**
1. Haga clic en **"Revocar Consentimiento"**
2. Confirme la acción
3. El procesamiento IA de su CV será deshabilitado

### Acceso Rápido desde Perfil

**Gestión de CV**
- **"Ver mi CV"**: Accede a su CV
- **"Ver Estadísticas"** (Solo admins): Estadísticas de todos los CVs
- **"Ver Todos los CVs"** (Solo admins): Panel administrativo de CVs

### Eliminar Cuenta

⚠️ **Acción irreversible**

1. En su perfil, busque la sección "Zona de Peligro"
2. Haga clic en **"Eliminar Cuenta"**
3. Confirme escribiendo su correo electrónico
4. Haga clic en **"Confirmar Eliminación"**

**Consecuencias**:
- Se eliminan todos sus datos
- Pierde acceso a proyectos
- Se elimina su CV
- No es recuperable

---

## Gestión de CV

### Cargar un CV

#### Primera Carga

1. **Acceder a la Sección de CV**
   - Navegue a **"Mi CV"** desde el menú
   - O vaya a la ruta `/my-cv`

2. **Subir Archivo**
   - Si no tiene un CV cargado, verá un mensaje de estado vacío
   - Haga clic en **"Subir CV"**
   - Seleccione un archivo PDF, DOC o DOCX
   - Tamaño máximo: 5MB
   - Haga clic en **"Cargar"**

3. **Procesamiento Automático**
   - El sistema procesará su CV automáticamente
   - Extraerá información como:
     - Datos de contacto
     - Experiencia laboral
     - Educación
     - Habilidades técnicas
     - Idiomas
     - Certificaciones
     - Proyectos

4. **Revisión y Confirmación**
   - Revise la información extraída
   - Realice correcciones si es necesario
   - Guarde los cambios

#### Actualizar CV Existente

1. Vaya a **"Mi CV"**
2. Haga clic en el botón **"Subir Nuevo CV"**
3. Seleccione el nuevo archivo
4. Confirme que desea reemplazar el CV actual

### Editar CV

#### Modo de Edición

1. En la página **"Mi CV"**
2. Haga clic en el botón **"Editar"**
3. Se activará el modo de edición

#### Secciones Editables

**1. Información de Contacto**
- Nombre completo
- Correo electrónico
- Teléfono
- Ubicación
- LinkedIn
- GitHub
- Sitio web personal

**2. Experiencia Laboral**
- Empresa
- Cargo/Puesto
- Fecha de inicio y fin
- Descripción de responsabilidades
- Logros destacados

Acciones:
- **Agregar Experiencia**: Botón **"+ Agregar Experiencia"**
- **Editar Experiencia**: Haga clic en el ícono de lápiz
- **Eliminar Experiencia**: Haga clic en el ícono de papelera

**3. Educación**
- Institución
- Título/Grado
- Campo de estudio
- Fecha de inicio y fin
- Descripción

Acciones similares a Experiencia Laboral.

**4. Habilidades Técnicas**
- Nombre de la habilidad
- Nivel de competencia (Básico, Intermedio, Avanzado, Experto)
- Años de experiencia

**5. Idiomas**
- Idioma
- Nivel (A1, A2, B1, B2, C1, C2)

**6. Certificaciones**
- Nombre de la certificación
- Organización emisora
- Fecha de obtención
- Fecha de expiración (opcional)
- ID de credencial

**7. Proyectos**
- Nombre del proyecto
- Descripción
- Tecnologías utilizadas
- URL del proyecto
- Fecha de inicio y fin

#### Guardar Cambios

1. Después de realizar ediciones, haga clic en **"Guardar"**
2. El sistema validará la información
3. Se mostrarán mensajes de éxito o error
4. Puede hacer clic en **"Cancelar"** para descartar cambios

### Eliminar CV

1. En la página **"Mi CV"**
2. Haga clic en el botón **"Eliminar CV"**
3. Confirme la acción en el diálogo emergente
4. El CV será eliminado permanentemente

### Compartir CV con Organizaciones

#### Enviar CV a una Organización

1. En la página **"Mi CV"**
2. Haga clic en **"Enviar a Organización"**
3. Seleccione la organización destino del menú desplegable
4. Agregue un mensaje personalizado (opcional)
5. Haga clic en **"Enviar"**

**Requisitos**:
- Debe tener un CV cargado
- Debe haber otorgado consentimiento a la organización

### Estadísticas de CV (Solo Administradores)

Los administradores pueden acceder a estadísticas detalladas:

1. Navegue a **"Estadísticas de CV"**
2. Vea métricas como:
   - Total de CVs en el sistema
   - CVs procesados recientemente
   - Distribución por habilidades
   - Tendencias de carga

### Lista de CVs Administrados (Solo Administradores)

1. Navegue a **"Administrar CVs"**
2. Vea una lista completa de todos los CVs en el sistema
3. Funciones disponibles:
   - Ver detalles de cualquier CV
   - Buscar por nombre, habilidades o experiencia
   - Filtrar por estado
   - Exportar datos

---

## Cuestionario de Personalidad BFI-44

### ¿Qué es el BFI-44?

El **Big Five Inventory (BFI-44)** es un cuestionario psicológico de 44 preguntas que evalúa cinco dimensiones principales de la personalidad:

1. **Extraversión**: Nivel de sociabilidad y energía
2. **Amabilidad**: Capacidad de cooperación y empatía
3. **Responsabilidad**: Organización y orientación a objetivos
4. **Neuroticismo**: Estabilidad emocional
5. **Apertura**: Creatividad e interés por nuevas experiencias

### Completar el Cuestionario

#### Acceso al Cuestionario

1. Navegue a **"BFI-44"** desde el menú
2. O vaya a la ruta `/bfi-44`

#### Responder las Preguntas

1. **Formato del Cuestionario**
   - 44 preguntas en total
   - Dividido en 4 páginas (11 preguntas por página)
   - Escala de respuesta: 1 (Totalmente en desacuerdo) a 5 (Totalmente de acuerdo)

2. **Navegación**
   - Responda todas las preguntas en la página actual
   - Haga clic en **"Siguiente"** para avanzar
   - Use **"Anterior"** para volver a páginas previas
   - Un indicador de progreso muestra su avance

3. **Requisitos**
   - Debe responder todas las 44 preguntas
   - No puede enviar el cuestionario incompleto
   - Las respuestas se guardan localmente mientras navega

4. **Envío**
   - En la última página, haga clic en **"Enviar Cuestionario"**
   - El sistema procesará sus respuestas
   - Recibirá sus resultados inmediatamente

### Interpretar los Resultados

#### Visualización de Resultados

Los resultados se muestran de forma visual y numérica:

1. **Gráfico de Radar**
   - Muestra las 5 dimensiones
   - Valores de 0 a 100
   - Permite comparación visual rápida

2. **Puntuaciones Individuales**
   - Cada dimensión con su puntuación
   - Interpretación del nivel (Bajo, Medio, Alto)
   - Descripción de lo que significa

#### Niveles de Interpretación

**Extraversión**
- **Bajo (0-40)**: Reservado, prefiere actividades en solitario
- **Medio (40-60)**: Balance entre socialización y tiempo a solas
- **Alto (60-100)**: Muy sociable, energético, disfruta de la interacción

**Amabilidad**
- **Bajo (0-40)**: Competitivo, directo, independiente
- **Medio (40-60)**: Balance entre cooperación y firmeza
- **Alto (60-100)**: Muy cooperativo, empático, altruista

**Responsabilidad**
- **Bajo (0-40)**: Flexible, espontáneo, menos estructurado
- **Medio (40-60)**: Balance entre planificación y flexibilidad
- **Alto (60-100)**: Muy organizado, disciplinado, orientado a metas

**Neuroticismo**
- **Bajo (0-40)**: Emocionalmente estable, calmado
- **Medio (40-60)**: Balance emocional normal
- **Alto (60-100)**: Sensible emocionalmente, puede experimentar estrés

**Apertura**
- **Bajo (0-40)**: Práctico, convencional
- **Medio (40-60)**: Balance entre tradición e innovación
- **Alto (60-100)**: Creativo, curioso, abierto a nuevas experiencias

### Volver a Realizar el Cuestionario

1. Solo puede completar el cuestionario una vez
2. Para actualizarlo, contacte al administrador
3. Los resultados existentes se mostrarán en visitas posteriores

### Uso de Resultados en la Plataforma

Los resultados del BFI-44 se utilizan para:
- **Predicción de Riesgos**: Análisis de compatibilidad en equipos
- **Asignación de Proyectos**: Matching de personalidades
- **Recomendaciones**: Sugerencias de roles basadas en perfil
- **Análisis de Equipo**: Composición óptima de equipos

---

## Gestión de Organizaciones

### Ver Mis Organizaciones

1. Navegue a **"Organizaciones"** en el menú
2. Verá dos pestañas:
   - **Como Administrador**: Organizaciones que administra
   - **Como Miembro**: Organizaciones donde es empleado

### Crear una Organización (Solo Administradores)

#### Requisitos
- Rol de **Administrador de Organización** (`org_admin`)

#### Pasos para Crear

1. En la página **"Mis Organizaciones"**
2. Haga clic en **"+ Crear Organización"**
3. Complete el formulario:
   - **Nombre**: Nombre de la organización (obligatorio)
   - **Descripción**: Breve descripción (opcional)
   - **Sitio Web**: URL del sitio web (opcional)
   - **Ubicación**: Ciudad o país (opcional)
4. Haga clic en **"Crear"**

### Detalles de Organización

#### Información General

1. Haga clic en una tarjeta de organización
2. Verá la página de detalles con:
   - Nombre y descripción
   - Información de contacto
   - Estadísticas
   - Fecha de creación

#### Gestión de Empleados

**Agregar Empleados**
1. En la página de detalle de la organización
2. Sección **"Miembros del Equipo"**
3. Haga clic en **"Agregar Empleado"**
4. Ingrese el correo electrónico del usuario
5. Seleccione el rol (Employee, Project Manager)
6. Haga clic en **"Agregar"**

**Eliminar Empleados**
1. Localice al empleado en la lista
2. Haga clic en **"Eliminar"**
3. Confirme la acción

**Cambiar Roles**
1. Haga clic en **"Editar"** junto al empleado
2. Seleccione el nuevo rol
3. Guarde los cambios

#### CVs Recibidos

Los administradores de organización pueden ver CVs que han sido compartidos:

1. En la página de organización
2. Sección **"CVs Recibidos"**
3. Lista de CVs con información de:
   - Nombre del candidato
   - Fecha de envío
   - Estado del consentimiento
   - Acciones disponibles

**Revisar CV**
1. Haga clic en **"Ver Detalles"**
2. Acceda al CV completo del candidato
3. Puede exportar o imprimir el CV

### Editar Organización

1. En la página de detalle de la organización
2. Haga clic en **"Editar Organización"**
3. Modifique los campos deseados
4. Guarde los cambios

### Eliminar Organización

⚠️ **Solo para administradores principales**

1. En la página de detalle de la organización
2. Sección **"Zona de Peligro"**
3. Haga clic en **"Eliminar Organización"**
4. Confirme escribiendo el nombre de la organización
5. Confirme la eliminación

**Consecuencias**:
- Se eliminarán todos los proyectos asociados
- Se revocarán permisos de empleados
- No se eliminarán los CVs, solo las relaciones

---

## Gestión de Proyectos

### Vista General de Proyectos

#### Acceder a Proyectos

1. Navegue a **"Proyectos"** en el menú principal
2. O vaya a la ruta `/projects`

#### Pestañas de Proyectos

**1. Mis Proyectos**
- Proyectos que usted ha creado
- Proyectos donde es el líder o manager
- Control total sobre el proyecto

**2. Asignados a Mí**
- Proyectos donde es miembro del equipo
- Puede ver detalles y contribuir
- Acceso limitado según su rol

### Crear un Proyecto

#### Requisitos
- Rol de **Project Manager** o **Administrador**
- Pertenecer a una organización

#### Pasos para Crear

1. En la página de **Proyectos**
2. Haga clic en **"+ Crear Proyecto"**
3. Complete el formulario:

**Información Básica**
- **Nombre del Proyecto**: Título descriptivo (obligatorio)
- **Descripción**: Descripción detallada del proyecto (obligatorio)
- **Organización**: Seleccione de sus organizaciones (obligatorio)
- **Estado**: Planificación, Activo, En Pausa, Completado, Cancelado

**Fechas**
- **Fecha de Inicio**: Fecha de comienzo del proyecto (obligatorio)
- **Fecha de Fin Estimada**: Fecha esperada de finalización (obligatorio)

**Detalles del Proyecto**
- **Presupuesto**: Presupuesto asignado (opcional)
- **Prioridad**: Baja, Media, Alta, Crítica
- **Tecnologías**: Lista de tecnologías a utilizar
- **Objetivos**: Objetivos específicos del proyecto

**Equipo del Proyecto**
- **Líder del Proyecto**: Seleccione un Project Manager
- **Miembros del Equipo**: Agregue empleados de la organización
  - Haga clic en **"Agregar Miembro"**
  - Seleccione usuario
  - Asigne rol en el proyecto
  - Defina responsabilidades

4. Haga clic en **"Crear Proyecto"**

### Detalles del Proyecto

#### Vista de Detalles

1. Haga clic en un proyecto de la lista
2. Accederá a la página de detalles con:
   - Información general
   - Estado actual
   - Progreso
   - Equipo asignado
   - Riesgos identificados
   - Actividades recientes

#### Secciones Principales

**1. Resumen del Proyecto**
- Nombre y descripción
- Estado actual
- Fechas (inicio, fin estimada, fin real)
- Presupuesto y gasto actual
- Progreso general (porcentaje)

**2. Equipo del Proyecto**
- Lista de todos los miembros
- Roles de cada miembro
- Información de contacto
- Responsabilidades asignadas

**3. Análisis de Riesgos**
- Predicción de riesgos del proyecto
- Riesgos manuales registrados
- Nivel de riesgo general
- Factores de riesgo identificados
- Recomendaciones

**4. Actividad y Seguimiento**
- Timeline de actividades
- Cambios de estado
- Actualizaciones de progreso
- Comentarios y notas

### Editar Proyecto

1. En la página de detalles del proyecto
2. Haga clic en **"Editar Proyecto"**
3. Modifique los campos deseados:
   - Información básica
   - Fechas
   - Presupuesto
   - Estado
   - Miembros del equipo
4. Haga clic en **"Guardar Cambios"**

### Actualizar Estado del Proyecto

1. En la página de detalles del proyecto
2. Localice el selector de **Estado**
3. Seleccione el nuevo estado:
   - **Planificación**: Proyecto en fase inicial
   - **Activo**: Proyecto en desarrollo
   - **En Pausa**: Proyecto temporalmente detenido
   - **Completado**: Proyecto finalizado exitosamente
   - **Cancelado**: Proyecto terminado sin completar
4. El cambio se guarda automáticamente

### Gestión de Equipo en Proyectos

#### Agregar Miembros

1. En la página de edición del proyecto
2. Sección **"Miembros del Equipo"**
3. Haga clic en **"+ Agregar Miembro"**
4. Seleccione el empleado de la lista
5. Asigne un rol:
   - Desarrollador
   - Diseñador
   - Analista
   - Tester
   - DevOps
   - Otro (especificar)
6. Agregue responsabilidades específicas
7. Haga clic en **"Agregar"**

#### Eliminar Miembros

1. Localice al miembro en la lista
2. Haga clic en el ícono de **"Eliminar"**
3. Confirme la acción

#### Cambiar Roles de Miembros

1. Haga clic en **"Editar"** junto al miembro
2. Modifique el rol o responsabilidades
3. Guarde los cambios

### Análisis de Riesgos del Proyecto

#### Predicción Automática de Riesgos

El sistema analiza automáticamente varios factores:

**Factores Analizados**:
- Composición del equipo (personalidades del BFI-44)
- Experiencia técnica de los miembros
- Historial de proyectos anteriores
- Duración y complejidad del proyecto
- Tamaño del equipo

**Tipos de Riesgos**:
1. **Riesgos de Personal**
   - Incompatibilidad de personalidades
   - Falta de experiencia en tecnologías clave
   - Sobrecarga de trabajo

2. **Riesgos de Proyecto**
   - Plazos demasiado ajustados
   - Presupuesto insuficiente
   - Alcance poco claro

3. **Riesgos Técnicos**
   - Tecnologías inmaduras o sin experiencia
   - Dependencias externas
   - Deuda técnica

#### Ver Predicción de Riesgos

1. En la página de detalles del proyecto
2. Sección **"Análisis de Riesgos"**
3. Haga clic en **"Ver Predicción de Riesgos"**
4. Verá:
   - **Nivel de Riesgo Global**: Bajo, Medio, Alto, Crítico
   - **Desglose por Categorías**: Gráficos y métricas
   - **Factores Principales**: Lista priorizada de riesgos
   - **Recomendaciones**: Acciones sugeridas

#### Riesgos Manuales

Los Project Managers pueden registrar riesgos manualmente:

**Agregar Riesgo Manual**
1. En la sección **"Riesgos Manuales"**
2. Haga clic en **"+ Agregar Riesgo"**
3. Complete el formulario:
   - **Título**: Nombre del riesgo (obligatorio)
   - **Descripción**: Descripción detallada (obligatorio)
   - **Categoría**: Seleccione una categoría
     - Personal
     - Técnico
     - Presupuesto
     - Cronograma
     - Calidad
     - Externo
   - **Probabilidad**: Baja, Media, Alta (obligatorio)
   - **Impacto**: Bajo, Medio, Alto, Crítico (obligatorio)
   - **Plan de Mitigación**: Cómo reducir o manejar el riesgo (obligatorio)
   - **Responsable**: Quién se encargará de monitorear (opcional)
   - **Fecha Límite**: Fecha de revisión (opcional)
4. Haga clic en **"Guardar Riesgo"**

**Gestionar Riesgos Existentes**
- **Ver Detalles**: Haga clic en un riesgo para ver información completa
- **Editar**: Actualice información o estado del riesgo
- **Marcar como Resuelto**: Cuando el riesgo ya no aplica
- **Eliminar**: Elimine riesgos no relevantes

**Estados de Riesgos**:
- **Identificado**: Riesgo registrado pero no gestionado
- **En Seguimiento**: Se está monitoreando activamente
- **Mitigado**: Se han aplicado medidas de mitigación
- **Resuelto**: El riesgo ya no existe
- **Materializado**: El riesgo se ha convertido en un problema real

### Seguimiento de Resultados (Outcomes)

#### Registrar Resultados Reales

Cuando el proyecto avanza o finaliza:

1. En la página de detalles del proyecto
2. Sección **"Resultados y Monitoreo"**
3. Haga clic en **"Registrar Resultado"**
4. Complete:
   - **Resultado Observado**: Descripción del outcome real
   - **Fecha de Observación**: Cuándo ocurrió
   - **Severidad**: Nivel de impacto real
   - **Relación con Predicción**: ¿Coincidió con la predicción?
   - **Notas**: Observaciones adicionales
5. Haga clic en **"Guardar"**

#### Analizar Precisión de Predicciones

El sistema compara predicciones vs resultados reales:

1. Navegue a **"Análisis de Precisión"**
2. Vea métricas como:
   - Tasa de acierto de predicciones
   - Desviación promedio
   - Mejoras en el tiempo
   - Lecciones aprendidas

### Completar Proyecto

1. En la página de detalles del proyecto
2. Cuando el proyecto esté terminado, cambie el estado a **"Completado"**
3. O navegue a `/projects/:id/completion`
4. Complete el formulario de cierre:
   - **Fecha Real de Finalización**
   - **Costo Final Real**
   - **Resumen de Logros**
   - **Lecciones Aprendidas**
   - **Calificación del Equipo**
   - **Documentación Final**
5. Haga clic en **"Completar Proyecto"**

### Eliminar Proyecto

⚠️ **Solo para creadores o administradores**

1. En la página de detalles del proyecto
2. Haga clic en el botón **"Eliminar Proyecto"**
3. Confirme la acción
4. El proyecto será eliminado permanentemente

### Filtros y Búsqueda

#### Filtrar Proyectos

En la página principal de proyectos:

**Por Estado**
- Todos los estados
- Planificación
- Activo
- En Pausa
- Completado
- Cancelado

**Por Organización**
- Todas las organizaciones
- Organización específica (si pertenece a varias)

**Por Fecha**
- Todos los tiempos
- Últimos 7 días
- Último mes
- Último trimestre
- Año actual

#### Buscar Proyectos

1. Use la barra de búsqueda en la parte superior
2. Busque por:
   - Nombre del proyecto
   - Descripción
   - Tecnologías
   - Miembros del equipo

#### Ordenar Proyectos

Ordene la lista por:
- Fecha de creación (más reciente primero)
- Fecha de inicio
- Fecha de finalización
- Prioridad
- Nombre (A-Z o Z-A)

---

## Sistema de Notificaciones

### Tipos de Notificaciones

La plataforma envía notificaciones para:

1. **Proyectos**
   - Nuevo proyecto asignado
   - Cambio de estado del proyecto
   - Actualización de fechas
   - Nuevo miembro agregado

2. **Riesgos**
   - Nuevo riesgo identificado
   - Riesgo escalado
   - Riesgo resuelto
   - Recordatorio de revisión de riesgo

3. **Organizaciones**
   - Agregado como miembro
   - Cambio de rol
   - Nuevo CV recibido

4. **CV y Consentimientos**
   - CV procesado exitosamente
   - Consentimiento próximo a expirar
   - Solicitud de acceso a CV

5. **Perfil**
   - Perfil actualizado
   - Cambio de configuración
   - Actividad de seguridad

### Ver Notificaciones

#### Acceso Rápido

1. Haga clic en el **ícono de campana** en la barra de navegación
2. Verá un resumen de notificaciones recientes
3. El número en el badge indica notificaciones no leídas

#### Página de Notificaciones

1. Navegue a **"Notificaciones"**
2. O vaya a la ruta `/notifications`
3. Verá todas las notificaciones con:
   - Título y descripción
   - Fecha y hora
   - Estado (leída/no leída)
   - Tipo de notificación
   - Acciones relacionadas

### Gestionar Notificaciones

#### Marcar como Leída

1. Haga clic en una notificación
2. Se marcará automáticamente como leída
3. O use el botón **"Marcar todas como leídas"**

#### Eliminar Notificaciones

1. Deslice la notificación hacia la izquierda
2. O haga clic en el ícono de **"Eliminar"**
3. Confirme si es necesario

#### Filtrar Notificaciones

- **Todas**: Todas las notificaciones
- **No Leídas**: Solo notificaciones sin leer
- **Por Tipo**: Filtre por categoría (Proyectos, Riesgos, etc.)
- **Por Fecha**: Últimas 24h, última semana, etc.

### Configurar Preferencias de Notificaciones

1. Vaya a **Perfil** > **Preferencias**
2. Sección **"Notificaciones"**
3. Configure:
   - Notificaciones por email
   - Notificaciones en la aplicación
   - Frecuencia de resúmenes
   - Tipos de eventos a notificar
4. Guarde los cambios

---

## Configuración y Preferencias

### Cambiar Idioma

La aplicación soporta múltiples idiomas: **Español** e **Inglés**.

#### Método 1: Desde el Perfil

1. Vaya a **Perfil**
2. Sección **"Preferencias"**
3. En **"Idioma"**, seleccione su idioma preferido
4. La interfaz cambiará inmediatamente

#### Método 2: Desde el Selector de Idioma

1. Haga clic en el **selector de idioma** en la barra de navegación (generalmente indicado por un ícono de globo o bandera)
2. Seleccione el idioma deseado
3. La aplicación se actualizará automáticamente

**Nota**: La preferencia de idioma se guarda en el servidor y se aplicará en todos sus dispositivos.

### Preferencias de Accesibilidad

La aplicación incluye características de accesibilidad:

1. **Navegación por Teclado**
   - Use `Tab` para navegar entre elementos
   - Use `Enter` o `Espacio` para activar botones
   - Use `Esc` para cerrar modales

2. **Lectores de Pantalla**
   - Soporte completo para NVDA, JAWS y VoiceOver
   - Etiquetas ARIA en todos los elementos interactivos
   - Anuncios de cambios de estado

3. **Skip Links**
   - Use `Tab` al cargar la página para acceder a "Saltar al contenido principal"
   - Facilita la navegación para usuarios de teclado

### Temas y Apariencia

Actualmente la aplicación usa un tema claro consistente. Futuras versiones pueden incluir:
- Modo oscuro
- Tamaño de fuente ajustable
- Contraste alto

---

## Roles y Permisos

### Tipos de Roles

La plataforma tiene cuatro roles principales:

#### 1. Usuario (User)

**Permisos**:
- ✅ Gestionar su propio perfil
- ✅ Cargar y editar su CV
- ✅ Completar cuestionario BFI-44
- ✅ Ver proyectos donde está asignado
- ✅ Otorgar/revocar consentimientos
- ✅ Ver notificaciones personales
- ❌ No puede crear proyectos
- ❌ No puede gestionar organizaciones

**Casos de Uso**:
- Empleados que solo necesitan gestionar su información
- Colaboradores externos
- Candidatos en proceso de selección

#### 2. Project Manager

**Permisos** (incluye todos los de Usuario más):
- ✅ Crear proyectos
- ✅ Editar proyectos que lidera
- ✅ Agregar/eliminar miembros del equipo
- ✅ Registrar riesgos manuales
- ✅ Ver predicciones de riesgos
- ✅ Actualizar estado de proyectos
- ✅ Registrar resultados (outcomes)
- ❌ No puede gestionar organizaciones
- ❌ No puede ver CVs de otros usuarios (excepto con consentimiento)

**Casos de Uso**:
- Gerentes de proyecto
- Líderes de equipo
- Coordinadores de proyectos

#### 3. Administrador de Organización (Org Admin)

**Permisos** (incluye todos los de Project Manager más):
- ✅ Crear organizaciones
- ✅ Editar organizaciones
- ✅ Agregar/eliminar empleados
- ✅ Ver CVs con consentimiento
- ✅ Acceder a estadísticas de CVs
- ✅ Ver lista de todos los CVs en la organización
- ✅ Gestionar consentimientos
- ✅ Ver todos los proyectos de la organización

**Casos de Uso**:
- Propietarios de empresas
- Directores de RRHH
- Administradores de sistemas

#### 4. Super Admin (System Admin)

**Permisos** (incluye todos los permisos anteriores más):
- ✅ Acceso completo a todas las organizaciones
- ✅ Ver todos los CVs del sistema
- ✅ Gestionar todos los usuarios
- ✅ Acceder a logs y métricas del sistema
- ✅ Configurar parámetros del sistema

**Casos de Uso**:
- Administradores de la plataforma
- Soporte técnico de nivel 3

### Cambiar de Rol

Los usuarios no pueden cambiar su propio rol. Para solicitar un cambio de rol:

1. Contacte al administrador de su organización
2. O envíe una solicitud al soporte técnico
3. El administrador puede cambiar su rol desde la gestión de empleados

---

## Solución de Problemas

### Problemas Comunes

#### No Puedo Iniciar Sesión

**Posibles Causas y Soluciones**:

1. **Contraseña Incorrecta**
   - Use la opción "¿Olvidó su contraseña?"
   - Recibirá un email con instrucciones

2. **Cuenta No Verificada**
   - Revise su correo electrónico
   - Busque el email de verificación
   - Haga clic en el enlace de confirmación
   - Si no recibió el email, use la opción "Reenviar verificación"

3. **Cuenta Bloqueada**
   - Después de múltiples intentos fallidos, la cuenta puede bloquearse
   - Espere 30 minutos e intente nuevamente
   - O contacte al administrador

#### Error al Cargar CV

**Problemas Comunes**:

1. **Archivo Demasiado Grande**
   - El límite es 5MB
   - Comprima el PDF o reduzca la resolución de imágenes
   - Use herramientas online para reducir el tamaño

2. **Formato No Soportado**
   - Formatos aceptados: PDF, DOC, DOCX
   - Convierta su archivo al formato correcto

3. **Error de Procesamiento**
   - El sistema no pudo extraer información
   - Asegúrese de que el CV sea un documento de texto, no una imagen escaneada
   - Use un formato estándar y estructurado

4. **Problemas de Red**
   - Verifique su conexión a internet
   - Intente nuevamente en unos minutos
   - Si el problema persiste, contacte a soporte

#### El Cuestionario BFI-44 No Se Guarda

**Soluciones**:

1. **Respuestas Incompletas**
   - Debe responder todas las 44 preguntas
   - Revise que no haya preguntas sin marcar
   - El sistema mostrará un contador de respuestas

2. **Problemas de Sesión**
   - Su sesión puede haber expirado
   - Guarde sus respuestas y vuelva a iniciar sesión
   - Intente nuevamente

3. **Error del Servidor**
   - Espere unos minutos
   - Refresque la página
   - Sus respuestas pueden estar guardadas localmente

#### No Veo un Proyecto o No Puedo Editar

**Posibles Razones**:

1. **Permisos Insuficientes**
   - Solo Project Managers y Admins pueden crear/editar proyectos
   - Solo puede editar proyectos que creó o donde es líder

2. **No Asignado al Proyecto**
   - Debe ser miembro del equipo para ver el proyecto
   - Contacte al líder del proyecto para ser agregado

3. **Proyecto Eliminado**
   - El proyecto puede haber sido eliminado por el creador
   - Contacte al administrador para más información

#### Las Notificaciones No Llegan

**Verificaciones**:

1. **Configuración de Notificaciones**
   - Revise su perfil > Preferencias > Notificaciones
   - Asegúrese de que las notificaciones estén habilitadas

2. **Email en Spam**
   - Revise su carpeta de spam/correo no deseado
   - Agregue el dominio de la aplicación a sus contactos seguros

3. **Problemas del Navegador**
   - Limpie la caché del navegador
   - Intente con otro navegador
   - Actualice la página

### Mensajes de Error Comunes

#### "No tiene permiso para realizar esta acción"

**Significado**: Su rol no tiene los permisos necesarios.

**Solución**:
- Verifique su rol en el perfil
- Contacte al administrador si necesita más permisos
- Asegúrese de estar en la organización correcta

#### "Sesión expirada"

**Significado**: Su sesión de autenticación ha caducado.

**Solución**:
- Vuelva a iniciar sesión
- La sesión expira después de cierto tiempo de inactividad
- Por seguridad, no deje sesiones abiertas por largos períodos

#### "Error de conexión"

**Significado**: No se puede comunicar con el servidor.

**Solución**:
- Verifique su conexión a internet
- El servidor puede estar en mantenimiento
- Intente nuevamente en unos minutos
- Contacte a soporte si persiste

#### "CV ya existe"

**Significado**: Ya tiene un CV cargado.

**Solución**:
- Use la opción "Actualizar CV" en lugar de "Subir CV"
- O elimine el CV existente primero
- Cada usuario solo puede tener un CV activo

### Problemas de Rendimiento

#### La Aplicación Está Lenta

**Soluciones**:

1. **Limpiar Caché del Navegador**
   - Chrome: Settings > Privacy > Clear browsing data
   - Firefox: Options > Privacy > Clear Data
   - Safari: Preferences > Privacy > Manage Website Data

2. **Cerrar Pestañas Innecesarias**
   - Múltiples pestañas consumen recursos
   - Cierre otras aplicaciones pesadas

3. **Actualizar Navegador**
   - Use la última versión de su navegador
   - Navegadores soportados: Chrome, Firefox, Safari, Edge

4. **Verificar Conexión**
   - Una conexión lenta afecta el rendimiento
   - Use una conexión estable y rápida

### Contactar Soporte

Si no puede resolver un problema:

1. **Email de Soporte**
   - Envíe un correo detallado
   - Incluya:
     - Descripción del problema
     - Pasos para reproducir
     - Capturas de pantalla
     - Navegador y versión
     - Hora en que ocurrió el error

2. **Información Útil**
   - Mensajes de error completos
   - URL donde ocurrió el problema
   - Acciones que realizó antes del error

3. **Tiempo de Respuesta**
   - Soporte responde en 24-48 horas laborables
   - Problemas críticos se priorizan

---

## Mejores Prácticas

### Para Usuarios

1. **Mantener CV Actualizado**
   - Actualice su CV cada 3-6 meses
   - Agregue nuevas habilidades y experiencias
   - Revise que la información sea precisa

2. **Completar el BFI-44**
   - Complete el cuestionario con sinceridad
   - Los resultados mejoran la precisión de las predicciones
   - Solo se puede completar una vez, tómese su tiempo

3. **Revisar Notificaciones**
   - Revise notificaciones regularmente
   - Configure preferencias de notificación según sus necesidades
   - Marque como leídas para mantener organizado

4. **Seguridad**
   - Use contraseñas fuertes y únicas
   - No comparta sus credenciales
   - Cierre sesión en dispositivos compartidos

### Para Project Managers

1. **Planificación de Proyectos**
   - Defina objetivos claros desde el inicio
   - Asigne fechas realistas
   - Documente el alcance detalladamente

2. **Gestión de Equipo**
   - Agregue todos los miembros relevantes
   - Asigne roles claros
   - Actualice el equipo cuando haya cambios

3. **Seguimiento de Riesgos**
   - Revise predicciones de riesgos regularmente
   - Registre riesgos manuales cuando los identifique
   - Actualice el estado de los riesgos
   - Documente planes de mitigación

4. **Actualización de Estado**
   - Mantenga el estado del proyecto actualizado
   - Registre el progreso regularmente
   - Documente cambios significativos

5. **Finalización**
   - Complete el formulario de cierre cuando termine
   - Documente lecciones aprendidas
   - Registre outcomes reales para mejorar predicciones futuras

### Para Administradores de Organización

1. **Gestión de Empleados**
   - Mantenga la lista de empleados actualizada
   - Asigne roles apropiados
   - Revoque accesos cuando sea necesario

2. **Revisión de CVs**
   - Revise CVs recibidos regularmente
   - Respete los consentimientos otorgados
   - Gestione expiración de consentimientos

3. **Supervisión de Proyectos**
   - Monitoree el progreso de todos los proyectos
   - Identifique proyectos en riesgo tempranamente
   - Apoye a los Project Managers con recursos

4. **Organización**
   - Mantenga información de la organización actualizada
   - Configure políticas y procedimientos
   - Documente procesos internos

---

## Glosario de Términos

**BFI-44**: Big Five Inventory con 44 preguntas. Cuestionario psicológico que mide cinco dimensiones de personalidad.

**Big Five**: Las cinco grandes dimensiones de personalidad: Extraversión, Amabilidad, Responsabilidad, Neuroticismo y Apertura.

**Consentimiento**: Permiso explícito otorgado por un usuario para que una organización acceda a su CV.

**CV**: Curriculum Vitae. Documento que resume experiencia profesional, educación y habilidades.

**Outcome**: Resultado real observado en un proyecto, usado para comparar con predicciones.

**Project Manager**: Usuario con permiso para crear y gestionar proyectos.

**Predicción de Riesgos**: Análisis automático que identifica posibles problemas en un proyecto basándose en datos históricos y características del equipo.

**Riesgo Manual**: Riesgo identificado y registrado manualmente por un Project Manager.

**Org Admin**: Administrador de Organización. Usuario con permisos para gestionar una empresa.

**Token**: Credencial de autenticación temporal que permite al sistema identificar al usuario.

---

## Preguntas Frecuentes (FAQ)

### General

**P: ¿La aplicación es gratuita?**
R: Depende del plan de su organización. Contacte al administrador para detalles.

**P: ¿Puedo usar la aplicación en móvil?**
R: Sí, la aplicación es responsive y funciona en navegadores móviles. No hay app nativa aún.

**P: ¿Qué navegadores son soportados?**
R: Chrome, Firefox, Safari y Edge en sus últimas versiones.

**P: ¿Mis datos están seguros?**
R: Sí, usamos encriptación HTTPS, almacenamiento seguro y cumplimos con regulaciones de privacidad.

### Cuenta y Perfil

**P: ¿Puedo cambiar mi correo electrónico?**
R: Contacte al administrador para cambios de correo electrónico.

**P: ¿Puedo tener múltiples cuentas?**
R: No, cada usuario debe tener una única cuenta.

**P: ¿Cómo elimino mi cuenta?**
R: Vaya a Perfil > Zona de Peligro > Eliminar Cuenta.

### CV

**P: ¿Puedo tener varios CVs?**
R: No, solo puede tener un CV activo. Puede actualizarlo cuando desee.

**P: ¿Qué formatos de CV se aceptan?**
R: PDF, DOC y DOCX. Tamaño máximo 5MB.

**P: ¿Quién puede ver mi CV?**
R: Solo organizaciones a las que otorgó consentimiento pueden verlo.

**P: ¿Cómo actualizo mi CV?**
R: Vaya a Mi CV > Editar, o suba un nuevo archivo.

### BFI-44

**P: ¿Debo completar el BFI-44?**
R: Es opcional pero recomendado para predicciones de riesgos más precisas.

**P: ¿Cuánto tiempo toma?**
R: Aproximadamente 10-15 minutos.

**P: ¿Puedo cambiar mis respuestas?**
R: No después de enviar. Contacte al administrador si necesita rehacerlo.

**P: ¿Quién ve mis resultados?**
R: Solo usted y administradores con permisos especiales.

### Proyectos

**P: ¿Puedo crear proyectos?**
R: Solo si es Project Manager o Admin.

**P: ¿Cuántos proyectos puedo crear?**
R: No hay límite establecido.

**P: ¿Cómo me asignan a un proyecto?**
R: El Project Manager debe agregarlo al equipo.

**P: ¿Puedo salir de un proyecto?**
R: Contacte al líder del proyecto para ser removido.

### Organizaciones

**P: ¿Puedo pertenecer a varias organizaciones?**
R: Sí, puede ser miembro de múltiples organizaciones.

**P: ¿Cómo creo una organización?**
R: Debe tener rol de Org Admin para crear organizaciones.

**P: ¿Puedo cambiar de organización?**
R: Sí, pero debe ser agregado por el admin de la nueva organización.

---

## Actualizaciones y Nuevas Funciones

La aplicación se actualiza regularmente. Para estar al tanto:

1. **Notas de Versión**
   - Revise las notas de versión en actualizaciones
   - Incluyen nuevas funciones y correcciones

2. **Anuncios**
   - Anuncios importantes aparecen en el inicio
   - También se envían por email

3. **Feedback**
   - Sus comentarios son valiosos
   - Contacte a soporte para sugerencias
   - Reporte bugs para mejorar la plataforma

---

## Conclusión

Este manual cubre las funcionalidades principales de la plataforma. Para soporte adicional:

- **Email de Soporte**: [soporte@plataforma.com]
- **Documentación Técnica**: Disponible para desarrolladores
- **Base de Conocimientos**: FAQ extendida online
- **Tutoriales en Video**: Próximamente disponibles

¡Gracias por usar nuestra plataforma!

---

**Versión del Manual**: 1.0  
**Fecha de Actualización**: Enero 2026  
**Compatible con**: Todas las versiones actuales de la aplicación

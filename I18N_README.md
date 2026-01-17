# Sistema de Internacionalización (i18n)

## Descripción

Este proyecto incluye soporte para múltiples idiomas usando `react-i18next`. Actualmente soporta:
- 🇬🇧 Inglés (English)
- 🇪🇸 Español (Castellano)

## Estructura de Archivos

```
src/
├── i18n/
│   ├── index.js              # Configuración de i18next
│   └── locales/
│       ├── en.json           # Traducciones en inglés
│       └── es.json           # Traducciones en español
├── components/
│   └── LanguageSwitcher.jsx  # Componente selector de idioma
└── main.jsx                  # Importa la configuración de i18n
```

## Cómo Usar las Traducciones

### En Componentes Funcionales

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('auth.login')}</h1>
      <p>{t('auth.dontHaveAccount')}</p>
    </div>
  );
}
```

### Traducciones con Parámetros

```jsx
// En el archivo de traducción
{
  "errors": {
    "minLength": "Minimum length is {{count}} characters"
  }
}

// En el componente
<p>{t('errors.minLength', { count: 8 })}</p>
```

### Cambiar el Idioma Programáticamente

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const changeToSpanish = () => {
    i18n.changeLanguage('es');
  };
  
  const changeToEnglish = () => {
    i18n.changeLanguage('en');
  };
}
```

## Agregar Nuevas Traducciones

### 1. Agregar la clave en ambos archivos de idioma

**src/i18n/locales/en.json:**
```json
{
  "myNewSection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

**src/i18n/locales/es.json:**
```json
{
  "myNewSection": {
    "title": "Mi Título",
    "description": "Mi Descripción"
  }
}
```

### 2. Usar la traducción en tu componente

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myNewSection.title')}</h1>
      <p>{t('myNewSection.description')}</p>
    </div>
  );
}
```

## Estructura de las Traducciones

Las traducciones están organizadas en las siguientes categorías:

- **app**: Información general de la aplicación
- **navigation**: Elementos de navegación y menús
- **auth**: Autenticación y login
- **register**: Registro de usuarios
- **profile**: Perfil de usuario
- **projects**: Gestión de proyectos
- **cv**: Currículum vitae
- **organizations**: Organizaciones
- **notifications**: Notificaciones
- **common**: Textos comunes (botones, mensajes, etc.)
- **errors**: Mensajes de error

## Componente LanguageSwitcher

El componente `LanguageSwitcher` se encuentra en:
- Barra de navegación superior (TopNavBar)
- Header de autenticación (AuthHeader)

Permite a los usuarios cambiar entre idiomas de forma visual con banderas y nombres de idiomas.

## Detección Automática de Idioma

El sistema detecta automáticamente el idioma del navegador del usuario. Si no está disponible, utiliza inglés como idioma predeterminado.

La preferencia del usuario se guarda en `localStorage` para mantener la selección entre sesiones.

## Agregar un Nuevo Idioma

### 1. Crear el archivo de traducciones

Crea un nuevo archivo en `src/i18n/locales/`:
```
src/i18n/locales/fr.json  // Para francés, por ejemplo
```

### 2. Registrar el idioma en la configuración

En `src/i18n/index.js`:
```js
import frTranslations from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations }  // Nuevo idioma
    },
    // ...
  });
```

### 3. Actualizar el LanguageSwitcher

En `src/components/LanguageSwitcher.jsx`:
```js
const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' }  // Nuevo idioma
];
```

## Buenas Prácticas

1. **Mantén consistencia**: Usa la misma estructura de claves en todos los archivos de idioma
2. **Usa nombres descriptivos**: Las claves deben ser claras y descriptivas
3. **Evita hardcodear texto**: Todo texto visible debe estar en los archivos de traducción
4. **Agrupa traducciones relacionadas**: Usa objetos anidados para organizar traducciones por contexto
5. **Revisa regularmente**: Asegúrate de que todas las traducciones estén actualizadas

## Solución de Problemas

### El texto no se traduce
- Verifica que la clave existe en ambos archivos de idioma
- Comprueba que la ruta de la clave es correcta (ej: `auth.login` no `auth/login`)
- Asegúrate de que el componente está usando `useTranslation`

### El idioma no cambia
- Verifica que el navegador tiene permisos para `localStorage`
- Comprueba la consola del navegador para errores
- Asegúrate de que el idioma está correctamente configurado en `i18n/index.js`

### Las traducciones no se cargan
- Verifica que los archivos JSON están correctamente formateados
- Asegúrate de que `src/i18n` está importado en `main.jsx`
- Comprueba que no hay errores de sintaxis en los archivos de traducción

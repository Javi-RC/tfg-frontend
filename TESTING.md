# Testing Guide

## Configuración de Jest

Este proyecto utiliza **Jest** y **React Testing Library** para realizar pruebas unitarias e de integración.

## Scripts Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se ejecutan automáticamente al guardar cambios)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

## Estructura de Tests

Los archivos de test se encuentran junto a los archivos que prueban, siguiendo la convención:
- `Component.test.jsx` para componentes React
- `utils.test.js` para utilidades JavaScript

### Tests Implementados

#### Componentes
- ✅ `PrimaryButton.test.jsx` - Botón primario con 10 tests
- ✅ `SecondaryButton.test.jsx` - Botón secundario con 9 tests
- ✅ `Badge.test.jsx` - Componente de badge con 15 tests

#### Utilidades
- ✅ `dateHelpers.test.js` - Funciones de fechas con 27 tests
- ✅ `stringHelpers.test.js` - Funciones de strings con 48 tests

#### Validadores
- ✅ `authValidators.test.js` - Validaciones de autenticación con 22 tests

**Total: 131 tests pasando ✅**

## Escribir Nuevos Tests

### Ejemplo para Componentes React

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Ejemplo para Funciones Puras

```javascript
import { myFunction } from './myUtils';

describe('myFunction', () => {
  it('returns expected value', () => {
    expect(myFunction('input')).toBe('expected');
  });

  it('handles edge cases', () => {
    expect(myFunction(null)).toBe('fallback');
  });
});
```

## Buenas Prácticas

1. **Nombres descriptivos**: Usa descripciones claras de lo que prueba cada test
2. **Arrange-Act-Assert**: Organiza los tests en tres secciones claras
3. **Un test, una cosa**: Cada test debe verificar un solo comportamiento
4. **Tests independientes**: Los tests no deben depender unos de otros
5. **Mock cuando sea necesario**: Usa mocks para aislar el código que pruebas

## Configuración

### jest.config.cjs
Configuración principal de Jest con:
- Entorno jsdom para simular el DOM
- Mapeo de módulos para CSS e imágenes
- Transformación de archivos JSX con Babel

### babel.config.cjs
Configuración de Babel para transpilar JSX y ES modules

### jest.setup.js
Configuración inicial que importa `@testing-library/jest-dom`

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Troubleshooting

### Error: Cannot find module
Verifica que la ruta de importación en el test sea correcta y relativa al archivo de test.

### Tests fallan con import de CSS
Ya está configurado `identity-obj-proxy` para manejar imports de CSS en los tests.

### Error con JSX
Asegúrate de que el archivo tenga extensión `.jsx` o `.tsx` si contiene JSX.

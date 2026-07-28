export function getProficiencyScore(proficiency) {
  const map = {
    basico: 1,
    básico: 1,
    intermedio: 2,
    avanzado: 3,
    experto: 4,
    expert: 4,
  };
  return map[proficiency?.toLowerCase()] || 2;
}

export function getProficiencyColor(score) {
  if (score >= 3.5) return '#28a745';
  if (score >= 2.5) return '#007bff';
  if (score >= 1.5) return '#ffc107';
  return '#dc3545';
}

export function getCategoryColor(category) {
  const colors = {
    frontend: '#61dafb',
    backend: '#68a063',
    lenguaje: '#f7df1e',
    framework: '#764abc',
    base_datos: '#336791',
    cloud: '#ff9900',
    devops: '#0db7ed',
    testing: '#e44d26',
    herramienta: '#6e7271',
    default: '#95a5a6',
  };
  return colors[category?.toLowerCase()] || colors.default;
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

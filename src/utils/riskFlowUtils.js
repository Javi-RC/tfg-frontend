import dagre from 'dagre';
import i18n from '../i18n';

/**
 * Risk Flow Utilities
 * Transform risk data into React Flow node/edge format
 */

/**
 * Get risk category from risk type
 */
export const getRiskCategory = (type) => {
  const categories = {
    communication_breakdown: 'riskCategories.teamCommunication',
    skill_gap: 'riskCategories.teamCommunication',
    team_overload: 'riskCategories.teamCommunication',
    dependency_blockage: 'riskCategories.technical',
    technical_infrastructure: 'riskCategories.technical',
    quality_degradation: 'riskCategories.technical',
    scope_creep: 'riskCategories.management',
    process_mismatch: 'riskCategories.management',
    other: 'riskCategories.other',
  };
  const key = categories[type] || 'riskCategories.other';
  return i18n.t(key);
};

/**
 * Get human-readable risk type label
 */
export const getRiskTypeLabel = (type) => {
  const key = `riskTypes.${type}`;
  const translated = i18n.t(key);
  if (translated && translated !== key) return translated;

  return (
    String(type || '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || i18n.t('riskTypes.other')
  );
};

const getRiskStableId = (risk, index) => {
  const candidate = risk?.id ?? risk?._id;
  if (candidate) return String(candidate);
  if (risk?.type) return `${String(risk.type)}-${index}`;
  return `risk-${index}`;
};

/**
 * Transform risks array into React Flow nodes and edges
 */
export const transformRisksToFlow = (
  predictedRisks = [],
  actualizedRisks = [],
  projectName
) => {
  const displayName = projectName || i18n.t('common.project');
  const nodes = [];
  const edges = [];

  // 1. Create root node (Project) - centered
  nodes.push({
    id: 'root',
    type: 'risk',
    position: { x: 800, y: 50 },
    data: {
      label: displayName,
      isRoot: true,
    },
  });

  // 2. Group risks by category
  const risksByCategory = {};
  predictedRisks.forEach((risk) => {
    const category = getRiskCategory(risk.type);
    if (!risksByCategory[category]) {
      risksByCategory[category] = [];
    }
    risksByCategory[category].push(risk);
  });

  const categories = Object.keys(risksByCategory);

  // 3. Create category nodes
  categories.forEach((category) => {
    const categoryId = `cat-${category.toLowerCase().replace(/\s+/g, '-')}`;

    nodes.push({
      id: categoryId,
      type: 'risk',
      position: { x: 0, y: 0 }, // Will be set by Dagre
      data: {
        label: category,
        isCategory: true,
      },
    });

    // Edge from root to category
    edges.push({
      id: `e-root-${categoryId}`,
      source: 'root',
      target: categoryId,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#9CA3AF', strokeWidth: 3 },
    });

    // 4. Create risk nodes for this category
    const risks = risksByCategory[category];

    risks.forEach((risk, riskIndex) => {
      // Find if this risk has been actualized
      const stableRiskId = getRiskStableId(risk, riskIndex);
      const actualized = actualizedRisks.find((ar) => String(ar.riskId) === stableRiskId);

      const riskNodeId = `risk-${stableRiskId}`;

      nodes.push({
        id: riskNodeId,
        type: 'risk',
        position: { x: 0, y: 0 }, // Will be set by Dagre
        data: {
          label: getRiskTypeLabel(risk.type),
          severity: risk.severity,
          occurred: actualized?.occurred,
          type: risk.type,
          probability: risk.probability,
          riskData: risk,
          onClick: () => {}, // Will be handled by parent
        },
      });

      // Edge from category to risk
      edges.push({
        id: `e-${categoryId}-${riskNodeId}`,
        source: categoryId,
        target: riskNodeId,
        type: 'smoothstep',
        animated: actualized?.occurred === true,
        style: {
          stroke:
            actualized?.occurred === true
              ? '#10B981'
              : actualized?.occurred === false
                ? '#D1D5DB'
                : '#9CA3AF',
          strokeWidth: actualized?.occurred === true ? 3 : 2,
        },
      });
    });
  });

  // Apply Dagre layout
  return applyDagreLayout(nodes, edges);
};

/**
 * Apply Dagre layout to nodes and edges
 * Uses hierarchical layout algorithm optimized for directed graphs
 */
export const applyDagreLayout = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure layout
  dagreGraph.setGraph({
    rankdir: 'TB', // Top to Bottom
    nodesep: 120, // Horizontal spacing between nodes
    ranksep: 150, // Vertical spacing between ranks
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    // Set node dimensions (approximate size of risk nodes)
    const width = node.data.isRoot ? 200 : node.data.isCategory ? 220 : 180;
    const height = node.data.isRoot ? 60 : node.data.isCategory ? 50 : 120;

    dagreGraph.setNode(node.id, { width, height });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

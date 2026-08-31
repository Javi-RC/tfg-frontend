import { useState, useEffect, useCallback } from 'react';
import { getExpertRulesConfig, updateExpertRulesConfig } from '../api/organization';
import { getDefaultConfig, PRESETS } from '../utils/decisionTreeValidation';

export function useExpertRulesConfig(organizationId) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!organizationId) {
      setConfig(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getExpertRulesConfig(organizationId);
      const remote = res?.data?.data || res?.data;
      setConfig(getDefaultConfig(remote));
    } catch {
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (newConfig) => {
    if (!organizationId) return;
    setSaving(true);
    try {
      await updateExpertRulesConfig(organizationId, newConfig);
      setConfig(getDefaultConfig(newConfig));
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (presetName) => {
    const preset = PRESETS[presetName];
    if (preset) setConfig(getDefaultConfig(preset));
  };

  return { config, loading, saving, save, applyPreset, reload: load };
}

import { useState, useEffect } from 'react';
import { getMyTeams } from '../api/teams';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await getMyTeams();
        if (!cancelled && res?.data?.data) setTeams(res.data.data);
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { teams, loading };
}

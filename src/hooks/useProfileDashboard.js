import { useState, useEffect, useRef } from 'react';
import { getMyCV } from '../api/cv';
import { getProfileStats, getProfileActivity } from '../api/profile';

function extractTopSkills(cvData, limit = 5) {
  const cv = cvData?.data || cvData;
  const technical = cv?.skills?.technical || [];
  const sorted = [...technical].sort((a, b) => (b.level || 0) - (a.level || 0));
  return sorted.slice(0, limit).map(s => ({ name: s.name, level: s.level }));
}

export function useProfileDashboard({ profileUser } = {}) {
  const [stats, setStats] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!profileUser) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const res = await getProfileStats();
        if (!cancelled && res?.data?.data) setStats(res.data.data);
      } catch { /* ignore */ }

      try {
        const res = await getMyCV();
        if (!cancelled) {
          const extracted = extractTopSkills(res.data);
          if (extracted) setSkills(extracted);
        }
      } catch { /* ignore */ }

      try {
        const res = await getProfileActivity();
        if (!cancelled && res?.data?.data) setActivity(res.data.data);
      } catch { /* ignore */ }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [profileUser]);

  return { stats, skills, activity, loading };
}

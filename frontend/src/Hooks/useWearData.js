import { useEffect, useState } from 'react';

export default function useWearData(stateId, fetchAll = false) {
  const [wears, setWears] = useState(fetchAll ? [] : null);

  useEffect(() => {
    const url = fetchAll
      ? `http://localhost:8081/wears/all`
      : stateId
      ? `http://localhost:8081/wears/wear/${stateId}`
      : null;

    if (!url) return;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (fetchAll) {
          setWears(Array.isArray(data) ? data : [data]);
        } else {
          setWears(data);
        }
      })
      .catch(err => console.error('Error fetching wear:', err));
  }, [stateId, fetchAll]);

  return wears;
}

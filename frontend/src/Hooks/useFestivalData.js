import { useEffect, useState } from 'react';

export default function useFestivalData(stateId, fetchAll = false) {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const url = fetchAll
      ? `http://localhost:8081/festivals/all`
      : stateId
      ? `http://localhost:8081/festivals/festival/${stateId}`
      : null;

    if (!url) return;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => setFestivals(Array.isArray(data) ? data : [data]))
      .catch(err => console.error('Error fetching festivals:', err));
  }, [stateId, fetchAll]);

  return festivals;
}

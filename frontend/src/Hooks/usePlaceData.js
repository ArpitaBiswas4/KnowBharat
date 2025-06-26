import { useEffect, useState } from 'react';

export default function usePlaceData(stateId, fetchAll = false) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const url = fetchAll
      ? `http://localhost:8080/places/all`
      : stateId
      ? `http://localhost:8080/places/place/${stateId}`
      : null;

    if (!url) return;

    fetch(url)
      .then(res => res.json())
      .then(data => setPlaces(Array.isArray(data) ? data : [data]))
      .catch(err => console.error('Error fetching places:', err));
  }, [stateId, fetchAll]);

  return places;
}

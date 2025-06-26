import { useEffect, useState } from 'react';

export default function useFoodData(stateId, fetchAll = false) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const url = fetchAll
      ? `http://localhost:8080/foods/all`
      : stateId
      ? `http://localhost:8080/foods/food/${stateId}`
      : null;

    if (!url) return;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => setFoods(Array.isArray(data) ? data : [data]))
      .catch(err => console.error('Error fetching foods:', err));
  }, [stateId, fetchAll]);

  return foods;
}

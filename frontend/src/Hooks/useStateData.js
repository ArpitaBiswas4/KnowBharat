import { useEffect, useState } from 'react';

export default function useStateData() {
  const [stateData, setStateData] = useState({});
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/states/all')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        const formatted = {};
        data.forEach(state => {
          const key = normalizeStateName(state.name);
          formatted[key] = state;
        });
        setStateData(formatted);
        if (Object.keys(formatted).length > 0) {
          setSelectedState(Object.keys(formatted)[35]);
        }
      })
      .catch(err => console.error('Error fetching states:', err));
  }, []);

  return { stateData, selectedState, setSelectedState };
}

 function normalizeStateName(name) {
  return name.replace(/\s+/g, '').replace(/&/g, 'and').toLowerCase();
}
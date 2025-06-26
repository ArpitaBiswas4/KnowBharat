import { useParams } from 'react-router-dom';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import useStateData from '../Hooks/useStateData';
import '../Css/Details.css';

export default function StateDetails() {
  const { id } = useParams();
  const numericId = Number(id);

  const { stateData } = useStateData();
  const stateInfo = Object.values(stateData).find(s => s.id === numericId);

  const foodData = useFoodData(numericId);
  const placeData = usePlaceData(numericId);
  const festivalData = useFestivalData(numericId);
  const wearData = useWearData(numericId);

  if (!stateInfo) return <p>Loading state details...</p>;

  return (
    <div className="state-details">
      <h1>Welcome to {stateInfo.name}</h1>

      <section>
        <h2>Capital</h2>
        <p><strong>{stateInfo.capital}</strong> - {stateInfo.about}</p>
      </section>

      {foodData?.length > 0 && (
        <section>
          <h2>Famous Food</h2>
          {foodData.map((item, i) => (
            <div className="food-container" key={i}>
              <img src={item.imageUrl} alt={item.name} />
              <div className="food">
                <p><strong>{item.name}</strong> - {item.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {placeData?.length > 0 && (
        <section>
          <h2>Tourist Places</h2>
          {placeData.map((place, i) => (
            <div className="tourist-container" key={i}>
              <img src={place.imageUrl} alt={place.name} />
              <div className="tourist">
                <p><strong>{place.name}</strong> - {place.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {wearData && (
        <section>
          <h2>Traditional Wear</h2>
          <div className="wear-container">
            <img src={wearData.imageUrl} alt="Traditional Wear" />
            <div className="wear">
              <p>
                Men: <strong>{wearData.menWear}</strong><br />
                Women: <strong>{wearData.womenWear}</strong>
              </p>
            </div>
          </div>
        </section>
      )}

      {festivalData?.length > 0 && (
        <section>
          <h2>Festivals</h2>
          {festivalData.map((fest, i) => (
            <div className="festival-container" key={i}>
              <img src={fest.imageUrl} alt={fest.name} />
              <div className="festival">
                <p><strong>{fest.name}</strong> - {fest.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

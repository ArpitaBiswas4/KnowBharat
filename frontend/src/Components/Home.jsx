import React from 'react';
import { Link } from 'react-router-dom';
import '../Css/Home.css';

const optionData = [
  {
    route: '/map',
    title: 'View the Map',
    description: 'Explore India states on an interactive map!',
    img: '../map.jpg',
  },
  {
    route: '/puzzle',
    title: 'Solve the Puzzle',
    description: 'Put the pieces together to discover states!',
    img: '../puzzel.png',
  },
  {
    route: '/spell',
    title: 'Spell Check',
    description: 'Test your spelling with fun words!',
    img: '../spelling.jpg',
  },
  {
    route: '/matching',
    title: 'Matching Game',
    description: 'Match states with their famous things!',
    img: '../Matching.png',
  },
  {
    route: '/quiz',
    title: 'Quiz',
    description: 'Challenge yourself with quizzes!',
    img: 'Quiz.png',
  },
  {
    route: '/dive',
    title: 'Dive with Pictures',
    description: 'Learn with amazing photos!',
    img: '../picture.jpg',
  },
];

export default function KidsHome() {
  return (
    <div className="container">
      <div className="grid">
        {optionData.map((option) => (
          <Link to={option.route} key={option.route} className="card">
            <img src={option.img} alt={option.title} />
            <h3>{option.title}</h3>
            <p>{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

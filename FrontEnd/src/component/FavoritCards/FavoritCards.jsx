import React, { useEffect, useState } from "react";
import axios from "axios";
import useGetUser from "../../hooks/UserHooks/useGetUser";
import styleFavCards from "./FavoritCards.module.css";

const FavoritCards = () => {
  const [cards, setCards] = useState([]);
  const { userInformation } = useGetUser();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards');
        if (userInformation) {
          const favoriteCards = response.data.filter(card => card.likes.includes(userInformation._id));
          setCards(favoriteCards);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCards();
  }, [userInformation]);

  return (
    <div className="bodyCards">
      <div className={styleFavCards.container_cards}>
        <h1 className={styleFavCards.stickTitle}>Favorite Cards</h1>
        <div className={styleFavCards.frontCard}>
          {cards.length === 0 ? (
            <p>No favorite cards found.</p>
          ) : (
            <ul className={styleFavCards.listOfCards}>
              {cards.map((card) => (
                <li className={styleFavCards.item} key={card._id}>
                  <img
                    className={styleFavCards.imgCards}
                    src={card.image.url}
                    alt={card.image.alt}
                  />
                  <h2>{card.title}</h2>
                  <p className={styleFavCards.p}>{card.subtitle}</p>
                  <p className={styleFavCards.p}>{card.address.country}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritCards;

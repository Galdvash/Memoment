import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import styleFindTheOne from "./FoundTheOne.module.css";
import Loading from "../Loading/Loading"; 
import useGetUser from "../../hooks/UserHooks/useGetUser";
import "./FindTheOne.css"

const FindTheOne = ({ searchQuery }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userInformation } = useGetUser();

  useEffect(() => {
    const fetchLikedCards = async () => {
      setLoading(true);
      setError(null);

      if (userInformation) {
        try {
          const response = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards');
          const savedLikedCardIds = JSON.parse(localStorage.getItem(`likedCards-${userInformation._id}`)) || [];
          const likedCards = response.data.filter(card => card.likes.includes(userInformation._id));
          const cardsWithLikes = response.data.map(card => ({
            ...card,
            liked: savedLikedCardIds.includes(card._id) || likedCards.some(likedCard => likedCard._id === card._id)
          }));
          setCards(cardsWithLikes);
        } catch (error) {
          console.error(error);
          setError("Error fetching cards. Please try again later.");
        }
      }

      setLoading(false);
    };

    fetchLikedCards();
  }, [userInformation]);

  const handleLike = async (cardId) => {
    const token = localStorage.getItem("token");
    try {
      const url = `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`;
      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url,
        headers: {
          'x-auth-token': token
        },
      };
      await axios(config);

      const updatedCards = cards.map(c =>
        c._id === cardId ? { ...c, liked: !c.liked } : c
      );
      setCards(updatedCards);

      const newLikedCardIds = updatedCards.filter(c => c.liked).map(c => c._id);
      localStorage.setItem(`likedCards-${userInformation._id}`, JSON.stringify(newLikedCardIds));
    } catch (error) {
      console.error(error);
      setError("Error updating like status. Please try again later.");
    }
  };

  if (loading) {
    return <Loading />; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  if (!cards || cards.length === 0) {
    return <div>No cards found</div>; 
  }

  const filteredCards = cards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bodyFindTheOne">
      <div className={styleFindTheOne.container_cards}>
        <div className={styleFindTheOne.frontCard}>
          <h1>Cards</h1>
          <ul className={styleFindTheOne.listOfCards}>
            {filteredCards.map((card) => (
              <li className={styleFindTheOne.item} key={card._id}>
                <img
                  className={styleFindTheOne.imgCards}
                  src={card.image.url}
                  alt={card.image.alt}
                />
                <h2 className={styleFindTheOne.title}>{card.title}</h2>
                <p className={styleFindTheOne.cardSubtitle}>{card.subtitle}</p>
                <p className={styleFindTheOne.cardDescription}>{card.description}</p>
                <p className={styleFindTheOne.countryName}>{card.address.country}</p>
                <p className={styleFindTheOne.countryName}>Phone: {card.phone}</p>
                <div className={styleFindTheOne.heartIcon} onClick={() => handleLike(card._id)}>
                  {card.liked ? (
                    <FavoriteIcon style={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FindTheOne;

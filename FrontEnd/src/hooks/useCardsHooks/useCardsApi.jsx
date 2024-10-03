import { useState, useEffect } from 'react';
import axios from 'axios';

const useCardsApi = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards');
        const savedLikedCardIds = JSON.parse(localStorage.getItem('likedCards')) || [];
        const cardsWithLikes = response.data.map(card => ({
          ...card,
          liked: savedLikedCardIds.includes(card._id)
        }));
        setCards(cardsWithLikes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return [cards, setCards, loading, error];
};

export default useCardsApi;

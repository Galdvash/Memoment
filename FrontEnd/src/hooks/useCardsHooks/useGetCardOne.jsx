import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetOneCard = (cardId) => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true); // מעדכן את מצב הטעינה לטובת הבקשה החדשה

      const configLikes = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        headers: {}
      };

      try {
        const response = await axios(configLikes);
        setCardData(response.data);
        setLoading(false); // מעדכן את מצב הטעינה לטובת הצליחות
      } catch (err) {
        setError(err.message); // מעדכן את השגיאה במקרה של כישלון
        setLoading(false); // מעדכן את מצב הטעינה לטובת הכישלון
      }
    };

    if (cardId) {
      fetchCard();
    } else {
      setLoading(false); // במקרה שאין cardId, יש לסיים את הטעינה
    }
  }, [cardId]);

  return { cardData, loading, error };
};

export default useGetOneCard;

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function LobbyPage() {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lobbies, setLobbies] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFull, setIsFull] = useState(false); // State to track if the lobby is full

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = 'http://localhost:8080/api';
      const getEndpoint = `${apiUrl}/get`;
      try {
        const response = await fetch(`${getEndpoint}?action=databaseFetch&gameid=${lobbyId}`);
        if (response.ok) {
          try {
            const data = await response.json();
            if (data.length > 0) {
              const { creatorUserId, secondUserId } = data[0];
              setLobbies({ ...lobbies, [lobbyId]: { player1: creatorUserId, player2: secondUserId } });
              const lobbyIsFull = secondUserId !== '0';
              setIsFull(lobbyIsFull); // Update the isFull state
            }
          } catch (error) {
            console.error(error);
            alert('Invalid JSON response.');
          }
        } else {
          setLoading(false);
          alert('Lobby not found. Redirecting to homepage.');
          navigate('/');
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        alert('Error fetching lobby data.');
      }
    };

    fetchData();
  }, [lobbyId, location]);

  const handleGameStartClick = () => {
    if (isFull) {
      const gameURL = `/${lobbyId}/game`;
      navigate(gameURL);
    } else {
      alert('Lobby is not full, please wait for the second player.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentLobby = lobbies[lobbyId] || { player1: '', player2: '' };

  return (
    <div className="lobby-page">
      <div className="logo"></div>
      <div className="lobby-heading">LOBBY</div>
      <div className="send-link">Send this link to a friend to join this lobby!</div>
      <div className="players-container">
        <div className="player1">PLAYER 1: {currentLobby.player1}</div>
        <div className="player2">PLAYER 2: {currentLobby.player2}</div>
      </div>
      <div className="start-game-button" onClick={handleGameStartClick}>
        START GAME
      </div>
    </div>
  );
}

export default LobbyPage;




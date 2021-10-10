import { PlayerList } from "../../components";

import { PlayerListType, GameState } from "../../business/types";

export const getPlayerList = (
  index: string,
  playersList: PlayerListType,
  numberOfPlayer: number,
  gameState: GameState,
  isPlayerAlone: boolean
) => {
  const playerItemList = Object.entries(playersList);

  const playerListOnCell = playerItemList
    .filter((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard.coord === index && playerCard.name === "player";
    })
    .map((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard;
    });

  const hasPlayerOncell = playerListOnCell.length > 0;

  switch (hasPlayerOncell) {
    case true: {
      return (
        <PlayerList
          playerListOnCell={playerListOnCell}
          playerList={playersList}
          numberOfPlayer={numberOfPlayer}
          gameState={gameState}
          isPlayerAlone={isPlayerAlone}
        />
      );
    }
    case false: {
      return null;
    }
  }
};

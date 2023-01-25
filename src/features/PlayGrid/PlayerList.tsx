import { Player } from "../../components";

import { PlayerListType, GameState, State } from "../../business/types";
import { useSelector } from "react-redux";

export const PlayerList = ({ coord }: { coord: string }) =>
  // playersList: PlayerListType,
  // numberOfPlayer: number,
  // gameState: GameState,
  // isPlayerAlone: boolean
  {
    const playerList = useSelector((state: State) => state.playerList);
    const activePlayerNumber = useSelector(
      (state: State) => state.activePlayerNumber
    );

    const playerItemList = Object.entries(playerList);

    const playerListOnCell = playerItemList
      .filter((playerItem) => {
        const [, playerCard] = playerItem;
        return playerCard.coord === coord && playerCard.name === "player";
      })
      .map((playerItem) => {
        const [, playerCard] = playerItem;
        return playerCard;
      });

    const hasPlayerOnCell = playerListOnCell.length > 0;

    switch (hasPlayerOnCell) {
      case true: {
        return (
          <Player
            playerListOnCell={playerListOnCell}
            playerList={playerList}
            numberOfPlayer={activePlayerNumber}
            // gameState={gameState}
            // isPlayerAlone={isPlayerAlone}
          />
        );
      }
      case false: {
        return null;
      }
    }
  };

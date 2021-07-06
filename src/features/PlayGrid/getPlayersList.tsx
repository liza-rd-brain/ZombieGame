import { PlayerList } from "../../components";

import { PlayerListType, PlayerCardType } from "../../business/types";

export const getPlayersList = (
  index: string,
  playersList: PlayerListType,
  numberOfPlayer: number,
  getContextMenu: Function,
  hor: string,
  vert: string
) => {
  const playerItemList = Object.entries(playersList);

  const playerList = playerItemList.map((playerItem) => {
    const [, item] = playerItem;
    return item;
  });

  console.log("playerItemList", playerItemList);
  console.log("playerList", playerList);

  if (playerList.length > 0) {
    return (
      (
        <PlayerList
          playerListOnCell={playerList}
          getContextMenu={getContextMenu}
        />
      ) || null
    );
  } else return null;
};

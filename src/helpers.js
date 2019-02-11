export const countPriceHour = (game) => {
  let dlcPrice = 0;

  if(game.items == undefined && game.dlc.length > 0) {
    game.dlc.forEach((dlcEl) => {
      dlcPrice = dlcPrice + dlcEl.price;
    })
  }

  let priceHour;
  if (game.playtimeForever <= 60) {
    priceHour = game.price + dlcPrice;
    return priceHour
  } else {
    let playTimeInHours = game.playtimeForever / 60;
    priceHour = Math.round((game.price  + dlcPrice) / playTimeInHours);
    return priceHour
  }
};



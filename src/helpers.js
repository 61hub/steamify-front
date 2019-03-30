const countPriceHour = (game) => {
  let dlcPrice = 0;

  if(!game.items && game.dlc.length > 0) {
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

const formatPlaytime = (minutes) => {
  const hrs = Math.round(minutes / 60);
  const mins = minutes % 60;

  return `${hrs}h ${mins}m`;
};

const getTotalPrice = (game) => {
  let total = game.price
  if (game.dlc && game.dlc.length) {
    game.dlc.forEach(dlc => total = total + dlc.price)
  }

  return total;
};

export { countPriceHour, formatPlaytime, getTotalPrice }

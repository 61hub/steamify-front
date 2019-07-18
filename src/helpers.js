const countPriceHour = (game) => {
  let dlcPrice = 0;

  if(!game.items && game.dlc.length > 0) {
    game.dlc.forEach((dlcEl) => {
      dlcPrice = dlcPrice + dlcEl.price;
    })
  }

  if (game.type === 'pack') {
    let itemsTotalTime = 0;

    game.games.forEach(g => itemsTotalTime = itemsTotalTime + g.playtimeForever);
    if (itemsTotalTime <= 60) {
      return game.price;
    } else {
      return Math.round((game.price / itemsTotalTime / 60));
    }
  }

  let priceHour;
  if (game.playtimeForever <= 60) {
    priceHour = game.price + dlcPrice;
    return priceHour
  } else {
    let playTimeInHours = game.playtimeForever / 60;
    priceHour = (game.price  + dlcPrice) / playTimeInHours;
    return priceHour
  }
};

const formatPlaytime = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  let mins = minutes % 60;
  if (mins > 10) {
    mins.toString().length < 2 ? mins = mins * 10 : void(0);
  }

  if (!hrs) {
    return `${mins}m`;
  }

  if (!mins) {
    return `${hrs}h`;
  }

  return `${hrs}h ${mins}m`;
};

const getTotalPrice = (game) => {
  let total = game.price
  if (game.dlc && game.dlc.length) {
    game.dlc.forEach(dlc => total = total + dlc.price)
  }

  return total;
};

export const definePriceHourClassName = (el) => {
  let priceHour = countPriceHour(el);
  if (priceHour <= 10) {
    return "darkGreen"
  } else if (priceHour <= 50) {
    return "green"
  } else if (priceHour <= 100) {
    return "yellow"
  } else if (priceHour <= 200) {
    return "orange"
  } else if (priceHour >= 200) {
    return "red"
  }
}

export { countPriceHour, formatPlaytime, getTotalPrice }

export const countPriceHour = (el) => {
  let priceHour;
  if (el.playtimeForever <= 60) {
    priceHour = el.price;
    return priceHour
  } else {
    let playTimeInHours = el.playtimeForever / 60;
    priceHour = Math.round(el.price / playTimeInHours);
    return priceHour
  }
};


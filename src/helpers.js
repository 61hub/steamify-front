export const countPriceHour = (el) => {
  if(el.dlc.length > 0) {
    let dlcPrice;
    el.dlc.map((dlcEl) => {
      // dlcPrice = dlcEl.price + el.price;
      console.log(dlcEl);
    })
  }

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


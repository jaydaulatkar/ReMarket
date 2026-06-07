const mongoose = require('mongoose');
const User = require('./backend/models/User');

mongoose.connect('mongodb+srv://aryan3it:buy_sell_rent_iiith@buysellrent.66rwe.mongodb.net/?retryWrites=true&w=majority&appName=BuySellRent')
  .then(async () => {
    const users = await User.find({});
    console.log("Users found:");
    users.forEach(u => console.log(`- Email: ${u.email}, First Name: ${u.firstName}`));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

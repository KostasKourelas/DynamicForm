const express = require("express");
const cors = require('cors');
const sequelize = require("./src/database/DBconfig");
const dynamicRouter = require("./src/dynamicRouter");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use("/m", dynamicRouter);

// Sync database and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

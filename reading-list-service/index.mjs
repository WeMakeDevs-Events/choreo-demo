import app from "./app.mjs";
import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(process.env.PORT);

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

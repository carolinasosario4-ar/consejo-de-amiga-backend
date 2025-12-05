import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend de Consejo de Amiga funcionando");
});

app.listen(10000, () => {
  console.log("Servidor en puerto 10000");
});

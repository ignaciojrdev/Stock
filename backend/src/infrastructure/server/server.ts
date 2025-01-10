import express from "express";
import ProductRouter  from './routes/ProductRouter';
import MovementRouter  from './routes/MovementRouter';
import CommandRouter  from './routes/CommandRoutes';
import { connectDatabase } from "../database/dataSources";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT_ONE || process.env.PORT_TWO || 3200;

app.use(cors());
app.use(express.json());
app.use("/Stock", ProductRouter);
app.use("/Stock", MovementRouter);
app.use("/Sale", CommandRouter);
connectDatabase()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor (Estoque) rodando na porta ${PORT}`);
    });
})
.catch(err => console.log("Erro ao iniciar o banco de dados: ", err));

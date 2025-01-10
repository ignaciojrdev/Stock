import { Router } from "express";
import { MovementController } from '../../http/controllers/MovementController';
import { MovementUseCases } from "../../../application/use-cases/MovementUseCases";
import { CommandUseCases } from "../../../application/use-cases/CommandUseCases";
import { MovementRepository } from "../../ImplRepositories/MovementRepository";
import { CommandRepository } from "../../ImplRepositories/CommandRepository";
import { ProductRepository } from "../../ImplRepositories/ProductRepository";

const MovementRouter = Router();

const commandRepository = new CommandRepository();
const commandUseCases = new CommandUseCases(commandRepository);
const productRepository = new ProductRepository();
const movementRepository = new MovementRepository();
const movementUseCases = new MovementUseCases(movementRepository, productRepository, commandUseCases.findOne.bind(commandUseCases));
const movementController = new MovementController(movementUseCases);


MovementRouter.post("/Movement",       (req, res) => movementController.create(req, res));
//MovementRouter.put("/Movement",        (req, res) => movementController.create(req, res));
MovementRouter.get("/Movement",        (req, res) => movementController.findWithFilterMovements(req, res));
MovementRouter.get("/Movement/:id",    (req, res) => movementController.findOne(req, res))
MovementRouter.delete("/Movement/:id/:idProduct?/:All?", (req, res) => movementController.delete(req, res));

export default MovementRouter;

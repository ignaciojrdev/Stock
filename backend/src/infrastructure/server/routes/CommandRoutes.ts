import { Router } from "express";
import { CommandController } from '../../http/controllers/CommandController';
import { CommandUseCases } from "../../../application/use-cases/CommandUseCases";
import { MovementUseCases } from "../../../application/use-cases/MovementUseCases";
import { CommandRepository } from "../../ImplRepositories/CommandRepository";
import { MovementRepository } from "../../ImplRepositories/MovementRepository";
import { ProductRepository } from "../../../infrastructure/ImplRepositories/ProductRepository";

const CommandRouter = Router();

const commandRepository = new CommandRepository();
const movementRepository = new MovementRepository();
const productRepository = new ProductRepository();
const movementUseCases = new MovementUseCases(movementRepository, productRepository);
const commandUseCases = new CommandUseCases(commandRepository, movementUseCases.getProductsByCommand.bind(movementUseCases),  movementUseCases.deleteAllProductsByCommand.bind(movementUseCases));
const commandController = new CommandController(commandUseCases);


CommandRouter.post("/Command",       (req, res) => commandController.create(req, res));
CommandRouter.put("/Command",        (req, res) => commandController.create(req, res));
CommandRouter.get("/Command",        (req, res) => commandController.findWithFilter(req, res));
CommandRouter.get("/Command/:id",    (req, res) => commandController.findOne(req, res))
CommandRouter.delete("/Command/:id", (req, res) => commandController.delete(req, res));

export default CommandRouter;

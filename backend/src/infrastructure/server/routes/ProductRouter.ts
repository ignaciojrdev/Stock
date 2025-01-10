import { Router } from "express";
const ProductRouter = Router();

import { ProductController } from '../../http/controllers/ProductController';
import { ProductUseCases } from "../../../application/use-cases/ProductUseCases";
import { CommandUseCases } from "../../../application/use-cases/CommandUseCases";
import { MovementUseCases } from "../../../application/use-cases/MovementUseCases";
import { ProductRepository } from "../../ImplRepositories/ProductRepository";
import { MovementRepository } from "../../ImplRepositories/MovementRepository";
import { CommandRepository } from "../../ImplRepositories/CommandRepository";

const productRepository = new ProductRepository();
const movementRepository = new MovementRepository();
const commandRepository = new CommandRepository();

const commandUseCases = new CommandUseCases(commandRepository);
const movementUseCases = new MovementUseCases(movementRepository, productRepository, commandUseCases.findOne);
const productUseCases = new ProductUseCases(productRepository, movementUseCases);
const productController = new ProductController(productUseCases);

ProductRouter.post("/Product",       (req, res) => productController.create(req, res));
ProductRouter.put("/Product",        (req, res) => productController.update(req, res));
ProductRouter.get("/Product",        (req, res) => productController.findWithFilter(req, res));
ProductRouter.get("/Product/:id",    (req, res) => productController.findOne(req, res))
ProductRouter.delete("/Product/:id", (req, res) => productController.delete(req, res));

export default ProductRouter;

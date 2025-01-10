import { Request, Response } from "express";
import { newProductDTO } from "../../../domain/dtos/product/newProductDTO";
import { DeleteOrFindDTO } from "../../../domain/dtos/product/DeleteOrFindDTO";
import { updateProductDTO } from "../../../domain/dtos/product/updateProductDTO";
import { IProductUseCases } from "../../../domain/interfaces/IUse-cases/IProductUseCases";

export class ProductController {
    constructor(private productUseCases: IProductUseCases) {}

    async create(req: Request, res: Response) {
        try {
            const commandData: newProductDTO = req.body;
            const command = await this.productUseCases.createProduct(commandData);
            res.status(201).json(command);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro: ", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const product: updateProductDTO = req.body;
            const productUpdated = await this.productUseCases.updateProduct(product);
            res.status(200).json(productUpdated);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro: ", error });
        }
    }

    async findWithFilter(req: Request, res: Response) {
        try {
            const queryParams = req.query as unknown as DeleteOrFindDTO;
            const commandData: DeleteOrFindDTO = queryParams;
            const products = await this.productUseCases.findWithFilterProducts(commandData);
            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro: ", error });
        }
    }

    async findOne(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const product = await this.productUseCases.findOne(Number(id));
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ message: "Produto não encontrado." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro: ", error });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await this.productUseCases.delete(Number(id));
            res.json({});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erro: ", error });
        }
    }
}

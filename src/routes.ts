import { Router, Request, Response, request } from "express"
import BookController from "./controllers/books.controller"

const routes = Router()
const bookCtrl = new BookController

routes.post('/create_book', async(req: Request, res: Response) => {
    try {
        const book = req.body

        const response = await bookCtrl.createBook(book)
        return res.status(response.code).json(response)
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

export default routes
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

routes.get('/find_books', async(req: Request, res: Response) => {
    try {
        const {term, limit, page} = req.query

        const response = await bookCtrl.findBooks(String(term), Number(limit), Number(page))
        return res.status(response.code).json(response)
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

routes.get('/get_book_by_isbn/:isbn', async(req: Request, res: Response) => {
    try {
        const { isbn } = req.params

        const response = await bookCtrl.getBookByIsbn(Number(isbn))
        return res.status(response.code).json(response)
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

routes.put('/update_book/:id', async(req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { book } = req.body

        const response = await bookCtrl.updateBook(book, String(id))
        return res.status(response.code).json(response)
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

export default routes
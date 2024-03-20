import logger from "../../lib/logger";
import HttpServer from "../class/server.class";
import IBook from "../interfaces/books.interface";
import IResponse from "../interfaces/response.interface";
import Book from "../models/books.model";


export default class BookController {
    private server: HttpServer
    private connection = null

    constructor () {
        this.server = HttpServer.instance
    }

    async createBook(book: IBook): Promise <IResponse> {
        try {
            this.connection = this.server.app.locals.dbConnection

            const response = await Book.create(book)

            return { ok: true, message: 'book created!', response: response, code: 201 }
        } catch (err: any) {
            logger.error(`[BookController/createBook] ${err}`)
            return { ok: false, message: 'Error ocurred', response: err, code: 500 }
        } finally {
            if(this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }

    
}
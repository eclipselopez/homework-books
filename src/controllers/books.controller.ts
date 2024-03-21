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

            if( !response ){
                return { ok: false, message: 'Incorrect data', response: null, code: 422 }
            }

            return { ok: true, message: 'Book created!', response: response, code: 201 }
        } catch (err: any) {
            logger.error(`[BookController/createBook] ${err}`)
            return { ok: false, message: 'Error ocurred', response: err, code: 500 }
        } finally {
            if(this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }

    async findBooks(term: string, limit: number, page: number): Promise<IResponse> {
        try {
            this.connection = this.server.app.locals.dbConnection

            const regex = new RegExp(term ? term : '', 'i')

            const response = await Book.find(
                {$or: [
                    { tittle: regex },
                    { author: regex },
                    { gender: regex }
                ]}
            )
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

            if( response.length < 1 ) {
                return { ok: false, message: 'Dont exist books with this terms', response: null, code: 404 }
            }

            return { ok: true, message: 'Books found!', response: response, code: 200 }
        } catch (err: any) {
            logger.error(`[BookController/findBooks] ${err}`)
            return { ok: false, message: 'Error ocurred', response: err, code: 500 }
        } finally {
            if(this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }

    async getBookByIsbn(isbn: number): Promise<IResponse> {
        try{
            this.connection = this.server.app.locals.dbConnection

            const response: any = await Book.findOne({isbn: isbn})

            if( response.length < 1 ) {
                return { ok: false, message: 'Dont exist books with this terms', response: null, code: 404 }
            }

            return { ok: true, message: 'Found book!', response: response, code: 200 }
        } catch (err: any) {
            logger.error(`[BookController/getBookByIsbn] ${err}`)
            return { ok: false, message: 'Error ocurred', response: err, code: 500 }
        } finally {
            if(this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }

    async updateBook(book: IBook, idBook: string): Promise<IResponse> {
        try {
            this.connection = this.server.app.locals.dbConnection

            const response: any = await Book.findByIdAndUpdate(
                {_id: idBook}, 
                book, 
                { returnDocument: 'after' }
            )

            if(!response) {
                return { ok: false, message: 'Dont exist books with this id', response: null, code: 404 }
            }

            return { ok: true, message: 'Updated book!', response: response, code: 200 }
        } catch (err: any) {
            logger.error(`[BookController/getBookByIsbn] ${err}`)
            return { ok: false, message: 'Error ocurred', response: err, code: 500 }
        } finally {
            if(this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }    
    }
}
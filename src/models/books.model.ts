import mongoose, { Schema } from "mongoose"

const booksSchema: Schema = new Schema ({
    id : { type: String },
    tittle: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: Number, required: true, unique: true },
    gender: { type: String, required: true, toLowerCase: true },
    publicationDate: { type: Date, required: true },
    synopsis: { type: String, required: true, default: 'Sin descripción' },
    availability: { type: Boolean, required: true, default: true }
}, { collection: 'books' })

const Book = mongoose.model('Book', booksSchema)

export default Book
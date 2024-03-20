export default interface IBook {
    id?: string,
    tittle: string,
    author: string,
    isbn: number,
    gender: string,
    publicationDate: Date,
    synopsis: string,
    availability: boolean
}
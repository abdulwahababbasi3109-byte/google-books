import { Injectable } from "@nestjs/common";
import { SearchBooksDto } from "../dto/books.dto";
import { BookDao } from "../dao/books.dao";

@Injectable()
export class BooksService {

    constructor(
        private readonly bookDao: BookDao
    ) {}

    async getBooks(
        searchBooksDto: SearchBooksDto
    ) {

        const {
            q,
            page,
            limit
        } = searchBooksDto;

        const [
            openLibraryResult,
            googleBooksResult
        ] = await Promise.allSettled([

            this.bookDao.getOpenLibraryBooks(
                q,
                page,
                limit
            ),

            this.bookDao.getGoogleBooks(
                q,
                page,
                limit
            )

        ]);

        return {
            openLibraryData: openLibraryResult.status === "fulfilled" ? openLibraryResult.value : null,
            googleBooksData: googleBooksResult.status === "fulfilled" ? googleBooksResult.value : null
        };
    }
}
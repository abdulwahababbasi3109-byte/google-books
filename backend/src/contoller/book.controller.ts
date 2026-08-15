import { Controller, Get, Query } from "@nestjs/common";
import { SearchBooksDto } from "src/books/dto/books.dto";
import { BooksService } from "src/books/service/book.service";

@Controller("books")
export class BooksController {

    constructor(
        private readonly booksService: BooksService
    ) {}

    @Get()
    async getBooks(
        @Query() searchBooksDto: SearchBooksDto
    ) {

        return this.booksService.getBooks(
            searchBooksDto
        );
    }
}
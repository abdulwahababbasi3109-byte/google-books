import { Module } from "@nestjs/common";
import { BooksController } from "src/contoller/book.controller";
import { BooksService } from "../service/book.service";
import { BookDao } from "../dao/books.dao";


@Module({

    controllers: [
        BooksController
    ],

    providers: [
        BooksService,
        BookDao
    ]

})
export class BooksModule {}
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BookDao {

  async getOpenLibraryBooks(
    query: string,
    page: number,
    limit: number,
  ) {
    const response = await axios.get(
      `${process.env.OPEN_LIBRARY_URL}/search.json`,
      {
        params: {
          q: query,
          page,
          limit,
        },
      },
    );

    return response.data;
  }

  async getGoogleBooks(
    query: string,
    page: number,
    limit: number,
  ) {
    const startIndex = (page - 1) * limit;

    const response = await axios.get(
      `${process.env.GOOGLE_BOOKS_URL}/volumes`,
      {
        params: {
          q: query,
          startIndex,
          maxResults: limit,
        },
      },
    );

    return response.data;
  }
}
import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
    query findAllBooks($authorToSearch: String, $genreToSearch: String) {
        allBooks(author: $authorToSearch, genre: $genreToSearch) {
            title
            published
            author
            genres
        }
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const CREATE_BOOK = gql`
    mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title
            author: $author
            published: $published
            genres: $genres
        ) {
            title
            author
            published
            genres
        }
    }
`
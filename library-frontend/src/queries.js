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

import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        id
        title
        author {
            name
            born
        }
        published
        genres
    }
`

export const ALL_BOOKS = gql`
    query findAllBooks($authorToSearch: String, $genreToSearch: String) {
        allBooks(author: $authorToSearch, genre: $genreToSearch) {
            title
            published
            author {
                name
            }
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
            ...BookDetails
        }
    }

    ${BOOK_DETAILS}
`


export const EDIT_AUTHOR = gql`
    mutation updateAuthor($name: String!, $birthYear: Int!) {
        editAuthor(
            name: $name
            setBornTo: $birthYear
        ) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    
    ${BOOK_DETAILS}
`
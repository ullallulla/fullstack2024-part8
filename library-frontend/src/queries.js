import { gql } from '@apollo/client'

// export const ALL_BOOKS = gql`
//     query {
//         allBooks($author: String, $genre: String) {
//             title
//             published
//             author
//             genres
//         }
//     }
// `

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

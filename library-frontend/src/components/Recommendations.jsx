import { useState } from "react"
import { ALL_BOOKS, ME } from "../queries"
import { useQuery } from "@apollo/client"


const Recommendations = (props) => {
    const result = useQuery(ME)
    const book_result = useQuery(ALL_BOOKS)

    if (result.loading) {
        return <div>loading...</div>
    }

    if (!props.show) {
        return null
    }

    const user = result.data.me
    const books = book_result.data.allBooks
    return (
        <div>
            <h2>recommendations</h2>
            books in your favorite genre <strong>{user.favoriteGenre}</strong>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.filter((book) => book.genres.includes(user.favoriteGenre)).map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations
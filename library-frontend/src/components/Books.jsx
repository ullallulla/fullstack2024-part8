import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from "react"

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

  const allGenres = books.flatMap(book => book.genres)
  const filteredGenres = allGenres.filter((genre, index) => {
    return allGenres.indexOf(genre) === index
  })

  return (
    <div>
      <h2>books</h2>
      in genre <strong>{genre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.filter((book) => genre === null || book.genres.includes(genre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      {filteredGenres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books

import { useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const NewBirthday = ( { authors } ) => {
    const [birthYear, setBirthYear] = useState('')
    const [name, setName] = useState('')

    const [ updateAuthor ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{query: ALL_AUTHORS}],
        onError: (error) => {
          console.log(error.graphQLErrors.map(e => e.message).join('\n'))
        }
    })
    
    
    const submit = (event) => {
        event.preventDefault()
        const birthYearInt = Number(birthYear) 
        updateAuthor({variables: {name, birthYear: birthYearInt}})
        setName('')
        setBirthYear('')
    }
    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <select value={name} onChange={({target}) => setName(target.value)}>
                    <option>Select Author</option>
                    {authors.map(author => 
                            <option key={author.name} value={author.name} >
                                {author.name}
                            </option>
                    )}
                </select>
                <br />
                born <input type="number" value={birthYear} onChange={({target}) => setBirthYear(target.value)}/>
                <button type="submit">update author</button>
            </form>
        </div>
    )
}


export default NewBirthday
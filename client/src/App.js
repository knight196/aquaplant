import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import BooksPage from './Books/BooksPage' 
import BookPage from './Books/BookTable/BookPage'
import CreateBook from './Books/CreateBook'
import Login from './Account/Login'
import Signup from './Account/Signup'
import 'bootstrap/dist/css/bootstrap.min.css'
import {ApolloClient,ApolloProvider,InMemoryCache} from '@apollo/client'

function App() {

  const client = new ApolloClient({
uri:'/graphql',
cache:new InMemoryCache({
  addTypename:false
})
  })

  return (
   <ApolloProvider client={client}>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<BooksPage/>}/>
      <Route path='/Bookpage/:id' element={<BookPage/>}/>
      <Route path='/CreateBook' element={<CreateBook/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
   </ApolloProvider>
   
  );
}

export default App;

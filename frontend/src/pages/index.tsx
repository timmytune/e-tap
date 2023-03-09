import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';
import Pagination from "../components/pagination";


const url_root = "http://localhost:3000"
const pageLimit = 5

interface Movie {
  id: number,
  title: string,
  genre: string,
  description: string,
  created_at: string,
  updated_at: string
}

const columns = [
  {
    name: 'ID',
    selector: (row: Movie) => row.id,
    sortable: true,
  },
  {
      name: 'Title',
      selector: (row: Movie) => row.title,
      sortable: true,
  },
  {
    name: 'Genre',
    selector: (row: Movie) => row.genre,
    sortable: true,
  },
  {
    name: 'Created At',
    selector: (row: Movie) => new Date(row.created_at).toISOString(),
    sortable: true,
},

];


const ExpandedComponent = ({ data }: {data:Movie}) => <pre>{JSON.stringify(data, null, 2)}</pre>;

export default function Home() {


  useEffect(() => {
    fetch(`${url_root}/movie`).then((res) => {
      if(res.status == 200){
        res.json().then((data) => {
          if(data.data) {
            let mvs: Array<Movie> = data.data
            setMovies(mvs)
            setPaginatedMovies(mvs.slice(0, 4))
          }
        }).catch((err) => console.log(err))
      }

    }).catch((err) => console.log(err))
}, []);



  const [title, setTitle] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [search, setSearch] = useState<string>("");

  const [submited, setSubmited] = useState<boolean>(false);

  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [paginatedMovies, setPaginatedMovies] = useState<Array<Movie>>([]);

  const [page, setPage] = useState<number>(1);

  const paginate = (pageNumber: number) => {
    
    setPage(pageNumber);
    
    if(movies.length < pageLimit){
      setPaginatedMovies(movies)
      return
    }

    let skip = (pageNumber - 1) * pageLimit

    let end = skip + pageLimit
    if(movies.length < end)(
      end = -1
    )

    console.log(pageNumber, " ", skip, " ", end)

    let mvs = movies.sort((a: Movie, b: Movie):number => {
      if(a.id > b.id) return 1;
      if(a.id == b.id) return 0;
      else return -1;
      
    }).slice(skip, end)
    
    setPaginatedMovies(mvs)

  }


  const submitMovie = async () => {
    if(title == "" || genre == "" || description == ""){
      swal("Oops!", "All fields are required", "error");
      return
    }
    try {

      setSubmited(true)
      
      let res  = await fetch(`${url_root}/movie`,
      {
        method: "POST", 
        headers:{
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({title: title, genre: genre, description: description})
      })

      if(res.status == 201){
        let data = await res.json()
        if(data.data) {
          let movie: Movie = data.data
          setMovies([movie, ...movies])
          setTitle("")
          setGenre("")
          setDescription("")
          paginate(1)
          swal("Movie created successfully!")
        }else{
          swal("Oops!", "invalid response from server", "error");
        }
      }
    
    } catch (err: any) {
      console.log(err)
      swal("Oops!", err.message, "error");
    }finally{
      setSubmited(false)
    }


  }

  const searchMovie = async () => {
    // if(search == "" ){
    //   swal("Oops!", "search field is required", "error");
    //   return
    // }

    try {
      setSubmited(true)
      
      let res  = await fetch(`${url_root}/movie?search=${search}`)

      if(res.status == 200){
        let data = await res.json()

        if(data.data) {
          console.log("GOT HERE: ", data.data)
          let mvs: Array<Movie> = data.data
          setMovies([...mvs])
          paginate(1)
        }
      }
    
    } catch (err: any) {
      console.log(err)
      console.log(err)
      swal("Oops!", err.message, "error");
    }finally{
      setSubmited(false)
    }


  }

  return (
    <>
      <Head>
        <title>E-TAP movie test</title>
        <meta name="description" content="E-TAP movie test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full flex">
        <div className="flex  flex-col w-full max-w-4xl mx-auto pt-24">
          
          <h1 className="text-3xl font-bold w-full text-center">
            Welcome to the E-TAP Movie APP!
          </h1>
          
          <div className="w-full flex flex-col p-2 mt-8  ">

            <div className="flex flex-col w-full bg-white  border border-gray-200 rounded-md">

              <div className="flex text-center text-dark uppercase font-bold text-md md:text-xl mb-4 p-5 border-b border-blue-100 w-full">
                    <span className="mx-auto">CREATE MOVIE</span>
              </div>


              <div className="w-full flex flex-wrap text-grey-800 text-sm md:text-xl mt-8 pb-5">
                  
                  
                <div className="my-3 mx-5 w-full ">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Movie Title</label>
                    <input  value={title} onChange={e => setTitle(e.target.value)} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='James bond 007' />
                </div>

                <div className="my-3 mx-5 w-full ">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Movie Genre(Comma seperated)</label>
                    <input  value={genre} onChange={e => setGenre(e.target.value)} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='action,triller' />
                </div>

                <div className="my-3 mx-5 w-full ">

                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Movie Description</label>
                  <textarea  value={description} onChange={e => setDescription(e.target.value)}  id="message" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="This movies is action packed..."></textarea>

                </div>

                <div className="my-3 mx-5 w-full flex ">
                  <button onClick={submitMovie} disabled={submited} type="button" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-1/2 mx-auto">Create Movie</button>
                </div>


              </div>

            </div>

          </div>


          <div className="w-full flex flex-col p-2 mt-8  ">

            <div className="flex flex-col w-full bg-white  border border-gray-200 rounded-md">

              <div className="flex text-center text-dark uppercase font-bold text-md md:text-xl mb-4 p-5 border-b border-blue-100 w-full">
                    <span className="mx-auto">SEARCH FOR MOVIE</span>
              </div>


              <div className="w-full flex flex-wrap text-grey-800 text-sm md:text-xl mt-8 pb-5">
                  
                  
                <div className="my-3 mx-5 w-full ">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seaech field</label>
                    <input  value={search} onChange={e => setSearch(e.target.value)} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='James' />
                </div>


                <div className="my-3 mx-5 w-full flex ">
                  <button onClick={searchMovie} disabled={submited} type="button" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-1/2 mx-auto">Search Movie</button>
                </div>


              </div>

            </div>

          </div>



          <div className="w-full flex flex-col p-2 mt-8 mb-16  ">
            
          <div className='ml-auto'>
            <Pagination postsPerPage={pageLimit} totalPosts={movies.length} paginate={paginate} currentPage={page}/>
          </div>
            <div className="flex flex-col w-full bg-white  border border-gray-200 rounded-md">



              <DataTable columns={columns} data={paginatedMovies} expandableRows expandableRowsComponent={ExpandedComponent} />
            </div>

          </div>

        </div>

      </main>
    </>
  )
}

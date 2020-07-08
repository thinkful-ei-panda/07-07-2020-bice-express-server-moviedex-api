const express = require( 'express' )
const morgan = require( 'morgan' )
const app = express()
const cors = require( 'cors' )
const helmet = require( 'helmet' )
require( 'dotenv' ).config()
app.use( morgan ( 'dev' ) )
app.use( morgan ( 'common' ) )
app.use( helmet () )
app.use( cors () )

const movies = require( './movies-data-small.json' )

app.use ( function validateBearerToken( req, res, next ) {
	
	const authToken = req.get('Authorization')
	const apiToken = process.env.API_TOKEN

	if ( !authToken || authToken.split(' ')[1] !== apiToken ) {
		return res.status ( 401 ).json( { error: 'Unauthorized request' } )
	}

	next ()

})

function handleGetMovieList( req, res ) {
	const { sort = '' } = req.query
		
	const { genre = '' } = req.query
	
	// Create a list of genres to check against
	let genreList = movies.map( movie => movie.genre.toLowerCase().toString() )
	genreList = new Set ( genreList )
	genreList = [ ...genreList ]

	const { country = '' } = req.query

	// Create a list of countries to check against
	let countryList = movies.map ( movie => movie.country.toLowerCase().toString() )
	countryList = new Set ( countryList )
	countryList = [ ...countryList ]

	const { avg_vote = '' } = req.query
	
	let movieList = movies
	
	if ( genre ) {
		if ( genreList.some( item => item.includes( genre ) === true ) ) {
			return res.json ( movies.filter( movie => { return movie.genre.toString().toLowerCase().includes( genre.toString().toLowerCase() ) } ) )
		}
		else return res.status ( 400 ).send ( `${ genre } is invalid` )
	}
	
	if ( country ) {
		if ( countryList.some( item => item.includes( country ) === true ) ) {
			return res.json ( movies.filter( movie => { return movie.country.toString().toLowerCase().includes( country.toString().toLowerCase() ) } ) )
		}
		else return res.status ( 400 ).send ( `${ country } is invalid` )
	}

	if ( avg_vote && Number.isNaN( avg_vote ) ) res.status( 400 ).send( `${ avg_vote } is not a number` )
		
	if ( avg_vote ) movieList = movieList.filter( item => { return item.avg_vote >= Number(avg_vote) } ) 

   	else return res.json( movieList )

}

app.get( '/movie', handleGetMovieList )

app.listen( 8000, () => {
	console.log( 'Express server is listening on port 8000!' )
} )
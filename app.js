const express = require ( 'express' )

const morgan = require ( 'morgan' )

const app = express ()

const cors = require ( 'cors' )

const helmet = require ( 'helmet' )

require ( 'dotenv' ).config ()

app.use ( morgan ( 'dev' ) )

app.use ( morgan ( 'common' ) )

app.use ( helmet () )

app.use ( cors () )


const movies = require ( './movies-data-small.json' )

app.use ( function validateBearerToken ( req, res, next ) {
	
	const authToken = req.get('Authorization')
	const apiToken = process.env.API_TOKEN

	if ( !authToken || authToken.split(' ')[1] !== apiToken ) {
	
		return res.status ( 401 ).json ( { error: 'Unauthorized request' } )
	
	}

	next ()

})

function handleGetMovieList ( req, res ) {
	const { sort = '' } = req.query
		
	const { genre = '' } = req.query
	
	let genreVal = genre.toString ()
	let genres = movies.map ( movie => movie.genre.toLocaleLowerCase ().toString () )
	genres = new Set ( genres )
	genres = [ ...genres ]

	const { country = '' } = req.query

	let countryVal = country.toString ()
	let countries = movies.map ( movie => movie.country.toLocaleLowerCase ().toString () )
	countries = new Set ( countries )
	countries = [ ...countries ]

	const { avg_vote = '' } = req.query
	
	let movieList = [ ...movies ]

	if ( genre && !( genres.includes ( genreVal ) ) ) {

		res.status ( 400 ).send ( `${ genre } is invalid` )

	}
	
	if ( genre ) {
		
		newMovieList = movieList.filter ( item => {
			
			if ( item.genre.toLowerCase () === genreVal ) return item 
		
		} )

		res.json ( newMovieList )

	}
	
	if ( country && !( countries.includes ( countryVal ) ) ) {

		res.status ( 400 ).send ( `${ country } is invalid` )

	}
	
		if ( country ) {
		
		newCountryList = movieList.filter ( item => {
			
			if ( item.country.toLowerCase () === countryVal ) return item 
		
			} )

		res.json ( newCountryList )

	}
	
	if ( avg_vote && Number.isNaN ( avg_vote ) ) {

		res.status ( 400 ).send ( `${ avg_vote } is not a number` )

	}
		
	if ( avg_vote ) {

		movieList = movieList.filter ( item => {
			
			if ( item.avg_vote >= avg_vote ) return item 
		
			} )

	}

   res.json ( movieList )

}

app.get ( '/movie', handleGetMovieList )

app.listen ( 8000, () => {

	console.log ( 'Express server is listening on port 8000!' )

} )
const express = require ( 'express' )

const morgan = require ( 'morgan' )

//const cors = require ( 'cors' )

const app = express ()

app.use ( morgan ( 'dev' ) )

app.use ( morgan ( 'common' ) )

//app.use ( cors () )

// is this correct?
//require ('dotenv').config()

// Pipeline stuff
app.get()
app.use()

function requireAuth ( req, res, next ) {

    const authVal = req.get ( 'Authorization' ) || ''

}

// Verify bearer token exists
if ( !authVal.startsWith ( 'Bearer' ) ) {

    return res.status ( 401 ).json ( { error: 'Missing bearer token' } )

}

// Val;idate token is correct
const token = authVal.split ( '' )[ 1 ]
if ( token !== process.env.API_TOKEN ) {

    return res.status ( 401 ).json ( { error: 'Invalid credentials' } )

}

function handleTypes ( req, res ) {

    res.json{ [ 'Bug','Dark','Test' ] }

}


app.get ( '/apps', ( req, res ) => {

    const { sort = '' } = req.query
    
    const { genre = '' } = req.query
    
    let appList = [ ...apps ]

    const genres = [ 'card', 'strategy', 'puzzle', 'action', 'adventure', 'casual', 'arcade', ]
    
    const sortToLowerCase = sort.toLowerCase ()
    
    if ( sort && sortToLowerCase !== 'rating' && sortToLowerCase !== 'app' ) {

        return res.status ( 400 ).json ( { error: 'Sort must be one of "app" or "rating"' } )
    
    }
    
    if ( genre && !( genres.includes ( genre.toLowerCase () ) ) ) {

        res.status ( 400 ).send ( `${ genre } is invalid` )

    }

    else {

        appList = apps.filter ( app => {

            return app.Genres.toLowerCase ().includes ( genre.toLowerCase () )

        } )

    }

    if ( sortToLowerCase === 'rating') {
        // Highest to lowest
        appList.sort ( ( a,b ) => { 
            
            return b.Rating - a.Rating 
        
        } )

    }

    if ( sortToLowerCase === 'app') {
        
        appList.sort ( ( a,b ) => { 
            
            return b.Rating - a.Rating 
        
        } )

    }

    res.json ( appList )

} )

app.listen ( 8000, () => {

	console.log ( 'Express server is listening on port 8000!' )

} )
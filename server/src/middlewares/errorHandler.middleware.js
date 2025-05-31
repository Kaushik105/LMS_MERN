function errorHandler(err, req, res, next){ 
	console.log(err.stackTrace)
    res.status(500).send("Internal server error")
}

export  {errorHandler}
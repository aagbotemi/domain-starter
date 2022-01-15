exports.constants = {
    handleError:(err, res) => {
        const errorObj = {}
        err.errors.map(error => {
            errorObj[error.path] = error.message;
        })
        res.status(400)
            .send(errorObj)
    }
}
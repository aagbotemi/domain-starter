exports.constants = {
  handleErr: (err, res) => {
    if (Array.isArray(err)) {
      const errObj = {};

      err.errors.map((error) => {
        errObj[error.path] = error.message;
      });

      return res.status(400).send(errObj);
    } else {
      return res.status(400).send({
        message: err.message || "Some error occurred.",
      });
    }
  },
};

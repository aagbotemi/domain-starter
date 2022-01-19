var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const rolesRouter = require("./routes/roles");
const beneficiariesRouter = require("./routes/beneficiaries");
const citiesRouter = require("./routes/cities");
const statesRouter = require("./routes/states");
const zonesRouter = require("./routes/geoPoliticalZones");
const categoriesRouter = require("./routes/trainingCategories");
const batchRouter = require("./routes/trainingBatch");
const partnerOrgRouter = require("./routes/partnerOrg");
const dashboardRouter = require("./routes/dashboard");


var app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/auth", authRouter);
app.use("/beneficiaries", beneficiariesRouter);
app.use("/cities", citiesRouter);
app.use("/states", statesRouter);
app.use("/zones", zonesRouter);
app.use("/trade-areas", categoriesRouter);
app.use("/training-batch", batchRouter);
app.use("/participating-organisation", partnerOrgRouter);
app.use("/dashboard", dashboardRouter);


const db = require("./models/index");
db.sequelize.sync();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

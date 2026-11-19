import ApiError from "../utils/ApiError.js";

// const validate = (schema, source = "body") => (req, res, next) => {
//     const result = schema.safeParse(req[source]);
//     if (!result.success) {
//         return next(
//             ApiError.badRequest("validation failed", result.error.issues)
//         )
//     }
//     req[source] = result.data;
//     next();
// }

// export { validate };

function validate(schema, target = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(result.error);
    }
    if (target === "query") {
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, result.data);
    } else {
      req[target] = result.data;
    }
    next();
  };
}

export { validate };

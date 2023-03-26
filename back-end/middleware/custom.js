const Company = require("./../models").Company;
const Book = require("./../models").Book;
const { to, ReE, ReS } = require("../services/util.service");

let company = async function (req, res, next) {
  let company_id, err, company;
  company_id = req.params.company_id;

  [err, company] = await to(Company.findOne({ where: { id: company_id } }));
  if (err) return ReE(res, "err finding company");

  if (!company) return ReE(res, "Company not found with id: " + company_id);
  let user, users_array, users;
  user = req.user;
  [err, users] = await to(company.getUsers());

  users_array = users.map((obj) => String(obj.user));

  if (!users_array.includes(String(user._id)))
    return ReE(
      res,
      "User does not have permission to read app with id: " + app_id
    );

  req.company = company;
  next();
};
module.exports.company = company;

/**
 * book
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

// let book = async function (req, res, next) {
//     let book_id, err, company;
//     book_id = req.params.book_id;

//     [err, book] = await to(Book.findOne({where:{id:book_id}}));
//     if(err) return ReE(res, "err finding book");

//     if(!book) return ReE(res, "book not found with id: "+book_id);
//     req.book = book;
// }
// module.exports.book = book;

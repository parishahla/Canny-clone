import Vote from "../model/vote.model.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

export const sendUpvote = async (req, res, next) => {
    try {
        // req.params
        // req.body
        // req.headers
        console.log("req params")
        console.log(req.params);

        console.log("req body")
        console.log(req.body);

        console.log("req headers")
        console.log(req.headers);
        //get feedback id
        //get user id => in the token
        // add a record to the vote model
        // add vote score query to the feedback vote property
        res.status(201).json();
    } catch (error) {
        next(error);
    }
};


export const sendDownvote = async (req, res, next) => {
    try {


        res.status(201).json();
    } catch (error) {
        next(error);
    }
};
  
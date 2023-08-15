import { RequestHandler } from "express";
import { mainPageRender , loginPageRender } from "../../utils/viewrender";

export const mainPage: RequestHandler = async (req, res, next) => {
  try {
    mainPageRender(res, next);
  } catch (error) {
    loginPageRender(res, next);
  }
};

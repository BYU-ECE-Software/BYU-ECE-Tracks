// @ts-nocheck
import { getSession } from "@auth/express"
import { authConfig } from "../config/auth.config.js"
// import type { NextFunction, Request, Response } from "express"

export async function authenticatedUser(
  req,
  res,
  next,
) {
  const session =
    res.locals.session ?? (await getSession(req, authConfig)) ?? undefined

  res.locals.session = session

  if (session) {
    return next()
  }

  res.status(401).json({ message: "Not Authenticated" })
}

export async function currentSession(
  req,
  res,
  next,
) {
  const session = (await getSession(req, authConfig)) ?? undefined
  res.locals.session = session
  return next()
}
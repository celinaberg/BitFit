// @flow

import type { $Request, $Response } from "express";

/**
 * Error responses
 */

export function pageNotFound(req: $Request, res: $Response) {
  const viewFilePath = "404";
  const statusCode = 404;
  const result = {
    status: statusCode
  };

  res.status(result.status);
  res.render(viewFilePath, err => {
    if (err) {
      return res.json(result, result.status);
    }

    res.render(viewFilePath);
  });
}

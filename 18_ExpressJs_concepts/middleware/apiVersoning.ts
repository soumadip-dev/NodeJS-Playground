import type { Request, Response, RequestHandler } from 'express';

/**
 * Enforces API version via URL path (e.g., /api/v1)
 */
const validateApiVersionFromUrl =
  (version: string): RequestHandler =>
  (req: Request, res: Response, next) => {
    if (req.path.startsWith(`/api/${version}`)) {
      return next();
    }

    return res.status(400).json({
      success: false,
      error: 'Unsupported API version in URL ❌',
    });
  };

/**
 * Enforces API version via request header (accept-version)
 */
const validateApiVersionFromHeader =
  (version: string): RequestHandler =>
  (req: Request, res: Response, next) => {
    const apiVersion = req.header('accept-version');

    if (apiVersion === version) {
      return next();
    }

    return res.status(406).json({
      success: false,
      error: 'Unsupported API version in header 🚫',
    });
  };

/**
 * Enforces API version via Content-Type vendor media type
 * Example: application/vnd.api.v1+json
 */
const validateApiVersionFromContentType =
  (version: string): RequestHandler =>
  (req: Request, res: Response, next) => {
    const contentType = req.get('Content-Type');

    if (contentType && contentType.includes(`application/vnd.api.${version}+json`)) {
      return next();
    }

    return res.status(415).json({
      success: false,
      error: 'Unsupported API version in Content-Type ⚠️',
    });
  };

export {
  validateApiVersionFromUrl,
  validateApiVersionFromHeader,
  validateApiVersionFromContentType,
};

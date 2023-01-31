import { Request, Response, NextFunction } from "express";
import { ApiKeyDocument, getDb } from '@db';
import { logger } from '@utils';
import { BadRequestError } from '@errors';

const updateRequestCount = async (apiKey: ApiKeyDocument) => {
  try {
    const db = getDb();
    await db.collection('apiKeys')
      .updateOne(
        { _id: apiKey._id },
        { $inc: { currentRequestCount: 1 } },
      );
  } catch (err) {
    logger.error(err);
  }
};

export const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKeyString = req.headers['x-api-key'];

  if (!apiKeyString) {
    throw new BadRequestError(
      "Validation Error",
      400,
      [{ msg: 'No API key provided!' }]
    );
  }
  let foundKey: ApiKeyDocument | null;
  try {
    const db = getDb();
    const key = await db.collection<ApiKeyDocument>('apiKeys').findOne({ key: apiKeyString });
    foundKey = key || null;
  } catch (err) {
    logger.error(err);
    throw new BadRequestError(
      "Validation Error",
      400,
      [{ msg: 'Invalid API key!' }]
    );
  }
  if (!foundKey) {
    logger.error('API Key not found in the database.');
    throw new BadRequestError(
      "Validation Error",
      400,
      [{ msg: 'Invalid API key!' }]
    );
  }
  const ips = req.header('x-forwarded-for')?.split(',') || [];

  const { allowedIps, requestLimit, allowedDomains } = foundKey;
  if (allowedIps.length > 0) {
    let allowed = true;
    let disallowedIp = '';
    ips.forEach((ip) => {
      if (!allowedIps.includes(ip)) {
        disallowedIp = ip;
        allowed = false;
      }
    });

    if (!allowed) {
      logger.error(`IP: ${disallowedIp} not allowed for this API Key: ${apiKeyString}`);
      throw new BadRequestError(
        "Validation Error",
        400,
        [{ msg: 'Invalid requesting IP' }]
      );
    }
  }

  if (requestLimit && parseInt(requestLimit) > 0) {
    const { currentRequestCount } = foundKey;
    const requestLimitInt = parseInt(requestLimit);
    if (currentRequestCount + 1 > requestLimitInt) {
      throw new BadRequestError(
        "Validation Error",
        400,
        [{ msg: 'API Key request limit reached' }]
      );
    }
    res.setHeader('x-api-key-request-count', currentRequestCount + 1);
    res.setHeader('x-api-key-request-limit', requestLimit);
  }

  updateRequestCount(foundKey);

  const { hostname } = req;
  if (allowedDomains.length > 0 && !allowedDomains.includes(hostname)) {
    throw new BadRequestError(
      "Validation Error",
      400,
      [{ msg: 'Invalid requesting domain' }]
    );
  }
  return next();
};


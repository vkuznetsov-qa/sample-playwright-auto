import crypto from 'crypto';

export const testID = function () {
    return crypto.randomBytes(4).toString('hex');
};

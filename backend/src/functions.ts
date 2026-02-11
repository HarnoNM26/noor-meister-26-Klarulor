const moment = require('moment');

export function isISOFormat(obj: number | string): boolean{
    if(!obj)
        return false;
    const momentDate = moment(obj, moment.ISO_8601, true);
    if(!momentDate.isValid() || !isNaN(+obj))
    {
        return false;
    }
    return true;
}
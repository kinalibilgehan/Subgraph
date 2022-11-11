import { BigInt } from "@graphprotocol/graph-ts";

export function toBigInt(integer: i32): BigInt {
    return BigInt.fromI32(integer)
};

export const ZERO = BigInt.fromI32(0);
export const ONE = BigInt.fromI32(1)
export const SECONDS_IN_DAY = BigInt.fromI32(86400);

class DayMonthYear {
    day: BigInt;
    month: BigInt;
    year: BigInt;

    constructor(day: BigInt, month: BigInt, year: BigInt) {
        this.day = day;
        this.month = month;
        this.year = year;
    }
}

export function dayMonthYearFromEventTimestamp(unixEpoch: BigInt): DayMonthYear {

    let daysSinceEpochStart = unixEpoch.div(SECONDS_IN_DAY);
    daysSinceEpochStart = daysSinceEpochStart.plus(toBigInt(719468));
    
    let era: BigInt = (daysSinceEpochStart.ge(ZERO) ? daysSinceEpochStart : daysSinceEpochStart.minus(toBigInt(146096))).div(toBigInt(146097));
    let dayOfEra: BigInt = (daysSinceEpochStart.minus(era.times(toBigInt(146097))));          // [0, 146096]
    let yearOfEra: BigInt = (dayOfEra.minus(dayOfEra.div(toBigInt(1460))).plus(dayOfEra.div(toBigInt(36524))).minus(dayOfEra.div(toBigInt(146096)))).div(toBigInt(365));  // [0, 399]
    
    let year: BigInt = yearOfEra.plus(era.times(toBigInt(400)));
    let dayOfYear: BigInt = dayOfEra.minus((toBigInt(365).times(yearOfEra)).plus(yearOfEra.div(toBigInt(4))).minus(yearOfEra.div(toBigInt(100))));                // [0, 365]
    let monthZeroIndexed = ((toBigInt(5).times(dayOfYear)).plus(toBigInt(2))).div(toBigInt(153));                                   // [0, 11]
    let day = dayOfYear.minus(((toBigInt(153).times(monthZeroIndexed)).plus(toBigInt(2))).div(toBigInt(5))).plus(toBigInt(1));                             // [1, 31]
    let month = monthZeroIndexed.plus((monthZeroIndexed < toBigInt(10) ? toBigInt(3) : toBigInt(-9)));                            // [1, 12]

    year = month <= toBigInt(2) ? year.plus(ONE) : year;
    
    return new DayMonthYear(day, month, year);
}
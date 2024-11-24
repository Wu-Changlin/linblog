/* 公历转农历代码思路：
1、建立农历年份查询表
2、计算输入公历日期与公历基准的相差天数
3、从农历基准开始遍历农历查询表，计算自农历基准之后每一年的天数，并用相差天数依次相减，确定农历年份
4、利用剩余相差天数以及农历每个月的天数确定农历月份
5、利用剩余相差天数确定农历哪一天 */

// 农历1949-2100年查询表
let lunarYearArr = [
    0x0b557, //1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
    0x0d520 //2100
],
    lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
    tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 公历转农历函数
export function sloarToLunar(sy, sm, sd, current_timestamp) {
    // 输入的月份减1处理
    sm -= 1;

    // 计算与公历基准的相差天数
    // Date.UTC()返回的是距离公历1970年1月1日的毫秒数,传入的月份需要减1
    let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
    let ly, lm, ld, lh;
    // 确定输出的农历年份
    for (let j = 0; j < lunarYearArr.length; j++) {
        daySpan -= lunarYearDays(lunarYearArr[j]);
        if (daySpan <= 0) {
            ly = 1949 + j;
            // 获取农历年份确定后的剩余天数
            daySpan += lunarYearDays(lunarYearArr[j]);
            break
        }
    }

    // 确定输出的农历月份  数字
    for (let k = 0; k < lunarYearMonths(lunarYearArr[ly - 1949]).length; k++) {
        daySpan -= lunarYearMonths(lunarYearArr[ly - 1949])[k];
        if (daySpan <= 0) {
            // 有闰月时，月份的数组长度会变成13，因此，当闰月月份小于等于k时，lm不需要加1
            if (hasLeapMonth(lunarYearArr[ly - 1949]) && hasLeapMonth(lunarYearArr[ly - 1949]) <= k) {
                if (hasLeapMonth(lunarYearArr[ly - 1949]) < k) {
                    lm = k;
                } else if (hasLeapMonth(lunarYearArr[ly - 1949]) === k) {
                    // lm = '闰' + k;
                    lm = k;//输出数字
                } else {
                    lm = k + 1;
                }
            } else {
                lm = k + 1;
            }
            // 获取农历月份确定后的剩余天数
            daySpan += lunarYearMonths(lunarYearArr[ly - 1949])[k];
            break
        }
    }

    // 确定输出农历哪一天
    ld = daySpan;

    // 将计算出来的农历月份转换成汉字月份，闰月需要在前面加上闰字
    // if (hasLeapMonth(lunarYearArr[ly - 1949]) && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
    //     lm = `闰${lunarMonth[/\d/.exec(lm) - 1]}`
    // } else {
    //     lm = lunarMonth[lm - 1];
    // }

    // 将计算出来的农历年份转换为天干地支年
    // ly = getTianGan(ly) + getDiZhi(ly);


    // 将计算出来的农历天数转换成汉字
    // if (ld < 11) {
    //     ld = `${lunarDay[10]}${lunarDay[ld - 1]}`
    // } else if (ld > 10 && ld < 20) {
    //     ld = `${lunarDay[9]}${lunarDay[ld - 11]}`
    // } else if (ld === 20) {
    //     ld = `${lunarDay[1]}${lunarDay[9]}`
    // } else if (ld > 20 && ld < 30) {
    //     ld = `${lunarDay[11]}${lunarDay[ld - 21]}`
    // } else if (ld === 30) {
    //     ld = `${lunarDay[2]}${lunarDay[9]}`
    // }


    // console.log(ly, lm, ld);
    //  返回农历：年 月 日
    // return {
    //     lunarYear: ly,
    //     lunarMonth: lm,
    //     lunarDay: ld,
    // }

    /* 返回农历年地支数 月份数 日数 时辰数   开始*/
    let diZhiKey = (ly - 3) % 12;
    if (diZhiKey === 0) diZhiKey = 12;

    ly = sy % 12;;


      // 检查当前时间戳是否在某个2小时时间段内
    lh = isInTwoHourPeriod(current_timestamp);

// console.log('检查当前时间是否在某个1小时时间段内:',lh);

    return {
        lunarYear: ly,
        lunarMonth: lm,
        lunarDay: ld,
        lunarHours: lh
    }

    /*  返回农历年地支数 月份数 日数 时辰数   结束*/
}

// 计算农历年是否有闰月，参数为存储农历年的16进制
// 农历年份信息用16进制存储，其中16进制的最后1位可以用于判断是否有闰月
function hasLeapMonth(ly) {
    // 获取16进制的最后1位，需要用到&与运算符
    if (ly & 0xf) {
        return ly & 0xf
    } else {
        return false
    }
}


// s='升随临损巽睽颐萃小过讼艮颐小过震蛊屯未济中孚艮困恒晋升损蛊萃蛊未济巽解艮贲未济观豫损蛊晋噬嗑晋旅解大畜困未济随蒙升解睽未济井困未济旅萃未济震蒙未济师涣归妹大有'
// dic={'坤': '000000', '剥': '000001', '比': '000010', '观': '000011', '豫': '000100', '晋': '000101', '萃': '000110', '否': '000111', '谦': '001000', '艮': '001001', '蹇': '001010', '渐': '001011', '小过': '001100', '旅': '001101', '咸': '001110', '遁': '001111', '师': '010000', '蒙': '010001', '坎': '010010', '涣': '010011', '解': '010100', '未济': '010101', '困': '010110', '讼': '010111', '升': '011000', '蛊': '011001', '井': '011010', '巽': '011011', '恒': '011100', '鼎': '011101', '大过': '011110', '姤': '011111', '复': '100000', '颐': '100001', '屯': '100010', '益': '100011', '震': '100100', '噬嗑': '100101', '随': '100110', '无妄': '100111', '明夷': '101000', '贲': '101001', '既济': '101010', '家人': '101011', '丰': '101100', '离': '101101', '革': '101110', '同人': '101111', '临': '110000', '损': '110001', '节': '110010', '中孚': '110011', '归妹': '110100', '睽': '110101', '兑': '110110', '履': '110111', '泰': '111000', '大畜': '111001', '需': '111010', '小畜': '111011', '大壮': '111100', '大有': '111101', '夬': '111110', '乾': '111111'}


// 如果有闰月，计算农历闰月天数，参数为存储农历年的16进制
// 农历年份信息用16进制存储，其中16进制的第1位（0x除外）可以用于表示闰月是大月还是小月
function leapMonthDays(ly) {
    if (hasLeapMonth(ly)) {
        // 获取16进制的第1位（0x除外）
        return (ly & 0xf0000) ? 30 : 29
    } else {
        return 0
    }
}

// 计算农历一年的总天数，参数为存储农历年的16进制
// 农历年份信息用16进制存储，其中16进制的第2-4位（0x除外）可以用于表示正常月是大月还是小月
function lunarYearDays(ly) {
    let totalDays = 0;

    // 获取正常月的天数，并累加
    // 获取16进制的第2-4位，需要用到>>移位运算符
    for (let i = 0x8000; i > 0x8; i >>= 1) {
        let monthDays = (ly & i) ? 30 : 29;
        totalDays += monthDays;
    }
    // 如果有闰月，需要把闰月的天数加上
    if (hasLeapMonth(ly)) {
        totalDays += leapMonthDays(ly);
    }

    return totalDays
}

// 获取农历每个月的天数
// 参数需传入16进制数值
function lunarYearMonths(ly) {
    let monthArr = [];

    // 获取正常月的天数，并添加到monthArr数组中
    // 获取16进制的第2-4位，需要用到>>移位运算符
    for (let i = 0x8000; i > 0x8; i >>= 1) {
        monthArr.push((ly & i) ? 30 : 29);
    }
    // 如果有闰月，需要把闰月的天数加上
    if (hasLeapMonth(ly)) {
        monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
    }

    return monthArr
}

// 将农历年转换为天干，参数为农历年 （年份的天干）
function getTianGan(ly) {
    let tianGanKey = (ly - 3) % 10;
    if (tianGanKey === 0) tianGanKey = 10;
    // console.log('tianGanKey:',tianGanKey);
    return tianGan[tianGanKey - 1]
}

// 将农历年转换为地支，参数为农历年 （年份的地支）
function getDiZhi(ly) {
    let diZhiKey = (ly - 3) % 12;
    if (diZhiKey === 0) diZhiKey = 12;
    // console.log('diZhiKey:',diZhiKey);
    return diZhi[diZhiKey - 1]
}

// TODO:    const month = date.getMonth();// 获取月份，需要加1?   加1后没有结果返回
//检查当前时间是否在某个2小时时间段内,十二时辰划分；返回子1丑2……亥12
function isInTwoHourPeriod(timestamp) {
     //秒为单位时间戳转时格式
    const date = new Date(timestamp * 1000); // 根据时间戳创建Date对象new Date(timestamp * 1000); // 根据时间戳创建Date对象
    const year = date.getFullYear();
    const month = date.getMonth();// 获取月份，需要加1?
    const day = date.getDate();
    // 时间戳数组
    let hourTimestamps = [];
    // 生成当天单数小时的时间戳数组
    for (let hour = 0; hour <= 23; hour++) {
        if (hour % 2 !== 0) {
            const start = new Date(year, month, day, hour);
            const end = new Date(year, month, day, hour + 2);//2小时时间段内
            let start_time = Math.floor(start.getTime() / 1000);
            let end_time = end.getTime() / 1000;
            end_time = end_time - 1;//减少1秒  如01：00：00 -1 = 00：00：59；
            hourTimestamps.push({ start: start_time, end: end_time });
        }

    }
    // 使用扩展运算符将数组最后一个元素移动到前端 ，把23-1时间段移到第一(子时排第一)
    hourTimestamps = [hourTimestamps.slice(-1)[0], ...hourTimestamps.slice(0, -1)];

    // console.log('hourTimestamps:',hourTimestamps);
    // 检查时间戳是否在任何2小时时间段内
    let key_number = hourTimestamps.findIndex(range => timestamp >= range.start && timestamp < range.end);
    key_number = key_number + 1;
    return key_number;
}

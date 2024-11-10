// HMAC-SHA256
// 使用示例：

// import { hex, sign } from '@/hooks/hmacSha256.js';
// let result = hex(sign('key', 'value'))

// key 字符串类型 
// value 字符串类型 
// let result = hex(sign(key, value))

// To ensure cross-browser support even without a proper SubtleCrypto
// impelmentation (or without access to the impelmentation, as is the case with
// Chrome loaded over HTTP instead of HTTPS), this library can create SHA-256
// HMAC signatures using nothing but raw JavaScript

/* eslint-disable no-magic-numbers, id-length, no-param-reassign, new-cap */

// By giving internal functions names that we can mangle, future calls to
// them are reduced to a single byte (minor space savings in minified file)


//即使没有适当的SubtleCrypto，也能确保跨浏览器支持
//弹劾（或无法获得弹劾，如：Chrome通过HTTP而不是HTTPS加载），此库可以创建SHA-256
//仅使用原始JavaScript的HMAC签名
/*eslint禁用无幻数、id长度、无参数重新分配、新上限*/
//通过为内部函数命名我们可以修改的名称，未来的调用
//它们被缩减为一个字节（在压缩文件中节省了少量空间）
var uint8Array = Uint8Array;
var uint32Array = Uint32Array;
var pow = Math.pow;

// Will be initialized below
// Using a Uint32Array instead of a simple array makes the minified code
// a bit bigger (we lose our `unshift()` hack), but comes with huge
// performance gains
//将在下面初始化
//使用Uint32Array而不是简单的数组会使代码缩小
//稍微大一点（我们失去了`unshift（）`破解），但带来了巨大的
//性能提升
var DEFAULT_STATE = new uint32Array(8);
var ROUND_CONSTANTS = [];

// Reusable object for expanded message
// Using a Uint32Array instead of a simple array makes the minified code
// 7 bytes larger, but comes with huge performance gains
//用于扩展消息的可重用对象
//使用Uint32Array而不是简单的数组会使代码缩小
//大7个字节，但带来了巨大的性能提升
var M = new uint32Array(64);

// After minification the code to compute the default state and round
// constants is smaller than the output. More importantly, this serves as a
// good educational aide for anyone wondering where the magic numbers come
// from. No magic numbers FTW!
//压缩代码以计算默认状态和轮次后
//常数小于输出。更重要的是，这起到了
//对于那些想知道幻数从哪里来的人来说，这是一个很好的教育助手
//从。没有幻数！
function getFractionalBits(n) {
    return ((n - (n | 0)) * pow(2, 32)) | 0;
}

var n = 2, nPrime = 0;
while (nPrime < 64) {
    // isPrime() was in-lined from its original function form to save
    // a few bytes
    //isPrime（）是从其原始函数形式换行保存的
    //几个字节
    var isPrime = true;
    // Math.sqrt() was replaced with pow(n, 1/2) to save a few bytes
    // var sqrtN = pow(n, 1 / 2);
    // So technically to determine if a number is prime you only need to
    // check numbers up to the square root. However this function only runs
    // once and we're only computing the first 64 primes (up to 311), so on
    // any modern CPU this whole function runs in a couple milliseconds.
    // By going to n / 2 instead of sqrt(n) we net 8 byte savings and no
    // scaling performance cost
    //Math.sqrt（）被替换为pow（n，1/2）以节省几个字节
//var sqrtN=pow（n，1/2）；
//因此，从技术上讲，要确定一个数字是否是素数，你只需要
//检查数字的平方根。但是，此功能仅运行
//一次，我们只计算前64个素数（最多311个），以此类推
//任何现代CPU，整个功能都可以在几毫秒内运行。
//通过使用n/2而不是sqrt（n），我们节省了8个字节，没有
//扩展性能成本
    for (var factor = 2; factor <= n / 2; factor++) {
        if (n % factor === 0) {
            isPrime = false;
        }
    }
    if (isPrime) {
        if (nPrime < 8) {
            DEFAULT_STATE[nPrime] = getFractionalBits(pow(n, 1 / 2));
        }
        ROUND_CONSTANTS[nPrime] = getFractionalBits(pow(n, 1 / 3));

        nPrime++;
    }

    n++;
}

// For cross-platform support we need to ensure that all 32-bit words are
// in the same endianness. A UTF-8 TextEncoder will return BigEndian data,
// so upon reading or writing to our ArrayBuffer we'll only swap the bytes
// if our system is LittleEndian (which is about 99% of CPUs)
//对于跨平台支持，我们需要确保所有32位字
//以相同的结尾。UTF-8文本编码器将返回BigEndian数据，
//因此，在读取或写入ArrayBuffer时，我们只会交换字节
//如果我们的系统是LittleEndian（大约99%的CPU）
var LittleEndian = !!new uint8Array(new uint32Array([1]).buffer)[0];

function convertEndian(word) {
    if (LittleEndian) {
        return (
            // byte 1 -> byte 4
            (word >>> 24) |
            // byte 2 -> byte 3
            (((word >>> 16) & 0xff) << 8) |
            // byte 3 -> byte 2
            ((word & 0xff00) << 8) |
            // byte 4 -> byte 1
            (word << 24)
        );
    }
    else {
        return word;
    }
}

function rightRotate(word, bits) {
    return (word >>> bits) | (word << (32 - bits));
}

// SHA-256算法
function sha256(data) {
    // Copy default state //复制默认状态
    var STATE = DEFAULT_STATE.slice();

    // Caching this reduces occurrences of ".length" in minified JavaScript
    // 3 more byte savings! :D
    //缓存——这减少了压缩JavaScript中“.length”的出现
//再节省3字节！：D
    var legth = data.length;

    // Pad data
    var bitLength = legth * 8;
    var newBitLength = (512 - ((bitLength + 64) % 512) - 1) + bitLength + 65;
//“bytes”和“words”存储在BigEndian中
    // "bytes" and "words" are stored BigEndian
    var bytes = new uint8Array(newBitLength / 8);
    var words = new uint32Array(bytes.buffer);

    bytes.set(data, 0);
    // 附录a 1
    // Append a 1 
    bytes[legth] = 0b10000000;
    // BigEndian中的存储长度
    // Store length in BigEndian
    words[words.length - 1] = convertEndian(bitLength);

    // 循环迭代器（避免两个“var”实例）——节省2个字节
    // Loop iterator (avoid two instances of "var") -- saves 2 bytes
    var round;
// 处理块（一次512位/64字节/16个字）
    // Process blocks (512 bits / 64 bytes / 16 words at a time)
    for (var block = 0; block < newBitLength / 32; block += 16) {
        var workingState = STATE.slice();

        // Rounds 循环
        for (round = 0; round < 64; round++) {
            var MRound;
            // Expand message 展开消息
            if (round < 16) {
                // 转换为平台Endianness以供以后计算
                // Convert to platform Endianness for later math
                MRound = convertEndian(words[block + round]);
            }
            else {
                var gamma0x = M[round - 15];
                var gamma1x = M[round - 2];
                MRound =
                    M[round - 7] + M[round - 16] + (
                        rightRotate(gamma0x, 7) ^
                        rightRotate(gamma0x, 18) ^
                        (gamma0x >>> 3)
                    ) + (
                        rightRotate(gamma1x, 17) ^
                        rightRotate(gamma1x, 19) ^
                        (gamma1x >>> 10)
                    )
                    ;
            }

            // M数组与平台端序匹配
            // M array matches platform endianness
            M[round] = MRound |= 0;

            // Computation 计算
            var t1 =
                (
                    rightRotate(workingState[4], 6) ^
                    rightRotate(workingState[4], 11) ^
                    rightRotate(workingState[4], 25)
                ) +
                (
                    (workingState[4] & workingState[5]) ^
                    (~workingState[4] & workingState[6])
                ) + workingState[7] + MRound + ROUND_CONSTANTS[round]
                ;
            var t2 =
                (
                    rightRotate(workingState[0], 2) ^
                    rightRotate(workingState[0], 13) ^
                    rightRotate(workingState[0], 22)
                ) +
                (
                    (workingState[0] & workingState[1]) ^
                    (workingState[2] & (workingState[0] ^
                        workingState[1]))
                )
                ;

            for (var i = 7; i > 0; i--) {
                workingState[i] = workingState[i - 1];
            }
            workingState[0] = (t1 + t2) | 0;
            workingState[4] = (workingState[4] + t1) | 0;
        }

        // Update state  更新状态
        for (round = 0; round < 8; round++) {
            STATE[round] = (STATE[round] + workingState[round]) | 0;
        }
    }

    // 最后，需要将状态转换为BigEndian进行输出
    // Finally the state needs to be converted to BigEndian for output
    // 我们想返回一个Uint8Array，而不是Uint32Array
    // And we want to return a Uint8Array, not a Uint32Array
    return new uint8Array(new uint32Array(
        STATE.map(function (val) { return convertEndian(val); })
    ).buffer);
}

// 使用SHA-256生成哈希值的HMAC算法
function hmac(key, data) {
    if (key.length > 64)
        key = sha256(key);

    if (key.length < 64) {
        const tmp = new Uint8Array(64);
        tmp.set(key, 0);
        key = tmp;
    }

    // 生成内部和外部密钥
    // Generate inner and outer keys
    var innerKey = new Uint8Array(64);
    var outerKey = new Uint8Array(64);
    for (var i = 0; i < 64; i++) {
        innerKey[i] = 0x36 ^ key[i];
        outerKey[i] = 0x5c ^ key[i];
    }
// 附加innerKey
    // Append the innerKey  Uint8Array是一个8位无符号整数数组，每个元素占用1个字节。
    var msg = new Uint8Array(data.length + 64);

    msg.set(innerKey, 0);
    msg.set(data, 64);

    //具有上一条消息并附加outerKey
    // Has the previous message and append the outerKey
    var result = new Uint8Array(64 + 32);
    result.set(outerKey, 0);
    result.set(sha256(msg), 64);

    // 对上一条消息进行哈希处理
    // Hash the previous message
    return sha256(result);
}

// 将字符串转换为Uint8Array，SHA-256，然后转换回字符串
// Convert a string to a Uint8Array, SHA-256 it, and convert back to string
const encoder = new TextEncoder("utf-8");

// 实现签名逻辑
function sign(inputKey, inputData) {
    const key = typeof inputKey === "string" ? encoder.encode(inputKey) : inputKey;
    const data = typeof inputData === "string" ? encoder.encode(inputData) : inputData;
    return hmac(key, data);
}

// 实现字符串哈希值
function hash(str) {
    return hex(sha256(encoder.encode(str)));
}
//循环数组，实现十进制转换为十六进制的逻辑。 90(十进制) = 5a(十六进制) 
function hex(bin) {
    return bin.reduce((acc, val) =>
        acc + ("00" + val.toString(16)).substr(-2)
        , "");
}


export { hex, sign,hash};
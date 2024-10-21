<template>
  <div>

    <input type="text" v-model="inputRef">
    <!-- <button @click="jia()">加密</button>
    <button @click="jie()">解密</button> -->

  </div>


  <div>asciiString： {{ asciiString }}</div>

  <div>
    <p>中文字符: {{ chineseChar }}</p>
    <p>ASCII 值: {{ asciiValue }}</p>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, provide, watch, onUnmounted,inject ,computed} from "vue";
  import  Base64 from "@/hooks/useBase64.js";


  const params = {
            act_name: '答题抢红包活动', //活动名称  是否必填：是            
            mch_billno:111, //商户订单号  是否必填：是
            mch_id: 'mchid', //商户号  是否必填：是
            nonce_str: '2132r00<>/[]==9-98*&&^%$%$!~', //随机字符串  是否必填：是
            re_openid: 're_openid', //用户openid  是否必填：是
            remark: '答题满分可抢红包！', //备注  是否必填：是
            client_ip: [1,5,7], //Ip地址  是否必填：是            
            sign: 'mysign', //签名  是否必填：是  generateSign(/* 传入相关参数进行签名 */) // 你需要实现generateSign函数
            
        };

  //把params中的各项转换为url查询字符串，先对params中的key除了sign按ASCII码升序排序在转换为url查询字符串。
function buildQueryString(params) {
 
  let query_string= Object.keys(params).sort().map(key => {
      return `${encodeURIComponent(key)}=${(params[key])}`
    }).join('&')
    return query_string;

}




const data={
  page_head_title: "首页",
  page_head_keyword: "关键字",
  page_head_description: "描述首页",
  total_pages:1,
  current_page:1,
  current_active_tag_id:20,
  current_active_tag_name:"html",
  website_approve_title:"桂icp0000号",
  website_approve_url:"https://beian.miit.gov.cn/#/Integrated/index",
  tag_data: [1,2,3]
}


console.log('data:',JSON.stringify(data));
  console.log('buildQueryString:',buildQueryString(data))



let data_to_base64=Base64.encode(data);
console.log('data_to_base64:',data_to_base64);

const inputRef=ref(null);
  // function jia() {
  //   let str =inputRef.value?'5ZCN56ew5Ye65aSE77yaTEFEWS0wNzcg5rC06YeO576O6aaZ':'5ZCN56ew5Ye65aSE77yaTEFEWS0wNzcg5rC06YeO576O6aaZ';
  //   let ta = "";

  //   // str = base64_encode();
  //   console.log(typeof str)
  //   for (let i = 0; i < str.length; i++) {
  //     for (let key in Table) {
  //       if (Table[key] == str[i]) {
  //         ta += key
  //       }
  //     }
  //   }

  //   console.log('ta:',ta)
  // }

  console.log('data:',JSON.stringify(data)); // 输出: 65





  function replaceMultiple(str, replacements) {
  const regex = new RegExp(Object.keys(replacements).join('|'), 'g');
  return str.replace(regex, match => replacements[match]+'***');
}

const str_ing = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?dog,dog reacted,lazy,quick brown';
const replacements = {
  'dog': 'monkey',
  'dog reacted': 'monkey moved',
  'lazy': 'quick',
  'quick brown': 'black white'
};

const result = replaceMultiple(str_ing, replacements);
console.log('str_ing:',str_ing);

console.log('result:',result);



  const str_two = ref('一');
const asciiString = ref('');


let asciiCode = str_two.value.charCodeAt(0);


console.log('asciiCode:',asciiCode); // 输出: 65

// 转换函数
function convertToAscii(inputStr) {
  let result = '';
  for (let i = 0; i < inputStr.length; i++) {
    const charCode = inputStr.charCodeAt(i);
    result +=charCode.toString(16).padStart(4, '0');
  }
  return result;
}

console.log(str_two.value.charCodeAt())


console.log('str_two.value.charCodeAt(0):',str_two.value.charCodeAt(0));

// 将字符串转换为 ASCII 码
function stringToAscii(str) {
  let ascii = '';
  for (let i = 0; i < str.length; i++) {
    ascii += (str[i].charCodeAt(0) & 0xFF).toString(16);
  }
  return ascii;
}

// 示例
console.log(stringToAscii('Javascript')); // 4a617661736372697074


// 示例
console.log('stringToAscii(Javascript):',stringToAscii('中')); 


const chineseChar = ref('中');
const asciiValue = computed(() => chineseChar.value.charCodeAt(0));
// 应用转换
asciiString.value = convertToAscii(str_two.value);

  let Table = {
    '乾': 'A',
    '坤': 'B',
    '屯': 'C',
    '蒙': 'D',
    '需': 'E',
    '讼': 'F',
    '师': 'G',
    '比': 'H',
    '小畜': 'I',
    '履': 'J',
    '泰': 'K',
    '否': 'L',
    '同人': 'M',
    '大有': 'N',
    '谦': 'O',
    '豫': 'P',
    '随': 'Q',
    '蛊': 'R',
    '临': 'S',
    '观': 'T',
    '噬嗑': 'U',
    '贲': 'V',
    '剥': 'W',
    '复': 'X',
    '无妄': 'Y',
    '大畜': 'Z',
    '颐': 'a',
    '大过': 'b',
    '坎': 'c',
    '离': 'd',
    '咸': 'e',
    '恒': 'f',
    '遁': 'g',
    '大壮': 'h',
    '晋': 'i',
    '明夷': 'j',
    '家人': 'k',
    '睽': 'l',
    '蹇': 'm',
    '解': 'n',
    '损': 'o',
    '益': 'p',
    '夬': 'q',
    '姤': 'r',
    '萃': 's',
    '升': 't',
    '困': 'u',
    '井': 'v',
    '革': 'w',
    '鼎': 'x',
    '震': 'y',
    '艮': 'z',
    '渐': '1',
    '归妹': '2',
    '丰': '3',
    '旅': '4',
    '巽': '5',
    '兑': '6',
    '涣': '7',
    '节': '8',
    '中孚': '9',
    '小过': '0',
    '既济': '+',
    '未济': '/'

  };

  
//   let Base64: {
//     _keyStr: string;
//     encode: (e: any) => string;
//     decode: (e: any) => string;
//     _utf8_encode: (e: any) => string;
//     _utf8_decode: (e: any) => string;
// }
</script>
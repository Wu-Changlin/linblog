<template>
  <div>

    <input type="text" v-model="inputRef">
    <button @click="jia()">加密</button>
    <button @click="jie()">解密</button>

  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, provide, watch, onUnmounted,inject } from "vue";
const inputRef=ref(null)
  function jia() {
    var str =inputRef.value?'5ZCN56ew5Ye65aSE77yaTEFEWS0wNzcg5rC06YeO576O6aaZ':'5ZCN56ew5Ye65aSE77yaTEFEWS0wNzcg5rC06YeO576O6aaZ';
    var ta = "";

    // str = base64_encode();
    console.log(typeof str)
    for (var i = 0; i < str.length; i++) {
      for (var key in Table) {
        if (Table[key] == str[i]) {
          ta += key
        }
      }
    }

    console.log('ta:',ta)
  }

  var Table = {
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
</script>
const regs={
    email:/^\s*\w+(?:\.{0,1}[\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*$/,
    number:/^([0]|[1-9][0-9]*)$/,
    password:/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`\~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`\~()-+=]+$)(?![0-9\W_!@#$%^&*`\~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`\~()-+=]{8,15}$/,
}

/*
合法E-mail地址：   
1. 必须包含一个并且只有一个符号“@”   
2. 第一个字符不得是“@”或者“.”   
3. 不允许出现“@.”或者.@   
4. 结尾不得是字符“@”或者“.”   
5. 允许“@”前的字符中出现“＋”   
6. 不允许“＋”在最前面，或者“＋@”
*/   

// ‌密码必须包含以下四种字符类型‌：

// 密码必须包含大写字母、小写字母、数字和特殊字符中的至少三种。这是为了保证密码的复杂度，增加破解难度‌12。

// ‌具体要求如下‌：

// ‌大写字母（A-Z）‌：至少包含一个大写字母。
// ‌小写字母（a-z）‌：至少包含一个小写字母。
// ‌数字（0-9）‌：至少包含一个数字。
// ‌特殊字符‌：至少包含一个特殊字符，如! @ # $ % ^ & * 等。
// ‌示例正则表达式‌：

// 一个示例正则表达式如下：

// regex
// Copy Code
// /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`\~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`\~()-+=]+$)(?![0-9\W_!@#$%^&*`\~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`\~()-+=]{8,32}$/
// 这个正则表达式确保密码至少包含大写字母、小写字母、数字和特殊字符中的三种，并且长度至少为8位‌15。

const verify=(rule,value,reg,callback)=>{
    if(value){
        // console.log('value:',value,',reg.test(value):',reg.test(value));
        if(reg.test(value)){
            callback();
        }else{
            callback(new Error(rule.message));
        }
    }else{
        callback();
    }

}

export default{
    email:(rule,value,callback)=>{
        return verify(rule,value,regs.email,callback)
    },
    number:(rule,value,callback)=>{
        return verify(rule,value,regs.number,callback)
    },
    password:(rule,value,callback)=>{
        return verify(rule,value,regs.password,callback)
    },

    // install: (app) => {
    //     app.config.globalProperties['$Verify'] = verify;
       
    // }

}


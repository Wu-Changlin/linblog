const regs={
    email :/^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$/,
    number:/^([0]|[1-9][0-9]*)$/,
    password:/^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{9,18}$/,
}

const verify=(rule,value,reg,callback)=>{
    if(value){
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
}

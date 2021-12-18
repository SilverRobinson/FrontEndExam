import React, { useState, useCallback, useEffect } from 'react'
//|===================| Keydown Event Listener |==================|//
const usePress=()=>{
  const [press,setPress]=useState('')
  useEffect(()=>{
    const Press=event=>{
      let {key}=event
      if(key==='Enter')key='=';
      if(key==='*')key='×';
      if(key==='/')key='÷';
      setPress(key)
    }
    window.addEventListener('keyup', Press);
    return ()=>{
      setPress('')
      window.removeEventListener('keyup', Press);
    }
  })
  return press
}
//|===================| Keys Array |==============================|//
const useKeyGen=({display})=>{
  const [key,setKey]=useState('AC')
  let keys=['AC','±','%','÷','7','8','9','×','4','5','6','-','1','2','3','+','0','.','='];
  useEffect(()=>{
    display===Number(0)?setKey('AC'):setKey('C') 
  },[display])
  keys[0]=key
  return keys; 
}
//|===================| Function List |===========================|//
const KeyFunc=(label,{memory,setMemory,display,setDisplay,operator,setOperator,keys})=>{
  let func=()=>{};
  keys.push("/");
  keys.push("*");
  keys.push("Enter");
  keys.push("Backspace");
  if(keys.includes(label)){
    switch(label){
      case 'Backspace':
        func=()=>setDisplay(Number(display.toString().substr(0,display.toString().length-1)))
      break;
      case '±': func=()=>{
          setDisplay(-1*display);
          if(memory.length>0){
            memory[0].display=(-1*display)
            console.log("memory update:",memory)
            setMemory(memory);
          }
        }        
      break;
      case 'AC': case 'C': 
        func=()=>Clear({memory,setMemory,display,setDisplay});
      break;
      case'+':  case '-': case '×': case '÷': case '%': case'=': case 'Enter':
        if(label==='Enter')label='=';
        if(label==='*')label='×';
        if(label==='/')label='÷';
        func=operator===false
        ?()=>{
          Operate(label,{memory,setMemory,display,setDisplay});
          setOperator(true);}
        :()=>{
          memory[0].label=label
          setMemory(memory)
        }
      break;  
      default: func=()=>{
        Press(label,{display,setDisplay,operator,memory,setMemory});
        setOperator(false)}
    }
  }
  return func
} 
//|===================| Button Component |---=====================|//
const KeyButton=(label,idx,{memory,setMemory,display,setDisplay,operator,setOperator,keys})=>{
  let func=KeyFunc(label,{memory,setMemory,display,setDisplay,operator,setOperator,keys});
  return <div className={"item"+idx} onClick={func}>{label}</div>
}
//|===================| Number Key Function |=====================|//
const Press=(label,{display,setDisplay,operator,memory,setMemory})=>{
  if(memory.length>0 && memory[0].label==='=')setMemory([])
  if(operator) Number(label) ? setDisplay(Number(label)) : setDisplay(0+label)
  else  Number(label) ? setDisplay(Number(display+label)) : setDisplay(display+label)
}
//|===================| Clear and Reset |=========================|//
const Clear=({setMemory,display,setDisplay})=>{
  if(display===Number('0'))setMemory([]);
  setDisplay(0)
}
//|===================| Operate Function |========================|//
const Operate=(label,{memory,setMemory,display,setDisplay})=>{
  if(memory.length===0){
    memory.push({label,display:Number(display)})
    setMemory(memory)
  }else{
    memory=Execute({memory,display,label})
    setDisplay(memory[0].display)
    setMemory(memory)
  }
}
//|===================| Execute |=================================|//
const Execute=({memory,display,label})=>{
  const {label:operator,display:num}=memory[0];
  switch(operator){
    case '+': return[{label,display:Number((num + Number(display)))}]
    case '-': return[{label,display:Number((num - display))}]
    case '×': return[{label,display:Number((num * display))}]
    case '÷': return[{label,display:Number((num / display))}]
    case '%': return[{label,display:Number((num % display))}]
    default : 
  }
}  
//|===================| KeyPad Generator |========================|//
const GenerateKeyPad=(keys,{memory,setMemory,display,setDisplay,operator,setOperator})=>{
  return keys.map((data,idx)=>{
    return KeyButton(data,idx,{memory,setMemory,display,setDisplay,operator,setOperator,keys})
  })
}
//|===================| Key Press Trigger |=======================|//
const useKeyPress=(label,{memory,setMemory,display,setDisplay,operator,setOperator,keys})=>{
  useEffect(()=>{
    KeyFunc(label,{memory,setMemory,display,setDisplay,operator,setOperator,keys})()
  },[label,display,memory,operator,setDisplay,setMemory,setOperator,keys])
}
//|===============================================================|//
const App = () => {
  const [operator,setOperator]=useState(true)
  const [memory,setMemory]=useState([]);
  const [display,setDisplay]=useState(0);
  const keys=useKeyGen({display})
  const keypad=GenerateKeyPad(keys,{memory,setMemory,display,setDisplay,operator,setOperator});
  const press=usePress();
  useKeyPress(press,{memory,setMemory,display,setDisplay,operator,setOperator,keys})
  useCallback(()=>{
    console.log("Sorry I don't know how to use this Use CallBack")
  },[])
  return (
    <div style={{maxWidth:"500px"}}>
      <div className='display'>
        {display}
      </div>
      <div className='grid-container'>
        {keypad}
      </div>
    </div>
    
  )
}
//|===============================================================|//
export default App;
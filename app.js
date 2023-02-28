const express = require("express");
const bodyparser = require("body-parser");
const jalaali = require("jalaali-js");
const register = require("./register");
const childeren = require("./children");


const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));


//#region third database project

app.post('/registered',async(req,res,next)=>{
    let{name,lastName,nationalCode,phoneNumber,birthday} = req.body
    if(name.length<3){
        return res.status(200).json({message:"your lastname must be grather than 3 digits"})
    }
    if(lastName.length<3){
        return res.status(200).json({message:"your lastname must be grather than 3 digits"})
    }
    if(nationalCode.length!=10){
        return res.status(200).json({message:"your nationalcode must be 10 digits"})
    }
    if(phoneNumber.length!=10 || phoneNumber[0]=="0"){
        return res.status(200).json({message:"your phoneNumber must be 10 digits and the first not be zero"})
    }
    let createpassword = Math.floor(10000 + Math.random() * 90000);

    let nowYear = new Date().getFullYear();
 
    let ArrayBirthDay = birthday.split("/");
    if (ArrayBirthDay[0].length != 4) {
      return res.status(200).json({ message: "must be 4" });
    }
    if (ArrayBirthDay[1].length != 2) {
      return res.status(200).json({ message: "must be 2" });
    }
    if (ArrayBirthDay[2].length != 2) {
      return res.status(200).json({ message: "must be 2" });
    }

    let BirthDayMiladi = jalaali.toGregorian(
        parseInt(ArrayBirthDay[0]),
        parseInt(ArrayBirthDay[1]),                     
        parseInt(ArrayBirthDay[2])
      );
      
    let newdate = `${BirthDayMiladi.gy}/${BirthDayMiladi.gm}/${BirthDayMiladi.gd}`
       
    let savedate =  new Date(newdate)

      let FinalAge = nowYear - parseInt(BirthDayMiladi.gy);

      if(FinalAge<18){
        return res.status(200).json({ message:"You must be 18 or older"});
      }

      let checks = await register.findAll()

      if(checks.length){
        for(let r=0;r<checks.length;++r){
            if(nationalCode==checks[r].nationalCode){
                return res.status(200).json({message:"your nationalCode is reapeatet"})
            }
        }
        for(let y=0;y<checks.length;++y){
            if(phoneNumber==checks[y].phoneNumber){
                return res.status(200).json({message:"your phoneNumber is reapeatet"})
            }
        }
      }
      await register.create({
        name:name,
        lastName:lastName,
        nationalCode:nationalCode,
        phoneNumber:phoneNumber,
        password:createpassword,
        birthday:savedate
      })
      return res.status(200).json({message:"khaste nabashid"})
})



app.post('/login',async(req,res,next)=>{
    let{nationalCode,password}=req.body

    if(nationalCode.length!=10){
        return res.status(200).json({message:"your nationalcode must be 10 digits"})
    }
    if(password.length!=5){
        return res.status(200).json({message:"your nationalcode must be 6 digits"})
    }

    let show = await register.findOne({where:{
        nationalCode:nationalCode,
        password:password
    },
    attributes:["name","lastName","phoneNumber","birthday"],
})
let convert = jalaali.toJalaali(show.birthday);

show.birthday = convert

let sets =`${convert.jy}/${convert.jm}/${convert.jd}`

let final = {
    name:show.name,
    lastName:show.lastName,
    phoneNumber:show.phoneNumber,
    birthday:sets
}
    return res.status(200).json({message:final})
})





app.post('/Update',async(req,res,next)=>{
  let{nationalCode,phoneNumber,oldpassword,newpassword}=req.body
  if(nationalCode.length!=10){
    return res.status(200).json({message:"your nationalCode must be 10 digits"})
  }
  if(phoneNumber.length!=10 || phoneNumber[0]=="0"){
    return res.status(200).json({message:"your phoneNumber must be 10 digits and first item not be 0"})
  }
  if(oldpassword.length!=5){
    return res.status(200).json({message:"your oldpassword must be 5"})
  }
  if(newpassword.length!=5){
    return res.status(200).json({message:"your newpassword must be 5"})
  }


  await register.update(
    {password:newpassword},
    {where:{nationalCode:nationalCode,
    phoneNumber:phoneNumber,
    password:oldpassword}}
  )
  return res.status(200).json({message:`update is done and your newpassword is ${newpassword}`})
})






app.post('/childeren',async(req,res,next)=>{
  let{name,gender,nationalCode} = req.body

  if(name.length<3){
    return res.status(200).json({message:"your lastname must be grather than 3 digits"})
  }
  if(gender!="male" && gender!="fmale"){
    return res.status(200).json({message:"You must be either female or male"})
  }
  if(nationalCode.length!=10){
    return res.status(200).json({message:"your nationalCode must be 10 digits"})
  }

  let createnationalCode = Math.floor(1000000000 + Math.random() * 9000000000);

  let father = await register.findOne({
    where:{nationalCode:nationalCode}
  })

  if(!father){
    return res.status(200).json({message:"no person"})
  }

  await childeren.create({
    name:name,
    nationalCode:createnationalCode,
    gender:gender,
    registerId:father.id
  })

  return res.status(200).json({message:"Your child has been added"})
})



app.get('/showchilderen/:nationalCode/:gender?',async(req,res,next)=>{
  let{nationalCode,gender}=req.params
if(gender)
{
  if(gender!="male" && gender!="fmale"){
    return res.status(200).json({message:"You must be either female or male"})
  }
  let girlChild = await register.findOne({
    where:{nationalCode:nationalCode},
    include:[{
      model:childeren,
      where:{
        gender:gender
      }

    }]
  })
  return res.status(200).json({message:girlChild})

}




  // if(gender){
  //   if(gender=="fmale"){
  //     let girlChild = await register.findOne({
  //       where:{nationalCode:nationalCode},
  //       include:[{
  //         model:childeren,
  //         where:{
  //           gender:'fmale'
  //         }

  //       }]
  //     })
  //     return res.status(200).json({message:girlChild})
  //   }
  //   if(gender=="male"){
  //     let boyChild = await register.findOne({
  //       where:{nationalCode:nationalCode},
  //       include:[{
  //         model:childeren,
  //         where:{
  //           gender:"male"
  //         }
  //       }]

  //     })
  //     return res.status(200).json({message:boyChild})
  //   }
  // }
  let allChild = await register.findOne({
    where:{nationalCode:nationalCode},
    include:[{
      model:childeren,
    }]
  })
 
})




app.get('/showfather/:nationalCode',async(req,res,next)=>{
  let nationalCode = req.params.nationalCode

  let father = await childeren.findOne({
    where:{nationalCode:nationalCode},
    include:[{
      model:register
    }]
  })
  return res.status(200).json({message:father})
})
























app.listen(4001);

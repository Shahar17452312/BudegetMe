import jwt from "jsonwebtoken";

const verify=(header,paramsId)=>{
    if(!header){
        return {status:401,message:"header not found"};
    }
    const auth=header["authorization"];
    if(!auth){
        return {status:401,message:"authorization field not found"};
    }
    const token=auth.split(" ")[1];
    if(token){
        try{
            const data=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY);
            if(data.id!==Number(paramsId)){
                return {status:400,message:"user id not matched to paramsId "};
            }
            return {
                status:200,
                payload:{...data},
                message:"user has authorization"
            };
        }
        catch(error){
            console.log(error.message);
            return {status:401,message:"Invalid token"};
        }
    }
    else{
        return {status:401,message:"No token included"};
    }

};


export default verify;


import { PermissionsAndroid,Alert } from 'react-native';

//返回 Promise类型 里面是用户是否授权的布尔值
//1.PermissionsAndroid.check(permission)  //permission是String型

//返回String类型   'granted'：同意了  'denied'：拒绝了  'never_ask_again'：永久性拒绝下次再请求用户也看不到了
//2. PermissionsAndroid.request(permission, rationale?) //permission是String型，rationale对象

//返回一个对象
//PermissionsAndroid.requestMultiple(permissions) //permissions为String型数组


function androidPermission(permission,title,message){
    if(checkAndroidPermission(permission)){
        return true;//已获得了权限
    }else{
        //未获得权限，申请权限
        var isAgree = requestAndroidPermission(permission,title,message);
        if(isAgree){
            return true;//同意
        }else{
            return false;//拒绝
        }
    }
}



//核实
function checkAndroidPermission(permission){
    try{
        //返回Promise类型
        const granted = PermissionsAndroid.check(
            permission
        )
        granted.then((data)=>{
            //是否获取权限 data
            Alert.alert(
                'warn',
                ''+data,
            )
            return data;
        }).catch((err)=>{
            console.warn(exception)
        })
    }catch(exception){
        console.warn(exception)
    }  
}

//请求权限
async function requestAndroidPermission(permission,title,message){
    try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                'title': '申请' + {title} + '权限',
                'message': {message}
            }
        )
        Alert.alert(
            'warn',
            ''+granted,
        )
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            console.log("获得"+title+"权限")
            return true;
        }else{
            console.log("获得"+title+"权限失败")
            return false;
        }
    }catch(exception){
        console.warn(exception)
    }
};

//请求多个权限
async function requestMultipleAndroidPermission(permissions){
    try{
        var agreePermissions = [];
        const granteds = await PermissionsAndroid.requestMultiple(permissions);//返回的是对象类型
        permissions.forEach(function(txt,index,b){
            if(granteds[permissions[index]]==='granted'){
                 agreePermissions.push(true);
            }else{
                agreePermissions.push(false);
            }
        });
        return agreePermissions;
    }catch(exception){
        console.warn(exception);
    }
}

module.exports = {androidPermission,checkAndroidPermission,requestAndroidPermission,requestMultipleAndroidPermission}
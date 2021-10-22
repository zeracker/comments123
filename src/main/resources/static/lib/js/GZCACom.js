
//获取签名证书信息NetONEX
function GetCertificateByNetONEX(KeyUsage) {
    var obj = new NetONEX();
    var colx = obj.getCertificateCollectionX();
    colx.Quiet = 1;
    colx.CF_KeyUsage = KeyUsage;          //密钥用途过滤，所有：1  签名证书:32  加密证书:16
   // colx.CF_Issuer_Contains = "CN=GZCA";  //签发者主题项，贵州CA证书：CN=GZCA
    if (colx.Load() <= 0) {
        alert(obj.getGZCAErr());
        return;
    }
    var crtx;
    if (colx.Size > 1) {
        crtx = colx.SelectCertificateDialog();
    } else {
        crtx = colx.GetAt(0);
    }
    return crtx;
};


function SignByCANoPIN(EncryptData) {
    var crtx = GetCertificateByNetONEX(32);
    if (!crtx) {
        return;
    }
    var Result = crtx.PKCS1String(EncryptData);
    if (!Result) {
        return;
    }
    return new Array(Result, crtx.SerialNumber);
};

//签名
function SignByCA(EncryptData) {
    //CA登录
    //var ret = GZCAKeyLogin(GZCACom);
    //if (ret == "0") {
    var crtx = GetCertificateByNetONEX(0x20);
    if (!crtx) {
        return;
    }
    var Result = crtx.PKCS1String(EncryptData);
    if (!Result) {
        return;
    }
    return new Array(Result, crtx.SerialNumber);
    //}
};

function GZCAEncrypt(DecryptVal) {
    if (DecryptVal === '' || DecryptVal === null || DecryptVal === undefined) {
        alert("请输入要加密的原文！");
        return "";
    }
    return encrypt(true, DecryptVal);
}

//字符串加密
function GZCADecrypt(DecryptVal) {
    //if (DecryptVal === "") {
    //    alert("请输入要解密的密文！");
    //    return "";
    //}
    if (DecryptVal === '' || DecryptVal === null || DecryptVal === undefined) {
        return '';
    }
    return encrypt(false, DecryptVal);
}

function loadCertificate(colx) {
    var crtx = null;
    var crtxNumber = colx.Load();
    if (crtxNumber == 0) {
        alert("浏览器中没有发现数字证书！");
        //} else if (crtxNumber == 1) {
        //    crtx = colx.GetAt(0);
        //} else {
        //    crtx = colx.SelectCertificateDialog();
    }
    else if (colx.Size > 1) {
        crtx = colx.SelectCertificateDialog();
    } else {
        crtx = colx.GetAt(0);
    }

    return crtx;
}


function initialize() { //主动初始化,并返回证书序列号

    var obj = new NetONEX();
    colx = obj.getCertificateCollectionX();
    colx.Quiet = 1;
    colx.CF_KeyUsage = 32;          //密钥用途过滤，所有：1  签名证书:32  加密证书:16
    colx.CF_Issuer_Contains = "CN=GZCA";  //签发者主题项，贵州CA证书：CN=GZCA
    if (colx.Load() <= 0) {
        alert(obj.getGZCAErr());
        return;
    }
    crtx = loadCertificate(colx);
    crtx.Quiet = 1;
    return crtx.SerialNumber;
}



//var fingerprint;
var colxFull = null;
var b64xFull = null;
var crtxFull = null;
function encrypt(enc, val) {
    if (val === '' || val === null || val === undefined) {
        return '';
    }

    if (!colxFull) {
        var obj = new NetONEX();
        colxFull = obj.getCertificateCollectionX();
        colxFull.Quiet = 1;
        colxFull.CF_KeyUsage = 16;          //密钥用途过滤，所有：1  签名证书:32  加密证书:16
        colxFull.CF_Issuer_Contains = "CN=GZCA";  //签发者主题项，贵州CA证书：CN=GZCA
        if (colxFull.Load() <= 0) {
            alert(obj.getGZCAErr());
            return;
        }
        b64xFull = obj.getBase64X();
    }
    if (!b64xFull) {
        var obj = new NetONEX();
        b64xFull = obj.getBase64X();
    }

    if (enc) {
        if (!crtxFull) {
            crtxFull = loadCertificate(colxFull);
            crtxFull.Quiet = 1;
            if (!crtxFull) {
                alert("找不到有效证书！");
                return '无有效证书';
            }
        }
        if (getDocumentType(crtxFull) != '机构代码') {
            return '#code0001';
        }
        //var crtx = loadCertificate(colx);
        //crtx.Quiet = 1;
        var data = val;
        var b64data = b64xFull.EncodeString(data);
        var encryptedData = crtxFull.PublicEncrypt(b64data);
        return encryptedData;
    } else {

        var enData = val;
        try {
            if (!crtxFull) {
                crtxFull = loadCertificate(colxFull);
                crtxFull.Quiet = 1;
                if (!crtxFull) {
                    alert("找不到有效证书！");
                    return '无有效证书';
                }
            }
            if (crtxFull.IsPrivateKeyAccessible) {
                var decrypedData = crtxFull.PrivateDecrypt(enData);
                if (decrypedData) {
                    return (b64xFull.DecodeString(decrypedData));
                }
                else {
                    return '用户取消';
                }

            } else {
                alert("您选择的证书私钥不可访问");
            }
        } catch (e) {
            alert(e);
        }
    }
}

if (isIE() != true) {
    // Alert the that CAPICOM was not able to be installed
    alert("此浏览器不兼容CA,请使用IE浏览器登录.");
}

function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

function getDocumentType(crtx) {
    if (crtx.Issuer.indexOf("CN=GZCA", 0) >= 0) {
        //组织机构:1.2.156.10260.4.1.4  个人:1.2.156.10260.4.1.1
        var oid = ['1.2.156.10260.4.1.4', '1.2.156.10260.4.1.1'];
        var d;
        for (var i in oid) {
            d = crtx.GetExtensionString(oid[i], 0);
            if (d) {
                if (oid[i] == '1.2.156.10260.4.1.4') {
                    return "机构代码";//机构代码
                } else if (oid[i] == '1.2.156.10260.4.1.1') {
                    return "身份证号";//身份证号
                }
            }
        }
    } else {
        return "";
    }
}

/* function GDCASetDevice(i_Com, deviceType) {
    i_Com.GDCA_SetDeviceType(deviceType);//设置密码设备类型
    return i_Com.GetError();
}

function GDCAInitialize(i_Com) {
    i_Com.GDCA_Initialize();//初始化接口所需要的全局资源
    return i_Com.GetError();
}
 */

/* function GDCAKeyInit(i_Com, KeyType) {
    var ret = GDCASetDevice(i_Com, KeyType);
    if (ret != 0) {
        alert("设置设备类型出错：" + ret);
        return ret;
    }
    //初始化控件
    ret = GDCAInitialize(i_Com);
    if (ret != 0) {
        alert("初始化控件出错：" + ret);
    }
    return ret;
}
 */

function ActiveXInit(i_Com2, KeyType) {
    var ret, DeviceType;

    DeviceType = i_Com2.GDCA_GetDevicType();//获得windows的usb设备类型
    ret = DeviceType;
    switch (parseInt(DeviceType)) {
        case -2: alert("注册表错误,请导入正确的注册表文件：" + ret);
            KeyType[0] = DeviceType;
            break;
        case -1: alert("请插入证书硬件介质:" + ret);
            KeyType[0] = DeviceType;
            break;
        case -3: alert("有其他的USB设备:" + ret);
            KeyType[0] = DeviceType;
            break;
        case 10:
        case 11: ret = GDCAKeyInit(i_Com2, DeviceType);
            KeyType[0] = 2;
        case 27: ret = GDCAKeyInit(i_Com2, DeviceType);
            KeyType[0] = 2;
    }

    return ret;
}
//***************************初始化END*********************************************
//***************************释放清除一组******************************************
/* function GDCAFinalize(i_Com) {
    i_Com.GDCA_Finalize();
    return i_Com.GetError();
}

function GDCAKeyEnd(i_Com) {
    var ret;

    //释放资源
    ret = GDCAFinalize(i_Com);
    if (ret != 0)
        alert("释放资源:" + ret);
    return ret;
}
 */
function ActiveXEnd(i_Com, KeyType) {
    var ret;
    ret = GDCAKeyEnd(i_Com);
    return ret;
}
//****************************************释放清除一组END****************************************

/* var KeyType = new Array;
var GZCAKeyPin = "";
function GZCAKeyLogin(i_Com) {
    var ret = 0;
    ret = ActiveXInit(i_Com, KeyType);
    if (ret != 0) {
        alert("系统初始化出错");
        return;
    }
    //===============
    if (GZCAKeyPin == "") {
        GZCAKeyPin = prompt("请输入您的PIN码：", "");
    }
    if (GZCAKeyPin == null) {
        return;
    }
    if (GZCAKeyPin == "") {
        alert("输入的PIN码为空！");
        return;
    }
    ret = i_Com.GDCA_Login(2, GZCAKeyPin);
    if (i_Com.GetError() != 0) {
        GZCAKeyPin = "";
        alert("登陆失败，剩余登录次数：" + ret);
        //释放资源
        i_Com.GDCA_Finalize();
    }
    return ret;
}

function GDCAKeyLogin(i_Com, userpin) {
    var ret, errorCode;

    ret = i_Com.GDCA_Login(2, userpin);
    errorCode = i_Com.GetError();
    if (errorCode != 0) {
        alert("登陆失败，剩余登录次数：" + ret);
        //释放资源
        ret = GDCAFinalize(i_Com);
    }
    return errorCode;
}

function GDCALogin(i_Com, keytype, userpin) {
    var ret;

    ret = GDCAKeyLogin(i_Com, userpin);

    return ret;
} */
//*******************************登陆一组end****************************************
//******************************登出一组******************************************
/* function GZCAKeyLogout(i_Com) {
    GZCAKeyPin = "";
    return GDCAKeyLogout(i_Com);
}
function GDCAKeyLogout(i_Com) {
    var ret, errorCode;

    ret = i_Com.GDCA_Logout();
    errorCode = i_Com.GetError();
    if (errorCode != 0) {
        alert("退出登录不成功:" + ret);
        GDCAKeyEnd(i_Com);
    }
    return ret;
}

function GDCALogout(i_Com, keytype) {
    return GDCAKeyLogout(i_Com);
} */
//******************************登出一组END******************************************
//*********************************读取证书********************************************************
/* function GDCAReadLabel(i_Com, labelName, labelType, outData) {
    var ret;
    var ReadOutData;

    //  alert("labelName="+labelName +"  labelType="+labelType);
    ReadOutData = i_Com.GDCA_ReadLabel(labelName, labelType);
    ret = i_Com.GetError();
    if (ret != 0) {
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }
    //     ret = GDCABase64Decode(i_Com,KeyType,out_data[0],outData);
    //        alert("GDCABase64Decode ret ="+ret);
    outData[0] = ReadOutData;

    return ret;
} */

/* function GDCAKeyGetCert(i_Com, CertType, CertData) {
    var ret;

    //        alert("CertType="+CertType);
    switch (parseInt(CertType)) {
        case 1:  //		alert("读加密证书");
            ret = GDCAReadLabel(i_Com, LBL_USERCERT_ENC, GDCA_LBL_ENCCERT, CertData);
            if (ret != 0) {
                alert("读加密证书出错：" + ret);
                return ret;
            }
            break;
        case 2:  //		alert("读签名证书");
            ret = GDCAReadLabel(i_Com, LBL_USERCERT_SIG, GDCA_LBL_SIGNCERT, CertData);
            if (ret != 0) {
                alert("读签名证书出错：" + ret);
                return ret;
            }
            break;
        case 3:  //	alert("读CA证书")
            ret = GDCAReadLabel(i_Com, LBL_CACERT, GDCA_LBL_CACERT, CertData);
            if (ret != 0) {
                alert("读CA证书出错：" + ret);
                return ret;
            }
            //   alert("LBL_CACERT="+CertData[0]);
            break;
        default: alert("无此证书类型");
            ret = -2016;
            return ret;

    }
    //       alert("CertData1="+CertData[0]);
    return ret;
}

function GDCAReadCert(i_Com, KeyType, CertType, CertData) {
    return GDCAKeyGetCert(i_Com, CertType, CertData);
} */
//*********************************读取证书END********************************************************
//*********************************数字信封加密******************************************
/* function GDCAKeySealEnvelope(i_Com, EncrytCert, i_algo, inData, outData) {
    var ret;
    var Base64Data = new Array;

    ret = GDCAKeyB64Encode(i_Com, inData, Base64Data);
    if (ret != 0) {
        alert("编码出错:" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }
    alert("编码后的数据=" + Base64Data[0]);
    outData[0] = i_Com.GDCA_OpkiSealEnvelope(EncrytCert, Base64Data[0], i_algo);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("加密出错：" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }

    return ret;
} */

/* function GDCASealEnvelope(i_Com, KeyType, EncrytCert, EncryptAlgo, inData, outData) {
    var ret = 0, Algo;

    if (EncryptAlgo == "GDCA_ALGO_3DES")
        Algo = 26115;
    else if (EncryptAlgo == "GDCA_ALGO_RC4")
        Algo = 26625;
    else if (EncryptAlgo == "GDCA_ALGO_SSF33")
        Algo = 9;
    else {
        alert("算法类型错误");
        return -2008;
    }
    ret = GDCAKeySealEnvelope(i_Com, EncrytCert, Algo, inData, outData);

    return ret;
} */

//*********************************数字信封加解密END******************************************
//*********************************数字信封解密******************************************
/* function GDCAKeyOpenEnvelope(i_Com, inData, outData) {
    var ret = 0;
    var middleText1 = "";
    middleText1 = i_Com.GDCA_OpkiOpenEnvelope(LBL_USERCERT_ENC, GDCA_LBL_ENCKEY, inData);
    if (outData[0] == "") {
        alert("数字信封解密出错:" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }

    ret = GDCAKeyB64Decode(i_Com, middleText1, outData);
    if (ret != 0) {
        alert("解码明文错误：" + ret);
        return ret;
    }
    return ret;
}

function GDCAOpenEnvelope(i_Com, KeyType, UserPin, inData, outData) {
    var ret = 0;

    ret = GDCAKeyOpenEnvelope(i_Com, inData, outData);

    return ret;
} */
//*********************************数字信封解密END******************************************
//*********************************数字签名*************************************************
/* function GDCAKeySignData(i_Com, ClientSignCert, Algo, inData, outData) {
    var ret;
    var Base64Data = new Array;

    ret = GDCAKeyB64Encode(i_Com, inData, Base64Data);
    if (ret != 0) {
        alert("编码出错:" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }

    outData[0] = i_Com.GDCA_OpkiSignData(LBL_USERCERT_SIG, GDCA_LBL_SIGNKEY, ClientSignCert, Base64Data[0], Algo, 0);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("数字签名出错:" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }

    return ret;
} */

/* function GDCASignData(i_Com, KeyType, ClientSignCert, UserPin, inData, hashAlgo, outData) {
    var ret = 0, Algo = 0;

    if (hashAlgo == "GDCA_ALGO_SHA1")
        Algo = 32772;
    else if (hashAlgo == "GDCA_ALGO_MD5")
        Algo = 32771;

    ret = GDCAKeySignData(i_Com, ClientSignCert, Algo, inData, outData);

    return ret;
} */
//*********************************数字签名END*************************************************

/* function GDCAKeyVerifySignData(i_Com, ClientSignCert, Algo, originalData, signedData) {
    var ret;
    var Base64Data = new Array;

    ret = GDCAKeyB64Encode(i_Com, originalData, Base64Data);
    if (ret != 0) {
        alert("编码出错:" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }

    ret = i_Com.GDCA_OpkiVerifyData(ClientSignCert, Base64Data[0], signedData, Algo, 0);
    errorCode = i_Com.GetError();
    if (errorCode != 0) {
        alert("客户端验证签名失败，请检查:" + errorCode);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
    } else {
        ret = 0;
    }
    return ret;
} */

/* function GDCAVerifySignData(i_Com, KeyType, ClientSignCert, originalData, signedData, hashAlgo) {
    var ret, Algo;

    if (hashAlgo == "GDCA_ALGO_SHA1")
        Algo = 32772;
    else if (hashAlgo == "GDCA_ALGO_MD5")
        Algo = 32771;
    else Algo = 0;

    ret = GDCAKeyVerifySignData(i_Com, ClientSignCert, Algo, originalData, signedData);

    return ret;
} */
//*********************************验证签名END*****************************************************
//*******************************Base64编解码*************************************************
/* function GDCAKeyB64Encode(i_Com, inData, outData) {
    var ret = 0;

    outData[0] = i_Com.GDCA_Base64Encode(inData);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("BASE64编码失败：" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }
    return ret;
} */
/* function GDCAKeyB64Decode(i_Com, inData, outData) {
    var ret = 0;
    // alert("inData="+inData);
    outData[0] = i_Com.GDCA_Base64Decode(inData);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("解码失败：" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }
    return ret;
} */
//*******************************Base64编解码 END*************************************************
//************************************读写文件*****************************************************************
/* function GDCAKeyWriteFile(i_Com, filename1, inData) {
    var ret;

    ret = i_Com.GDCA_WriteFile(filename1, 0, inData);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("保存文件失败:" + ret);
        return ret;
    }

    return ret;
}

function GDCAWriteFile(i_Com, KeyType, filename1, inData) {
    var ret;

    ret = GDCAKeyWriteFile(i_Com, filename1, inData);

    return ret;
}

function GDCAKeyReadFile(i_Com, filename1, outData) {
    var ret = 0;

    outData[0] = i_Com.GDCA_ReadFile(0, filename1, 1);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("文件读取失败:" + ret);
        return ret;
    }
    return ret;
}

function GDCAReadFile(i_Com, KeyType, filename1, outData) {
    var ret = 0;

    ret = GDCAKeyReadFile(i_Com, filename1, outData);

    return ret;
} */


//************************************读写文件END*****************************************************************
//************************************验证证书*****************************************************************
/* function GDCAKeyCheckCert(i_Com, inCertData, caCert, crlData) {
    var ret;

    //    alert("GDCAKeyCheckCert Start");

    ret = i_Com.GDCA_VerifyCert(inCertData, caCert);
    if (ret != 0) {
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        alert("用户证书非法：" + ret);
        return ret;
    }
    //    alert("GDCA_VerifyCert end");
    ret = i_Com.GDCA_VerifyCrl(crlData, caCert);
    if (ret != 0) {
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        alert("撤销列表非法：" + ret);
        return ret;
    }

    ret = i_Com.GDCA_CheckCertByCrl(inCertData, crlData);
    if (ret != 0) {
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        alert("该证书已被撤销：" + ret);
        return ret;
    }
    return ret;
}
 */
/* function GDCACheckCert(i_Com, KeyType, inCertData, UserRootCert, crlData) {
    var ret;

    ret = GDCAKeyCheckCert(i_Com, inCertData, UserRootCert, crlData);

    return ret;
} */

//************************************************Base64编码END*********************************
/* function GDCAKeyB64Decode(i_Com, inData, outData) {
    var ret = 0;

    outData[0] = i_Com.GDCA_Base64Decode(inData);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("解码失败：" + ret);
        GDCAKeyLogout(i_Com);
        GDCAKeyEnd(i_Com);
        return ret;
    }
    return ret;
}


function GDCABase64Decode(i_Com, KeyType, inData, outData) {
    var ret = 0;


    ret = GDCAKeyB64Decode(i_Com, inData, outData);

    return ret;
} */
//***********************************Base64解码END***********************************/

//***************************获得证书截止时间************************************//
/* function GDCAGetCerTime(i_Com, inData, outData) {
    var ret = 0;
    var date = i_Com.GDCA_GetCertificateInfo(inData, 6);
    ret = i_Com.GetError();
    //var time = date.substring(15,date.length);
    outData[0] = date.substring(15, 23);
    return ret;
} */
//*****************************************************************************//

//**********************证书过期预警接口**********************************/
/* function GDCACerEndDate(i_Com, inData) {
    var ret = 0;
    var date = i_Com.GDCA_GetCertificateInfo(inData, 6);
    var time = date.substring(15, 23);
    var today = new Date();
    var DisaEndDate = new Date();
    DisaEndDate.setFullYear(time.substring(0, 4));
    DisaEndDate.setMonth(time.substring(4, 6));
    DisaEndDate.setDate(time.substring(6, 8));
    alert(today.getTime().toString());
    alert((DisaEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) - 30);
    if ((((DisaEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) - 30) < 15) && (((DisaEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) - 30) >= 0)) {
        alert("您的用户证书将于" + time + "过期");
        ret = 1;
    }
    if (((DisaEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) - 30) < 0) {
        alert("您的用户证书已经过期");
        ret = 2;
    }
    return ret;
} */
/************************************************************************/
/************获得keyid***************************/
/* function GDCAGetKeyId(i_Com, outData) {
    var ret = 0;
    var keyid = i_Com.GDCA_ReadLabel(LBL_DISAID, 3);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("获得keyid失败，请检查!：" + ret);
        return ret;
    }

    outData[0] = i_Com.GDCA_Base64Decode(keyid);
    ret = i_Com.GetError();
    if (ret != 0) {
        alert("解码失败：" + ret);
        return ret;
    }
    return ret;
} */
/************************************************/


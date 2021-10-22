//package com.vito.comments.util;
//
//import com.alibaba.fastjson.JSONObject;
//import com.fop.sdk.DefaultFopClient;
//import com.fop.sdk.FopApiException;
//import com.fop.sdk.FopClient;
//import com.fop.sdk.SignType;
//import com.fop.sdk.request.FopCommonRequest;
//import com.fop.sdk.response.FopCommonResponse;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.PropertySource;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.PostConstruct;
//import java.awt.event.ActionEvent;
//import java.awt.event.ActionListener;
//import java.util.*;
//
///**
// * 银行请求util
// */
//
//@Component
//@PropertySource("classpath:application.yml")
//public class BankUtil  implements ActionListener {
//    private static Logger log = LoggerFactory.getLogger(BankUtil.class);
//    @Value("${bankUrl}")
//    private static String bankUrl;
////    private static PayLogUtil payLogUtil = new PayLogUtil();
//    public static String SUCCESS_CODE = "SUCCESS";//通信成功
//    public static String RES_SUCC = "SCSAAAAAAA";//处理成功
//
//    //测试环境
////    private static String serverUrl = "http://222.85.178.210:8008/OAP/sit/gateway/v1/scs";
////    private static String appId = "00870215";
////    private static String privateKey = "1ed316861ef661ac1186c6af9367d2f02ab40afbc64ac050e63514cebb9772a8";
////    private static String fopPublicKey = "0432157a049d99758ec0ff362ef2e498fecb0921d2c72abf533959f6572f2f7e6081fd78dd90e480ff587acbcee9798bef5bd431790583e169ee11198827ba9f14";
////    private static String  superAccNo= "0136001900000041";//0315001900000434
////    private static String superAccName = "测试客户0200099808810136001900000041";//测试账户
//
//    //正式环境
////    private static String superAccNo= "0136001900000041";
////    private static String superAccName = "贵州省公共资源交易中心";
////    private static String serverUrl = "http://70.1.0.32:8008/OAP/common/gateway/v1/scs";
////    private static String appId = "00870215";
////    private static String privateKey = "83b5f3c3389720c3510dc5f10b5b5f4d49c0c7a9e7087c48edaf6aecfb78c0df";
////    private static String fopPublicKey = "049693743f3485dc9fc5d7d9507302473e74853c688f6bdacf43c4674f581201cefaf436dda962bf331bbb5139eb9d5cf481aa890705d6a487cac892e9dd4bc130";
//
//
//    @Value("${bank.serverUrl}")
//    private  String serverUrlStatic;
//    private static String serverUrl;
//    @Value("${bank.appId}")
//    private  String appIdStatic;
//    private static String appId;
//    @Value("${bank.privateKey}")
//    private  String privateKeyStatic;
//    private static String privateKey;
//    @Value("${bank.fopPublicKey}")
//    private  String fopPublicKeyStatic;
//    private static String fopPublicKey;
//    @Value("${bank.superAccNo}")
//    private  String superAccNoStatic;
//    private static String superAccNo;
//    @Value("${bank.superAccName}")
//    private  String superAccNameStatic;
//    private static String superAccName;
//    @PostConstruct
//    public void init() {
//        serverUrl = serverUrlStatic;
//        appId = appIdStatic;
//        privateKey =privateKeyStatic;
//        fopPublicKey = fopPublicKeyStatic;
//        superAccNo = superAccNoStatic;
//        superAccName = superAccNameStatic;
//    }
//
//    /**
//     * 获取账户信息
//     */
//    public static FopCommonResponse getAccount(String accNo ,String accName ,String userDeviceId,String  functionCode){
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140202";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0111033", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl(serverUrl + "/SCS0111033/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","SCS");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS0111033");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("functionCode",functionCode);//新增
//        body.put("superAccNo",superAccNo);//主账号
//        body.put("superAccName",superAccName);//主账户名
//        body.put("accNo",accNo);//
//        body.put("accName",accName);//账户名称
//        body.put("ccy","001");//001是CNY
//        body.put("out_request_no",generateSerialNo()); //20201224新加入参，业务流水号
//
////        requestData.put("body",body);
////        bizContent.put("requestData", requestData);
//
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            //不需要token
////      response = fopClient.execute(request);
//            //需要token
//            response = fopClient.execute(request, userDeviceId);
////            log.warn(JSONObject.toJSONString(response));
//            log.warn("response:[" + response+ "]");
//            log.warn("response.getCode:[" + response.getCode() + "]");
//            log.warn("response.getMsg:[" + response.getMsg() + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//            return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//    /**
//     * 修改
//     */
//    public static FopCommonResponse editAccount(String accNo ,String accName ,String userDeviceId){
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140202";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0111033", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl(serverUrl + "/SCS0111033/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","SCS");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS0111033");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("functionCode","1");//修改
//        body.put("superAccNo",superAccNo);//主账号
//        body.put("superAccName",superAccName);//主账户名
//        body.put("accNo",accNo);//
//        body.put("accName",accName);//账户名称
//        body.put("ccy","001");//001是CNY
//        body.put("out_request_no",generateSerialNo()); //20201224新加入参，业务流水号
//
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            //不需要token
////          response = fopClient.execute(request);
//            //需要token
//            response = fopClient.execute(request, userDeviceId);
//            log.warn("response.getCode:[" + response.getCode() + "]");
//            log.warn("response.getMsg:[" + response.getMsg() + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//            return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//    /**
//     * 销户
//     */
//    public static FopCommonResponse delAccount(String accNo ,String accName ,String userDeviceId){
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140202";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0111033", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl(serverUrl + "/SCS0111033/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","SCS");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS0111033");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("functionCode","2");//删除
//        body.put("superAccNo",superAccNo);//主账号
//        body.put("superAccName",superAccName);//主账户名
//        body.put("accNo",accNo);//
//        body.put("accName",accName);//账户名称
//        body.put("ccy","001");//001是CNY
//        body.put("out_request_no",generateSerialNo()); //20201224新加入参，业务流水号
//
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            //不需要token
////      response = fopClient.execute(request);
//            //需要token
//            response = fopClient.execute(request, userDeviceId);
////            log.warn(JSONObject.toJSONString(response));
//            log.warn("response:[" + response.getResult() + "]");
//            return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//
//    /**
//     * 查询余额 903015000500000044
//     */
//    public static FopCommonResponse getRemain(String account ,String userDeviceId){
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140203";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0585046", "1.0.0");
//        System.out.println("地址："+serverUrl);
//        System.out.println("地址："+appId);
//        System.out.println("地址："+privateKey);
//        System.out.println("地址："+fopPublicKey);
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl( serverUrl +  "/SCS0585046/1.0.0");
//        //http://222.85.178.210:8008/OAP/sit/gateway/v1/scs/SCS0585046/1.0.0
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
////        systemHeader.put("sourceSystemCode","ACP");
////        systemHeader.put("sinkSystemCode","SCS");
////        systemHeader.put("actionId","SCS0585046");
////        systemHeader.put("sourceJnlNo",generateSerialNo());
//////        systemHeader.put("timestamp", MyTimeUtil.getCurrentTime());
////        requestData.put("systemHeader",systemainmHeader);
//        body.put("mbrAcno",account);//查询账户
//        body.put("out_request_no",generateSerialNo());//20201224新加入参，业务流水号
//
////        requestData.put("body",body);
////        bizContent.put("requestData", requestData);
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            response = fopClient.execute(request, userDeviceId);
//            log.warn("response:[" + response+ "]");
//            log.warn("response.getCode:[" + response.getCode() + "]");
//            log.warn("response.getMsg:[" + response.getMsg() + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//            return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//
//    /**
//     *
//     * @param payAcno 付款账号
//     * @param payAcname 付款户名
//     * @param rcvAcno
//     * @param rcvAcname
//     * @param amt
//     * @param paymainid
//     * @param compno
//     * @return
//     */
//    public static FopCommonResponse paymainOnline(String payAcno , String payAcname ,String rcvAcno , String rcvAcname
//            ,String amt ,String paymainid , String compno ,String paydetail,String bnakName,String bnakCode,String actionFlag ,String userDeviceId){
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140201";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0210206", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl(serverUrl +  "/SCS0210206/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","SCS");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS0210206");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("summary",paymainid);//企业凭证号+附言长度不能超过150字符，不支持特殊符号：“|”、“&”、“<”
//        body.put("bankFlag","0");//指收款方账户的开户银行0本行 其他银行
//        body.put("payAcno", payAcno);
//        body.put("payAcname", payAcname);
//        body.put("rcvAcno",rcvAcno);//首款方账号
//        body.put("rcvAcname",rcvAcname);
//        body.put("rcvBankName",bnakName);//收款方行名
//        body.put("rcvBankNo",bnakCode);//收款方行名
//        body.put("amt",amt);
//        body.put("certNo",compno);//企业凭证编号，同一企业不可重复
//        body.put("areaFlag","0");//指付款方所在地和收款方所在地是否为同城0同城1其他城市
//        body.put("actionFlag",actionFlag);//1 转账；2 退汇
//        body.put("curCode","CNY");
////        body.put("paydetails","支付明细编号(C36)| 发票号(C100)|发票代码(C100)|医院名称(C128)|生产企业名称(C100)|配送企业名称(C100)|" +
////                "交易编码(C100)|通用名(C512)|剂型(C100)|规格(C200)|包装数量(N11)|单位(C100)|结算金额(N18.3)|结算数量(N11)|111222|112211|123|测试医院|aaa|bbb|456|ccc|a|yy|10|zzz|10.00|10");
//        body.put("payDetails",paydetail);
//        body.put("out_request_no",generateSerialNo());//20201224新加入参，业务流水号
//
////        requestData.put("body",body);
////        bizContent.put("requestData", requestData);
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        Date retTime  = new Date();
//        Date resTime  = new Date();
//        try {
//            response = fopClient.execute(request, userDeviceId);
//            resTime  = new Date();
////            new PayLogUtil().addPayLog(requestData,response.getResult(),"1","SCS0210206",serverUrl,retTime,resTime);
//            log.warn("response.getCode:[" + response.getCode() + "]");
//            log.warn("response.getMsg:[" + response.getMsg() + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//                return response;
//        } catch (FopApiException e) {
////            new PayLogUtil().addPayLog(requestData,new JSONObject(),"1","SCS0210206","",retTime,resTime);
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//
//    /**
//     *充值
//     */
//    public static FopCommonResponse tramsform(String userDeviceId){
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140201";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0210206", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl(serverUrl +  "/SCS0210206/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
////        systemHeader.put("sourceSystemCode","SCS");
////        systemHeader.put("sinkSystemCode","SCS");
////        systemHeader.put("actionId","SCS0210206");
////        systemHeader.put("sourceJnlNo",generateSerialNo());
////        requestData.put("systemHeader",systemHeader);
//        body.put("summary","13ba5b100b2d46fd88e190d5c439c2fc");//企业凭证号+附言长度不能超过150字符，不支持特殊符号：“|”、“&”、“<”
//        body.put("bankFlag","0");//指收款方账户的开户银行0本行 其他银行
//        body.put("payAcno","901036001300000053");//0099800124310214100013
//        body.put("payAcname","测试客户0200088706410101001300000129");
//        body.put("rcvAcno"," 901036001300000053");//首款方账号0099800124310214100013
//        body.put("rcvAcname","贵州省公共资源交易中心贵阳市妇幼保健院");
//        body.put("rcvBankName","贵州银行");//收款方行名
//        body.put("rcvBankNo","110220");//收款方行名
//
//        body.put("amt","10000000");
//        body.put("certNo","GYS47892_01");//企业凭证编号，同一企业不可重复
//        body.put("areaFlag","0");//指付款方所在地和收款方所在地是否为同城0同城1其他城市
//        body.put("actionFlag","1");//1 转账；2 退汇
//        body.put("curCode","CNY");
//        body.put("payDetails","支付明细编号(C36)| 发票号(C100)|发票代码(C100)|医院名称(C128)|生产企业名称(C100)|配送企业名称(C100)|" +
//                "交易编码(C100)|通用名(C512)|剂型(C100)|规格(C200)|包装数量(N11)|单位(C100)|结算金额(N18.3)|结算数量(N11)" +
//                "$||||||||||||88|1");
//        body.put("out_request_no",generateSerialNo()); //20201224新加入参，业务流水号
//
////        requestData.put("body",body);
////        bizContent.put("requestData", requestData);
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            response = fopClient.execute(request, userDeviceId);
//            log.warn("response:[" + response + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//                return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//
//    /**
//     * 查询业务状态
//     */
//    public static FopCommonResponse queryPayStatus(String serino ,String userDeviceId){//
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140204";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0310204", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl(serverUrl +  "/SCS0310204/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","ACP");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS0310204");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("tranDate","20201204");
//        body.put("oglSerialNo",serino);
//        body.put("queryFlag","2");
//        body.put("out_request_no",generateSerialNo());//20201224新加入参，业务流水号
//
////        requestData.put("body",body);
////        bizContent.put("requestData", requestData);
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            response = fopClient.execute(request, userDeviceId);
//            log.warn("response.getCode:[" + response.getCode() + "]");
//            log.warn("response.getCode:[" + response.getMsg() + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//                return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//
//    /**
//     * 对账2.2.8
//     */
//    public static FopCommonResponse querydeal(String account,int pageNum,int pageSize,String status,String origDate,String tranDate,
//                                              String queryUse ,String userDeviceId){//
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201085259";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0200609", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2,true);
//        fopClient.setServerUrl(serverUrl +  "/SCS0200609/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","ACP");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS0200609");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("origDate",origDate);
//        body.put("tranDate",tranDate);
//        body.put("queryUse",queryUse);//1.不分用途  2.与调账相关
//        body.put("afltAcctQuryMode","1");//1-按附属账号查询2-按主体账号查询3-按交易日志查询4-按对方账号查询
//        body.put("custActnum",account);
//        body.put("afltAcctAttr","03");//00-公共计息收费账号01-公共调账账号02-公共资金初始化账号03-一般交易账号04-保证金账号05-受托支付账号
//        body.put("afltAcctBsinTyp",status);//01-普通转账02-资金初始化03-调账04-强制转账05-收取手续费06-利息分配07-外部转账
//        body.put("apedAcctBsinTyp","6");//1-现金管理2-电子商务3-保证金4 - 一般附属账户5 - 集群类附属账户6 - 集团类附属账户
//        body.put("pageNum",pageNum);
//        body.put("pageSize",pageSize);
//        body.put("out_request_no",generateSerialNo());//20201224新加入参，业务流水号
//
////        requestData.put("body",body);
////        bizContent.put("requestData", requestData);
////        bizContent.put("body",body);
////        log.warn("old请求json: ------------ " + bizContent.toJSONString());
//        log.warn("new请求json: ------------ " + body);
//
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            response = fopClient.execute(request, userDeviceId);
//            log.warn("response:[" + response + "]");
//            log.warn("response.getCode:[" + response.getCode() + "]");
//            log.warn("response.getCode:[" + response.getMsg() + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//                return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//    /**
//     * 绑定实体账户白名单
//     */
//    public static FopCommonResponse bindingBankAccount(String acno ,String accName ,String accBk ,String postTime ,String operFlag ,String userDeviceId){
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140202";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0111033", "1.0.0");
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2 ,true);
//        fopClient.setServerUrl(serverUrl + "/SCS0111033/1.0.0");
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","SCS");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS0111033");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("acno",acno);//账号最长可支持到40位
//        body.put("accName",accName);//49位中文字；仅允许上级实体账户户名+后缀
//        body.put("accBk",accBk);//主账户名
//        body.put("postTime",postTime);//校验时间
//        body.put("operFlag",operFlag);//查询，新增
//        body.put("out_request_no",generateSerialNo()); //20201224新加入参，业务流水号
//
////        requestData.put("body",body);
////        bizContent.put("requestData", requestData);
//
//        log.warn("请求json: ------------ " + body.toJSONString());
//        request.setBizContent(body.toJSONString());
//        FopCommonResponse response;
//        try {
//            //不需要token
////      response = fopClient.execute(request);
//            //需要token
//            response = fopClient.execute(request, userDeviceId);
////            log.warn(JSONObject.toJSONString(response));
//            log.warn("response:[" + response+ "]");
//            log.warn("response.getCode:[" + response.getCode() + "]");
//            log.warn("response.getMsg:[" + response.getMsg() + "]");
//            log.warn("response.getResult:[" + response.getResult() + "]");
//            return response;
//        } catch (FopApiException e) {
//            log.error("银行接口出错" ,e);
//            return null;
//        }
//    }
//
//    public static void main(String[] args) {
////        System.out.println(queryPayStatus("5a6d8d11b489457d88baf34e9f42c99b","admin"));
////        log.warn( getAccount( "52P0125" ,"华润贵州医药有限公司").getJSONObject("biz_content")
////                .getJSONObject("responseData").getJSONObject("body"));
////        System.out.println( getAccount( "52P0007" ,"华润贵州医药有限公司" , "52P0007","1"));
//        editAccount("901036001300000054" ,"贵州省公共资源交易中心贵州康心药业有限公司（集体）" , "52P0007");
////        System.out.println( delAccount( "903015002600000016" ,"贵州省医药（集团）有限责任公司遵义分公司" , "52P0092"));
//        //response:[{"acctBalc":"9019026.82","lastDayBalc":"9018026.82","frzAmt":"0.00","afltCustActnum":"903015002600000016",
//        // "ovdfLimt":"0.00","instBlce":0,"ccyDgtlCod":"CNY"}]
////        FopCommonResponse remain = getRemain("903015002600000016" , "GYS74646_01");
////        JSONObject body = remain.getResult();
////        System.out.println(body.getString("acctBalc"));
////        System.out.println(getRemain("903015002600000016" , "GYS74646_01"));   http://222.85.178.210:8008/OAP/sit/gateway/v1/scs/SCS0585046/1.0.0
////
////        System.out.println(querydeal("903015002600000016" , 1 ,10,"01","20260304","20260304","2","admin"));
////        System.out.println( tramsform("GYS47892_01"));
////        log.warn( paymainOnline("903015000500000060" ,"遵义市第一人民医院" , "903015000500000046" , "贵州省医药（集团）有限责任公司遵义分公司" , "1.00",
////                "dfsdds" ,"5105" , "支付明细编号(C36)| 发票号(C100)|发票代码(C100)|医院名称(C128)|生产企业名称(C100)|配送企业名称(C100)|" +
////                        "交易编码(C100)|通用名(C512)|剂型(C100)|规格(C200)|包装数量(N11)|单位(C100)|结算金额(N18.3)|结算数量(N11)|111222|112211|123|测试医院|aaa|bbb|456|ccc|a|yy|10|zzz|10.00|10"));
////          log.warn(queryPayStatus("SC070096656808"));
////        System.out.println(querydeal("903015002600000064" ,1 ,2,"01","20241220","20241220","2","admin"));
////        System.out.println(querydeal("903015002600000016" ,1 ,10,"1","20201201","20201219","1"));
////        log.warn(generateSerialNo());
//
//    }
//
//    /**
//     * 生成唯一交易代码
//     * @return
//     */
//    public static String generateSerialNo(){
//        int r1=(int)(Math.random()*(10));//产生2个0-9的随机数
//        int r2=(int)(Math.random()*(10));
//        int r3=(int)(Math.random()*(10));
//        int r4=(int)(Math.random()*(10));
//        int r5=(int)(Math.random()*(10));
//        int r6=(int)(Math.random()*(10));
//        int r7=(int)(Math.random()*(10));
//        long now = System.currentTimeMillis();//一个13位的时间戳
//        return String.valueOf(r1)+String.valueOf(r2)+String.valueOf(r3)+String.valueOf(r4)+String.valueOf(r5)+String.valueOf(r6)+
//                String.valueOf(r7)+String.valueOf(now);// 唯一交易代码
//    }
//
//    @Override
//    public void actionPerformed(ActionEvent e) {
//        log.warn("1222AAAAAAAAAAa");
//    }
//
//    /*public static void main(String[] args) {
//        FopClient[] li = {};
//        log.warn(li.length);
//        final String SUCCESS_CODE = "SUCCESS";
//        //		String serverUrl = "http://192.168.58.18:8188/api/payGrp/pay/recharge/1.0.0";
////		String serverUrl = "http://192.168.1.159:8188/fop/api/request";
//        String serverUrl = "http://222.85.178.210:8008/oba/gateway/v1/scs/SCS0111033/1.0.0";
////    String serverUrl = "http://172.31.61.72:8099/oba/gateway/v1/scs/SCS0310204/1.0.0";
////    String serverUrl = "http://172.30.3.150:9011/v1/scs/SCS0310204/1.0.0";
//
//        //应用id，不动
//        String appId = "00870215";
//        //1012012020120201085259	v1.scs.SCS0200609 交易明细查询/对账接口
//        //1012012020120201140201	v1.scs.SCS0210206 在线支付-转账接口
//        //1012012020120201140202	v1.scs.SCS0111033 在线开立和注销虚拟账户
//        //1012012020120201140203	v1.scs.SCS0585046 虚拟账户余额查询
//        //1012012020120201140204	v1.scs.SCS0310204 查询交易业务状态信息
//        String sceneCode ="1012012020120201140203";
//        FopCommonRequest request = new FopCommonRequest("v1.scs.SCS0585046", "1.0.0");
//        String privateKey = "1ed316861ef661ac1186c6af9367d2f02ab40afbc64ac050e63514cebb9772a8";
//        String fopPublicKey = "0432157a049d99758ec0ff362ef2e498fecb0921d2c72abf533959f6572f2f7e6081fd78dd90e480ff587acbcee9798bef5bd431790583e169ee11198827ba9f14";
//        //    String fopPublicKey = "04cee66e16318be3262f0fad6bd727829ddbeafb4aa0233d7001957b5f0b2452e4d82c2958ac5d0bf5830ef8c5e4dd3176754abf62a61beadef15fff63e0c33e73";
//
//        FopClient fopClient = new DefaultFopClient(appId,sceneCode, privateKey, fopPublicKey, SignType.SM2);
//        fopClient.setServerUrl(serverUrl);
//        JSONObject bizContent = new JSONObject();
//        JSONObject requestData = new JSONObject();
//        JSONObject systemHeader = new JSONObject();
//        JSONObject body = new JSONObject();
//
//        systemHeader.put("sourceSystemCode","SCS");
//        systemHeader.put("sinkSystemCode","SCS");
//        systemHeader.put("actionId","SCS210206");
//        systemHeader.put("sourceJnlNo",generateSerialNo());
//        requestData.put("systemHeader",systemHeader);
//        body.put("payAcno","009982001200000151");
//        body.put("payAcname","测试");
//        body.put("rcvAcno","0101000124310299100017");
//        body.put("rcvAcname","测试");
//        body.put("rcvBankName","贵州银行");
//        body.put("rcvBankNo","01001001");
//        body.put("curCode","CNY");
//        body.put("amt","0.11");
//        body.put("certNo","112233221");
//        body.put("summary","123654565");
//        body.put("bankFlag","0");
//        body.put("areaFlag","0");
//        body.put("actionFlag","1");
//        body.put("paydetails","支付明细编号(C36)| 发票号(C100)|发票代码(C100)|医院名称(C128)|生产企业名称(C100)|配送企业名称(C100)|交易编码(C100)|通用名(C512)|剂型(C100)|规格(C200)|包装数量(N11)|单位(C100)|结算金额(N18.3)|结算数量(N11)|111222|112211|123|测试医院|aaa|bbb|456|ccc|a|yy|10|zzz|0.110|10");
//        requestData.put("body",body);
//        bizContent.put("requestData", requestData);
//        request.setBizContent(bizContent.toJSONString());
//        FopCommonResponse response;
//        try {
//            //不需要token
////      response = fopClient.execute(request);
//            //需要token
//            response = fopClient.execute(request, userDeviceId);
//            log.warn(JSONObject.toJSONString(response));
//            if (RES_SUCC.equals(response.getCode())) {
//                log.warn("response:[" + response.getResult() + "]");
//            } else {
//                log.warn(response.getBizCode() + ":" + response.getBizMsg());
//            }
//        } catch (FopApiException e) {
//            e.printStackTrace();
//        }
//    }*/
//}

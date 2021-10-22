//package com.hsnn.bankPay.util;
//
//import com.alibaba.fastjson.JSONObject;
//import com.hsnn.bankPay.sys.dao.SysBankReqResLogDao;
//import com.hsnn.bankPay.sys.entity.SysBankReqResLog;
//import com.hsnn.bankPay.sys.service.SysBankReqResLogService;
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.AfterReturning;
//import org.aspectj.lang.annotation.Before;
//import org.aspectj.lang.annotation.Pointcut;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Propagation;
//import org.springframework.transaction.annotation.Transactional;
//import com.hsnn.bankPay.sys.dao.*;
//import com.hsnn.bankPay.sys.entity.*;
//
//import javax.annotation.PostConstruct;
//import java.math.BigDecimal;
//import java.util.*;
//
///**
// * @author: zbc
// * @create: 2020-10-30 08:46
// *
// * 使用spring自动注入
// * 使用方式 LogUtil.addLog(paramObject,操作类型,日志类型)
// **/
//@Component
//public class PayLogUtil {
//    private static final Logger log = LoggerFactory.getLogger(PayLogUtil.class);
//    @Autowired
//    private SysBankReqResLogDao sysBankReqResLogDao;
//    @Autowired
//    private SysBankReqResLogService sysBankReqResLogService;
//    private static PayLogUtil payLogUtil;
//    @PostConstruct
//    public void init(){
//        payLogUtil = this;
//        payLogUtil.sysBankReqResLogDao = this.sysBankReqResLogDao;
//        payLogUtil.sysBankReqResLogService = this.sysBankReqResLogService;
//
//    }
////  @Transactional(propagation = Propagation.REQUIRES_NEW)
//    @Transactional(propagation=Propagation.NOT_SUPPORTED)
//    public   void addPayLog(JSONObject requestData,JSONObject responseData ,String logType,String req_url,String ip, Date retTime, Date resTime ) {
//
//        SysBankReqResLog sysBankReqResLog = new SysBankReqResLog();
//        log.info(""+responseData);
//        try {
//            System.out.println(System.currentTimeMillis());
//            System.out.println(System.currentTimeMillis());
//            String uidMain = UUID.randomUUID().toString();
//            uidMain = uidMain.replace("-","");
//            sysBankReqResLog.setLogId(uidMain);
//            sysBankReqResLog.setLogType(new BigDecimal(logType));
//            sysBankReqResLog.setReqTime(retTime);
//            sysBankReqResLog.setResTime(resTime);
//            sysBankReqResLog.setReqMsg(requestData.toJSONString());
//            sysBankReqResLog.setResMsg(responseData.toJSONString());
//            sysBankReqResLog.setStatusMsg("1");
//            sysBankReqResLog.setOuterIp(ip);
//            if(res(responseData)){
//                sysBankReqResLog.setIsSucc(new BigDecimal("1"));
//            }else{
//                sysBankReqResLog.setIsSucc(new BigDecimal("2"));
//            }
//            sysBankReqResLog.setOuterIp(ip);
//            sysBankReqResLog.setReqUrl(req_url);
//            log.info("支付日志参数："+sysBankReqResLog);
//            payLogUtil.sysBankReqResLogService.insert(sysBankReqResLog);
//        } catch (Exception e) {
//            log.error("错误信息日志："+e.getMessage());
//        }
//
//
//    }
//    public static  boolean res(JSONObject responseData ){
//        boolean yes =true;
//        try {
//            if (BankUtil.SUCCESS_CODE.equals(responseData.getString("code"))) {
//                String resCode = responseData.getJSONObject("biz_content").getJSONObject("responseData").getString("responseCode");
//                JSONObject body = responseData.getJSONObject("biz_content").getJSONObject("responseData").getJSONObject("body");
//                if(BankUtil.RES_SUCC.equals(resCode)){//处理成功
//                    if(body !=null && body.getString("payStatus").equals("1")){
//                    }else{
//                        yes = false;
//                    }
//                }else{
//                    yes = false;
//                }
//            }else{
//                yes = false;
//            }
//        } catch (Exception e) {
//            yes = false;
//        }
//        return yes;
//    }
////    @Transactional(propagation=Propagation.NOT_SUPPORTED)
////    @Async("taskExecutor")
//    public   void addPayPushLog(String requestData, Map<String,Object>  responseData ,String logType,String req_url,String ip, Date retTime, Date resTime,String status ) {
//        log.info("支付日志参数："+ requestData+"|"+ responseData+"|"+ logType+"|"+ req_url+"|"+ ip+"|"+ retTime+"|"+ resTime+"|"+ status);
//        SysBankReqResLog sysBankReqResLog = new SysBankReqResLog();
//        log.info(""+responseData);
//        try {
//            log.info("时间戳："+System.currentTimeMillis());
//            System.out.println(System.currentTimeMillis());
//            String uidMain = UUID.randomUUID().toString();
//            uidMain = uidMain.replace("-","");
//            sysBankReqResLog.setLogId(uidMain);
//            sysBankReqResLog.setLogType(new BigDecimal(logType));
//            sysBankReqResLog.setReqTime(retTime);
//            sysBankReqResLog.setResTime(resTime);
//            sysBankReqResLog.setReqMsg(requestData);
//            sysBankReqResLog.setStatusMsg("1");
//            sysBankReqResLog.setOuterIp(ip);
//            Map<String,Object> res = (Map<String, Object>) objectToMap(responseData);
//            String jsonString = JSONObject.toJSONString(responseData);
//            System.out.println(responseData.get("retcode"));
//            if("0".equals(responseData.get("retcode"))){
//                sysBankReqResLog.setIsSucc(new BigDecimal("1"));
//            }else{
//                sysBankReqResLog.setIsSucc(new BigDecimal("2"));
//            }
//            sysBankReqResLog.setResMsg(jsonString);
//            sysBankReqResLog.setOuterIp(ip);
//            sysBankReqResLog.setReqUrl(req_url);
//            log.info("支付日志参数："+sysBankReqResLog);
//            payLogUtil.sysBankReqResLogService.insert(sysBankReqResLog);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.error("错误信息日志："+e.getMessage());
//        }
//    }
//    public static Map<?, ?> objectToMap(Object obj) {
//        if (obj == null) {
//            return null;
//        }
//        return new org.apache.commons.beanutils.BeanMap(obj);
//    }
//
//
//
//
//
//    private final String ExpGetResultDataPonit = "execution(* com.hsnn.bankPay.util.BankUtil.paymainOnline(..))";
//
//
//
//
//
//    //定义切入点,拦截servie包其子包下的所有类的所有方法
////    @Pointcut("execution(* com.haiyang.onlinejava.complier.service..*.*(..))")
//    //拦截指定的方法,这里指只拦截TestService.getResultData这个方法
//    @Pointcut(ExpGetResultDataPonit)
//    public void excuteService() {
//
//    }
////    @Before("excuteService()")
////    public void before(){
////
////        System.out.println("被拦截方法调用之前调用此方法，输出此语句");
////
////    }
////    @After("excuteService()")
////    public void after(){
////
////        System.out.println("被拦截方法调用之后调用此方法，输出此语句");
////
////    }
//    @Before("excuteService()")
//    public void doBeforeMethod(JoinPoint joinPoint) {
//        System.out.println("我是前置通知，我将要执行一个方法了");
//        //获取目标方法的参数信息
//        Object[] obj = joinPoint.getArgs();
//        for (Object argItem : obj) {
//            System.out.println("---->now-->argItem:" + argItem);
//
//            System.out.println("---->after-->argItem:" + argItem);
//        }
//    }
//
//    @AfterReturning(value = ExpGetResultDataPonit, returning = "keys")
//    public void doAfterReturningAdvice1(JoinPoint joinPoint, Object keys) {
//        System.out.println("第一个后置返回通知的返回值：" + keys);
//
//        System.out.println("修改完毕-->返回方法为:" + keys);
//    }
//
//    @Pointcut()
//    public static void test(){
//
//        System.out.println("11");
//
//    }
//
//    public static void main(String[] args) {
//        test();
//    }
//}

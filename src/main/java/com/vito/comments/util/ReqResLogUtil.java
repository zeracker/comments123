//package com.hsnn.bankPay.util;
//
//import com.hsnn.bankPay.sys.dao.SysBankReqResLogDao;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import javax.annotation.PostConstruct;
//
///**
// * 银行接口日志
// */
//public class ReqResLogUtil {
//
//    @Autowired
//    private SysBankReqResLogDao sysBankReqResLogDao;
//
//    private static ReqResLogUtil log;
//
//    @PostConstruct
//    public void init(){
//        log = this;
//        log.sysBankReqResLogDao = this.sysBankReqResLogDao;
//    }
//}

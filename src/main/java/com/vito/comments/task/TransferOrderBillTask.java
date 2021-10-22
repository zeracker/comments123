//package com.hsnn.bankPay.task;
//
//import com.alibaba.fastjson.JSONObject;
//import com.fop.sdk.response.FopCommonResponse;
//import com.hsnn.bankPay.pay.dao.PayBankBillDao;
//import com.hsnn.bankPay.pay.dao.PayBillCheckDayDao;
//import com.hsnn.bankPay.pay.service.PayBillCheckDayService;
//import com.hsnn.bankPay.sys.account.dao.StdPayContractDao;
//import com.hsnn.bankPay.sys.account.service.StdPayContractService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.scheduling.annotation.EnableScheduling;
//import com.hsnn.bankPay.tb.dao.TbPaymainDao;
//import com.hsnn.bankPay.tb.entity.TbPaymain;
//import com.hsnn.bankPay.tb.service.TbPaymainService;
//import com.hsnn.bankPay.util.BankUtil;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.List;
//
///**
// * 定时任务处理结算业务定时核对账单，保证数据完整性
// * 处理体现充值类账单，跨行不能实时党章问题
// */
//@Configuration      //1.主要用于标记配置类，兼备Component的效果。
//@EnableScheduling   // 2.开启定时任务
//public class TransferOrderBillTask {
//
//    @Autowired
//    private PayBillCheckDayService payBillCheckDayService;
//    @Autowired
//    private TbPaymainService tbPaymainService;
//
//    @Autowired
//    private TbPaymainDao tbPaymainDao;
//
//    @Autowired
//    private StdPayContractDao stdPayContractDao;
//
//    @Autowired
//    private PayBillCheckDayDao payBillCheckDayDao;
//
//    @Autowired
//    private PayBankBillDao payBankBillDao;
//
//    @Autowired
//    private StdPayContractService stdPayContractService;
//    /**
//     * 定时任务处理结算系统账户流水与银行账单核对
//     */
////    @Scheduled(cron = "0 45 11 ? * *")
////    @Scheduled(cron = "0 */10 * * * ?")
////    @Scheduled(cron = "0 30 0 * * ?") //每天零点三十分钟执行一次
//    //或直接指定时间间隔，例如：5秒
//    //@Scheduled(fixedRate=5000)
//    public void configureTasks() {
//        System.err.println("执行静态定时任务时间: " + LocalDateTime.now());
//        TbPaymain tbPaymain = new TbPaymain();
//        tbPaymain.setPayType("3");
//        tbPaymain.setStatus(new BigDecimal("7"));
//        List<TbPaymain> list = tbPaymainDao.list(tbPaymain);
//        for(int i =0;i<list.size();i++){
//            TbPaymain tbPaymainNew = new TbPaymain();
//            tbPaymainNew = list.get(i);
//            FopCommonResponse retJson = BankUtil.queryPayStatus(tbPaymainNew.getPaymainid() ,"admin");
//            String status = retJson.getCode();
//            if (BankUtil.RES_SUCC.equals(status)) {
//                JSONObject serialRecords = retJson.getResult();
//                String oglSerialNo = serialRecords.getString("oglSerialNo");
//                String errMsg = serialRecords.getString("oglSerialNo");
//                String reqNo = serialRecords.getString("oglSerialNo");
//                String serialNo = serialRecords.getString("oglSerialNo");
//                String stat = serialRecords.getString("oglSerialNo");
//                BigDecimal amt = new BigDecimal(serialRecords.getString("amt"));
//                if("1".equals(stat)){
//                    tbPaymain.setCheckState("2");
//                    tbPaymain.setStatus(new BigDecimal("8"));
//                    tbPaymain.setSerialno(serialNo);
//                    tbPaymain.setPaytime(tbPaymain.getCreatetime());
//                    tbPaymain.setPaystate("2");
//                    tbPaymainService.update(tbPaymain);
//                }
//            }
//        }
//
//        System.err.println("结束执行静态定时任务时间: " + LocalDateTime.now());
//    }
//}

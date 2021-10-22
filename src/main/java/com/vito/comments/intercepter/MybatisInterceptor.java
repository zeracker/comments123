//package com.hsnn.bankPay.intercepter;
//
//import com.hsnn.bankPay.pay.entity.PayBankBill;
//import com.hsnn.bankPay.pay.entity.PayBillCheckDay;
//import com.hsnn.bankPay.sys.account.entity.BankImg;
//import com.hsnn.bankPay.sys.entity.SysActionLog;
//import com.hsnn.bankPay.sys.entity.SysActionLogDetail;
//import com.hsnn.bankPay.sys.entity.SysBankReqResLog;
//import com.hsnn.bankPay.sys.entity.SysSmsMessage;
//import com.hsnn.bankPay.util.BeanUtil;
//import com.hsnn.bankPay.util.JsonUtil;
//import com.hsnn.bankPay.util.LogUtil;
//import com.hsnn.bankPay.util.SpringUtil;
//import org.apache.ibatis.binding.MapperMethod;
//import org.apache.ibatis.executor.Executor;
//import org.apache.ibatis.mapping.MappedStatement;
//import org.apache.ibatis.mapping.SqlCommandType;
//import org.apache.ibatis.plugin.*;
//import org.mybatis.spring.SqlSessionTemplate;
//import org.springframework.stereotype.Component;
//import com.hsnn.bankPay.base.entity.BaseImgannex;
//import com.hsnn.bankPay.sys.entity.*;
//import com.hsnn.bankPay.tb.dao.TbInvoiceScDao;
//import com.hsnn.bankPay.tb.entity.TbInvoiceSc;
//import com.hsnn.bankPay.tb.entity.TbPaymainVoucher;
//import com.hsnn.bankPay.trade.entity.TradeInvoiceimg;
//import com.hsnn.bankPay.util.*;
//
//import javax.servlet.http.HttpSession;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Properties;
//
//
///**
// * mtbatis拦截器，用于做数据库操作日志
// */
//@Component
//@Intercepts({
//        @Signature(
//                type = Executor.class,
//                method = "update",
//                args = {MappedStatement.class, Object.class}
//        ),
////        @Signature(type = Executor.class, method = "query", args = {MappedStatement.class,
////                Object.class, RowBounds.class, ResultHandler.class})
////        @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})
//})
//public class MybatisInterceptor implements Interceptor {
//    private SqlSessionTemplate sqlSessionTemplate ;
//
////    private TbInvoiceScDao tbInvoiceScDao;
//
//    @Override
//    public Object intercept(Invocation invocation) throws Throwable {
////        System.out.println("intercept拦截成功");
//        //old
//        Object[] args = invocation.getArgs();
//        MappedStatement ms = (MappedStatement) args[0];
//        SqlCommandType sqlCommandType = ms.getSqlCommandType();
//        if(sqlCommandType == SqlCommandType.UPDATE){
//            if(args[1] instanceof MapperMethod.ParamMap){
//
//            }else{//是直接操作实体的dao方法
//                String mapperId = ms.getId();
//                mapperId =  mapperId.substring(0 ,mapperId.lastIndexOf(".") );
//                sqlSessionTemplate.clearCache();
//                Object old = null;
//                if(args[1] instanceof TbInvoiceSc){
//                    TbInvoiceSc invoice = (TbInvoiceSc) args[1];
//                    old = tbInvoiceScDao.getInvoice(invoice.getInvoiceid() , invoice.getInvoicecode());
//                }else{
//                    old = sqlSessionTemplate.selectOne( mapperId+ ".getById", BeanUtil.getBeanPk(args[1]));//查询旧数据
//                }
//
//
//                if(old != null){
//                    Map difs =  BeanUtil.compareTwoObject(old,  args[1]);
//                    HttpSession session = LogUtil.getSession();
//                    if(session != null){
//                        List difMapList = (List) session.getAttribute("difMapList");
//                        if(difMapList != null){
//                            difMapList.add(difs);//放入session ，在logUtil统一插入日志
//                            difs.put("saveData" , JsonUtil.getMapper().writeValueAsString(old));
//                            difs.put("operType" , "update");//操作类型是update
//                        }
//                    }
//
//
//
//                }
//            }
//        }else if(sqlCommandType == SqlCommandType.DELETE ){
//            String mapperId = ms.getId();
//            mapperId =  mapperId.substring(0 ,mapperId.lastIndexOf(".") );
//            sqlSessionTemplate.clearCache();
//            HttpSession session = LogUtil.getSession();
//            Object old = null;
//            if (args[1] instanceof TbInvoiceSc){
//                Map<String , String> values = (Map<String, String>) session.getAttribute("values");
//                old = tbInvoiceScDao.getInvoice(values.get("invoiceid"), values.get("invoicecode"));
//            }else{
//                Object pk = BeanUtil.getBeanPk(args[1]);
//                old = sqlSessionTemplate.selectOne( mapperId+ ".getById", pk);//查询旧数据
//            }
//                Map difs =  new HashMap();
//                difs.put("operType" , "delete");
//                difs.put("tablename" , BeanUtil.getTableName(old));
//                difs.put("recordId ->" , BeanUtil.getBeanPk(old));
//                difs.put("saveData" , JsonUtil.getMapper().writeValueAsString(old));
//
//                if(session != null){
//                    List difMapList = (List) session.getAttribute("difMapList");
//                    if(difMapList != null){
//                        difMapList.add(difs);//放入session ，在logUtil统一插入日志
//                    }
//                }
//
//
//
//        }else if(sqlCommandType == SqlCommandType.INSERT){
//            if(!(args[1] instanceof SysActionLogDetail) && !(args[1] instanceof SysActionLog) && !(args[1] instanceof SysBankReqResLog)
//                    && !(args[1] instanceof SysSmsMessage)
//                    &&!(args[1] instanceof BaseImgannex) && !(args[1] instanceof TradeInvoiceimg)
//                    && !(args[1] instanceof BankImg) && !(args[1] instanceof TbPaymainVoucher) && !(args[1] instanceof SysBankReqResLog)
//                    && !(args[1] instanceof PayBillCheckDay)
//                    &&! (args[1] instanceof PayBankBill)){
//                Map difs =  new HashMap();
//                difs.put("operType" , "insert");
//                difs.put("tablename" , BeanUtil.getTableName(args[1]));
//                difs.put("recordId ->" , BeanUtil.getBeanPk(args[1]));
//                difs.put("saveData" , JsonUtil.getMapper().writeValueAsString(args[1]));
//                List difMapList = (List) LogUtil.getSession().getAttribute("difMapList");
//                difMapList.add(difs);//放入session ，在logUtil统一插入日志
//            }
//        }
//        // 执行完上面的任务后，不改变原有的sql执行过程.
//        return invocation.proceed();
//    }
//
//    @Override
//    public Object plugin(Object target) {
//        if(sqlSessionTemplate == null){
//            sqlSessionTemplate =  SpringUtil.getBean(SqlSessionTemplate.class);
//        }
//        if(tbInvoiceScDao == null){
//            tbInvoiceScDao =  SpringUtil.getBean(TbInvoiceScDao.class);
//        }
////        System.out.println("plugin拦截成功");
//        return Plugin.wrap(target, this);
//    }
//
//    @Override
//    public void setProperties(Properties properties) {
//        System.out.println("setPropertiesplugin拦截成功");
//    }
//}

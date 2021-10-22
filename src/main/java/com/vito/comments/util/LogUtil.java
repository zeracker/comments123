//package com.hsnn.bankPay.util;
//
//import com.hsnn.bankPay.entity.base.ParamObject;
//import com.hsnn.bankPay.sys.dao.*;
//import com.hsnn.bankPay.sys.entity.SysActionLog;
//import com.hsnn.bankPay.sys.entity.SysActionLogDetail;
//import com.hsnn.bankPay.sys.entity.SysActionLogDic;
//import com.hsnn.bankPay.sys.entity.SysUser;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import com.hsnn.bankPay.sys.dao.*;
//import com.hsnn.bankPay.sys.entity.*;
//
//import javax.annotation.PostConstruct;
//import javax.servlet.http.HttpSession;
//import java.util.*;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
///**
// * @author: zbc
// * @create: 2020-10-30 08:46
// *
// * 使用spring自动注入
// * 使用方式 LogUtil.addLog(paramObject,操作类型,日志类型)
// **/
//@Component
//public class LogUtil {
//
//    @Value("${pros.exceptionLog}")
//    private String execeptions;
//
//    @Value("${pros.menuandname}")
//    private String menuAndNames;
//
//    private static ThreadLocal<HttpSession> sessionLocal = new ThreadLocal<>();
//
//    /**
//     * 不需要加入日志的集合
//     */
//    private static Set<String> execeptionsLogMap;
//    /**
//     * 菜单-功能对应关系
//     */
//    private static Map<String,String> menuAndNameMap;
//
//    @Autowired
//    private SysActionLogDao logService;
//
//    @Autowired
//    private SysActionLogDetailDao logDetailDao;
//
//    @Autowired
//    private SysUserDao sysUserDao;
//
//    @Autowired
//    private SysFunctionNameLogDao functionNameLogDao;
//
//    @Autowired
//    private SysActionLogDicDao logDicDao;
//
//    private static LogUtil log;
//
//    @PostConstruct
//    public void init(){
//        this.execeptionsLogMap = new HashSet<>();
//        String [] exceps = execeptions.split(",");
//        for (String s : exceps) {
//            this.execeptionsLogMap.add(s);
//        }
//        log = this;
//        log.logService = this.logService;
//        log.functionNameLogDao = this.functionNameLogDao;
//        log.sysUserDao = this.sysUserDao;
//        log.logDetailDao = this.logDetailDao;
//        log.logDicDao = this.logDicDao;
//
//    }
//
//    /**
//     * 判断是否过滤日志
//     * @return
//     */
//    private static boolean contains(ParamObject paramObject ){
//        if( execeptionsLogMap.contains(paramObject.getServiceName() + "-"  +paramObject.getMethodName()) ){//该类不加日志
//            return true;
//        }
//
//        if (paramObject.getUser()==null){
//            return true;
//        }
//        if(paramObject.getMethodName().toLowerCase().contains("get") ||
//                paramObject.getMethodName().toLowerCase().contains("select") ||
//                paramObject.getMethodName().toLowerCase().contains("list")
//                ||paramObject.getMethodName().toLowerCase().contains("info")
//                ||paramObject.getMethodName().toLowerCase().contains("payTransactionPayment")
//                ||paramObject.getMethodName().toLowerCase().contains("rankingHosPay")
//
//        ){
//            return true;
//        }
//        return false;
//    }
//
//    /**
//     * 添加日志
//     * @param paramObject 请求参数对象
//     */
//    public static void addLog(ParamObject paramObject){
//        try {
////            SysUser user = paramObject.getUser();
////            SysActionLog sysActionLog = new SysActionLog();
////            String actionNo = UUID.randomUUID().toString();
////            if(!contains(paramObject)){
////
////                sysActionLog.setActionNo(actionNo);
////                sysActionLog.setOrgId(user.getOrgId());
////                sysActionLog.setOperId(user.getUserId());
////                sysActionLog.setOperTime(new Date());
////                sysActionLog.setOperName(user.getUserName());
////                sysActionLog.setFuncUrl(paramObject.getServiceName()+"/"+paramObject.getMethodName());
////                sysActionLog.setFuncName(functionName(paramObject));
////                sysActionLog.setMessage(getMsg(paramObject));
////                sysActionLog.setClientIp(GetIpAndPort.getRealIp(paramObject.getReq()));
////                sysActionLog.setServerIp(GetIpAndPort.getLocalIP());
////                sysActionLog.setInData(paramObject.getValues().toString());
////                Object msg = paramObject.getSession().getAttribute("msg");
////                if (AssertUtil.notNull(msg)){
////                    sysActionLog.setResultMsg(msg.toString());
////                }
////                Object sysDepar = user.getDepartmentId();
////                if (AssertUtil.notNull(sysDepar)){
////                    sysActionLog.setSysDepartmentId(sysDepar.toString());
////                }
//////                sysActionLog.setSysDepartmentId(user.getDepartmentId().toString());
////                sysActionLog.setRoleId(user.getRoleId().toString());
////                log.logService.insert(sysActionLog);
////                addDetail(actionNo);//添加日志明细
////            }else {
////                if (paramObject.getServiceName().equals("loginService")){
////                    String username =  (String) paramObject.getValue("username");
////                    SysUser sysUser = log.sysUserDao.getByUserName(username);
////                    if (sysUser != null){
////                        sysActionLog.setActionNo(actionNo);
////                        sysActionLog.setOperId(sysUser.getUserId());
////                        sysActionLog.setOperName(username);
////                        sysActionLog.setOrgId(sysUser.getOrgId());
////                        sysActionLog.setResultMsg("登录失败：密码错误");
////                        sysActionLog.setOperTime(new Date());
////                        sysActionLog.setFuncUrl(paramObject.getServiceName()+"/"+paramObject.getMethodName());
////                        sysActionLog.setClientIp(GetIpAndPort.getRealIp(paramObject.getReq()));
////                        log.logService.insert(sysActionLog);
////                        return;
////                    }else {
////                        return;
////                    }
////                }
////            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            System.err.println("日志添加出错");
//        }finally {
//
//        }
//    }
//
//    private static String getMsg(ParamObject paramObject) {
//        SysActionLogDic dic = log.logDicDao.getById(paramObject.getServiceName() + "/" + paramObject.getMethodName());
//        String logmsg = null;
//        String template =  dic.getMsgTemplate();
//        if(template != null){
//
//            if(template.contains("${userName}")){
//                template = template.replace("${userName}" , paramObject.getUser().getUserName() );
//            }
//            if(template.contains("${name}")){
//                template = template.replace("${name}" , paramObject.getUser().getName() );
//            }
//            if(template.contains("${now}")){
//                template = template.replace("${now}" , MyTimeUtil.getCurrentTime() );
//            }
//            Pattern p = Pattern.compile("\\#\\{\\w+\\}");
//            //处理java调用的部分
//            Matcher m = p.matcher(template);
//            while (m.find()){
//                String str = m.group();
//                String match = str.substring(str.indexOf("{") + 1 , str.indexOf("}"));
//                template= template.replace("#{"+ match +"}" , paramObject.getValue(match) == null ? "" : (String) paramObject.getValue(match));
//            }
//            //处理if语句的部分
//            template =  StringUtil.valiIf(template);
//            logmsg = template;
//        }
//
//
//        return  logmsg;
//    }
//
//    public static void main(String[] args) {
//
//    }
//
//
//
//    private static String functionName(ParamObject paramObject){
//
//        SysActionLogDic dic = log.logDicDao.getById(paramObject.getServiceName() + "/" + paramObject.getMethodName());
//        return dic == null ? "" : dic.getFuncName();
//    }
//    /**
//     * 添加日志明细
//     */
//    private static void addDetail(String actionNo) {
//        List difMapList = (List) getSession().getAttribute("difMapList");
//        if(difMapList.size() > 0){//存在变动的数据
//            for (Object o : difMapList) {
//                //增加新变动记录
//                SysActionLogDetail detail = new SysActionLogDetail();
//                Map difsMap = (Map) o;
//                String operType = (String) difsMap.get("operType");
//                detail.setOperType(operType);
//                detail.setActionNo(actionNo);
//                detail.setTableName((String) difsMap.get("tablename"));
//                detail.setRecordId((String) difsMap.get("recordId ->"));
//                detail.setSaveData((String) difsMap.get("saveData"));
//                if("delete".equals(operType) || "insert".equals(operType)){
//
//                    log.logDetailDao.insert(detail);
//                }else if("update".equals(operType)){
//                    for (Object o1 : difsMap.keySet()) {
//                        String key = (String) o1;
//                        if(difsMap.containsKey(key + "->newVal")){//update时存在变动字段
//                            detail.setValOld(difsMap.get(key) == null ? null : difsMap.get(key).toString());
//                            detail.setValNew(difsMap.get(key + "->newVal") == null ? null : difsMap.get(key + "->newVal").toString() );
//                            detail.setColName(difsMap.get(key + "->colname") == null ? null : difsMap.get(key + "->colname").toString());
//                            log.logDetailDao.insert(detail);
//                        }
//                    }
//                }
//
//            }
//        }
//
//    }
//
//
//    public static void addSession(HttpSession session){
//        sessionLocal.set(session);
//    }
//
//    public static HttpSession getSession(){
//        return sessionLocal.get();
//    }
//
//
//
//    public static void removeSession(){
//        sessionLocal.remove();
//    }
//
//}

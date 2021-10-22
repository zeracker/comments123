//package com.hsnn.bankPay.query.util.impl;
//
//import com.hsnn.bankPay.entity.base.ParamObject;
//import com.hsnn.bankPay.query.util.XmlParser;
//import com.hsnn.bankPay.sys.entity.SysUser;
//
///**
// * @author: zbc
// * @create: 2020-11-05 16:42
// **/
//public class RoleIdParser implements XmlParser {
//    @Override
//    public String parse(String param) {
//        return null;
//    }
//
//    @Override
//    public String parse(ParamObject param) {
//        String str = "";
//        SysUser user = param.getUser();
//        String accType = user.getAcctType().toString();
//        if (param.getUser().getRoleId().toString().equals("5")){
//            return str;
//        }
//        if("1".equals(accType)){
//            str +=" AND S.role_id = '" + param.getUser().getRoleId().toString()+"'AND S.ORG_ID = '" + param.getUser().getOrgId()+"'";
//        }else{
//            str +="AND S.ORG_ID = '" + param.getUser().getOrgId()+"'";
//        }
//        return str;
//    }
//    @Override
//    public String parse() {
//        return null;
//    }
//}

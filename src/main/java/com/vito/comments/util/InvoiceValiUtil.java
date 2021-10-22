package com.vito.comments.util;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * 发票验证工具类
 */
public class InvoiceValiUtil {
    static Logger log = LoggerFactory.getLogger(InvoiceValiUtil.class);

    private static Pattern amountPattern = Pattern.compile("\\d+\\.\\d{2}");


    /**
     * 验证发票明细
     *
     * @param paramMap map包括 "invoicecode"-发票代码 普通票12位 专票10位，专票可不用校验码 , "invoiceno"发票号,
     *                 "invoicedate" 开票日期 如:"2020-11-20" ,"notaxamount"-不含税金额  "validatecodeaftersix" - 发票校验码后六位（普通发票）
     * @return 结果对象，null ：验证失败
     */
    public static JSONObject valiInvoice(Map<String, String> paramMap) {
        //1、data 数据组装
        Map<String, String> param = new HashMap<String, String>();
        //查验税号 非购方税号 该税号为航天接口验证权限所用
        param.put("appid", "G520000materialtrade001");
        //发票类型
        param.put("appsecret", "958E98D607F34F3A9EAFD199483458A7");
        String result = HttpClientUtil.postPara("https://openapi.eliancloud.cn/API/AccessToken/GetToken", param);
        if (result != null) {
            JSONObject res = null;
            try {
                res = new JSONObject(result);

                if (res.getString("msg").equals("ok")) {
                    String token = res.getString("token");
                    //为金额添加或者截断保证两位小数
                    String amount = paramMap.get("notaxamount");
                    if(amount != null && amount.length() >0){
                        paramMap.put("notaxamount" , handleFloat(amount));
                    }
                    //开始验证发票
                    Map<String, String> req = new HashMap<String, String>();
                    req.put("appid", "G520000materialtrade001");
                    req.put("appsecret", "958E98D607F34F3A9EAFD199483458A7");
                    req.put("token", token);
                    req.put("tooltype", "3");//接口类型，传3即可
                    req.putAll(paramMap);
                    log.info("发票入参："+req);
                    String valires = HttpClientUtil.postPara("https://openapi.eliancloud.cn/Api/Invoice/GetInfo", req);
                    log.info("发票验证返回："+valires);
                    return new JSONObject(valires);
                }
            } catch (Exception e) {
                e.printStackTrace();
                log.error("验证发票出错", e);
            }
        }else {
            log.error("获取token失败");
        }
        return null;

    }

    private static String handleFloat(String amount){
        if(amount.contains(".")){
            String exStr = amount.substring(amount.indexOf(".") + 1);
            String prefix = amount.substring(0,amount.indexOf("."));
            if(exStr.length() > 2){
                exStr = exStr.substring(0 ,2);
            }else if(exStr.length()  == 1){
                exStr = exStr + "0";
            }
            amount =prefix + "."+ exStr;
        }else{
            amount += ".00";
        }
        return amount;
    }

    public static void main(String[] args) {
//        Map<String, String> req = new HashMap<String, String>();
//        req.put("invoicecode", "5200202130");//发票代码
//        req.put("invoiceno", "00774717");//发票号码
//        req.put("invoicedate", "2020-11-20");//开票日期
//        req.put("notaxamount", "267.92");//不含税金额（增值税专票)
//        req.put("validatecodeaftersix", "");//发票校验码后六位（普通发票）
//        System.out.println(valiInvoice(req));


        //普通发票
        Map<String, String> req = new HashMap<String, String>();
        req.put("invoicecode", "3700192130");//发票代码
        req.put("invoiceno", "21747783");//发票号码
        req.put("invoicedate", "2020-03-01");//开票日期
        req.put("notaxamount", "1000");//不含税金额（增值税专票)
        // 66822572340134516993
//        req.put("validatecodeaftersix", "516993");//发票校验码后六位（普通发票）
        System.out.println(valiInvoice(req));

    }
}

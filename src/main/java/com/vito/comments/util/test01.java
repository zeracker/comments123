package com.vito.comments.util;

import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @BelongsProject: springboot
 * @BelongsPackage: com.hsnn.bankPay.util
 * @Author: 小猪佩奇
 * @CreateTime: 2021-03-15 10:27
 * @Description: Test01
 */
public class test01 {
    public static void main(String[] args) throws IOException {
//        String passWord = "niweiniN251090!";
//        String encodedPwd = DigestUtils.md5Hex(passWord);
//        System.out.println(encodedPwd);
//        BigDecimal  num = null;
//        System.out.println(num.toString());
//        String str = "070005202010280100000000666660||单位公章||GZCAOPERROOT";
//        String str01 = "91520115551920145K||070005202012091100000000687838||单位公章||GZCAOPERROOT";
//        String[] strarr = str01.split("\\|\\|");
//        System.out.println(strarr[1]);
        Map<String, String> req = new HashMap<String, String>();
        req.put("invoicecode", "5200204130");//发票代码
        req.put("invoiceno", "00000082");//发票号码
        req.put("invoicedate", "2021-03-16");//开票日期
        req.put("notaxamount","65238.94");//不含税金额（增值税专票)
        req.put("validatecodeaftersix", "");//发票校验码后六位（普通发票）
        JSONObject obj = InvoiceValiUtil.valiInvoice(req);
        System.out.println("回家吃饭：");
        System.out.println(obj);
        System.out.println("73720==73720:"+(73720==73720.00));
//        String  data="SlZCRVJpMHhMamNLSmNLeng5Z05DakVnTUNCdlltb05QRHd2VG1GdFpYTWdQRHd2UkdWemRITWdOQ0F3SUZJK1BpQXZUM1YwYkdsdVpYTWdOU0F3SUZJZ0wxQmhaMlZ6SURJZ01DQlNJQzlVZVhCbElDOURZWFJoYkc5blBqNE5aVzVrYjJKcURUTWdNQ0J2WW1vTlBEd3ZRWFYwYUc5eUlDaEJaRzFwYm1semRISmhkRzl5S1NBdlEyOXRiV1Z1ZEhNZ0tDa2dMME52YlhCaGJua2dLQ2tnTDBOeVpXRjBhVzl1UkdGMFpTQW9SRG95TURJeE1EUXhPVEUwTlRRek1pc3dOaWMxTkNjcElDOURjbVZoZEc5eUlDaFhVRk1nVDJabWFXTmxLU0F2UzJWNWQyOXlaSE1nS0NrZ0wwMXZaRVJoZEdVZ0tFUTZNakF5TVRBME1Ua3hORFUwTXpJck1EWW5OVFFuS1NBdlVISnZaSFZqWlhJZ0tDa2dMMU52ZFhKalpVMXZaR2xtYVdWa0lDaEVPakl3TWpFd05ERTVNVFExTkRNeUt6QTJKelUwSnlrZ0wxTjFZbXBsWTNRZ0tDa2dMMVJwZEd4bElDZ3BJQzlVY21Gd2NHVmtJR1poYkhObFBqNE5aVzVrYjJKcURUZ2dNQ0J2WW1vTlBEd3ZRbWwwYzFCbGNrTnZiWEJ2Ym1WdWRDQTRJQzlEYjJ4dmNsTndZV05sSUM5RVpYWnBZMlZTUjBJZ0wwWnBiSFJsY2lBdlJFTlVSR1ZqYjJSbElDOUlaV2xuYUhRZ01UYzBOQ0F2VEdWdVozUm9JREUzTnpNNU1pQXZVM1ZpZEhsd1pTQXZTVzFoWjJVZ0wxUjVjR1VnTDFoUFltcGxZM1FnTDFkcFpIUm9JREV5TmpnK1BnMEtjM1J5WldGdERRci8yUC9nQUJCS1JrbEdBQUVCQUFBQkFBRUFBUC9iQUVNQUNBWUdCd1lGQ0FjSEJ3a0pDQW9NRkEwTUN3c01HUklU";
//        System.out.println(data.length());
//        BASE64Decoder decoder = new BASE64Decoder();
//        byte[] bytes = decoder.decodeBuffer("YWJj");
//        System.out.println("BASE64解密：" + new String(bytes));


    }
}

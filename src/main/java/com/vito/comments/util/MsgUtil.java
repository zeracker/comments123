package com.vito.comments.util;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MsgUtil {
    private static final Logger log = LoggerFactory.getLogger(MsgUtil.class);
    /* url地址 */
    private static final String URL = "http://218.201.202.174:8900/smstemp/http/sendSms";
    private static final String account = "85151421178";//账户
    private static final String reqNo = ""+System.currentTimeMillis();//时间戳
    private static final String serviceCode = "1065712605041975";//接入号
    private static final int msgType = 1;//短信类型 0模板短信，1普通短信
    private static final String password ="qN6527K66ck7"; //MD5加密加盐字符串





    public static void main(String[] args)
    {
        String account = "85151421178";
        String reqNo = ""+System.currentTimeMillis();
        String authCode = "SDF2342SDFSFSFJSKDFJSDKFSLD";
        String serviceCode = "1065712605041975";
        String msisdn = "15348673469";
        String content =new String("回家吃饭") ;
        int msgType = 1;
        System.out.println("时间戳" + reqNo);
        authCode = DigestUtils.md5Hex("qN6527K66ck7" + reqNo);
        System.out.println("鉴权码，时间戳和账户拼接:" + authCode);

        /* 字符串拼接*/
        String str = "account=" + account + "&reqNo=" + reqNo + "&authCode=" + authCode + "&serviceCode=" + serviceCode + "&msisdn=" + msisdn + "&content=" + content+"&msgType="+msgType;

//		String str = "account=85151421178&reqNo=1607593513869&authCode=BE82EDEB9E6D061257551DD0BF861C87&serviceCode=1065712605041975&msisdn=13163346707&content=锟斤拷鐎硅泛锟斤拷妤楋拷&msgType=1";

        System.out.println("请求参数拼接字符串：" + str);
        /* */
        String response = postURL("15348673469","记得回家吃饭！");
        response = response.replaceAll("=",":");
        String array[] = response.split(",");
        String result = array[0];
        System.out.println(result);

        System.out.println("返回参数信息：" + response);
    }


    /**
     * 请求发送短信方法
     * @param msisdn
     * @param content
     * @return
     */
    public static String postURL(String msisdn,String content) {
        String  authCode = DigestUtils.md5Hex(password+reqNo);
        String commString = "account=" + account + "&reqNo=" + reqNo + "&authCode=" + authCode + "&serviceCode=" + serviceCode + ""
                + "&msisdn=" + msisdn + "&content=" + content+"&msgType="+msgType;
        log.info(System.currentTimeMillis()+"入参："+commString);
        String rec_string = "";
        java.net.URL url = null;
        HttpURLConnection urlConn = null;
        try {
            /* 设置链接地址 */
            url = new URL(URL);
            /* 设置链接地址，地址http地址注入 */
            urlConn = (HttpURLConnection) url.openConnection();
            /* 链接30秒无响应超时*/
            urlConn.setConnectTimeout(30000);
            /* 链接后30秒无响应返回超时 */
            urlConn.setReadTimeout(30000);
            /* 设置http请求类型 */
            urlConn.setRequestMethod("POST");
            /* 如果你打算输出，则设置为true，否则false。默认false */
            urlConn.setDoOutput(true);
            OutputStream out = urlConn.getOutputStream();
            out.write(commString.getBytes("utf-8"));
            //out.write(commString.getBytes("GBK"), "utf-8");
            out.flush();
            out.close();
            /* 设置字符集*/
            BufferedReader rd = new BufferedReader(new InputStreamReader(urlConn.getInputStream(), "UTF-8"));
            StringBuffer sb = new StringBuffer();
            int ch;
            while ((ch = rd.read()) > -1) {
                sb.append((char) ch);
            }
            rec_string = sb.toString().trim();
            /* 关闭输入流并释放与该流关联的任何系统资源 */
            rd.close();
        } catch (Exception e) {
            /* 设置异常一份代码 */
            rec_string = "-107";
            System.out.println(e);
        } finally {
            /* 关闭 */
            if (urlConn != null) {
                urlConn.disconnect();
            }
        }
        /* 返回数据 */
        log.info(System.currentTimeMillis()+"结果出参："+rec_string);
        return rec_string;
    }
}

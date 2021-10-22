package com.vito.comments.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * JSON 请求
 */
public class HttpClientUtil {

    private static int resultSum;

    /**
     * 发送JSON数据请求到server端
     * @param url Json数据请求地址
     * @return null发送失败，否则返回响应内容
     */
    public static String postJson(String url, JSONObject jsonObject) {
        String responseBody = "";
        try {
            CloseableHttpClient httpclient = HttpClients.createDefault();
            HttpPost httpPost = new HttpPost(url);
            httpPost.addHeader("Content-Type", "text/html;charset=UTF-8");
            StringEntity stringEntity = new StringEntity(jsonObject.toString());
            httpPost.setEntity(stringEntity);
            System.out.println("Executing request " + httpPost.getRequestLine());
            ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
                @Override
                public String handleResponse(final HttpResponse response)
                        throws ClientProtocolException, IOException {
                    int status = response.getStatusLine().getStatusCode();
                    if (status >= 200 && status < 300) {
                        HttpEntity entity = response.getEntity();
                        return entity != null ? EntityUtils.toString(entity) : null;
                    } else {
                        throw new ClientProtocolException(
                                "Unexpected response status: " + status);
                    }
                }
            };
            responseBody = httpclient.execute(httpPost, responseHandler);
        } catch (Exception e) {
            System.out.println(e);
        }
        return responseBody;
    }

    /**
     * 发送JSON数据请求到server端
     * @param url Json数据请求地址
     * @return null发送失败，否则返回响应内容
     */
    public static String postPara(String url, Map<String,String> params) {
        String responseBody = "";
        try {
            CloseableHttpClient httpclient = HttpClients.createDefault();
            HttpPost httpPost = new HttpPost(url);
//            httpPost.addHeader("Content-Type", "text/html;charset=UTF-8");
            List<NameValuePair> formparams = new ArrayList<NameValuePair>();
            for (Map.Entry<String, String> stringStringEntry : params.entrySet()) {
                formparams.add(new BasicNameValuePair(stringStringEntry.getKey(), stringStringEntry.getValue()));
            }
            HttpEntity reqEntity = new UrlEncodedFormEntity(formparams, "utf-8");
            httpPost.setEntity(reqEntity);
            System.out.println("Executing request " + httpPost.getRequestLine());
            ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
                @Override
                public String handleResponse(final HttpResponse response)
                        throws ClientProtocolException, IOException {
                    int status = response.getStatusLine().getStatusCode();
                    if (status >= 200 && status < 300) {
                        HttpEntity entity = response.getEntity();
                        return entity != null ? EntityUtils.toString(entity) : null;
                    } else {
                        throw new ClientProtocolException(
                                "Unexpected response status: " + status);
                    }
                }
            };
            responseBody = httpclient.execute(httpPost, responseHandler);
        } catch (Exception e) {
            System.out.println(e);
        }
        return responseBody;
    }

    /**
     * 获取数据交换流水号 enterpriseCode+14位日期+三位数 从0到999 到999后重置为0
     * @return
     */
    public static String getDataExchangeId(){
        Date date=new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String dataExchangeId ="";
        for(int i=resultSum; i<1000; i++){
            if(i<10) {
                resultSum = ++resultSum;
                dataExchangeId = "SXYJ" + dateFormat.format(date) + "00" + i;
                break;
            }
            if(i<100){
                resultSum = ++resultSum;
                dataExchangeId = "SXYJ" + dateFormat.format(date) + "0" + i;
                break;
            }
            if (i<1000){
                resultSum = ++resultSum;
                dataExchangeId = "SXYJ" + dateFormat.format(date) + i;
                break;
            }else{
                resultSum = 0;
                dataExchangeId = "SXYJ" + dateFormat.format(date) + "000";
                break;
            }
        }
        return dataExchangeId;
    }

    /**
     * 获取查验码
     * @param resultJson
     * @return
     */
    public static String getReturnCode(JSONObject resultJson) throws JSONException {
        String returnStateInfo =  resultJson.get("returnStateInfo").toString();
        String returnCode = new JSONObject(returnStateInfo).getString("returnCode");
//                JSONObject.parseObject(returnStateInfo).get("returnCode").toString();
        return returnCode;
    }

    public static void main(String[] args) throws JSONException {
        //1、data 数据组装
        Map<String ,String> param = new HashMap<String , String>();
        //查验税号 非购方税号 该税号为航天接口验证权限所用
        param.put("appid", "G520000materialtrade001");
        //发票类型
        param.put("appsecret", "958E98D607F34F3A9EAFD199483458A7");
        String result = HttpClientUtil.postPara("https://openapi.eliancloud.cn/API/AccessToken/GetToken", param);
        if(result != null){
            JSONObject res = new JSONObject(result);
            if(res.getString("msg").equals("ok")){
                String token = res.getString("token");
                //开始验证发票
                Map<String ,String> req = new HashMap<String , String>();
                req.put("appid", "G520000materialtrade001");
                req.put("appsecret", "958E98D607F34F3A9EAFD199483458A7");
                req.put("token", token);
                req.put("invoicecode", "5200202130");//发票代码
                req.put("invoiceno", "00774717");//发票号码
                req.put("invoicedate", "2020-11-20");//开票日期
                req.put("notaxamount", "267.92");//不含税金额（增值税专票)
                req.put("validatecodeaftersix", "");//发票校验码后六位（普通发票）
                req.put("tooltype", "3");//接口类型，传3即可
                String valires = HttpClientUtil.postPara("https://openapi.eliancloud.cn/Api/Invoice/GetInfo", req);
                System.out.println(valires);
            }
        }else{
            System.out.println("获取token失败");
        }
    }

    /**
     * 数据加密 获取到签名串
     *
     * @return
     */
    public static String getAppSecInfo(String data) {
        String srcStr =
                "POST/rest/invoice/dii?authorize={\"appSecId\":" +
                        "appSecId" +
                        "}&globalInfo={\"appId\":" +
                        "appId,\"version\":" +
                        "version,\"interfaceCode\":" +
                        "interfaceCode,\"enterpriseCode\":" +
                        "enterpriseCode,\"dataExchangeId\":" +
                        "dataExchangeId}&"
                        + "data=" + "\"data\"+";
        String appSec = "";
        try {
            SecretKeySpec keySpec = new SecretKeySpec("c2hhbnhpeWFvamlhbmFwcFNlY0tleQ==".getBytes("UTF-8"), "HmacSHA1");
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(keySpec);
            byte[] singBytes = mac.doFinal(srcStr.getBytes("UTF-8"));
            appSec = Base64.encodeBase64String(singBytes);
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }
        return appSec;
    }

}
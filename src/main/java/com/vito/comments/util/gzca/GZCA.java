package com.vito.comments.util.gzca;


import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import com.vito.comments.util.gzca.util.HttpSecurityClient;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wuziqing on 2017-6-1.
 * 功能于旧CA类相似，接口名与CA相同，具体实现放弃了apache httpclient,
 */
public class GZCA {
    /**
     * 用户证书管理系统配置属性
     * URL 连接地址，可带端口名 eg:https://58.42.231.108:5001
     * Appname 应用名 eg:Test_W
     * Port 端口号  eg:5001
     */
    private String Url = "";
    private String Appname = "";
    private int Port = 5001;
    private String Path = "/gzcaverify/servlet/VerifyInterface";

    /**
     * 构造函数，用于默认端口5001的GZCA类
     *
     * @param url     传入的连接地址
     * @param appname 应用名称
     */
    public GZCA(String url, String appname) {
        this.Url = url;
        this.Appname = appname;
    }

    /**
     * 构造函数
     * @param url     传入的URL
     * @param appname 应用名称
     * @param port    端口号
     */
    public GZCA(String url, String appname, int port,String path) {
        this.Url = url;
        this.Appname = appname;
        this.Port = port;
        this.Path = path;
    }

    /**
     * 验证用户证书有效性
     *
     * @param serialnumber 证书序列号
     * @return
     */
    public String VerifyCertificate(String serialnumber) {
        String result = "";
        if (this.Url.indexOf("http://") == 0) {
            result = "this modules(http post data) is incomplet(http模块未完成)";
            System.out.println(result);
            return result;
        } else if (this.Url.indexOf("https://") == 0) {
            try {
                List<NameValuePair> para = new ArrayList<NameValuePair>();
                para.add(new BasicNameValuePair("forto", "VerifyCertificate"));
                para.add(new BasicNameValuePair("Appnameen", this.Appname));
                para.add(new BasicNameValuePair("Serialnumber",serialnumber ));
                result = this.HttpsDataPost(para);
                return result;
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
        }
        return "";
    }

    public String VerifySign(String serialnumber,String data,String signature){
        String result= "";
        if (this.Url.indexOf("http://") == 0) {

        }else if(this.Url.indexOf("https://") == 0){
            List<NameValuePair> para = new ArrayList<NameValuePair>();
            para.add(new BasicNameValuePair("forto", "VerifySign"));
            para.add(new BasicNameValuePair("Appnameen", this.Appname));
            para.add(new BasicNameValuePair("Serialnumber",serialnumber ));
            para.add(new BasicNameValuePair("Data",data));
            para.add(new BasicNameValuePair("Signature",signature));
            try {
                result = this.HttpsDataPost(para);
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
        }
        return result;
    }


    /**
     * 使用HTTP协议与用户证书管理系统进行交互
     * 该模块未完成
     * @throws URISyntaxException
     */
    private void HttpDataPost() throws URISyntaxException {
        HttpClient httpClient = HttpClients.createDefault();
        List<NameValuePair> para = new ArrayList<NameValuePair>();
        para.add(new BasicNameValuePair("forto", "VerifyCertificate"));
        para.add(new BasicNameValuePair("Appnameen", "SGGZY_GZHC"));
        para.add(new BasicNameValuePair("pSerialnumber", "070005201706021100000000171468"));
        URI uri = new URIBuilder()
                .setScheme("http")
                .setHost("58.42.231.108")
                .setPort(5001)
                .setPath("/gzcaverify/servlet/VerifyInterface")
                .setParameters(para)
                .build();
        HttpGet httpGet = new HttpGet(uri);
        System.out.println(httpGet.getURI());
        try {
            CloseableHttpResponse response = (CloseableHttpResponse) httpClient.execute(httpGet);
            System.out.println(response.getStatusLine().toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 使用HTTPS协议与用户证书管理系统交互
     *
     * @throws URISyntaxException
     */
    private String HttpsDataPost(List<NameValuePair> para) throws URISyntaxException {
        //获取传入地址的host名，根据初始化配置来进行连接
        String result = "";
        URI url = new URI(this.Url);
        URI uri = new URIBuilder()
                .setScheme("https")
                .setHost(url.getHost())
                .setPort(this.Port)
                .setPath(this.Path)
                .build();
        HttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(HttpSecurityClient.createSSLConnSocketFactory())
                .build();
        HttpPost httpPost = new HttpPost(uri);
        CloseableHttpResponse closeableHttpResponse = null;
        try {
            httpPost.setEntity(new UrlEncodedFormEntity(para, HTTP.UTF_8));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        try {
            closeableHttpResponse = (CloseableHttpResponse) httpClient.execute(httpPost);
            result = EntityUtils.toString(closeableHttpResponse.getEntity(), "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }
}











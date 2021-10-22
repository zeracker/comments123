package com.vito.comments.util.gzca.util;

import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.List;

public class HttpSecurityClient {
    public void dopost(){

    }
    /**
     * 信任https网站证书
     *
     * @return
     */

    public void getclasspath(){
        System.out.println(this.getClass().getResource(""));
    }

    /**
     * 用于创建https的Post方法
     * @param uri 拼接的URI链接
     * @param para 传入的参数
     * @return
     */
    private CloseableHttpResponse HttpsPost(URI uri,List<NameValuePair> para){
        HttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(createSSLConnSocketFactory())
                .build();
        HttpPost httpPost = new HttpPost(uri);
        CloseableHttpResponse closeableHttpResponse = null;
        try {
            httpPost.setEntity(new UrlEncodedFormEntity(para, HTTP.UTF_8));
            closeableHttpResponse = (CloseableHttpResponse) httpClient.execute(httpPost);
            return closeableHttpResponse;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        } catch (ClientProtocolException e) {
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 对外提供的方法
     * @param para 传入的参数
     * @param url  url地址，比如http://127.0.0.1
     * @param port 端口 比如8080
     * @param path 路径 比如/WebDemo
     * @return
     * @throws URISyntaxException
     */
    public String HttpsDataPost(List<NameValuePair> para,String url,int port,String path) throws URISyntaxException {
        //获取传入地址的host名，根据初始化配置来进行连接
        String result = "";
        URI uriByUrl = new URI(url);
        URI uri = new URIBuilder()
                .setScheme("https")
                .setHost(uriByUrl.getHost())
                .setPort(port)
                .setPath(path)
                .build();
        try {
            CloseableHttpResponse closeableHttpResponse = HttpsPost(uri, para);
            result = EntityUtils.toString(closeableHttpResponse.getEntity());
            result = String.valueOf(closeableHttpResponse.getStatusLine().getStatusCode());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    public CloseableHttpResponse HttpsPostRasp(List<NameValuePair> para,String url,int port,String path){
        URI uriByUrl = null;
        try {
            uriByUrl = new URI(url);
            URI uri = new URIBuilder()
                    .setScheme("https")
                    .setHost(uriByUrl.getHost())
                    .setPort(port)
                    .setPath(path)
                    .build();
            CloseableHttpResponse closeableHttpResponse = HttpsPost(uri, para);
            return closeableHttpResponse;
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return null;
        }
    }


    public static SSLConnectionSocketFactory createSSLConnSocketFactory() {
        SSLConnectionSocketFactory sslcsf = null;
        SSLContext sslContext = null;
        try {
            sslContext = new SSLContextBuilder().loadTrustMaterial(null, new TrustStrategy() {
                @Override
                public boolean isTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {
                    return true;
                }
            }).build();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }
        sslcsf = new SSLConnectionSocketFactory(sslContext, new X509HostnameVerifier() {
            @Override
            public void verify(String s, SSLSocket sslSocket) throws IOException {

            }

            @Override
            public void verify(String s, X509Certificate x509Certificate) throws SSLException {

            }

            @Override
            public void verify(String s, String[] strings, String[] strings1) throws SSLException {

            }

            @Override
            public boolean verify(String s, SSLSession sslSession) {
                return true;
            }
        });
        return sslcsf;
    }
}

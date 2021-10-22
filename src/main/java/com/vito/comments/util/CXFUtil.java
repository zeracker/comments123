package com.vito.comments.util;

//import org.apache.cxf.endpoint.Client;
//import org.apache.cxf.jaxws.endpoint.dynamic.JaxWsDynamicClientFactory;

/**
 * webservice调用类
 */
public class CXFUtil {
   /* public static Object invok(String url , String method , Object... obj){
        // 创建动态客户端
        JaxWsDynamicClientFactory dcf = JaxWsDynamicClientFactory.newInstance();
        Client client = dcf.createClient(url);
        // 需要密码的情况需要加上用户名和密码
        //client.getOutInterceptors().add(new ClientLoginInterceptor(USER_NAME,PASS_WORD));
        Object[] objects = new Object[0];
        try {
            // invoke("方法名",参数1,参数2,参数3....);
            objects = client.invoke(method, obj);
            System.out.println("返回数据======================:" + objects[0]);
            return objects[0];
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void main(String[] args) {
//       Object res =  invok("http://localhost:8080/webservice/webServiceTestImpl?wsdl" , "testWS" , "你是傻子吗");
        Object res =  invok("http://localhost:8080/webservice/testService?wsdl" , "aplusb" , 1 ,2);
        System.out.println(res);
    }*/
}

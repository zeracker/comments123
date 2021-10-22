package com.vito.comments.service.ws;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;

@javax.jws.WebService(serviceName = "WSService"//服务名称
        , targetNamespace = "http://huazhao.webservice.com"// 一般是接口的包名倒序
)
public interface WebServiceTest {


    @WebMethod
    @WebResult(name = "String",targetNamespace = "")
    public String testWS(@WebParam(name = "msg") String msg);

    @WebMethod
    @WebResult(name = "Integer",targetNamespace = "")
    public int aplusb(@WebParam(name = "a") int a , @WebParam(name = "b") int b);


    /**
     * 应先调用生成令牌接口，传入参数为系统分配的银行Userid，获取后五分钟有效。
     * @param userID
     * @return
     */
    @WebMethod
    @WebResult(name = "String",targetNamespace = "")
    public String getToken(@WebParam(name = "userID") String userID);
}
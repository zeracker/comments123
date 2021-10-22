package com.vito.comments.service.ws.impl;

import org.springframework.stereotype.Component;
import com.vito.comments.service.ws.WebServiceTest;
import com.vito.comments.util.StringUtil;


@javax.jws.WebService(serviceName = "WSService"//服务名称
        , targetNamespace = "http://huazhao.webservice.com"// 一般是接口的包名倒序
)
@Component
public class WebServiceTestImpl implements WebServiceTest {

    @Override
    public String testWS(String msg) {
        return "webservice 返回结果 " + msg;
    }

    @Override
    public int aplusb(int a , int b) {
        return a + b;
    }


    /**
     * 应先调用生成令牌接口，传入参数为系统分配的银行Userid，获取后五分钟有效。
     * @param userID
     * @return null获取失败
     */
    @Override
    public String getToken(String userID) {
        if(StringUtil.isNotEmpty(userID)){

        }
        return null;
    }
}

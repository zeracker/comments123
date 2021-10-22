//package springboot.hello.cnf;
//
//import org.apache.cxf.Bus;
//import org.apache.cxf.bus.spring.SpringBus;
//import org.apache.cxf.jaxws.EndpointImpl;
//import org.apache.cxf.transport.servlet.CXFServlet;
//import org.springframework.boot.web.servlet.ServletRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import springboot.hello.service.ws.WebServiceTest;
//import springboot.hello.service.ws.impl.WebServiceTestImpl;
//
//import javax.xml.ws.Endpoint;
//
///**
// * webservice发布配置
// */
//@Configuration
//public class CxfConfig {
//
//    @Bean(name = "cxfServlet")
//    public ServletRegistrationBean cxfServlet() {
//        //创建服务并指定服务名称
//        return new ServletRegistrationBean(new CXFServlet(),"/webservice/*");
//    }
//
//    @Bean(name = Bus.DEFAULT_BUS_ID)
//    public SpringBus springBus() {
//        return new SpringBus();
//    }
//
//    @Bean
//    public WebServiceTest webService(){
//        return new WebServiceTestImpl();
//    }
//
//    /**
//     * 注册WebServiceDemoService接口到webservice服务
//     * @return
//     */
//    @Bean
//    public Endpoint endpoint() {
//        EndpointImpl endpoint = new EndpointImpl(springBus(),webService());
//        endpoint.publish("/hahaService");
//        EndpointImpl endpoint1 = new EndpointImpl(springBus(),webService());
//        endpoint1.publish("/testService");
//        return null;
//    }
//
//}

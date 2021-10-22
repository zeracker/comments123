//package springboot;
//
//import javax.mail.MessagingException;
//import javax.sql.DataSource;
//
//import org.junit.After;
//import org.junit.Before;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.ApplicationContext;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import springboot.hello.Application;
//import springboot.hello.sys.entity.TestPayDemo;
//import springboot.hello.sys.service.TestPayDemoService;
//import springboot.hello.util.EmailUtil;
//
//import java.math.BigDecimal;
//
//@SpringBootTest(classes = Application.class)
//@RunWith(SpringRunner.class)
//public class Test {
//
//	@Autowired
//    ApplicationContext applicationContext;
//
//	@Autowired
//	EmailUtil emailUtil;
//
//	@Autowired
//	private TestPayDemoService testPayDemoService;
//
//	@Before
//	public void before() {
//		System.out.println("before");
//	}
//
//	@org.junit.Test
//	public void test() {
////		Thread t1 = new Thread( ()->{
////			System.out.println("开始执行");
////			TestPayDemo demo = new TestPayDemo();
////			demo.setTestDemoId(new BigDecimal(123));
////			demo.setTestVal("3");
////			testPayDemoService.update(demo);
////		});
////
////		Thread t2 = new Thread( ()->{
////			System.out.println("开始执行");
////			TestPayDemo demo = new TestPayDemo();
////			demo.setTestDemoId(new BigDecimal(123));
////			demo.setTestVal("4");
////			testPayDemoService.update(demo);
////		});
////
////		t1.start();
////		t2.start();
////		TestPayDemo demo = new TestPayDemo();
////		demo.setTestDemoId(new BigDecimal(123));
////		demo.setTestVal("5");
////		testPayDemoService.update(demo);
////		try {
////			Thread.sleep(2000);
////		} catch (InterruptedException e) {
////			e.printStackTrace();
////		}
////
//
//	}
//
//	@After
//	public void after() {
//		System.out.println("after");
//	}
//
//	@org.junit.Test
//	public void mailtest(){
//
//	}
//	@org.junit.Test
//	public void codetest(){
//
//	}
//}

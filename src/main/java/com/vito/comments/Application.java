package com.vito.comments;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import com.vito.comments.util.XmlUtil;

/*
 * 在 starter 的逻辑中，如果你没有使用 @MapperScan 注解，
 * 你就需要在你的接口上增加 @Mapper 注解，否则 MyBatis 无法判断扫描哪些接口。
 * 项目启动时，自动配置报告提示Redis已经matched(这里说一下，你如果没有引入redis而又在启动类上加了@EnableCaching注解，
 * SpringBoot会自动给你匹配一个SimpleCacheConfiguration缓存，它的底层用了一个key-value的Map，不能像redis一样持久化，
 * 不建议使用，像SQLite、H2这些一样，玩具型的，只适合个人博客等非正式场合使用，有轻量级的优点，
 * 也有不可靠，不好管理的缺点
 * */
@EnableCaching  //开启缓存   redis
//@MapperScan("springboot.hello.dao.**")
@SpringBootApplication
public class Application extends SpringBootServletInitializer {
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {
//        	//放入全局以供调用
//        		SpringUtil.setContext(ctx);
			//加载查询xml
        		XmlUtil.loadQueryXml();
			/*
			 * System.out.
			 * println("Let's inspect the beans provided by Spring Boot:--------------------------------------------------------------------------------------"
			 * ); String[] beanNames = ctx.getBeanDefinitionNames(); Arrays.sort(beanNames);
			 * for (String beanName : beanNames) { System.out.println(beanName); }
			 */
        };
    }

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(Application.class);
	}


//	@Override
//	protected SpringApplicationBuilder configure(SpringApplicationBuilder application){
//
//		return application.sources(Application.class);
//	}
//
//	public static void main(String[] args) {
//		SpringApplication.run(Application.class, args);
//	}

}

package com.vito.comments.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * spring工具类
 * @author Administrator
 *
 */
@Component
public class SpringUtil implements ApplicationContextAware {
	private static  ApplicationContext context;
	
	
	public static  synchronized ApplicationContext getContext() {
		return context;
	}

	public static <T> T getBean( Class<T> clazz){
		return context.getBean(clazz);
	}


	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		SpringUtil.context = applicationContext;
	}
}

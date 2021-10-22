package com.vito.comments.controller.exception;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * 异常处理
 * @author Administrator
 *
 */
@Configuration
public class HandlerExceptionResolverImpl implements HandlerExceptionResolver{

	@Override
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("msg", "实现 HandlerExceptionResolver 接口处理异常");
		
		//判断不同异常类型，做不同视图跳转
//				if(ex instanceof Exception){
					modelAndView.setViewName("index");
//				}
		return modelAndView;
	}

}

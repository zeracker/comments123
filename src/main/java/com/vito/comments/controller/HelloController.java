package com.vito.comments.controller;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import com.vito.comments.entity.base.ParamObject;
import com.vito.comments.entity.base.ResObj;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.*;

import com.vito.comments.controller.base.BaseController;
//import com.hsnn.bankPay.util.LogUtil;
import com.vito.comments.util.VerifyCodeUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@RestController
//@Scope("prototype")
public class
HelloController extends BaseController{

	private static final Logger log = LoggerFactory.getLogger(HelloController.class);
	
	@Autowired
    private ApplicationContext applicationContext;
//	@Value("${checkEdiePass}")
//	private String checkEdiePass;

	@RequestMapping(value="/serviceCall",method = RequestMethod.GET)
	@ResponseBody
	public Object servicecall() {

		ParamObject po =  getParamObjectGet();
		if(po == null) {
			return ResObj.build("-1", "参数解析错误");
		}
		//动态调用方法
		Object res = invokeMethod(po);
		return res;
	}


	@RequestMapping("/serviceCtl")
	@ResponseBody
	public Object serviceCtl() {
		ParamObject po =  getParamObject();
		String sericeName = po.getServiceName();
		String methodName = po.getMethodName();
		log.info("方法名："+sericeName);
		if(!"loginService".equals(sericeName) && !"getUserHasEmail".equals(methodName)
				&& !"getDecodeEmailStr".equals(methodName)
				&& !"checkFFCZ".equals(methodName)
				&& !"editPassByEmail".equals(methodName)){
//			boolean logState = validateLogin();
//			if(!logState){
//				return ResObj.build("-9", "用户未登录!");
//			}
//			if(initPasswordAnswer() && !"editChildrenPass".equals(methodName) && "true".equals(checkEdiePass)){
//				return ResObj.build("-10", "初始化密码强制修改!");
//			}
//			if(!isMyResource()){
//				return ResObj.build("-11", "没有访问权限");
//			}
		}

		if(po == null) {
			return ResObj.build("-1", "参数解析错误");
		}
		//验证用户密码是否是初始化密码；

		//2
		//动态调用方法
		Object res = invokeMethod(po);
			//2222
		return res;
	}


	
	/**
	 *
	 *
	 *
	 * 动态调用方法
	 * @param po
	 * @return
	 */
	private Object invokeMethod(ParamObject po) {

		//根据参数调用相应的方法
				Object service = applicationContext.getBean(po.getServiceName());

				List difMapList = new ArrayList();//放实体修改前后变化字段,日志用
				session.setAttribute("difMapList" , difMapList);
		        session.setAttribute("values" , po.getValues());
//				LogUtil.addSession(session);
				if(service != null) {
					try {
						Method method = service.getClass().getDeclaredMethod(po.getMethodName(), po.getClass());
//						return method.invoke(service, po);
						ResObj res = ResObj.build("1", "调用成功",method.invoke(service, po));
						
						Object msg = session.getAttribute("msg");
						if(msg != null) {
							res.setMsg((String) msg);
						}

						//处理excel导出
						if("queryService".equals(po.getServiceName()) && "exportById".equals(po.getMethodName())){
							exportExcel(res);
							return null;
						}

						return res;
					} catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
//						String msgstr = "";
//						Object msg = session.getAttribute("msg");
//						if(msg != null) {
//							msgstr = (String) msg;
//						}
						log.error("-2method调用错误:" + e.getCause().getMessage(),e);
						po.setMsg(e.getCause().getMessage());
						return ResObj.build("-2", e.getCause().getMessage());
					} catch (Exception e) {
						e.printStackTrace();
						log.error("-3,excel导出错误:" + e.getCause().getMessage(),e);
						return ResObj.build("-3", e.getCause().getMessage());
					} finally{
//						LogUtil.addLog(po);
//						LogUtil.removeSession();
					}
				}else {
					log.error("-3", "service调用错误 未找到service");
					return ResObj.build("-3", "service解析错误");
				}
				
	}
	
	@RequestMapping("/hello")
	public <T> T hello(@RequestParam(value = "333")String name){//333是必须填参数
		System.out.println(this.getClass().getClassLoader());
		
		return (T) name;
	}

	@RequestMapping("getVerifiCode")
	@ResponseBody
	public void getVerifiCode(HttpServletRequest request, HttpServletResponse response) throws IOException {
//		ParamObject po =  getParamObject();
        /*
             1.生成验证码
             2.把验证码上的文本存在session中
             3.把验证码图片发送给客户端
             */
		VerifyCodeUtils ivc = new VerifyCodeUtils();     //用我们的验证码类，生成验证码类对象
		BufferedImage image = ivc.getImage();  //获取验证码
		request.getSession().setAttribute("verifyCodeText", ivc.getText()); //将验证码的文本存在session中
		ivc.output(image, response.getOutputStream());//将验证码图片响应给客户端
	}
	
	public static void main(String[] args) {
		log.debug("ssss");
	}
}

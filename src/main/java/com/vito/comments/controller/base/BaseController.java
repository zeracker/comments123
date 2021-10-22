package com.vito.comments.controller.base;

import java.io.*;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.vito.comments.entity.base.ParamObject;
import com.vito.comments.entity.base.ResObj;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.vito.comments.util.AssertUtil;
import com.vito.comments.util.EncryptUtil;
import com.vito.comments.util.ExcelUtil;

public class BaseController {
	
	protected HttpServletRequest request;

	protected HttpServletResponse response;

	protected HttpSession session;


	//初始化密码MD5值
	public static String INITPASS = "c4ca4238a0b923820dcc509a6f75849b";
	public static String INITPASSTWO = "52c69e3a57331081823331c4e69d3f2e";
	
	private static Logger log = LoggerFactory.getLogger(BaseController.class);

	protected boolean validateLogin(){
		boolean yes = false;
		Object userinfo = session.getAttribute("userinfo");
		log.info("用户名测试："+userinfo);
		if(userinfo == null){
			yes = false;
		}else{
			yes  = true;
		}
		return  yes;
	}

//	//验证用户密码是否为初始化密码
//	protected boolean initPasswordAnswer(){
//		boolean yes = false;
//		SysUser userinfo = (SysUser) session.getAttribute("userinfo");
//		String pass = userinfo.getUserPassword();
//		String passCa = (String) session.getAttribute("cakey");
//		if((INITPASS.equals(pass) || INITPASSTWO.equals(pass)) && null == passCa){
//			yes  = true;
//		}
//		return  yes;
//	}

	/**
	 * 验证当前请求是否是自己权限范围内的页面
	 * @return
	 */
//	protected boolean isMyResource(){
//		SysUser userInfo = (SysUser) session.getAttribute("userinfo");
//		String accType =userInfo.getAcctType().toString();
//		List<SysResource> resList = null;
//		if("1".equals(accType)){
//			resList = sysResourceDao.listByRoleidchildren(userInfo.getRoleId());
//		}else{
//			resList = sysResourceDao.listByRoleid(userInfo.getRoleId());
//		}
//		String refer = request.getHeader("Referer");
//		System.out.println("请求来源"+	refer);
//		if(refer.contains("/index.html") || refer.contains("/homeComppage.html")
//				|| refer.contains("/HomePageCenter.html")
//				|| refer.contains("/HomePageHealthbureau.html")
//				|| refer.contains("/HomePageHos.html")
//				|| refer.contains("/HomePagePs.html")
//				|| refer.contains("/HomePageSc.html")
//				|| refer.contains("/messagehosp.html")
//				|| refer.contains("/messagecomp.html")
//				|| refer.contains("/editUserPass.html")
//				) return true;
//		for (SysResource sysResource : resList) {//当前refer在权限范围内
//			String resourceUrl = sysResource.getResourceUrl();
//			if(resourceUrl == null)continue;
//			String url =sysResource.getResourceUrl();
//			if(url.contains(",")){
//				String[] urls = url.split(",");
//				for (String s : urls) {
//					if(refer.contains(s)){
//						return true;
//					}
//				}
//			}else{
//				if(refer.contains(url)){
//					return true;
//				}
//			}
//		}
//		return false;
//	}
	
	/**
	 * 把request  response  session 注入controller
	 * @param request
	 * @param response
	 */
	@ModelAttribute
	public void setReqAndRes(HttpServletRequest request, HttpServletResponse response){

		this.request = request;

		this.response = response;

		this.session = request.getSession();

	}
	
	/**
	 * 获得参数对象
	 */
	protected ParamObject getParamObject() {
		ParamObject po = null;
		String inputStr = getInputStr();
		inputStr = EncryptUtil.decode(inputStr);
//		log.info("表单数据-old："+ inputStr);
//		inputStr = inputStr.replaceAll("䣈","（");
//		inputStr = inputStr.replaceAll("䣉","）");
//		log.info("表单数据—new："+ inputStr);
		if(!AssertUtil.isNull(inputStr)) {
			return po;
		}
		System.err.println(inputStr);
		//封装param到paramObject
		po = parseParams(inputStr);
		
		po.setReq(this.request);
		po.setRes(this.response);
		po.setSession(this.session);
		this.session.removeAttribute("msg");
		
		return po;
	}
	
	/**
	 * get方式
	 * @return
	 */
	protected ParamObject getParamObjectGet() {
		ParamObject po = null;
		//获取所有的param
		Enumeration<String> parameterNames = request.getParameterNames();
		

		
		if(!AssertUtil.isNull(get("serivceName"))  || !AssertUtil.isNull(get("methodName"))) {
			return po;
		}
	    po = new ParamObject();
	    po.setServiceName(get("serivceName"));
	    po.setMethodName(get("methodName"));
	    
	    //添加更多的参数
		//设置valuemap
		Map<String, Object> paramMap = new HashMap<String, Object>();
		while(parameterNames.hasMoreElements()) {
		String nextElement = parameterNames.nextElement();
			if( !nextElement.equals("serivceName")  && !nextElement.equals("methodName") ) {
				if( get(nextElement) != null && !"".equals(get(nextElement)) ){
					paramMap.put(nextElement, get(nextElement));
				}
			}
		}
		po.setValues(paramMap);

		po.setReq(this.request);
		po.setRes(this.response);
		po.setSession(this.session);
		
		
		return po;
	}
	
	/**
	 * 解析json到paramobj
	 * @param <T>
	 * @param inputStr
	 */
	private <T> ParamObject parseParams(String inputStr) {
		try {
			JSONObject json = new JSONObject(inputStr);
			if(!json.has("serviceName") ||  !json.has("methodName")) {
				return null;
			}
			
			ParamObject param = new ParamObject<T>();
			param.setServiceName(json.getString("serviceName"));
			param.setMethodName(json.getString("methodName"));
			
			JSONObject params =  json.getJSONObject("params");
			//设置valuemap
			Map<String, Object> paramMap = new HashMap<String, Object>();
			Iterator ite = params.keys();
			ite.forEachRemaining(obj  ->{
				try {
					//设置id 用于缓存
					if(obj.equals("id")) {
						param.setId( params.getString((String) obj));
					}
					paramMap.put((String) obj, params.getString((String) obj));
				} catch (JSONException e) {
					e.printStackTrace();
				}
			});
			param.setValues(paramMap);
			
//			ZhangSan zs = BeanUtil.buildEntity(ZhangSan.class, param.getValues());
		
			return param;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}

	protected String getInputStr() {
		StringBuilder sb=null;
		try {
			InputStream in = request.getInputStream();
			InputStreamReader ir = new InputStreamReader(in, "utf-8");
			BufferedReader br = new BufferedReader(ir);
		     sb = new StringBuilder();
			String str = null;
			while((str = br.readLine()) != null) {
				sb.append(str);
			}
//			System.out.println(sb.toString());
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("获取参数失败");
			log.error("-2", "method调用错误"+ e.getStackTrace());
			e.printStackTrace();
		}

		return sb == null ? null : sb.toString();
	}

	/**
	 * 向外写文件
	 */
	protected void writeFile(File file) {

		FileInputStream fin = null;
		OutputStream os = null;
		try {
			fin = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			os =  response.getOutputStream();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		byte[] buffer = new byte[2 * 1024];
		int index = 0;
		try {
			while((index = fin.read(buffer)) != -1) {
				os.write(buffer, 0, index);
			}
			fin.close();
			os.flush();
			os.close();
		} catch (IOException e) {

			e.printStackTrace();
		}
	}
	protected void writePng(File file) {
		response.addHeader("Content-Type","image/png");
		writeFile(file);
	}
	protected void writeJpg(File file) {
		response.addHeader("Content-Type","image/jpg");
		writeFile(file);
	}

	protected void exportExcel(ResObj res) throws Exception {
		ExcelUtil.exportData(res,response);
	}


	public static void main(String[] args) throws JSONException, InstantiationException, IllegalAccessException, Exception {
		
		String str = "{serviceName:\"sfdas\",methodName:\"Flintstone\" ,params:{	id:1,	name : \"张三\",	age : 15,	salary : 2000.8 , bir : \"2020-10-01\"	}	}";
		JSONObject json = new JSONObject(str);

		System.out.println(json.getJSONObject("params"));
		long start =System.currentTimeMillis();
    	
		JSONObject params =  json.getJSONObject("params");
//		ZhangSan zs = JsonUtil.parseJson(params.toString()  , ZhangSan.class);
		
//		ZhangSan zs = BeanUtil.buildEntity(ZhangSan.class, params);
		long end =System.currentTimeMillis();
		System.out.println(params);
		
		System.out.println(end  - start);
	}
	
	private String get(String key) {
		return this.request.getParameter(key);
	}
} 

package com.vito.comments.util;

import java.io.IOException;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.json.JSONObject;

/**
 * @author hebaoming 2018年5月30日
 */
public class JsonUtil {
	
	private static ObjectMapper mapper;
	
	public static ObjectMapper getMapper() {
		if(mapper == null) {
			mapper = new ObjectMapper();
			mapper.setSerializationInclusion(Include.NON_EMPTY)//类级别的设置，JsonInclude.Include.NON_EMPTY标识只有非NULL的值才会被纳入json string之中，其余的都将被忽略
			.setSerializationInclusion(Include.NON_DEFAULT)//不包括初始值
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)//禁止使用出现未知属性之时，抛出异常
            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
            .configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true)
            .configure(JsonParser.Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, true)//把反斜杠不当作转译符号
            .setPropertyNamingStrategy(PropertyNamingStrategy.LOWER_CAMEL_CASE);//转化后的json的key命名格式
		}
		return  mapper;
	}
	

	/**
	 * 把字符串解析为对象，解析失败则返回null
	 * @param json
	 * @param t
	 * @return
	 */
	public static <T> T parseJson (String json,Class<T> t) {
		try {
			return getMapper().readValue(json, t);
		} catch (JsonParseException e) {
			// TODO 添加log
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO 添加log
			e.printStackTrace();
		} catch (IOException e) {
			// TODO 添加log
			e.printStackTrace();
			
		}
		return null;
	}
	
	/**
	 * 把对象转换成希望的类型
	 * @param json
	 * @param t
	 * @return
	 */
	public static <T> T changeTo (Object o,Class<T> t) {
		String oStr = buildResponseJson(o);
		if(oStr != null) {
			return parseJson(oStr, t);
		}
		return null;
	}

//	/**
//	 * 	从json字符串里  获取属性
//	 * @param attr 属性名
//	 * @param json json字符串
//	 * @return 返回null则失败
//	 */
//	public static String getAttr(String attr,String json) {
//		BaseJsonBean bean = parseJson(json, BaseJsonBean.class);
//		if(bean == null) return null;
//		try {
//
//			Field f = bean.getClass().getDeclaredField(attr);
//			f.setAccessible(true);
//			return (String)f.get(bean);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}
	

	/**
	 * 构建json字符串,失败则返回null
	 * @param t
	 * @return
	 */
	public static<T> String buildResponseJson(T t) {
		if(t == null) {
			return null;
		}
		try {
			return getMapper().writeValueAsString(t);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String[] args) throws Exception, SecurityException {
		String decStr="{userId:admin,userName:admin,code:452160,email:772977181@qq.com,type:forget}";
		JSONObject obj = new JSONObject(decStr);

		System.out.println("userName:"+obj.getString("userName"));
	}
	
	
}

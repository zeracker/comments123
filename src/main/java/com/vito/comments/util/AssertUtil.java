package com.vito.comments.util;

/**
 * 断言类
 * @author Administrator
 *
 */
public class AssertUtil {
	
	/**
	 * 判断字符串不为空
	 * @param obj
	 * @return
	 */
	public static boolean isNull(String obj) {
		
		if(obj == null || "".equals(obj)) {
			return false;
		}
		
		return true;
	}

	/**
	 * 判断对象非空
	 * @return
	 */
	public static boolean notNull(Object obj){
		return obj != null ? true : false;
	}
}

package com.vito.comments.util;

import java.lang.annotation.Annotation;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.BiPredicate;

import com.vito.comments.entity.base.ParamObject;
import org.json.JSONException;
import org.json.JSONObject;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 操作bean的工具类
 * @author Administrator
 *
 */
public class BeanUtil {

	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

	public static<T> T  buildEntity(Class<T> type , String json) throws Exception {
		return buildEntity(type , new JSONObject(json) );
	}
	
	/**
	 * 根据json匹配bean生成实例
	 * @param <T>
	 * @param type bean类型
	 * @param json json字符串
	 * @return
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public static<T> T  buildEntity(Class<T> type , JSONObject json) throws Exception {
		T t = type.newInstance();
		Field[] fs =  type.getDeclaredFields();
		for(Field f : fs) {
			if(json.has(f.getName())) {
				try {
					setValue(t , f , json.getString(f.getName()));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return t;
	}
	
	public static<T> T  buildEntity(Class<T> type , Map map) throws InstantiationException, IllegalAccessException {
		T t = type.newInstance();
		Field[] fs =  type.getDeclaredFields();
		for(Field f : fs) {
			if(map.containsKey(f.getName())) {
				try {
					setValue(t , f , (String) map.get(f.getName()));
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return t;
	}
	/**
	 * 反射赋值
	 * @param o
	 * @param f
	 * @param value
	 * @throws IllegalAccessException 
	 * @throws IllegalArgumentException 
	 * @throws ParseException 
	 */
	private static void setValue(Object o,Field f, String value) throws IllegalArgumentException, IllegalAccessException, ParseException {
		if(!AssertUtil.isNull(value)) {
			return;
		}
		f.setAccessible(true);
		Class c = f.getType();
			
			if(c.equals(BigDecimal.class)) {
				f.set(o, new BigDecimal(value));
			}else if(c.equals(String.class)) {
				f.set(o, value);
			}else if(c.equals(Date.class)) {
				f.set(o, sdf.parse(value));
			}
			
	}

	/**
	 * 获取bean的pk字段
	 * @return
	 */
	public static Object getBeanPk(Object bean) throws IllegalAccessException {
		Field[] declaredFields = bean.getClass().getDeclaredFields();
		for (Field declaredField : declaredFields) {

			if(declaredField.isAnnotationPresent(Id.class)){
				Object res =  getValue(declaredField , bean);
				if(res == null)continue;
				return res;
			}

		}
		
		return null;
	}

	/**
	 * 获取bean的表字段名
	 * @return
	 */
	public static String getBeanColname(Object bean,String properName) throws IllegalAccessException, NoSuchFieldException {
		Field declaredField = bean.getClass().getDeclaredField(properName);

		if(declaredField != null){
			Column declaredAnnotation = declaredField.getDeclaredAnnotation(Column.class);
			if(declaredAnnotation != null){
				return declaredAnnotation.name();
			}
		}
		return null;
	}


	/**
	 *获取实体的tablename注解
	 * @param entity
	 * @return
	 */
	public static String getTableName(Object entity){
		Table[] annotationsByType = entity.getClass().getAnnotationsByType(Table.class);
		for (Table table : annotationsByType) {
			return table.name();
		}
		return null;
	}
	
	public static void main(String[] args) throws IllegalAccessException {
//		SysRoleChildren ch = new SysRoleChildren();
//		ch.setRoleId(new BigDecimal(2));
//		System.out.printf(getTableName(ch).toString());

	}

	private static boolean hasAnnotation(AnnotatedElement clazz , Class<? extends Annotation> annotationType){
		return clazz.isAnnotationPresent(annotationType);
	}

	private static Object getValue(Field f , Object o) throws IllegalAccessException {
		f.setAccessible(true);
		return f.get(o);

	}


	/**
	 * 比较两个对象存在不同的字段
	 * @param obj1
	 * @param obj2
	 * @param ignoreFields 忽略的字段
	 * @return
	 * @throws IllegalAccessException
	 */
	public static Map<String, String> compareTwoObject(Object obj1, Object obj2, String[] ignoreFields) throws IllegalAccessException, NoSuchFieldException {
		Map<String, String> diffMap = new LinkedHashMap<>();
		List<String> ignoreFieldList = Arrays.asList(ignoreFields);
		Class<?> clazz1 = obj1.getClass();
		Class<?> clazz2 = obj2.getClass();
		Field[] fields1 = clazz1.getDeclaredFields();
		Field[] fields2 = clazz2.getDeclaredFields();
		BiPredicate biPredicate = new BiPredicate() {
			@Override
			public boolean test(Object object1, Object object2) {
				if (object1 == null && object2 == null) {
					return true;
				}
				if (object1 == null && object2 != null){
					return false;
				}
				// 假如还有别的类型需要特殊判断 比如 BigDecimal, 演示，只写BigDecimal示例，其他都相似
				if (object1 instanceof BigDecimal && object2 instanceof BigDecimal) {
					if (object1 == null && object2 == null) {
						return true;
					}
					if (object1 == null ^ object2 == null) {
						return false;
					}
					return ((BigDecimal) object1).compareTo((BigDecimal) object2) == 0;
				}

				if (object1.equals(object2)) {
					return true;
				}
				return false;
			}
		};

		for (Field field1 : fields1) {
			for (Field field2 : fields2) {
				if (ignoreFieldList.contains(field1.getName()) || ignoreFieldList.contains(field2.getName())) {
					continue;
				}
				if (field1.getName().equals(field2.getName())) {
					field1.setAccessible(true);
					field2.setAccessible(true);
					if (!biPredicate.test(field1.get(obj1), field2.get(obj2))) {
						if(field1.get(obj1) == null || field2.get(obj2) == null || field1.get(obj1) instanceof  Date)continue;
						diffMap.put(field1.getName(), field1.get(obj1) == null ? null : field1.get(obj1).toString());
						diffMap.put(field1.getName() + "->newVal", field2.get(obj2) == null ? null : field2.get(obj2).toString() );
						diffMap.put(field1.getName() + "->colname" , getBeanColname(obj1 , field1.getName()));
						diffMap.put("tablename" , getTableName(obj1));
						diffMap.put("recordId ->" ,getBeanPk(obj1).toString());
					}
				}
			}
		}
		return diffMap;
	}





	public static Map<String, String> compareTwoObject(Object obj1, Object obj2) throws IllegalAccessException, NoSuchFieldException {
		return compareTwoObject(obj1,obj2,new String[]{});
	}
	
	/**
	 * 实例化paramobj内部的bean
	 * @param <T>
	 * @param class1
	 * @param paramObject
	 * @throws ParseException 
	 * @throws IllegalArgumentException 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public static <T> void buildEntity(Class<T> class1, ParamObject<T> paramObject) throws IllegalArgumentException, IllegalAccessException, ParseException, InstantiationException   {
			T newInstance = class1.newInstance();
			
			Field[] declaredFields = newInstance.getClass().getDeclaredFields();
			
			Map paramMap = paramObject.getValues();
			for (int i = 0; i < declaredFields.length; i++) {
				Field field = declaredFields[i];
				String val = (String) paramMap.get(field.getName());
				if(paramMap.containsKey(field.getName())) {
					setValue(newInstance , field  , val);
				}
				
			}
			paramObject.setEntity(newInstance);
	}

	
	

}

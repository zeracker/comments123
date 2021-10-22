package com.vito.comments.util;


import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import com.vito.comments.entity.base.QueryEntity;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * xml工具类
 * @author Administrator
 *
 */
@Component
public class XmlUtil {
	
	private static RedisTemplate redisTemplate;
	
	public static void main(String[] args) throws Exception {
		
		loadQueryXml();
	}
	
	
	/**
	 * 加载查询xml文件
	 */
	public static void loadQueryXml() {
		if(redisTemplate == null) {
			redisTemplate  = (RedisTemplate) SpringUtil.getContext().getBean("redisTemplate");
		}
		String path = null;
		try {
			path = URLDecoder.decode(XmlUtil.class.getResource("/").getPath() + "com/vito/comments/query", "utf-8");
		} catch (UnsupportedEncodingException e) {
			path =XmlUtil.class.getResource("/").getPath() + "com/vito/comments/query";
		}
		System.out.println("redis缓存数千里："+path);
//		path = "D:\\项目\\11_贵州省医药集中采购结算支付系统\\bill\\springboot\\target\\classes\\springboot\\hello\\query";

		//迭代加载所有的xml
		loadAll(new File(path));


	}

	
	
	

	private static void loadAll(File f) {
		if(f.isDirectory()) {
			File[] listFiles = f.listFiles();
			for(File file : listFiles) {
				if(file.isDirectory()) {
					loadAll(file);
				}else {
					if(file.getName().endsWith(".xml")) {
						DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
						try {
							 DocumentBuilder builder = dbf.newDocumentBuilder();
					           SAXReader reader =  new SAXReader();
					           
					          Document document = reader.read(file);
					         Element  root =  document.getRootElement();
					         Attribute rootAttr = root.attribute("queryId");
					         QueryEntity qe = new QueryEntity();
					         String sql = root.elementText("sql");
					         //使用xpath
					         List<Element> elements = root.selectNodes("//td");
					         
					         Map<String, Element> eleMap = new HashMap<String, Element>();
					        for(Element e : elements) {
								String column = e.attributeValue("column");
								if(column != null){
									eleMap.put(column, e);
								}
					        }
							eleMap.remove(null);
					         
					         qe.setSqlOrign(sql);
					         qe.setAttrs(elements);
					         qe.setEleMap(eleMap);
					         //写入缓存
					         redisTemplate.opsForValue().set(rootAttr.getText(), qe);

						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
		
	}


	public static void setRedisTemplate(RedisTemplate redisTemplate) {
		XmlUtil.redisTemplate = redisTemplate;
	}
	
	
	
	

}



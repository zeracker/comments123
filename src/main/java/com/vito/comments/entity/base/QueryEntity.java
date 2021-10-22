package com.vito.comments.entity.base;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.dom4j.Element;

/**
 * 查询实体类
 * @author Administrator
 *
 */
public class QueryEntity implements Serializable{
	
	/**
	 * 从xml里读取的sql语句
	 */
	private String sqlOrign;
	
	/**
	 * 预处理好的sql
	 */
	private String sqlpre;
	
	private Map<String, Element> eleMap;
	
	/**
	 * 列s
	 */
	private List<Element> attrs;
	
	

	public Map<String, Element> getEleMap() {
		return eleMap;
	}

	public void setEleMap(Map<String, Element> eleMap) {
		this.eleMap = eleMap;
	}

	public List<Element> getAttrs() {
		return attrs;
	}

	public void setAttrs(List<Element> attrs) {
		this.attrs = attrs;
	}

	public String getSqlOrign() {
		return sqlOrign;
	}

	public void setSqlOrign(String sqlOrign) {
		this.sqlOrign = sqlOrign;
	}

	public String getSqlpre() {
		return sqlpre;
	}

	public void setSqlpre(String sqlpre) {
		this.sqlpre = sqlpre;
	}

	
	
}

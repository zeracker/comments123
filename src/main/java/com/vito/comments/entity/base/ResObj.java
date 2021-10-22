package com.vito.comments.entity.base;

/**
 * 返回对象
 * @author Administrator
 *
 */
public class ResObj {

	//状态
	private String  state;
	
	//消息
	private String msg;
	
	//数据
	private Object data;
	
	
	
	
	
	public static ResObj build(Object data) {
		return  build(null ,null ,data);
	}
	
	public static ResObj build(String state , String msg , Object data) {
		ResObj res = new ResObj();
		res.setState(state);
		res.setMsg(msg);
		res.setData(data);
		return  res;
	}
	
	public static ResObj build(String state ) {
		return  build(state , null  , null);
	}
	
	public static ResObj build(String state ,String msg) {
		return  build(state , msg ,null);
	}
	

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}
	
	
	
}

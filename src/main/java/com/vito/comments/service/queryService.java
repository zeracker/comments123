package com.vito.comments.service;

import com.vito.comments.entity.base.ParamObject;

/**
* 查询服务
*/
public interface queryService {
	
	 Object queryById(ParamObject po) throws Exception;

	 Object exportById(ParamObject po) throws Exception;
    
}
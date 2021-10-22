package com.vito.comments.service;

import com.vito.comments.entity.base.ParamObject;

/**
 * 查询服务
 */
public interface LoginService {

    Object login(ParamObject po) throws Exception;

    Object loginOut(ParamObject po) throws Exception;

    /**
     *
     * @param po 参数对象
     * @return ParamObject 对象
     * @throws Exception
     */
    Object loginCa(ParamObject po) throws Exception;

}
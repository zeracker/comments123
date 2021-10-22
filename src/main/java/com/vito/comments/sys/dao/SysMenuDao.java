package com.vito.comments.sys.dao;

import com.vito.comments.sys.entity.SysMenu;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

/**
* Created by hbm Generator<27683139@qq.com> on 2021-10-22.
*/
@org.apache.ibatis.annotations.Mapper
public interface SysMenuDao extends Mapper<SysMenu>{

    int insert(SysMenu sysMenu);

    int delete(SysMenu sysMenu);

    int deleteByIds(@Param("ids") String[] ids);

    int update(SysMenu sysMenu);

    SysMenu getById(@Param("id") String id);

    List<SysMenu> list(SysMenu sysMenu);

    List<SysMenu> listMenu(SysMenu sysMenu);
}
package com.vito.comments.sys.service;

import com.vito.comments.sys.entity.SysMenu;
import java.util.List;

/**
* Created by hbm Generator<27683139@qq.com> on 2021-10-22.
*/
public interface SysMenuService {

    int insert(SysMenu sysMenu);

    int delete(SysMenu sysMenu);

    int deleteByIds(String[] ids);

    int update(SysMenu sysMenu);

    SysMenu getById(String id);

    List<SysMenu> list(SysMenu sysMenu);
    
}